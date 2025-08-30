import { useState } from "react";
import { Button } from "@/components/ui/enhanced-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Mail, Lock, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import heroImage from "@/assets/hero-image.jpg";

const AuthPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const { toast } = useToast();

  const validateSRMEmail = (email: string) => {
    return email.endsWith("@srmist.edu.in");
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSRMEmail(email)) {
      toast({
        title: "Invalid Email",
        description: "Please use your SRM email address (@srmist.edu.in)",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Welcome to Campus Cupid! 💕",
      description: "Please connect Supabase to enable authentication",
    });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSRMEmail(email)) {
      toast({
        title: "Invalid Email", 
        description: "Please use your SRM email address (@srmist.edu.in)",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Welcome back! 💕",
      description: "Please connect Supabase to enable authentication",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-primary/5 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
      
      {/* Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div className="relative w-full h-screen">
          <img 
            src={heroImage} 
            alt="Campus Cupid - Find Love at SRM" 
            className="absolute inset-0 w-full h-full object-cover rounded-r-3xl shadow-2xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent rounded-r-3xl" />
          <div className="absolute bottom-20 left-10 text-white">
            <h1 className="text-5xl font-bold mb-4 leading-tight">
              Find Your Perfect
              <span className="text-primary-glow block">Campus Match</span>
            </h1>
            <p className="text-xl opacity-90 max-w-md">
              Connect with fellow SRMists and discover meaningful relationships in your campus community.
            </p>
          </div>
        </div>
      </div>

      {/* Auth Form */}
      <div className="w-full max-w-md lg:w-1/2 lg:max-w-lg relative z-10 lg:ml-20">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Heart className="w-12 h-12 text-primary mr-2" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Campus Cupid
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">SRM's Exclusive Dating Platform</p>
        </div>

        <Card className="shadow-2xl border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Welcome</CardTitle>
            <CardDescription>Sign in or create your account to start connecting</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signup" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="signup" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                  Sign Up
                </TabsTrigger>
                <TabsTrigger value="login" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                  Login
                </TabsTrigger>
              </TabsList>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="h-12 text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">SRM Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your-email@srmist.edu.in"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="pl-10 h-12 text-base"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Only @srmist.edu.in emails are accepted</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="Create a strong password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="pl-10 h-12 text-base"
                      />
                    </div>
                  </div>
                  <Button type="submit" variant="romantic" size="lg" className="w-full text-base font-semibold">
                    Create Account
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">SRM Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="your-email@srmist.edu.in"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="pl-10 h-12 text-base"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="pl-10 h-12 text-base"
                      />
                    </div>
                  </div>
                  <Button type="submit" variant="romantic" size="lg" className="w-full text-base font-semibold">
                    Sign In
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;