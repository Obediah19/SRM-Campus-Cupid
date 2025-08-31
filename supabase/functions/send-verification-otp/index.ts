import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, X-Client-Info, Apikey, Content-Type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight OPTIONS request immediately
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { user_id, otp } = await req.json()

    if (!user_id || !otp) {
      throw new Error('Missing user_id or otp')
    }

    const { data: user, error } = await supabase.auth.admin.getUserById(user_id)
    if (error || !user) throw new Error('User not found')

    const storedOtp = user.user_metadata?.verification_otp
    const otpExpiry = user.user_metadata?.otp_expires_at

    if (!storedOtp || !otpExpiry) {
      throw new Error('OTP not found or expired')
    }

    if (otp !== storedOtp) {
      throw new Error('Invalid OTP')
    }

    if (new Date() > new Date(otpExpiry)) {
      throw new Error('OTP expired')
    }

    // Clear OTP and mark user as verified
    const { error: updateError } = await supabase.auth.admin.updateUserById(user_id, {
      user_metadata: {
        verification_otp: null,
        otp_expires_at: null,
        is_verified: true,
      },
    })

    if (updateError) throw updateError

    return new Response(
      JSON.stringify({ success: true, message: 'Email verified successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    console.error('OTP verification error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
