import { useState } from "react";
import { Button } from "@/components/ui/enhanced-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Mail, Lock, ArrowRight, Shield } from "lucide-react";
import { useMockAuth } from "@/hooks/useMockAuth";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-image.jpg";

const AuthPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);
  const { signUp, signIn, sendVerificationOTP, verifyOTP, loading, user, profile } = useMockAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated and verified
  if (user && profile?.is_verified) {
    if (profile.is_profile_complete) {
      navigate("/app");
    } else {
      navigate("/setup");
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await signUp(email, password, name);
      if (result?.needsVerification) {
        setPendingUserId(result.user.id);
        await sendVerificationOTP(email);
        setShowOTP(true);
      }
    } catch (error) {
      // Error is handled in useAuth hook
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(email, password);
    } catch (error) {
      // Error is handled in useAuth hook
    }
  };

  const handleOTPVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingUserId) return;
    
    try {
      await verifyOTP(pendingUserId, otp);
      navigate("/setup");
    } catch (error) {
      // Error is handled in useAuth hook
    }
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

              {!showOTP ? (
                <>
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
                          disabled={loading}
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
                            disabled={loading}
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
                            disabled={loading}
                          />
                        </div>
                      </div>
                      <Button type="submit" variant="romantic" size="lg" className="w-full text-base font-semibold" disabled={loading}>
                        {loading ? "Creating Account..." : "Create Account"}
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
                            disabled={loading}
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
                            disabled={loading}
                          />
                        </div>
                      </div>
                      <Button type="submit" variant="romantic" size="lg" className="w-full text-base font-semibold" disabled={loading}>
                        {loading ? "Signing In..." : "Sign In"}
                        <ArrowRight className="w-5 h-5" />
                      </Button>
                    </form>
                  </TabsContent>
                </>
              ) : (
                <div className="space-y-6">
                  <div className="text-center">
                    <Shield className="w-16 h-16 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Verify Your SRM Email</h3>
                    <p className="text-muted-foreground mb-4">
                      We've sent a verification code to:<br />
                      <strong>{email}</strong>
                    </p>
                  </div>

                  <form onSubmit={handleOTPVerification} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="otp">Verification Code</Label>
                      <Input
                        id="otp"
                        type="text"
                        placeholder="Enter 6-digit code"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                        className="h-12 text-base text-center text-2xl tracking-widest"
                        maxLength={6}
                        disabled={loading}
                      />
                    </div>
                    <Button type="submit" variant="romantic" size="lg" className="w-full text-base font-semibold" disabled={loading || otp.length !== 6}>
                      {loading ? "Verifying..." : "Verify Email"}
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </form>

                  <div className="text-center">
                    <Button 
                      variant="ghost" 
                      onClick={() => setShowOTP(false)}
                      className="text-sm"
                    >
                      Back to Sign Up
                    </Button>
                  </div>
                </div>
              )}
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