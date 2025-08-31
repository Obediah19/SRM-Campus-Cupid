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
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { email } = await req.json()

    if (!email || !email.endsWith('@srmist.edu.in')) {
      throw new Error('Invalid SRM email address')
    }

    // Get user by email from auth.users
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()
    if (listError) throw listError
    
    const user = users.find(u => u.email === email)
    if (!user) {
      throw new Error('User not found')
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    // Store OTP in user metadata
    const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
      user_metadata: {
        ...user.user_metadata,
        verification_otp: otp,
        otp_expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      },
    })

    if (updateError) throw updateError

    // Get SendGrid API key from secrets
    const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY')
    if (!SENDGRID_API_KEY) {
      // For now, return success without actually sending email
      console.log(`OTP for ${email}: ${otp}`)
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'OTP generated (check console for development)',
          otp: otp // Remove this in production
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }

    // Send email via SendGrid
    const sendGridResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email }] }],
        from: { email: 'noreply@campuscupid.com', name: 'Campus Cupid' },
        subject: 'Your Campus Cupid Verification Code',
        content: [{
          type: 'text/html',
          value: `
            <h2>Your Campus Cupid Verification Code</h2>
            <p>Your verification code is: <strong>${otp}</strong></p>
            <p>This code expires in 10 minutes.</p>
            <p>If you didn't request this code, please ignore this email.</p>
          `
        }],
      }),
    })

    if (!sendGridResponse.ok) {
      const errorText = await sendGridResponse.text()
      console.error('SendGrid error:', errorText)
      throw new Error(`Failed to send email: ${errorText}`)
    }

    return new Response(
      JSON.stringify({ success: true, message: 'OTP sent successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error) {
    console.error('Error sending OTP:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to send OTP' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})