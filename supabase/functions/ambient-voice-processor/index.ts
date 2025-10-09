import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const { headers } = req;
  const upgradeHeader = headers.get("upgrade") || "";

  if (upgradeHeader.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket connection", { status: 400 });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);
  
  const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
  if (!OPENAI_API_KEY) {
    console.error('❌ OPENAI_API_KEY not found in environment variables');
    socket.close(1011, 'OPENAI_API_KEY not configured. Please add it in Supabase Edge Function secrets.');
    return new Response("Server configuration error: OPENAI_API_KEY not set", { 
      status: 500,
      headers: corsHeaders 
    });
  }
  
  console.log('✓ OPENAI_API_KEY found, length:', OPENAI_API_KEY.length);

  let openAISocket: WebSocket | null = null;
  let sessionCreated = false;
  let rateLimitRetries = 0;
  const MAX_RETRIES = 3;

  socket.onopen = () => {
    console.log('Client WebSocket connected');
    
    // Connect to OpenAI Realtime API with proper authentication
    openAISocket = new WebSocket(
      "wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17",
      [
        "realtime",
        `openai-insecure-api-key.${OPENAI_API_KEY}`,
        "openai-beta.realtime-v1"
      ]
    );

    openAISocket.onopen = () => {
      console.log('Connected to OpenAI Realtime API');
    };

    openAISocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('OpenAI message:', data.type);

      // Handle rate limiting and transcription errors
      if (data.type === 'error' && data.error?.code === 'rate_limit_exceeded') {
        console.error('❌ Rate limit exceeded:', data.error);
        socket.send(JSON.stringify({
          type: 'error',
          error: {
            type: 'rate_limit_exceeded',
            message: 'OpenAI rate limit exceeded. Please check your API key billing/quota.',
            retry_after: data.error.retry_after || 5
          }
        }));
        return;
      }

      // Handle transcription failures - often due to API key issues
      if (data.type === 'conversation.item.input_audio_transcription.failed') {
        console.error('❌ Transcription failed:', data.error);
        
        // Check if it's a rate limit issue
        if (data.error?.message?.includes('429')) {
          socket.send(JSON.stringify({
            type: 'error',
            error: {
              type: 'api_key_issue',
              message: 'OpenAI API Key quota exceeded. Please check billing at platform.openai.com'
            }
          }));
        }
        // Forward the error to client
        socket.send(event.data);
        return;
      }

      // Handle session creation
      if (data.type === 'session.created' && !sessionCreated) {
        sessionCreated = true;
        
        // Get voice preference from client (will be sent via session update)
        // Default to shimmer if not specified
        const voicePreference = "shimmer";
        
        // Configure session for ambient EMR
        const sessionUpdate = {
          type: "session.update",
          session: {
            modalities: ["text", "audio"],
            instructions: `You are Alis, an ambient medical AI assistant for the Virtualis EMR platform. You help physicians with:
- Converting conversations to clinical documentation
- Voice-controlled EMR navigation and chart access
- Ambient order entry with safety confirmations
- Clinical decision support during patient encounters
- Real-time documentation from bedside conversations

Be helpful, concise, and medically accurate. Always confirm critical orders. When appropriate, refer to yourself as "Alis".`,
            voice: voicePreference,
            input_audio_format: "pcm16",
            output_audio_format: "pcm16",
            input_audio_transcription: {
              model: "whisper-1"
            },
            turn_detection: {
              type: "server_vad",
              threshold: 0.5,
              prefix_padding_ms: 300,
              silence_duration_ms: 1000
            },
            tools: [
              {
                type: "function",
                name: "navigate_emr",
                description: "Navigate to different sections of the EMR system",
                parameters: {
                  type: "object",
                  properties: {
                    section: { 
                      type: "string",
                      enum: ["patient_chart", "lab_results", "medications", "orders", "notes", "vitals"]
                    },
                    patient_id: { type: "string" }
                  },
                  required: ["section"]
                }
              },
              {
                type: "function", 
                name: "create_clinical_note",
                description: "Create clinical documentation from conversation",
                parameters: {
                  type: "object",
                  properties: {
                    note_type: {
                      type: "string",
                      enum: ["progress_note", "soap_note", "admission_note", "discharge_summary"]
                    },
                    content: { type: "string" },
                    patient_id: { type: "string" }
                  },
                  required: ["note_type", "content"]
                }
              },
              {
                type: "function",
                name: "place_order",
                description: "Place medical orders from voice commands",
                parameters: {
                  type: "object",
                  properties: {
                    order_type: {
                      type: "string", 
                      enum: ["lab", "medication", "imaging", "consult"]
                    },
                    details: { type: "string" },
                    patient_id: { type: "string" }
                  },
                  required: ["order_type", "details"]
                }
              },
              {
                type: "function",
                name: "create_clinical_note_from_voice",
                description: "Structure voice input into clinical note format with proper SOAP sections",
                parameters: {
                  type: "object",
                  properties: {
                    noteType: { 
                      type: "string",
                      enum: ["progress_note", "soap_note", "admission_note", "discharge_summary", "consultation_note"]
                    },
                    chiefComplaint: { 
                      type: "string",
                      description: "Main reason for visit or encounter"
                    },
                    hpi: { 
                      type: "string",
                      description: "History of present illness - detailed narrative"
                    },
                    examination: { 
                      type: "string",
                      description: "Physical examination findings"
                    },
                    assessment: { 
                      type: "string",
                      description: "Clinical assessment and diagnosis"
                    },
                    plan: { 
                      type: "string",
                      description: "Treatment plan and follow-up"
                    }
                  },
                  required: ["noteType", "chiefComplaint", "hpi", "assessment", "plan"]
                }
              }
            ],
            tool_choice: "auto",
            temperature: 0.7,
            max_response_output_tokens: "inf"
          }
        };

        openAISocket?.send(JSON.stringify(sessionUpdate));
        console.log('Session configured for ambient EMR');
      }

      // Forward all messages to client
      socket.send(event.data);
    };

    openAISocket.onerror = (error) => {
      console.error('OpenAI WebSocket error:', error);
      socket.send(JSON.stringify({ 
        type: 'error',
        error: {
          type: 'connection_error',
          message: 'Connection to AI service failed. Retrying...' 
        }
      }));
    };

    openAISocket.onclose = () => {
      console.log('OpenAI WebSocket closed');
      socket.close();
    };
  };

  socket.onmessage = (event) => {
    // Forward client messages to OpenAI
    if (openAISocket?.readyState === WebSocket.OPEN) {
      const message = JSON.parse(event.data);
      
      // Handle voice preference updates
      if (message.type === 'update_voice') {
        const voiceUpdate = {
          type: "session.update",
          session: {
            voice: message.voice || "shimmer"
          }
        };
        openAISocket.send(JSON.stringify(voiceUpdate));
        console.log('Updated voice to:', message.voice);
      } else {
        console.log('Forwarding message to OpenAI');
        openAISocket.send(event.data);
      }
    }
  };

  socket.onclose = () => {
    console.log('Client WebSocket closed');
    openAISocket?.close();
  };

  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
    openAISocket?.close();
  };

  return response;
});