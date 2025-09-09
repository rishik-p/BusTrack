import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { LogOut, MapPin, Play, Square, Bus, Users, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { setBusLocation, subscribeBusLocation } from "@/lib/busLocation";

//   function TestBus() {
 

//   return <div>Open console and watch for updates…</div>;
// }


interface DriverDashboardProps {
  driverData: { email: string; busNumber: string };
  onLogout: () => void;
}

const DriverDashboard = ({ driverData, onLogout }: DriverDashboardProps) => {
  const [busNumber, setBusNumber] = useState(driverData.busNumber);
  const [isActive, setIsActive] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [studentsTracking, setStudentsTracking] = useState(0);
  const [tripDuration, setTripDuration] = useState(0);
  const { toast } = useToast();

  const watchIdRef = useRef<number | null>(null);
  
  useEffect(() => {
    let interval: NodeJS.Timeout;

    
    if (isActive) {
      // Simulate getting location
      setLocation({ lat: 40.7128, lng: -74.0060 });
      
      // Simulate students joining
      setStudentsTracking(Math.floor(Math.random() * 15) + 5);
      
      // Track trip duration
      const startTime = Date.now();
      interval = setInterval(() => {
        setTripDuration(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    } else {
      setTripDuration(0);
      setStudentsTracking(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]);

  const startTrip = () => {
    if (!navigator.geolocation) {
      toast({ title: "Error", description: "Geolocation not supported", variant: "destructive" });
      return;
    }
    setIsActive(true);
    toast({ title: "Trip Started", description: `Sharing location for Bus ${busNumber}` });
    const id = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });

        // Push location to Firebase using current busNumber state
        setBusLocation(busNumber, { lat: latitude, lng: longitude });
      },
      (error) => {
        console.error(error);
        toast({ title: "Location Error", description: error.message, variant: "destructive" });
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
    );

    watchIdRef.current = id;

  };

  const endTrip = () => {
    setIsActive(false);
    setLocation(null);

    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    toast({
      title: "Trip Ended",
      description: "Location sharing has been stopped",
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-trust-blue/10 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-trust p-3 rounded-lg shadow-trust">
              <Bus className="h-6 w-6 text-trust-blue-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Driver Dashboard</h1>
              <p className="text-muted-foreground">{driverData.email}</p>
            </div>
          </div>
          <Button variant="outline" onClick={onLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Status Cards */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Bus className="h-8 w-8 text-trust-blue" />
                <div>
                  <p className="text-sm text-muted-foreground">Bus Number</p>
                  <p className="text-xl font-bold">{busNumber}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`h-3 w-3 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="text-xl font-bold">{isActive ? 'Active' : 'Offline'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Students Tracking</p>
                  <p className="text-xl font-bold">{studentsTracking}</p>
                </div>
              </div>
            </CardContent>
          </Card> */}

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Trip Duration</p>
                  <p className="text-xl font-bold">{formatTime(tripDuration)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Control Panel */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Bus Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bus className="h-5 w-5" />
                Bus Configuration
              </CardTitle>
              <CardDescription>
                Update your bus number for tracking
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="busNumber">Bus Number</Label>
                <Input
                  id="busNumber"
                  value={busNumber}
                  onChange={(e) => setBusNumber(e.target.value)}
                  placeholder="Enter bus number"
                  disabled={isActive}
                />
              </div>
              {isActive && (
                <Badge variant="secondary" className="text-sm">
                  Cannot change bus number during active trip
                </Badge>
              )}
            </CardContent>
          </Card>

          {/* Trip Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Trip Controls
              </CardTitle>
              <CardDescription>
                Start or stop location sharing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isActive ? (
                <Button
                  variant="action"
                  size="lg"
                  className="w-full"
                  onClick={startTrip}
                >
                  <Play className="h-5 w-5 mr-2" />
                  Start Trip
                </Button>
              ) : (
                <Button
                  variant="destructive"
                  size="lg"
                  className="w-full"
                  onClick={endTrip}
                >
                  <Square className="h-5 w-5 mr-2" />
                  End Trip
                </Button>
              )}
              
              {location && (
                <p>
                 Current Location: Lat {location.lat.toFixed(6)}, Lng {location.lng.toFixed(6)}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Live Tracking Status */}
        {/* {isActive && (
          <Card className="border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse" />
                Live Tracking Active
              </CardTitle>
              <CardDescription>
                Your location is being shared with students in real-time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm">
                <span>Bus {busNumber} is visible to students</span>
                <Badge variant="secondary">{studentsTracking} students tracking</Badge>
              </div>
            </CardContent>
          </Card>
        )} */}
      </div>
    </div>
  );
};

export default DriverDashboard;