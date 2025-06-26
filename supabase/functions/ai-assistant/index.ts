
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
    console.log('AI Assistant request:', { type, data, context });

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    let systemPrompt = '';
    let userPrompt = '';

    switch (type) {
      case 'clinical_note':
        systemPrompt = `You are an expert clinical AI assistant. Generate comprehensive, professional medical documentation following proper medical terminology and SOAP format. Always include: Chief Complaint, History of Present Illness, Physical Examination, Assessment, and Plan. Be thorough but concise and clinically accurate.`;
        userPrompt = `Generate a detailed clinical note based on: ${data.summary}. Patient context: ${context || 'Standard adult patient visit'}. Format as proper SOAP note with clear sections.`;
        break;

      case 'diagnosis_support':
        systemPrompt = `You are a clinical decision support AI. Provide differential diagnosis suggestions based on symptoms and patient data. Include likelihood assessment and recommended next steps. Always emphasize that this is for educational/support purposes only and final diagnosis must be made by qualified healthcare professionals.`;
        userPrompt = `Based on these symptoms and findings: ${data.symptoms}, provide differential diagnosis suggestions with clinical reasoning and recommended diagnostic workup.`;
        break;

      case 'medical_coding':
        systemPrompt = `You are a medical coding AI assistant specializing in ICD-10 and CPT codes. Provide accurate coding suggestions based on medical documentation. Include code descriptions and rationale. Always recommend verification by certified coders.`;
        userPrompt = `Suggest appropriate ICD-10 and CPT codes for: ${data.procedure || data.diagnosis}. Clinical context: ${data.context || ''}. Include code descriptions and justification.`;
        break;

      case 'medication_check':
        systemPrompt = `You are a clinical pharmacist AI assistant. Review medications for interactions, contraindications, and dosing appropriateness. Provide safety alerts and recommendations. Always recommend consulting with clinical pharmacists for final verification.`;
        userPrompt = `Review this medication regimen: ${data.medications}. Patient info: Age ${data.age || 'adult'}, conditions: ${data.conditions || 'none specified'}. Check for interactions, contraindications, and dosing issues.`;
        break;

      case 'care_plan':
        systemPrompt = `You are a nursing care plan AI assistant. Generate comprehensive nursing care plans with nursing diagnoses, goals, interventions, and evaluation criteria based on NANDA guidelines. Include priority nursing diagnoses and measurable outcomes.`;
        userPrompt = `Create a detailed nursing care plan for: ${data.condition}. Patient assessment: ${data.assessment || 'Standard assessment'}. Include NANDA nursing diagnoses, SMART goals, and specific interventions.`;
        break;

      case 'claims_review':
        systemPrompt = `You are a medical billing AI assistant. Review claims for potential issues, coding accuracy, and reimbursement optimization. Identify potential denial risks and suggest improvements. Focus on compliance and revenue optimization.`;
        userPrompt = `Review this claim: Procedure: ${data.procedure}, Diagnosis: ${data.diagnosis}, Codes: ${data.codes || 'Not specified'}. Insurance: ${data.insurance || 'Not specified'}. Identify potential issues and optimization opportunities.`;
        break;

      case 'triage_assessment':
        systemPrompt = `You are an emergency department triage AI assistant. Analyze patient presentation to provide triage recommendations, acuity assessment, and immediate care priorities. Focus on identifying high-risk conditions and appropriate resource allocation.`;
        userPrompt = `Triage assessment for: ${data.symptoms}. Provide acuity level recommendation, immediate priorities, and suggested diagnostic workup. Consider emergency vs urgent vs routine classification.`;
        break;

      default:
        systemPrompt = `You are a helpful medical AI assistant. Provide accurate, professional healthcare information while emphasizing the importance of clinical judgment and professional verification.`;
        userPrompt = data.prompt || 'Please provide assistance.';
    }

    console.log('Calling OpenAI with prompts:', { systemPrompt: systemPrompt.substring(0, 100), userPrompt: userPrompt.substring(0, 100) });

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

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const aiData = await response.json();
    console.log('OpenAI response received successfully');
    
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
      details: 'AI assistant encountered an error. Please check the logs.'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
