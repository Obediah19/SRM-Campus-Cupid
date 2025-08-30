import { useState } from "react";
import { Button } from "@/components/ui/enhanced-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, ArrowLeft, Upload, Camera, Heart, Sparkles, MapPin, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProfileSetup = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [profile, setProfile] = useState({
    age: "",
    bio: "",
    course: "",
    year: "",
    interests: [] as string[],
    prompts: ["", "", ""],
    photos: [] as string[]
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const availableInterests = [
    "Music", "Movies", "Books", "Sports", "Gaming", "Travel", "Art", "Photography",
    "Dancing", "Cooking", "Fitness", "Technology", "Fashion", "Nature", "Anime",
    "Cricket", "Football", "Basketball", "Swimming", "Cycling", "Hiking", "Yoga"
  ];

  const promptQuestions = [
    "What's your perfect first date?",
    "What's something you're passionate about?",
    "What makes you laugh the most?"
  ];

  const handleInterestToggle = (interest: string) => {
    setProfile(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete profile setup
      toast({
        title: "Profile Created! 🎉",
        description: "Welcome to Campus Cupid! Start swiping to find your match.",
      });
      navigate("/app");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <GraduationCap className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Basic Information</h2>
              <p className="text-muted-foreground">Tell us about yourself</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Select value={profile.age} onValueChange={(value) => setProfile({...profile, age: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your age" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 10 }, (_, i) => 18 + i).map(age => (
                      <SelectItem key={age} value={age.toString()}>{age} years old</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Academic Year</Label>
                <Select value={profile.year} onValueChange={(value) => setProfile({...profile, year: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1st">1st Year</SelectItem>
                    <SelectItem value="2nd">2nd Year</SelectItem>
                    <SelectItem value="3rd">3rd Year</SelectItem>
                    <SelectItem value="4th">4th Year</SelectItem>
                    <SelectItem value="postgrad">Postgraduate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="course">Course/Department</Label>
              <Input
                id="course"
                placeholder="e.g., Computer Science, Mechanical Engineering"
                value={profile.course}
                onChange={(e) => setProfile({...profile, course: e.target.value})}
                className="text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">About You</Label>
              <Textarea
                id="bio"
                placeholder="Write a brief description about yourself..."
                value={profile.bio}
                onChange={(e) => setProfile({...profile, bio: e.target.value})}
                className="min-h-24 text-base"
                maxLength={150}
              />
              <p className="text-xs text-muted-foreground text-right">
                {profile.bio.length}/150 characters
              </p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Camera className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Add Photos</h2>
              <p className="text-muted-foreground">Show your best self</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from({ length: 6 }, (_, i) => (
                <div
                  key={i}
                  className="aspect-square border-2 border-dashed border-muted rounded-lg flex items-center justify-center bg-muted/20 hover:bg-muted/40 cursor-pointer transition-colors"
                >
                  <div className="text-center">
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {i === 0 ? "Profile Photo" : `Photo ${i + 1}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-accent/20 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground text-center">
                <strong>Note:</strong> Photo upload requires Supabase integration for file storage.
                Click the Supabase button to enable this feature.
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Sparkles className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">About You</h2>
              <p className="text-muted-foreground">Answer some fun prompts</p>
            </div>

            {promptQuestions.map((question, index) => (
              <div key={index} className="space-y-2">
                <Label className="text-base font-medium">{question}</Label>
                <Textarea
                  placeholder="Your answer..."
                  value={profile.prompts[index]}
                  onChange={(e) => {
                    const newPrompts = [...profile.prompts];
                    newPrompts[index] = e.target.value;
                    setProfile({...profile, prompts: newPrompts});
                  }}
                  className="min-h-20 text-base"
                  maxLength={100}
                />
                <p className="text-xs text-muted-foreground text-right">
                  {profile.prompts[index].length}/100 characters
                </p>
              </div>
            ))}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Heart className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Your Interests</h2>
              <p className="text-muted-foreground">Choose what you're passionate about</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {availableInterests.map((interest) => (
                <Badge
                  key={interest}
                  variant={profile.interests.includes(interest) ? "default" : "outline"}
                  className={`cursor-pointer text-center py-2 px-3 text-sm transition-all hover:scale-105 ${
                    profile.interests.includes(interest)
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "hover:bg-primary hover:text-primary-foreground"
                  }`}
                  onClick={() => handleInterestToggle(interest)}
                >
                  {interest}
                </Badge>
              ))}
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Selected {profile.interests.length} interests
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-primary/5 py-8">
      <div className="container max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Heart className="w-8 h-8 text-primary mr-2" />
            <h1 className="text-2xl font-bold text-primary">Campus Cupid</h1>
          </div>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="text-sm font-medium">Step {currentStep} of {totalSteps}</span>
          </div>
          <Progress value={progress} className="max-w-md mx-auto" />
        </div>

        {/* Main Content */}
        <Card className="shadow-xl border-0 bg-card/90 backdrop-blur-sm">
          <CardContent className="p-8">
            {renderStep()}

            <Separator className="my-8" />

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <Button
                variant="ghost"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>

              <Button
                variant="romantic"
                onClick={handleNext}
                className="flex items-center"
              >
                {currentStep === totalSteps ? "Complete Profile" : "Continue"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileSetup;