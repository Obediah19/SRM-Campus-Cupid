// Mock data for the dating app
export type MockUser = {
  id: string;
  email: string;
  full_name: string;
  age: number;
  course: string;
  academic_year: string;
  bio: string;
  is_profile_complete: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  photos: Array<{ photo_url: string; is_primary: boolean }>;
  prompts: Array<{ question: string; answer: string }>;
  interests: string[];
}

export type MockMatch = {
  id: string;
  user: MockUser;
  created_at: string;
}

export type MockMessage = {
  id: string;
  match_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
}

// Mock current user
export const mockCurrentUser: MockUser = {
  id: 'current-user-1',
  email: 'john.doe@srmist.edu.in',
  full_name: 'John Doe',
  age: 20,
  course: 'Computer Science',
  academic_year: '3rd Year',
  bio: 'Love coding and making new friends! Always up for a good conversation about tech.',
  is_profile_complete: true,
  is_verified: true,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  photos: [
    { photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop', is_primary: true },
    { photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop', is_primary: false }
  ],
  prompts: [
    { question: 'My ideal weekend', answer: 'Coding new projects and hanging out with friends' },
    { question: 'I geek out on', answer: 'Latest tech trends and AI developments' }
  ],
  interests: ['Technology', 'Gaming', 'Music', 'Movies']
};

// Mock potential matches
export const mockPotentialMatches: MockUser[] = [
  {
    id: 'user-2',
    email: 'sarah.smith@srmist.edu.in',
    full_name: 'Sarah Smith',
    age: 19,
    course: 'Information Technology',
    academic_year: '2nd Year',
    bio: 'Creative soul who loves art, music, and deep conversations. Always looking for new adventures!',
    is_profile_complete: true,
    is_verified: true,
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
    photos: [
      { photo_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop', is_primary: true },
      { photo_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop', is_primary: false }
    ],
    prompts: [
      { question: 'My ideal weekend', answer: 'Exploring new cafes and painting' },
      { question: 'I geek out on', answer: 'Digital art and indie music' }
    ],
    interests: ['Art', 'Music', 'Photography', 'Coffee']
  },
  {
    id: 'user-3',
    email: 'mike.johnson@srmist.edu.in',
    full_name: 'Mike Johnson',
    age: 21,
    course: 'Mechanical Engineering',
    academic_year: '4th Year',
    bio: 'Sports enthusiast and adventure lover. Love hiking, playing basketball, and trying new foods!',
    is_profile_complete: true,
    is_verified: true,
    created_at: '2024-01-03T00:00:00Z',
    updated_at: '2024-01-03T00:00:00Z',
    photos: [
      { photo_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop', is_primary: true },
      { photo_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop', is_primary: false }
    ],
    prompts: [
      { question: 'My ideal weekend', answer: 'Hiking or playing sports with friends' },
      { question: 'I geek out on', answer: 'Sports statistics and adventure documentaries' }
    ],
    interests: ['Sports', 'Adventure', 'Travel', 'Food']
  },
  {
    id: 'user-4',
    email: 'emily.chen@srmist.edu.in',
    full_name: 'Emily Chen',
    age: 20,
    course: 'Business Administration',
    academic_year: '3rd Year',
    bio: 'Aspiring entrepreneur with a passion for books, travel, and making a difference in the world.',
    is_profile_complete: true,
    is_verified: true,
    created_at: '2024-01-04T00:00:00Z',
    updated_at: '2024-01-04T00:00:00Z',
    photos: [
      { photo_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop', is_primary: true },
      { photo_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop', is_primary: false }
    ],
    prompts: [
      { question: 'My ideal weekend', answer: 'Reading a good book or planning my next trip' },
      { question: 'I geek out on', answer: 'Startup stories and travel blogs' }
    ],
    interests: ['Reading', 'Travel', 'Business', 'Languages']
  },
  {
    id: 'user-5',
    email: 'alex.patel@srmist.edu.in',
    full_name: 'Alex Patel',
    age: 22,
    course: 'Electronics Engineering',
    academic_year: '4th Year',
    bio: 'Tech geek who loves building gadgets and exploring the latest innovations. Always up for intellectual discussions!',
    is_profile_complete: true,
    is_verified: true,
    created_at: '2024-01-05T00:00:00Z',
    updated_at: '2024-01-05T00:00:00Z',
    photos: [
      { photo_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop', is_primary: true },
      { photo_url: 'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=400&h=400&fit=crop', is_primary: false }
    ],
    prompts: [
      { question: 'My ideal weekend', answer: 'Building cool electronics projects' },
      { question: 'I geek out on', answer: 'IoT devices and robotics' }
    ],
    interests: ['Electronics', 'Robotics', 'Innovation', 'Science']
  }
];

// Mock matches (users who have already matched)
export const mockMatches: MockMatch[] = [
  {
    id: 'match-1',
    user: {
      id: 'user-6',
      email: 'lisa.wang@srmist.edu.in',
      full_name: 'Lisa Wang',
      age: 19,
      course: 'Computer Science',
      academic_year: '2nd Year',
      bio: 'AI enthusiast and coffee lover. Always excited to learn something new!',
      is_profile_complete: true,
      is_verified: true,
      created_at: '2024-01-06T00:00:00Z',
      updated_at: '2024-01-06T00:00:00Z',
      photos: [
        { photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop', is_primary: true }
      ],
      prompts: [
        { question: 'My ideal weekend', answer: 'Learning new programming languages' },
        { question: 'I geek out on', answer: 'Machine Learning and AI' }
      ],
      interests: ['AI', 'Programming', 'Coffee', 'Learning']
    },
    created_at: '2024-01-15T10:30:00Z'
  },
  {
    id: 'match-2',
    user: {
      id: 'user-7',
      email: 'david.kim@srmist.edu.in',
      full_name: 'David Kim',
      age: 21,
      course: 'Graphic Design',
      academic_year: '3rd Year',
      bio: 'Creative designer who loves bringing ideas to life. Always sketching and dreaming up new concepts.',
      is_profile_complete: true,
      is_verified: true,
      created_at: '2024-01-07T00:00:00Z',
      updated_at: '2024-01-07T00:00:00Z',
      photos: [
        { photo_url: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400&h=400&fit=crop', is_primary: true }
      ],
      prompts: [
        { question: 'My ideal weekend', answer: 'Sketching in the park or visiting art galleries' },
        { question: 'I geek out on', answer: 'Design trends and creative software' }
      ],
      interests: ['Design', 'Art', 'Creativity', 'Illustration']
    },
    created_at: '2024-01-14T15:45:00Z'
  }
];

// Mock messages
export const mockMessages: { [matchId: string]: MockMessage[] } = {
  'match-1': [
    {
      id: 'msg-1',
      match_id: 'match-1',
      sender_id: 'current-user-1',
      content: 'Hey Lisa! I saw you\'re into AI too. That\'s awesome!',
      created_at: '2024-01-15T11:00:00Z',
      is_read: true
    },
    {
      id: 'msg-2',
      match_id: 'match-1',
      sender_id: 'user-6',
      content: 'Hi John! Yes, I\'m really passionate about machine learning. What kind of projects are you working on?',
      created_at: '2024-01-15T11:15:00Z',
      is_read: true
    },
    {
      id: 'msg-3',
      match_id: 'match-1',
      sender_id: 'current-user-1',
      content: 'Currently building a recommendation system for a college project. How about you?',
      created_at: '2024-01-15T11:30:00Z',
      is_read: true
    },
    {
      id: 'msg-4',
      match_id: 'match-1',
      sender_id: 'user-6',
      content: 'That sounds cool! I\'m working on a computer vision project for recognizing campus landmarks.',
      created_at: '2024-01-15T11:45:00Z',
      is_read: false
    }
  ],
  'match-2': [
    {
      id: 'msg-5',
      match_id: 'match-2',
      sender_id: 'user-7',  
      content: 'Hey! Love your profile, you seem really interesting!',
      created_at: '2024-01-14T16:00:00Z',
      is_read: true
    },
    {
      id: 'msg-6',
      match_id: 'match-2',
      sender_id: 'current-user-1',
      content: 'Thanks David! Your design work looks incredible. Do you do freelance projects?',
      created_at: '2024-01-14T16:15:00Z',
      is_read: true
    }
  ]
};

// Available interests for profile setup
export const availableInterests = [
  'Technology', 'Gaming', 'Music', 'Movies', 'Art', 'Photography', 'Coffee',
  'Sports', 'Adventure', 'Travel', 'Food', 'Reading', 'Business', 'Languages',
  'Electronics', 'Robotics', 'Innovation', 'Science', 'AI', 'Programming',
  'Learning', 'Design', 'Creativity', 'Illustration', 'Fitness', 'Dancing',
  'Cooking', 'Nature', 'Meditation', 'Fashion'
];

// Prompt questions for profile setup
export const promptQuestions = [
  'My ideal weekend',
  'I geek out on',
  'The way to my heart is',
  'I spend way too much time thinking about',
  'My simple pleasures',
  'I\'m known for',
  'The best way to ask me out is',
  'My biggest pet peeve is'
];