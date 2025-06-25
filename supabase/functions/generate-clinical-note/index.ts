
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
    const { noteType, summary, patientData } = await req.json()
    
    // Get OpenAI API key from secrets
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    const noteTypes: Record<string, string> = {
      hp: "History & Physical Examination",
      progress: "Progress Note", 
      discharge: "Discharge Summary",
      consult: "Consultation Report",
      procedure: "Procedure Documentation",
      admission: "Admission Assessment"
    }

    const systemPrompt = `You are a clinical AI assistant helping to generate professional medical documentation. 
    Generate a comprehensive ${noteTypes[noteType] || 'Clinical Note'} based on the provided information.
    
    Follow proper medical documentation standards:
    - Use clear, professional medical terminology
    - Include all relevant sections for this note type
    - Maintain objectivity and clinical accuracy
    - Follow SOAP format where appropriate
    - Include appropriate disclaimers about AI assistance
    
    The note should be ready for provider review and electronic signature.`

    const userPrompt = `Generate a ${noteTypes[noteType] || 'Clinical Note'} with the following information:
    
    Clinical Summary: ${summary}
    
    ${patientData ? `Patient Context: ${JSON.stringify(patientData, null, 2)}` : ''}
    
    Please generate a complete, professional clinical note that follows medical documentation standards.`

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
        temperature: 0.3,
        max_tokens: 2000,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const data = await response.json()
    const generatedNote = data.choices[0]?.message?.content

    if (!generatedNote) {
      throw new Error('No content generated from OpenAI')
    }

    return new Response(
      JSON.stringify({ generatedNote }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error in generate-clinical-note function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
