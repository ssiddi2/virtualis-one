
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, data, context } = await req.json();

    let systemPrompt = '';
    let userPrompt = '';

    switch (type) {
      case 'clinical_note':
        systemPrompt = `You are an expert clinical AI assistant. Generate comprehensive, professional medical documentation following proper medical terminology and format. Always include: Chief Complaint, History of Present Illness, Physical Examination, Assessment, and Plan (SOAP format). Be thorough but concise.`;
        userPrompt = `Generate a clinical note based on: ${data.summary}. Patient context: ${context || 'Standard adult patient visit'}.`;
        break;

      case 'diagnosis_support':
        systemPrompt = `You are a clinical decision support AI. Provide differential diagnosis suggestions based on symptoms, but always emphasize that this is for educational/support purposes only and final diagnosis must be made by qualified healthcare professionals.`;
        userPrompt = `Based on these symptoms and findings: ${data.symptoms}, suggest possible differential diagnoses with brief rationale.`;
        break;

      case 'medical_coding':
        systemPrompt = `You are a medical coding AI assistant specializing in ICD-10 and CPT codes. Provide accurate coding suggestions based on medical documentation, but always recommend verification by certified coders.`;
        userPrompt = `Suggest appropriate ICD-10 and CPT codes for: ${data.procedure || data.diagnosis}. Clinical context: ${data.context || ''}`;
        break;

      case 'medication_check':
        systemPrompt = `You are a clinical pharmacist AI assistant. Review medications for interactions, contraindications, and dosing appropriateness. Always recommend consulting with clinical pharmacists for final verification.`;
        userPrompt = `Review this medication regimen: ${data.medications}. Patient info: Age ${data.age || 'adult'}, conditions: ${data.conditions || 'none specified'}.`;
        break;

      case 'care_plan':
        systemPrompt = `You are a nursing care plan AI assistant. Generate comprehensive nursing care plans with nursing diagnoses, goals, interventions, and evaluation criteria based on NANDA guidelines.`;
        userPrompt = `Create a nursing care plan for: ${data.condition}. Patient assessment: ${data.assessment || 'Standard assessment'}.`;
        break;

      case 'claims_review':
        systemPrompt = `You are a medical billing AI assistant. Review claims for potential issues, coding accuracy, and reimbursement optimization. Identify potential denial risks and suggest improvements.`;
        userPrompt = `Review this claim: Procedure: ${data.procedure}, Diagnosis: ${data.diagnosis}, Codes: ${data.codes || 'Not specified'}. Insurance: ${data.insurance || 'Not specified'}.`;
        break;

      default:
        systemPrompt = `You are a helpful medical AI assistant. Provide accurate, professional healthcare information while emphasizing the importance of clinical judgment and professional verification.`;
        userPrompt = data.prompt || 'Please provide assistance.';
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    const aiData = await response.json();
    
    if (!response.ok) {
      throw new Error(aiData.error?.message || 'OpenAI API error');
    }

    const result = aiData.choices[0].message.content;

    return new Response(JSON.stringify({ 
      result,
      type,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-assistant function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'AI assistant encountered an error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
