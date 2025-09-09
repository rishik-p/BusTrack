import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bus, MapPin, Shield, Users } from "lucide-react";

interface RoleSelectionProps {
  onSelectRole: (role: 'driver' | 'student') => void;
}

const RoleSelection = ({ onSelectRole }: RoleSelectionProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-primary-glow/20 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Hero Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-hero p-4 rounded-2xl shadow-glow">
              <Bus className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Bus Tracker
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real-time school bus tracking for students and drivers
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-2 gap-6 mt-12">
          {/* Driver Card */}
          <Card className="cursor-pointer transition-all duration-300 hover:shadow-trust hover:scale-105 group">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto bg-gradient-trust p-4 rounded-full w-fit shadow-trust group-hover:shadow-glow transition-all">
                <Shield className="h-8 w-8 text-trust-blue-foreground" />
              </div>
              <CardTitle className="text-2xl text-foreground">Driver Portal</CardTitle>
              <CardDescription className="text-muted-foreground">
                Share your bus location with students in real-time
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-trust-blue" />
                  <span>Start & stop location sharing</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bus className="h-4 w-4 text-trust-blue" />
                  <span>Manage bus route information</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-trust-blue" />
                  <span>Secure driver authentication</span>
                </div>
              </div>
              <Button 
                variant="driver" 
                size="lg" 
                className="w-full"
                onClick={() => onSelectRole('driver')}
              >
                Driver Login
              </Button>
            </CardContent>
          </Card>

          {/* Student Card */}
          <Card className="cursor-pointer transition-all duration-300 hover:shadow-glow hover:scale-105 group">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto bg-gradient-primary p-4 rounded-full w-fit shadow-primary group-hover:shadow-glow transition-all">
                <Users className="h-8 w-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl text-foreground">Student Portal</CardTitle>
              <CardDescription className="text-muted-foreground">
                Track your school bus location in real-time
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>Real-time bus location</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bus className="h-4 w-4 text-primary" />
                  <span>Enter your bus number</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span>No login required</span>
                </div>
              </div>
              <Button 
                variant="student" 
                size="lg" 
                className="w-full"
                onClick={() => onSelectRole('student')}
              >
                Track My Bus
              </Button>
            </CardContent>
          </Card>
        </div>

        <p className="text-sm text-muted-foreground mt-8">
          Safe, reliable, and real-time bus tracking for your peace of mind
        </p>
      </div>
    </div>
  );
};

export default RoleSelection;