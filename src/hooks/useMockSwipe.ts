import { useState, useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'
import { mockPotentialMatches, type MockUser } from '@/lib/mockData'

export type PotentialMatch = {
  id: string
  name: string
  age: number
  course: string
  year: string
  bio: string
  photos: Array<{ photo_url: string; is_primary: boolean }>
  prompts: Array<{ question: string; answer: string }>
  interests: string[]
}

export const useMockSwipe = () => {
  const [potentialMatches, setPotentialMatches] = useState<PotentialMatch[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchPotentialMatches()
  }, [])

  const fetchPotentialMatches = async () => {
    try {
      setLoading(true)
      
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Convert mock data to the expected format
      const formattedMatches = mockPotentialMatches.map(user => ({
        id: user.id,
        name: user.full_name,
        age: user.age,
        course: user.course,
        year: user.academic_year,
        bio: user.bio,
        photos: user.photos,
        prompts: user.prompts,
        interests: user.interests
      }))
      
      setPotentialMatches(formattedMatches)
    } catch (error: any) {
      console.error('Error fetching matches:', error)
      toast({
        title: "Error loading profiles",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSwipe = async (targetUserId: string, isLike: boolean) => {
    try {
      // Simulate swipe processing
      await new Promise(resolve => setTimeout(resolve, 300))

      const currentUser = potentialMatches[currentIndex]
      
      if (isLike) {
        // Simulate random match chance (30% for demo purposes)
        const isMatch = Math.random() < 0.3
        
        if (isMatch) {
          toast({
            title: "It's a Match! 💕",
            description: `You and ${currentUser?.name} liked each other!`,
            duration: 5000,
          })
        } else {
          toast({
            title: "Like Sent 💖",
            description: "They'll see your like when they come across your profile!",
          })
        }
      } else {
        toast({
          title: "Passed",
          description: "No worries, there are plenty more profiles to discover!",
        })
      }

      // Move to next user
      setCurrentIndex(prev => prev + 1)

      // If we're running out of profiles, reset to beginning for demo
      if (currentIndex >= potentialMatches.length - 2) {
        setTimeout(() => {
          setCurrentIndex(0)
          toast({
            title: "Fresh profiles loaded!",
            description: "Here are some new people to discover.",
          })
        }, 1000)
      }

    } catch (error: any) {
      console.error('Error swiping:', error)
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getCurrentUser = () => {
    return potentialMatches[currentIndex] || null
  }

  return {
    potentialMatches,
    currentUser: getCurrentUser(),
    loading,
    handleSwipe,
    fetchPotentialMatches
  }
}