import { createClient } from '@supabase/supabase-js'

// Replace these with your actual Supabase project values
// You can find these in your Supabase project settings
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'your-project-url'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types
export type Profile = {
  id: string
  email: string
  full_name: string
  age?: number
  course?: string
  academic_year?: string
  bio?: string
  is_profile_complete: boolean
  is_verified: boolean
  created_at: string
  updated_at: string
}

export type ProfilePhoto = {
  id: string
  profile_id: string
  photo_url: string
  is_primary: boolean
  created_at: string
}

export type ProfilePrompt = {
  id: string
  profile_id: string
  question: string
  answer: string
  created_at: string
}

export type Interest = {
  id: string
  name: string
}

export type Swipe = {
  id: string
  swiper_id: string
  swiped_id: string
  is_like: boolean
  created_at: string
}

export type Match = {
  id: string
  user1_id: string
  user2_id: string
  created_at: string
}

export type Message = {
  id: string
  match_id: string
  sender_id: string
  content: string
  created_at: string
  is_read: boolean
}