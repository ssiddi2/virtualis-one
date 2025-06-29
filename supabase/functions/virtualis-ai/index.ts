
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const cohereApiKey = Deno.env.get('COHERE_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { input, context, availableSpecialties } = await req.json();
    console.log('Virtualis AI request:', { input: input?.substring(0, 100) + '...' });

    if (!cohereApiKey) {
      throw new Error('Cohere API key not configured');
    }

    const systemPrompt = `You are Virtualis AI Assistant™, a clinical workflow parser that helps healthcare professionals execute tasks through natural language.

Your job is to parse clinical requests and extract structured information:

AVAILABLE SPECIALTIES: ${availableSpecialties?.join(', ') || 'General Medicine, Cardiology, Neurology, Emergency Medicine'}

PARSE THE FOLLOWING ELEMENTS:
1. ACTION TYPE: message, order, note, consult, lab, radiology
2. PATIENT IDENTIFIER: room number, name, MRN
3. RECIPIENT: specialty, specific doctor name, department
4. CLINICAL CONTENT: symptoms, findings, requests
5. URGENCY: routine, urgent, critical, STAT

RESPOND WITH STRUCTURED JSON:
{
  "action": "message|order|note|consult|lab|radiology",
  "patient": "room 405|Jane Doe|MRN-12345",
  "recipient": "cardiologist|Dr. Smith|emergency",
  "content": "clinical details extracted",
  "urgency": "routine|urgent|critical",
  "confidence": 0.0-1.0
}

BE PRECISE and CONFIDENT in parsing clinical language.`;

    const userPrompt = `Parse this clinical workflow request: "${input}"

Context: ${context || 'Standard clinical workflow'}`;

    const response = await fetch('https://api.cohere.ai/v1/chat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${cohereApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'command-r-plus',
        message: userPrompt,
        preamble: systemPrompt,
        temperature: 0.1,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Cohere API error:', errorData);
      throw new Error(`Cohere API error: ${errorData.message || 'Unknown error'}`);
    }

    const aiData = await response.json();
    console.log('Virtualis AI response received successfully');
    
    let parsedResult;
    try {
      // Try to extract JSON from the response
      const jsonMatch = aiData.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResult = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback parsing if no JSON found
        parsedResult = {
          action: 'message',
          patient: extractPatientInfo(input),
          recipient: extractRecipientInfo(input, availableSpecialties),
          content: input,
          urgency: extractUrgency(input),
          confidence: 0.7
        };
      }
    } catch (parseError) {
      console.error('JSON parsing error, using fallback:', parseError);
      parsedResult = {
        action: 'message',
        patient: extractPatientInfo(input),
        recipient: extractRecipientInfo(input, availableSpecialties),
        content: input,
        urgency: extractUrgency(input),
        confidence: 0.5
      };
    }

    return new Response(JSON.stringify({ 
      result: parsedResult,
      originalText: aiData.text,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in virtualis-ai function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Virtualis AI assistant encountered an error.'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function extractPatientInfo(input: string): string | undefined {
  const roomMatch = input.match(/room\s*(\d+)/i);
  if (roomMatch) return `room ${roomMatch[1]}`;
  
  const mrnMatch = input.match(/mrn[:\s]*([a-z0-9-]+)/i);
  if (mrnMatch) return `mrn ${mrnMatch[1]}`;
  
  return undefined;
}

function extractRecipientInfo(input: string, specialties: string[] = []): string | undefined {
  const lowerInput = input.toLowerCase();
  
  for (const specialty of specialties) {
    if (lowerInput.includes(specialty.toLowerCase())) {
      return specialty;
    }
  }
  
  // Common specialty patterns
  const patterns = ['cardiologist', 'nephrologist', 'nocturnist', 'radiologist', 'neurologist'];
  for (const pattern of patterns) {
    if (lowerInput.includes(pattern)) {
      return pattern;
    }
  }
  
  return undefined;
}

function extractUrgency(input: string): string {
  const lowerInput = input.toLowerCase();
  if (lowerInput.includes('stat') || lowerInput.includes('critical') || lowerInput.includes('emergency')) {
    return 'critical';
  }
  if (lowerInput.includes('urgent') || lowerInput.includes('asap')) {
    return 'urgent';
  }
  return 'routine';
}
