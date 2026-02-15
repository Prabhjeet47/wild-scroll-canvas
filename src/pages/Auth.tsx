import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Leaf, Mail, Lock, User, ArrowLeft, MapPin, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useToast } from "@/hooks/use-toast";
import wildlifeHero from "@/assets/wildlife-hero.jpg";

const countriesWithLocations: Record<string, string[]> = {
  USA: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio"],
  UK: ["London", "Manchester", "Birmingham", "Glasgow", "Liverpool", "Edinburgh", "Leeds"],
  Canada: ["Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa", "Edmonton", "Winnipeg"],
  Australia: ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Gold Coast", "Canberra"],
  India: ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune"],
  Germany: ["Berlin", "Hamburg", "Munich", "Cologne", "Frankfurt", "Stuttgart", "Düsseldorf"],
  France: ["Paris", "Marseille", "Lyon", "Toulouse", "Nice", "Nantes", "Strasbourg"],
  Japan: ["Tokyo", "Osaka", "Yokohama", "Nagoya", "Sapporo", "Fukuoka", "Kobe"],
};

const Auth = () => {
  const [userType, setUserType] = useState<"user" | "admin">("user");
  const [isLogin, setIsLogin] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [country, setCountry] = useState("");
  const [location, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleGoogleAuth = () => {
    toast({
      title: "Google Authentication",
      description: "Google authentication would be integrated here",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

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
      if (!firstName || !lastName) {
        toast({
          title: "Error",
          description: "Please enter your first and last name",
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
      if (userType === "admin" && (!country || !location)) {
        toast({
          title: "Error",
          description: "Please select country and location",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
    }

    setTimeout(() => {
      toast({
        title: isLogin ? `Welcome back${userType === "admin" ? " Admin" : ""}!` : "Account created!",
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
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setCountry("");
    setLocation("");
  };

  const handleUserTypeChange = (value: string) => {
    setUserType(value as "user" | "admin");
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setCountry("");
    setLocation("");
  };

  const handleCountryChange = (value: string) => {
    setCountry(value);
    setLocation("");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center py-12">
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

      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <Button
        variant="ghost"
        className="fixed top-6 left-6 z-50 text-foreground hover:text-primary"
        onClick={() => navigate("/")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

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

            <Tabs value={userType} onValueChange={handleUserTypeChange} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="user">User</TabsTrigger>
                <TabsTrigger value="admin">Admin</TabsTrigger>
              </TabsList>
            </Tabs>

            <div>
              {userType === "admin" && isLogin ? (
                <CardTitle className="text-2xl font-display text-foreground">
                  Welcome Admin
                </CardTitle>
              ) : (
                <CardTitle className="text-2xl font-display text-foreground">
                  {isLogin ? "Welcome Back" : "Join the Mission"}
                </CardTitle>
              )}
              <CardDescription className="text-muted-foreground mt-2">
                {isLogin
                  ? `Sign in to continue ${userType === "admin" ? "managing" : "protecting"} wildlife`
                  : `Create ${userType === "admin" ? "an admin" : "a"} account to start making a difference`}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-foreground font-body">
                        First Name
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="firstName"
                          type="text"
                          placeholder="John"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="pl-10 bg-background/50 border-border focus:border-primary transition-colors"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-foreground font-body">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Doe"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="bg-background/50 border-border focus:border-primary transition-colors"
                        required
                      />
                    </div>
                  </div>
                </>
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

              {!isLogin && userType === "admin" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="country" className="text-foreground font-body">
                      Country
                    </Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                      <Select value={country} onValueChange={handleCountryChange} required>
                        <SelectTrigger className="pl-10 bg-background/50 border-border focus:border-primary transition-colors">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(countriesWithLocations).map((countryName) => (
                            <SelectItem key={countryName} value={countryName}>
                              {countryName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-foreground font-body">
                      Location
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                      <Select
                        value={location}
                        onValueChange={setLocation}
                        disabled={!country}
                        required
                      >
                        <SelectTrigger className="pl-10 bg-background/50 border-border focus:border-primary transition-colors">
                          <SelectValue placeholder={country ? "Select location" : "Select country first"} />
                        </SelectTrigger>
                        <SelectContent>
                          {country &&
                            countriesWithLocations[country]?.map((loc) => (
                              <SelectItem key={loc} value={loc}>
                                {loc}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </>
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
                  <span>{isLogin ? "Sign In" : `Sign Up${userType === "admin" ? " as Admin" : ""}`}</span>
                )}
              </Button>
            </form>

            <div className="mt-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border/50" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full mt-4 bg-background/50 border-border hover:bg-background hover:border-primary transition-colors"
                onClick={handleGoogleAuth}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google {isLogin ? "Sign In" : "Sign Up"}
              </Button>
            </div>

            {isLogin && (
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground font-body">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={toggleMode}
                    className="text-primary hover:text-primary/80 transition-colors font-semibold"
                  >
                    Sign up
                  </button>
                </p>
              </div>
            )}

            {!isLogin && (
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground font-body">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={toggleMode}
                    className="text-primary hover:text-primary/80 transition-colors font-semibold"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            )}

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
