import { useState, useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'
import { mockCurrentUser, type MockUser } from '@/lib/mockData'

type MockProfile = Omit<MockUser, 'photos' | 'prompts'> & {
  photos?: Array<{ photo_url: string; is_primary: boolean }>;
  prompts?: Array<{ question: string; answer: string }>;
}

export const useMockAuth = () => {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null)
  const [profile, setProfile] = useState<MockProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Simulate loading auth state
    const timer = setTimeout(() => {
      const savedAuth = localStorage.getItem('mockAuth')
      if (savedAuth) {
        const authData = JSON.parse(savedAuth)
        setUser(authData.user)
        setProfile(authData.profile)
      }
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      if (!email.endsWith('@srmist.edu.in')) {
        throw new Error('Only @srmist.edu.in email addresses are allowed')
      }

      // Simulate signup process
      await new Promise(resolve => setTimeout(resolve, 1000))

      const newUser = {
        id: 'new-user-' + Date.now(),
        email,
        full_name: fullName,
        age: 20,
        course: '',
        academic_year: '',
        bio: '',
        is_profile_complete: false,
        is_verified: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      toast({
        title: "Account created! 🎉",
        description: "Welcome to Campus Cupid! Please complete your profile.",
      })

      return { user: { id: newUser.id, email }, needsVerification: true }
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

      // Simulate login process
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Use mock current user for demo
      const authData = {
        user: { id: mockCurrentUser.id, email: mockCurrentUser.email },
        profile: mockCurrentUser
      }

      setUser(authData.user)
      setProfile(authData.profile)
      localStorage.setItem('mockAuth', JSON.stringify(authData))

      toast({
        title: "Welcome back! 💕",
        description: "Successfully signed in to Campus Cupid.",
      })

      return authData.user
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
      setUser(null)
      setProfile(null)
      localStorage.removeItem('mockAuth')

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
      // Simulate OTP sending
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "OTP Sent! 📧",
        description: `Check your SRM email for the verification code.`,
      })
      return { success: true }
    } catch (error: any) {
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
      // Simulate OTP verification
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (otp !== '123456') {
        throw new Error('Invalid OTP. Use 123456 for demo')
      }

      const updatedProfile = { ...profile, is_verified: true } as MockProfile
      setProfile(updatedProfile)
      
      const authData = { user, profile: updatedProfile }
      localStorage.setItem('mockAuth', JSON.stringify(authData))

      toast({
        title: "Email Verified! ✅",
        description: "Your SRM email has been verified successfully.",
      })
      return { success: true }
    } catch (error: any) {
      toast({
        title: "OTP Verification Failed",
        description: error.message || String(error),
        variant: "destructive",
      })
      throw error
    }
  }

  const updateProfile = async (updates: Partial<MockProfile>) => {
    try {
      if (!user) throw new Error('No user logged in')
      
      // Simulate profile update
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const updatedProfile = { ...profile, ...updates } as MockProfile
      setProfile(updatedProfile)
      
      const authData = { user, profile: updatedProfile }
      localStorage.setItem('mockAuth', JSON.stringify(authData))

      toast({
        title: "Profile Updated! ✨",
        description: "Your changes have been saved.",
      })
      return updatedProfile
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      })
      throw error
    }
  }

  const fetchProfile = async (userId: string) => {
    // Profile is already loaded in this mock implementation
    return profile
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