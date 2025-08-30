import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )
    const { email } = await req.json()
    if (!email || !email.endsWith('@srmist.edu.in')) {
      throw new Error('Invalid SRM email address')
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    // Store OTP in user's metadata (ensure to use correct user ID instead of email)
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      email, // Adjust as needed to user UUID for production
      {
        user_metadata: {
          verification_otp: otp,
          otp_expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 minutes
        }
      }
    )
    if (updateError) throw updateError

    // Send OTP email with SendGrid
    const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY')
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
        content: [
          {
            type: 'text/plain',
            value: `Your OTP code is ${otp}. It is valid for 10 minutes.`,
          },
        ],
      }),
    })

    if (!sendGridResponse.ok) {
      const errText = await sendGridResponse.text()
      throw new Error(`Failed to send email: ${errText}`)
    }

    return new Response(
      JSON.stringify({ success: true, message: 'OTP sent successfully to your email' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    console.error('OTP send error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
