import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

export type MatchUser = {
  id: string
  name: string
  course: string
  age: number
  photos: Array<{ photo_url: string; is_primary: boolean }>
}

export type Match = {
  id: string
  user: MatchUser
  created_at: string
}

export type ChatMessage = {
  id: string
  content: string
  sender_id: string
  created_at: string
  is_read: boolean
}

export const useMatches = () => {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchMatches()
  }, [])

  const fetchMatches = async () => {
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('matches')
        .select(`
          id,
          created_at,
          user1_id,
          user2_id,
          user1:profiles!matches_user1_id_fkey (
            id,
            full_name,
            course,
            age,
            profile_photos (
              photo_url,
              is_primary
            )
          ),
          user2:profiles!matches_user2_id_fkey (
            id,
            full_name,
            course,
            age,
            profile_photos (
              photo_url,
              is_primary
            )
          )
        `)
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Format matches to get the other user's data
      const formattedMatches = data?.map(match => {
        const isUser1 = match.user1_id === user.id
        const otherUser = isUser1 ? match.user2[0] : match.user1[0]

        return {
          id: match.id,
          created_at: match.created_at,
          user: {
            id: otherUser.id,
            name: otherUser.full_name,
            course: otherUser.course,
            age: otherUser.age,
            photos: otherUser.profile_photos || []
          }
        }
      }) || []

      setMatches(formattedMatches)
    } catch (error: any) {
      console.error('Error fetching matches:', error)
      toast({
        title: "Error loading matches",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async (matchId: string, content: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          match_id: matchId,
          content: content.trim()
        })
        .select()
        .single()

      if (error) throw error

      return data
    } catch (error: any) {
      console.error('Error sending message:', error)
      toast({
        title: "Failed to send message",
        description: error.message,
        variant: "destructive",
      })
      throw error
    }
  }

  const fetchMessages = async (matchId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('match_id', matchId)
        .order('created_at', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error: any) {
      console.error('Error fetching messages:', error)
      return []
    }
  }

  return {
    matches,
    loading,
    fetchMatches,
    sendMessage,
    fetchMessages
  }
}