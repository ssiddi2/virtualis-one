
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { patientId } = await req.json()
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get OpenAI API key from secrets
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    // Fetch patient data
    const { data: patient, error: patientError } = await supabase
      .from('patients')
      .select(`
        *,
        medications (*),
        allergies (*),
        clinical_notes (*)
      `)
      .eq('id', patientId)
      .single()

    if (patientError) {
      throw new Error(`Failed to fetch patient data: ${patientError.message}`)
    }

    const systemPrompt = `You are a clinical AI assistant providing evidence-based medical insights. 
    Analyze the patient data and provide 3-5 actionable clinical insights or recommendations.
    
    Focus on:
    - Potential medication interactions or optimization opportunities
    - Risk factors that need monitoring
    - Care plan improvements
    - Diagnostic considerations
    - Quality improvement suggestions
    
    Keep insights concise, actionable, and evidence-based. Each insight should be 1-2 sentences.`

    const userPrompt = `Analyze this patient data and provide clinical insights:
    
    Patient: ${patient.first_name} ${patient.last_name}, Age ${patient.age}
    Chief Complaint: ${patient.chief_complaint || 'Not specified'}
    Medical History: ${patient.medical_history || 'Not documented'}
    Current Medications: ${patient.medications?.map(m => `${m.name} ${m.dosage} ${m.frequency}`).join(', ') || 'None documented'}
    Allergies: ${patient.allergies?.map(a => a.allergen).join(', ') || 'None documented'}
    Recent Notes: ${patient.clinical_notes?.slice(0, 3).map(n => n.content).join('; ') || 'No recent notes'}
    
    Provide 3-5 actionable clinical insights for this patient.`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.2,
        max_tokens: 800,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const data = await response.json()
    const insightsText = data.choices[0]?.message?.content

    if (!insightsText) {
      throw new Error('No insights generated from OpenAI')
    }

    // Parse insights into array (assuming numbered list format)
    const insights = insightsText
      .split('\n')
      .filter(line => line.match(/^\d+\./))
      .map(line => line.replace(/^\d+\.\s*/, '').trim())

    return new Response(
      JSON.stringify({ insights }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error in generate-ai-insights function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
