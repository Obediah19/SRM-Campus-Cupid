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

    const { user_id, otp } = await req.json()

    if (!user_id || !otp) {
      throw new Error('User ID and OTP are required')
    }

    // Get user to check OTP
    const { data: user, error: userError } = await supabase.auth.admin.getUserById(user_id)
    
    if (userError || !user) {
      throw new Error('User not found')
    }

    const storedOtp = user.user?.user_metadata?.verification_otp
    const otpExpiresAt = user.user?.user_metadata?.otp_expires_at

    if (!storedOtp || !otpExpiresAt) {
      throw new Error('No OTP found for this user')
    }

    if (new Date() > new Date(otpExpiresAt)) {
      throw new Error('OTP has expired')
    }

    if (otp !== storedOtp) {
      throw new Error('Invalid OTP')
    }

    // Mark user as verified
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ is_verified: true })
      .eq('id', user_id)

    if (updateError) {
      throw updateError
    }

    // Clear OTP from user metadata
    await supabase.auth.admin.updateUserById(user_id, {
      user_metadata: {
        verification_otp: null,
        otp_expires_at: null
      }
    })

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email verified successfully!' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('OTP verification error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})