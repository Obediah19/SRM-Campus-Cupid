import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, X-Client-Info, Apikey, Content-Type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 })
  }

  try {
    const supabase = createClient(
      'https://dfycajftqqgdlwkssvtm.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjU0Njc2NywiZXhwIjoyMDcyMTIyNzY3fQ.EZDmXAJrR-k5SQ75DdP11z2pg9wK9ss64xExDXtg78s'
    )

    const { email } = await req.json()

    if (!email || !email.endsWith('@srmist.edu.in')) {
      throw new Error('Invalid SRM email address')
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    // Store OTP and expiration in user metadata
    // NOTE: replace 'user_id' here with actual UUID lookup if needed; currently uses email as id
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      email,
      {
        user_metadata: {
          verification_otp: otp,
          otp_expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // expires in 10 mins
        },
      }
    )
    if (updateError) {
      throw updateError
    }

    // SendGrid API key - keep this secret and store in env vars in real usage
    const SENDGRID_API_KEY = '23df8f865685a9d4f6cb5990a8f9e325e8b85b5505a2c3efc09e687bbbdb324d'
    if (!SENDGRID_API_KEY) throw new Error('SendGrid API key not set')

    const sendGridResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email }] }],
        from: { email: 'help.campuscupid@gmail.com', name: 'Campus Cupid' },
        subject: 'Your Campus Cupid OTP Code',
        content: [{ type: 'text/plain', value: `Your OTP code is ${otp}. It is valid for 10 minutes.` }],
      }),
    })

    if (!sendGridResponse.ok) {
      const errorText = await sendGridResponse.text()
      throw new Error(`SendGrid email failed: ${errorText}`)
    }

    return new Response(
      JSON.stringify({ success: true, message: 'OTP sent successfully to your email' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    console.error('Error sending OTP:', error)
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
