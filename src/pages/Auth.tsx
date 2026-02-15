import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Leaf, Mail, Lock, User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useToast } from "@/hooks/use-toast";
import wildlifeHero from "@/assets/wildlife-hero.jpg";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Basic validation
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (!isLogin) {
      if (!name) {
        toast({
          title: "Error",
          description: "Please enter your name",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        toast({
          title: "Error",
          description: "Passwords do not match",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      if (password.length < 8) {
        toast({
          title: "Error",
          description: "Password must be at least 8 characters long",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
    }

    // Simulate API call
    setTimeout(() => {
      toast({
        title: isLogin ? "Welcome back!" : "Account created!",
        description: isLogin
          ? "You have successfully logged in."
          : "Your account has been created successfully.",
      });
      setIsLoading(false);
      navigate("/home");
    }, 1500);
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Fixed background */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url(${wildlifeHero})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-background/90 backdrop-blur-sm" />
      </div>

      {/* Theme Toggle */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Back Button */}
      <Button
        variant="ghost"
        className="fixed top-6 left-6 z-50 text-foreground hover:text-primary"
        onClick={() => navigate("/")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      {/* Auth Card */}
      <div className="relative z-10 w-full max-w-md px-6 animate-fade-up">
        <Card className="border-border/50 shadow-2xl backdrop-blur-xl bg-card/95">
          <CardHeader className="space-y-4 text-center">
            <div className="flex justify-center">
              <div className="flex items-center gap-2 mb-2">
                <Leaf className="w-8 h-8 text-primary" />
                <span className="text-2xl font-display font-bold text-foreground tracking-tight">
                  WildGuard
                </span>
              </div>
            </div>
            <div>
              <CardTitle className="text-2xl font-display text-foreground">
                {isLogin ? "Welcome Back" : "Join the Mission"}
              </CardTitle>
              <CardDescription className="text-muted-foreground mt-2">
                {isLogin
                  ? "Sign in to continue protecting wildlife"
                  : "Create an account to start making a difference"}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground font-body">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 bg-background/50 border-border focus:border-primary transition-colors"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-body">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-background/50 border-border focus:border-primary transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground font-body">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-background/50 border-border focus:border-primary transition-colors"
                    required
                  />
                </div>
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-foreground font-body">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 bg-background/50 border-border focus:border-primary transition-colors"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              {isLogin && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-sm text-primary hover:text-primary/80 transition-colors font-body"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-body text-base py-6 rounded-lg shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⏳</span>
                    {isLogin ? "Signing in..." : "Creating account..."}
                  </span>
                ) : (
                  <span>{isLogin ? "Sign In" : "Create Account"}</span>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground font-body">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-primary hover:text-primary/80 transition-colors font-semibold"
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-border/50">
              <p className="text-xs text-center text-muted-foreground font-body">
                By continuing, you agree to WildGuard's{" "}
                <a href="#" className="text-primary hover:text-primary/80 transition-colors">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-primary hover:text-primary/80 transition-colors">
                  Privacy Policy
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quote */}
        <blockquote className="mt-8 text-center text-sm text-muted-foreground font-body italic max-w-md mx-auto">
          "In every walk with nature, one receives far more than he seeks."
          <cite className="block mt-2 text-xs text-primary not-italic font-semibold">
            — John Muir
          </cite>
        </blockquote>
      </div>
    </div>
  );
};

export default Auth;
