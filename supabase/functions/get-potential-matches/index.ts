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
    const authHeader = req.headers.get('Authorization')!
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      throw new Error('Unauthorized')
    }

    // Get potential matches (users not already swiped on)
    const { data: potentialMatches, error: matchError } = await supabase
      .from('profiles')
      .select(`
        id,
        full_name,
        age,
        course,
        academic_year,
        bio,
        profile_photos (
          photo_url,
          is_primary
        ),
        profile_prompts (
          question,
          answer
        ),
        profile_interests (
          interests (
            name
          )
        )
      `)
      .eq('is_verified', true)
      .eq('is_profile_complete', true)
      .neq('id', user.id)
      .not('id', 'in', `(
        SELECT swiped_id 
        FROM swipes 
        WHERE swiper_id = '${user.id}'
      )`)
      .limit(10)

    if (matchError) {
      throw matchError
    }

    // Format the data
    const formattedMatches = potentialMatches?.map(match => ({
      id: match.id,
      name: match.full_name,
      age: match.age,
      course: match.course,
      year: match.academic_year,
      bio: match.bio,
      photos: match.profile_photos || [],
      prompts: match.profile_prompts || [],
      interests: match.profile_interests?.map((pi: any) => pi.interests.name) || []
    }))

    return new Response(
      JSON.stringify({ matches: formattedMatches }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Get matches error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})