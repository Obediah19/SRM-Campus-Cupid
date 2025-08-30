import { useState } from "react";
import { Button } from "@/components/ui/enhanced-button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { 
  Heart, 
  X, 
  MessageCircle, 
  Settings, 
  User, 
  MapPin,
  GraduationCap,
  Sparkles
} from "lucide-react";

// Mock user data
const mockUsers = [
  {
    id: 1,
    name: "Priya Sharma",
    age: 20,
    course: "Computer Science",
    year: "2nd Year",
    bio: "Love coding and coffee ☕ Looking for someone to explore Chennai with!",
    interests: ["Music", "Technology", "Travel", "Photography"],
    distance: "0.5 km away",
    prompts: [
      { question: "Perfect first date?", answer: "Coffee and a walk around campus" },
      { question: "Passionate about?", answer: "Building apps that make a difference" },
      { question: "What makes you laugh?", answer: "Coding memes and dad jokes" }
    ]
  },
  {
    id: 2,
    name: "Arjun Patel",
    age: 21,
    course: "Mechanical Engineering",
    year: "3rd Year",
    bio: "Fitness enthusiast 💪 Love trying new restaurants and weekend adventures",
    interests: ["Sports", "Fitness", "Movies", "Cooking"],
    distance: "1.2 km away",
    prompts: [
      { question: "Perfect first date?", answer: "Watching sunset from the terrace" },
      { question: "Passionate about?", answer: "Sustainable engineering solutions" },
      { question: "What makes you laugh?", answer: "Friends reruns and gym fails" }
    ]
  },
  {
    id: 3,
    name: "Ananya Reddy",
    age: 19,
    course: "Business Administration",
    year: "1st Year",
    bio: "Bookworm 📚 Dance lover 💃 Always up for deep conversations over chai",
    interests: ["Books", "Dancing", "Art", "Music"],
    distance: "2.1 km away",
    prompts: [
      { question: "Perfect first date?", answer: "Library study session turned coffee date" },
      { question: "Passionate about?", answer: "Classical dance and entrepreneurship" },
      { question: "What makes you laugh?", answer: "Witty book quotes and dance bloopers" }
    ]
  }
];

const SwipeApp = () => {
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [matches, setMatches] = useState<typeof mockUsers>([]);
  const [showMatches, setShowMatches] = useState(false);
  const { toast } = useToast();

  const currentUser = mockUsers[currentUserIndex];

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'right') {
      // Simulate match (50% chance)
      const isMatch = Math.random() > 0.5;
      if (isMatch) {
        setMatches(prev => [...prev, currentUser]);
        toast({
          title: "It's a Match! 💕",
          description: `You and ${currentUser.name} liked each other!`,
          duration: 3000,
        });
      } else {
        toast({
          title: "Like Sent 💖",
          description: "They'll see your like when they come across your profile!",
        });
      }
    } else {
      toast({
        title: "Passed",
        description: "No worries, there are plenty more fish in the sea!",
        variant: "destructive",
      });
    }

    // Move to next user
    if (currentUserIndex < mockUsers.length - 1) {
      setCurrentUserIndex(currentUserIndex + 1);
    } else {
      setCurrentUserIndex(0); // Loop back to start
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-primary/5 flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-16 h-16 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">No more profiles!</h2>
          <p className="text-muted-foreground">Check back later for new matches</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-primary/5">
      {/* Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-sm border-b border-border/50 z-10">
        <div className="container max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Heart className="w-8 h-8 text-primary mr-2" />
              <h1 className="text-xl font-bold text-primary">Campus Cupid</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowMatches(!showMatches)}
                className="relative"
              >
                <MessageCircle className="w-5 h-5" />
                {matches.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-match text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {matches.length}
                  </span>
                )}
              </Button>
              <Button variant="ghost" size="icon">
                <User className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Matches Panel */}
      {showMatches && (
        <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 p-4">
          <div className="container max-w-lg mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Your Matches 💕</h2>
              <Button variant="ghost" onClick={() => setShowMatches(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            {matches.length === 0 ? (
              <div className="text-center py-20">
                <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No matches yet. Keep swiping!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {matches.map((match) => (
                  <Card key={match.id} className="p-4 cursor-pointer hover:shadow-lg transition-shadow">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-16 h-16">
                        <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                          {match.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{match.name}</h3>
                        <p className="text-muted-foreground">{match.course}</p>
                        <p className="text-sm text-primary">Tap to start chatting</p>
                      </div>
                      <MessageCircle className="w-6 h-6 text-primary" />
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container max-w-lg mx-auto px-4 py-6">
        <Card className="shadow-2xl border-0 bg-card/90 backdrop-blur-sm overflow-hidden">
          {/* Profile Image Placeholder */}
          <div className="h-96 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center relative">
            <Avatar className="w-32 h-32">
              <AvatarFallback className="bg-primary text-primary-foreground text-4xl">
                {currentUser.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm rounded-full px-3 py-1">
              <span className="text-sm font-medium">{currentUserIndex + 1}/{mockUsers.length}</span>
            </div>
          </div>

          <CardContent className="p-6 space-y-6">
            {/* Basic Info */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">{currentUser.name}</h2>
                <span className="text-lg text-muted-foreground">{currentUser.age}</span>
              </div>
              
              <div className="flex items-center space-x-4 text-muted-foreground">
                <div className="flex items-center">
                  <GraduationCap className="w-4 h-4 mr-1" />
                  <span className="text-sm">{currentUser.course}</span>
                </div>
                <div className="flex items-center">
                  <Sparkles className="w-4 h-4 mr-1" />
                  <span className="text-sm">{currentUser.year}</span>
                </div>
              </div>

              <div className="flex items-center text-muted-foreground">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="text-sm">{currentUser.distance}</span>
              </div>
            </div>

            {/* Bio */}
            <p className="text-base leading-relaxed">{currentUser.bio}</p>

            {/* Interests */}
            <div className="space-y-2">
              <h3 className="font-semibold">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {currentUser.interests.map((interest) => (
                  <Badge key={interest} variant="outline" className="text-sm">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Prompts */}
            <div className="space-y-4">
              {currentUser.prompts.map((prompt, index) => (
                <div key={index} className="bg-muted/30 rounded-lg p-4">
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">
                    {prompt.question}
                  </h4>
                  <p className="text-base">{prompt.answer}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center items-center space-x-8 mt-8">
          <Button
            variant="reject"
            size="swipe"
            onClick={() => handleSwipe('left')}
            className="shadow-2xl"
          >
            <X className="w-8 h-8" />
          </Button>

          <Button
            variant="like"
            size="swipe"
            onClick={() => handleSwipe('right')}
            className="shadow-2xl"
          >
            <Heart className="w-8 h-8" />
          </Button>
        </div>

        <div className="text-center mt-4 space-y-1">
          <p className="text-sm text-muted-foreground">Swipe left to pass • Swipe right to like</p>
          <p className="text-xs text-muted-foreground">Or use the buttons above</p>
        </div>
      </div>
    </div>
  );
};

export default SwipeApp;