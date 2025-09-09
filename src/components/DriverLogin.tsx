import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Shield, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DriverLoginProps {
  onLogin: (driverData: { email: string; busNumber: string }) => void;
  onBack: () => void;
}

const DriverLogin = ({ onLogin, onBack }: DriverLoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate authentication
    if (email && password) {
      setTimeout(() => {
        // For demo purposes, extract bus number from email or use a default
        const busNumber = email.includes('bus') 
          ? email.match(/\d+/)?.[0] || "101"
          : "101";
        
        onLogin({ email, busNumber });
        toast({
          title: "Login Successful",
          description: `Welcome back! You're now logged in as driver for Bus ${busNumber}.`,
        });
        setIsLoading(false);
      }, 1500);
    } else {
      setIsLoading(false);
      toast({
        title: "Invalid Credentials",
        description: "Please check your email and password.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-trust-blue/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Role Selection
        </Button>

        <Card className="shadow-trust">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto bg-gradient-trust p-4 rounded-full w-fit shadow-trust">
              <Shield className="h-8 w-8 text-trust-blue-foreground" />
            </div>
            <CardTitle className="text-2xl">Driver Login</CardTitle>
            <CardDescription>
              Sign in to start sharing your bus location
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="driver@school.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="focus:ring-trust-blue focus:border-trust-blue"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="focus:ring-trust-blue focus:border-trust-blue pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                variant="driver"
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>Demo credentials:</p>
              <p className="font-mono text-xs mt-1">
                Email: driver@school.edu<br />
                Password: password
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DriverLogin;