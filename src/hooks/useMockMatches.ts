import { useState, useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'
import { mockMatches, mockMessages, type MockMatch, type MockMessage } from '@/lib/mockData'

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

export const useMockMatches = () => {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchMatches()
  }, [])

  const fetchMatches = async () => {
    try {
      setLoading(true)
      
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Convert mock matches to the expected format
      const formattedMatches = mockMatches.map(match => ({
        id: match.id,
        created_at: match.created_at,
        user: {
          id: match.user.id,
          name: match.user.full_name,
          course: match.user.course,
          age: match.user.age,
          photos: match.user.photos
        }
      }))

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
      // Simulate sending message
      await new Promise(resolve => setTimeout(resolve, 300))

      const newMessage: MockMessage = {
        id: 'msg-' + Date.now(),
        match_id: matchId,
        sender_id: 'current-user-1', // Mock current user ID
        content: content.trim(),
        created_at: new Date().toISOString(),
        is_read: false
      }

      // Add to mock messages store
      if (!mockMessages[matchId]) {
        mockMessages[matchId] = []
      }
      mockMessages[matchId].push(newMessage)

      return newMessage
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

  const fetchMessages = async (matchId: string): Promise<ChatMessage[]> => {
    try {
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const messages = mockMessages[matchId] || []
      return messages.map(msg => ({
        id: msg.id,
        content: msg.content,
        sender_id: msg.sender_id,
        created_at: msg.created_at,
        is_read: msg.is_read
      }))
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