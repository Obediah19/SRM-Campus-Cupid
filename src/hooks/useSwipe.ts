import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

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

export const useSwipe = () => {
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
      const { data, error } = await supabase.functions.invoke('get-potential-matches')
      
      if (error) throw error
      
      setPotentialMatches(data.matches || [])
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
      const { data, error } = await supabase
        .from('swipes')
        .insert({
          swiped_id: targetUserId,
          is_like: isLike
        })
        .select()

      if (error) throw error

      // Check if it's a match
      if (isLike) {
        // The database trigger will handle match creation
        // We can check if a match was created by looking for it
        const { data: matchData } = await supabase
          .from('matches')
          .select('*')
          .or(`user1_id.eq.${targetUserId},user2_id.eq.${targetUserId}`)
          .order('created_at', { ascending: false })
          .limit(1)

        if (matchData && matchData.length > 0) {
          const latestMatch = matchData[0]
          const matchTime = new Date(latestMatch.created_at).getTime()
          const now = new Date().getTime()
          
          // If match was created in the last few seconds, it's likely our match
          if (now - matchTime < 10000) {
            const matchedUser = potentialMatches.find(u => u.id === targetUserId)
            toast({
              title: "It's a Match! 💕",
              description: `You and ${matchedUser?.name} liked each other!`,
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

      // If we're running low on matches, fetch more
      if (currentIndex >= potentialMatches.length - 2) {
        await fetchPotentialMatches()
        setCurrentIndex(0)
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