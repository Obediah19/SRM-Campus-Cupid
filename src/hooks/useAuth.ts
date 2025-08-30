import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase, type Profile } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      if (session?.user) {
        await fetchProfile(session.user.id)
      }
      setLoading(false)
    }
    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        await fetchProfile(session.user.id)
      } else {
        setProfile(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      if (error) throw error
      setProfile(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      if (!email.endsWith('@srmist.edu.in')) {
        throw new Error('Only @srmist.edu.in email addresses are allowed')
      }
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } }
      })
      if (error) throw error

      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email,
            full_name: fullName,
            is_verified: false,
            is_profile_complete: false
          })

        if (profileError) throw profileError

        toast({
          title: "Account created! 🎉",
          description: "Please check your SRM email for verification link.",
        })

        return { user: data.user, needsVerification: true }
      }
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive",
      })
      throw error
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      if (!email.endsWith('@srmist.edu.in')) {
        throw new Error('Only @srmist.edu.in email addresses are allowed')
      }
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error

      toast({
        title: "Welcome back! 💕",
        description: "Successfully signed in to Campus Cupid.",
      })

      return data.user
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      })
      throw error
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      toast({
        title: "Signed out",
        description: "See you soon! 💕",
      })
    } catch (error: any) {
      toast({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const sendVerificationOTP = async (email: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('send-otp', {
        body: { email }
      })
      if (error) {
        console.error("send-otp invoke error:", error)
        throw error
      }
      toast({
        title: "OTP Sent! 📧",
        description: `Check your SRM email for the verification code.`,
      })
      return data
    } catch (error: any) {
      console.error("Failed to send OTP:", error)
      toast({
        title: "Failed to send OTP",
        description: error.message || String(error),
        variant: "destructive",
      })
      throw error
    }
  }

  const verifyOTP = async (userId: string, otp: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('verify-otp', {
        body: { user_id: userId, otp }
      })
      if (error) {
        console.error("verify-otp invoke error:", error)
        throw error
      }
      toast({
        title: "Email Verified! ✅",
        description: "Your SRM email has been verified successfully.",
      })
      await fetchProfile(userId)
      return data
    } catch (error: any) {
      console.error("OTP Verification Failed:", error)
      toast({
        title: "OTP Verification Failed",
        description: error.message || String(error),
        variant: "destructive",
      })
      throw error
    }
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      if (!user) throw new Error('No user logged in')
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single()
      if (error) throw error
      setProfile(data)

      toast({
        title: "Profile Updated! ✨",
        description: "Your changes have been saved.",
      })
      return data
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      })
      throw error
    }
  }

  return {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    sendVerificationOTP,
    verifyOTP,
    updateProfile,
    fetchProfile
  }
}
