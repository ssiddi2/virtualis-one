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
    console.error('OPENAI_API_KEY not found');
    return new Response("Server configuration error", { status: 500 });
  }

  let openAISocket: WebSocket | null = null;
  let sessionCreated = false;

  socket.onopen = () => {
    console.log('Client WebSocket connected');
    
    // Connect to OpenAI Realtime API
    openAISocket = new WebSocket("wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01", {
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "OpenAI-Beta": "realtime=v1"
      }
    });

    openAISocket.onopen = () => {
      console.log('Connected to OpenAI Realtime API');
    };

    openAISocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('OpenAI message:', data.type);

      // Handle session creation
      if (data.type === 'session.created' && !sessionCreated) {
        sessionCreated = true;
        
        // Configure session for ambient EMR
        const sessionUpdate = {
          type: "session.update",
          session: {
            modalities: ["text", "audio"],
            instructions: `You are an ambient EMR assistant. You help physicians with:
- Converting conversations to clinical documentation
- Voice-controlled navigation ("show patient chart", "open lab results")
- Ambient order entry ("order CBC", "prescribe medication")
- Clinical decision support during patient encounters
- Real-time documentation from bedside conversations

Be concise, medically accurate, and focus on clinical workflows. Always confirm critical orders.`,
            voice: "alloy",
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
        message: 'Connection to AI service failed' 
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
      console.log('Forwarding message to OpenAI');
      openAISocket.send(event.data);
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