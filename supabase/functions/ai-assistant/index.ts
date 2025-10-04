
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
    const { type, data, context } = await req.json();
    console.log('AI Assistant request:', { type, data: { ...data, symptoms: data.symptoms?.substring(0, 50) + '...' } });

    if (!cohereApiKey) {
      console.error('Cohere API key not found in environment');
      throw new Error('Cohere API key not configured');
    }

    console.log('Cohere API key found, length:', cohereApiKey.length);

    let systemPrompt = '';
    let userPrompt = '';

    switch (type) {
      case 'clinical_note':
        systemPrompt = `You are an expert clinical AI assistant. Generate comprehensive, professional medical documentation following proper medical terminology and SOAP format. Always include: Chief Complaint, History of Present Illness, Physical Examination, Assessment, and Plan. Be thorough but concise and clinically accurate.`;
        userPrompt = `Generate a detailed clinical note based on: ${data.summary}. Patient context: ${context || 'Standard adult patient visit'}. Format as proper SOAP note with clear sections.`;
        break;

      case 'clinical_note_with_emr_data':
        systemPrompt = `You are an expert clinical AI assistant with access to comprehensive EMR data. Generate professional medical documentation that intelligently integrates patient data from:
- Recent vital signs and trends
- Active medications and potential interactions
- Lab results and abnormal findings
- Imaging studies and interpretations
- Active problem list and chronic conditions
- Known allergies and adverse reactions
- Recent nursing assessments
- Previous visit documentation

Synthesize this information into a cohesive SOAP note that:
1. References relevant data points naturally within the narrative
2. Highlights abnormal findings and clinical concerns
3. Shows trends over time when applicable
4. Maintains professional medical terminology
5. Ensures clinical accuracy and completeness

If the user provides voice transcript or manual summary, use that as the primary narrative and enhance it with EMR data context.`;
        
        const emrContext = data.emrData ? `
EMR DATA AVAILABLE:
${data.emrData.vitalSigns?.length > 0 ? `\nRecent Vitals (most recent first):
${data.emrData.vitalSigns.slice(0, 3).map((v: any) => 
  `- ${new Date(v.recorded_at).toLocaleDateString()}: BP ${v.blood_pressure_systolic}/${v.blood_pressure_diastolic}, HR ${v.heart_rate}, RR ${v.respiratory_rate}, Temp ${v.temperature}°F, SpO2 ${v.oxygen_saturation}%`
).join('\n')}` : ''}

${data.emrData.medications?.length > 0 ? `\nActive Medications:
${data.emrData.medications.map((m: any) => 
  `- ${m.medication_name} ${m.dosage} ${m.route} ${m.frequency} (started ${new Date(m.start_date).toLocaleDateString()})`
).join('\n')}` : ''}

${data.emrData.labOrders?.length > 0 ? `\nRecent Lab Results:
${data.emrData.labOrders.slice(0, 5).map((l: any) => 
  `- ${l.test_name} (${l.status}): ${l.results ? JSON.stringify(l.results) : 'Pending'}`
).join('\n')}` : ''}

${data.emrData.radiologyOrders?.length > 0 ? `\nRecent Imaging:
${data.emrData.radiologyOrders.slice(0, 3).map((r: any) => 
  `- ${r.study_type} of ${r.body_part} (${r.status}): ${r.findings || 'Results pending'}`
).join('\n')}` : ''}

${data.emrData.problemList?.length > 0 ? `\nActive Problems:
${data.emrData.problemList.map((p: any) => 
  `- ${p.problem_name} (${p.icd10_code || 'No code'}) - ${p.status}`
).join('\n')}` : ''}

${data.emrData.allergies?.length > 0 ? `\nAllergies:
${data.emrData.allergies.map((a: any) => 
  `- ${a.allergen}: ${a.reaction_type} (${a.severity}) - ${a.symptoms}`
).join('\n')}` : ''}

${data.emrData.patient ? `\nPatient Demographics:
- Name: ${data.emrData.patient.first_name} ${data.emrData.patient.last_name}
- DOB: ${data.emrData.patient.date_of_birth}
- MRN: ${data.emrData.patient.mrn}
- Status: ${data.emrData.patient.status}` : ''}
` : '';

        userPrompt = `Generate a comprehensive ${data.noteType || 'progress'} note incorporating the following:

${data.voiceTranscript ? `VOICE TRANSCRIPT:\n${data.voiceTranscript}\n` : ''}
${data.manualSummary ? `CLINICAL SUMMARY:\n${data.manualSummary}\n` : ''}

${emrContext}

Create a well-structured SOAP note that synthesizes the clinical narrative with relevant EMR data. Highlight abnormal findings, trends, and clinically significant information.`;
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
        systemPrompt = `You are an emergency department triage AI assistant. Analyze patient presentation to provide triage recommendations, acuity assessment, and immediate care priorities. Focus on identifying high-risk conditions and appropriate resource allocation. Always provide structured responses with clear acuity levels (routine/urgent/critical) and specialty recommendations.`;
        userPrompt = `Triage assessment for: ${data.symptoms}. Patient context: ${data.patientContext || 'No specific patient context'}. Available specialties: ${data.availableSpecialties?.join(', ') || 'General Medicine'}. Provide acuity level (routine/urgent/critical), recommended specialty, and brief clinical reasoning.`;
        break;

      default:
        systemPrompt = `You are a helpful medical AI assistant. Provide accurate, professional healthcare information while emphasizing the importance of clinical judgment and professional verification.`;
        userPrompt = data.prompt || 'Please provide assistance.';
    }

    console.log('Calling Cohere API...');
    
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
        temperature: 0.3,
        max_tokens: 1500,
      }),
    });

    console.log('Cohere API response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Cohere API error:', errorData);
      
      // More specific error handling for Cohere
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please wait a moment and try again.');
      } else if (response.status === 401) {
        throw new Error('Invalid Cohere API key. Please check your API key configuration.');
      } else if (response.status === 402) {
        throw new Error('Insufficient Cohere credits. Please add billing to your Cohere account.');
      } else {
        throw new Error(`Cohere API error: ${errorData.message || 'Unknown error'}`);
      }
    }

    const aiData = await response.json();
    console.log('Cohere response received successfully');
    
    const result = aiData.text;

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
