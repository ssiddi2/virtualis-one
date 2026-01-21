import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    console.log('AI Assistant request:', { type, dataKeys: Object.keys(data || {}) });

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      throw new Error('AI service is not configured');
    }

    let systemPrompt = '';
    let userPrompt = '';

    // Helper to format EMR data
    const formatEMRData = (emrData: any) => {
      if (!emrData) return '';
      let formatted = '';
      
      if (emrData.vitalSigns?.length) {
        const latest = emrData.vitalSigns[0];
        formatted += `\nVital Signs: BP ${latest.blood_pressure_systolic}/${latest.blood_pressure_diastolic}, HR ${latest.heart_rate}, Temp ${latest.temperature}°F, SpO2 ${latest.oxygen_saturation}%`;
      }
      if (emrData.medications?.length) {
        formatted += `\nMedications: ${emrData.medications.map((m: any) => `${m.medication_name} ${m.dosage}`).join(', ')}`;
      }
      if (emrData.allergies?.length) {
        formatted += `\nAllergies: ${emrData.allergies.map((a: any) => `${a.allergen} (${a.severity})`).join(', ')}`;
      }
      if (emrData.problemList?.length) {
        formatted += `\nProblems: ${emrData.problemList.map((p: any) => p.problem_name).join(', ')}`;
      }
      if (emrData.labOrders?.length) {
        formatted += `\nRecent Labs: ${emrData.labOrders.slice(0, 3).map((l: any) => `${l.test_name}: ${l.status}`).join(', ')}`;
      }
      return formatted;
    };

    switch (type) {
      case 'clinical_note':
        systemPrompt = `You are an expert clinical documentation assistant. Generate professional, accurate clinical notes in SOAP format. Be concise but thorough.`;
        userPrompt = `Generate a clinical note based on:\n${data.summary || data.prompt || JSON.stringify(data)}\n${context ? `Context: ${context}` : ''}`;
        break;

      case 'clinical_note_with_emr_data':
        systemPrompt = `You are an expert clinical documentation assistant with EMR access. Generate professional SOAP notes incorporating patient data intelligently.`;
        userPrompt = `Generate a clinical note with this EMR data:${formatEMRData(data.emrData)}\n\nClinician notes: ${data.summary || data.voiceTranscript || data.manualSummary || ''}`;
        break;

      case 'auto_generate_from_emr_only':
        systemPrompt = `You are a clinical AI that generates progress notes from EMR data. Create structured SOAP notes based on objective findings. Add disclaimer: "⚠️ AUTO-GENERATED - requires physician review"`;
        userPrompt = `Generate a ${data.noteType || 'progress'} note from:${formatEMRData(data.emrData)}`;
        break;

      case 'diagnosis_support':
        systemPrompt = `You are a clinical decision support AI. Provide differential diagnoses with likelihood and recommended workup. Emphasize this is for support only - final diagnosis requires qualified professionals.`;
        userPrompt = `Differential diagnoses for:\n${data.symptoms || data.prompt || JSON.stringify(data)}`;
        break;

      case 'medical_coding':
        systemPrompt = `You are a medical coding specialist. Suggest ICD-10 and CPT codes with descriptions. Recommend verification by certified coders.`;
        userPrompt = `Suggest codes for:\n${data.documentation || data.procedure || data.diagnosis || JSON.stringify(data)}`;
        break;

      case 'medication_check':
        systemPrompt = `You are a clinical pharmacist AI. Review medications for interactions, contraindications, and dosing. Flag concerns and suggest alternatives.`;
        userPrompt = `Review medications:\n${data.medications || JSON.stringify(data)}\n${data.allergies ? `Allergies: ${data.allergies}` : ''}`;
        break;

      case 'care_plan':
        systemPrompt = `You are a care coordination specialist. Generate comprehensive care plans with goals, interventions, and outcomes.`;
        userPrompt = `Care plan for:\nDiagnosis: ${data.diagnosis || data.condition || 'Not specified'}\nContext: ${data.context || data.assessment || context || ''}`;
        break;

      case 'claims_review':
        systemPrompt = `You are a healthcare claims analyst. Review for completeness, accuracy, and denial risks.`;
        userPrompt = `Review claim:\n${JSON.stringify(data)}`;
        break;

      case 'triage_assessment':
        systemPrompt = `You are an ED triage specialist. Assess urgency, assign acuity level (routine/urgent/critical), and recommend specialty.`;
        userPrompt = `Triage:\n${data.symptoms || data.chiefComplaint || JSON.stringify(data)}`;
        break;

      case 'note_suggestions':
        systemPrompt = `You are a clinical documentation assistant. Provide 3 specific, actionable suggestions to improve the clinical note. Each should be a complete sentence ready to add.`;
        userPrompt = `Suggestions for ${data.noteType || 'progress'} note:\nPatient: ${data.patientName || 'Unknown'}\nContent: ${data.currentContent || 'Empty'}\n${context ? `Context: ${context}` : ''}`;
        break;

      case 'snf_billing':
        systemPrompt = `You are a skilled nursing facility (SNF) medical coding and billing specialist. Analyze clinical documentation and suggest appropriate ICD-10 diagnosis codes and CPT procedure codes. Focus on SNF-specific codes (99304-99310 for E/M, 97xxx for therapy). Always recommend verification by certified coders.`;
        userPrompt = `Analyze this SNF documentation for billing codes:\nNote Type: ${data.noteType || 'SNF Daily'}\nFacility: ${data.facilityType || 'SNF'}\nDocumentation:\n${data.documentation || ''}`;
        break;

      case 'denial_prediction':
        systemPrompt = `You are a healthcare claims analyst specializing in SNF billing. Analyze documentation for potential denial risks and suggest improvements.`;
        userPrompt = `Assess denial risk for:\n${data.documentation || JSON.stringify(data)}`;
        break;

      case 'real_time_coding':
        systemPrompt = `You are a fast medical coding assistant optimized for real-time suggestions. Return ONLY codes in this exact format:
ICD-10: [CODE] - [Brief description]
CPT: [CODE] - [Brief description]
Provide 2-4 most likely codes. No explanations.`;
        userPrompt = `Quick codes for ${data.facilityType || 'clinical'} ${data.noteType || 'note'}:\n${data.documentation?.substring(0, 500) || ''}`;
        break;

      default:
        systemPrompt = `You are a helpful medical AI assistant. Provide accurate, professional responses while emphasizing clinical judgment.`;
        userPrompt = data.prompt || JSON.stringify(data);
    }

    console.log('Calling Lovable AI Gateway...');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    console.log('AI Gateway response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again shortly.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'AI credits exhausted. Please add credits.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`AI service error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const result = aiResponse.choices?.[0]?.message?.content;

    if (!result) {
      throw new Error('No response from AI service');
    }

    console.log('AI response received successfully');

    return new Response(JSON.stringify({
      result,
      type,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-assistant:', error);
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
