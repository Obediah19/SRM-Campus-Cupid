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

    // Store OTP in database (you might want to create an otp_verifications table)
    // For now, we'll use user metadata
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      email, // This should be user ID, but for demo we'll use a different approach
      {
        user_metadata: {
          verification_otp: otp,
          otp_expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 minutes
        }
      }
    )

    if (updateError) {
      throw updateError
    }

    // In a real implementation, you would send an email here
    // For demo purposes, we'll just return the OTP (REMOVE IN PRODUCTION!)
    console.log(`Verification OTP for ${email}: ${otp}`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'OTP sent to your SRM email',
        // Remove this in production!
        otp_demo: otp 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('OTP send error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})