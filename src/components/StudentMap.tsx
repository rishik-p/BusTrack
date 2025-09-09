import { useEffect, useState } from "react";
import { GoogleMap, Marker, DirectionsRenderer, useJsApiLoader } from "@react-google-maps/api";
import { getBusLocationOnce, subscribeBusLocation } from "@/lib/busLocation";


interface StudentMapProps {
  busNumber: string;
}

const StudentMap = ({ busNumber }: StudentMapProps) => {
  const [studentLocation, setStudentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [busLocation, setBusLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [directions, setDirections] = useState<any>(null);
  const [eta, setEta] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_MAPS_API, // Replace with your API key
    libraries: ["places"],
  });

  // Get student location (once)
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setStudentLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          console.log("Student location obtained:", { lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        (err) => {
          console.error("Error getting student location:", err);
          setError("Failed to get your location. Please enable location permissions.");
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);
  // Initial bus location fetch
  useEffect(() => {
    if (!busNumber) return;
    
    async function fetchBusLocation() {
      try {
        const location = await getBusLocationOnce(busNumber);
        if (location) {
          setBusLocation(location);
        } else {
          setError(`No location data found for bus ${busNumber}`);
        }
      } catch (err) {
        console.error("Error fetching initial bus location:", err);
        setError("Failed to fetch bus location");
      }
    }

    fetchBusLocation();
  }, [busNumber]);

  // Subscribe to bus location from Firebase
  useEffect(() => {
    if (!busNumber) return;
  
    // Subscribe to Firestore updates
    const unsub = subscribeBusLocation(busNumber, (loc) => {
      console.log("Bus location updated:", loc);
      if (loc) {
        setBusLocation(loc);
        setError(null); // Clear any previous errors
      } else {
        setError(`Bus ${busNumber} is not currently sharing location`);
      }
    });
  
    // Cleanup subscription on unmount or busNumber change
    return () => unsub();
  }, [busNumber]);
  

  // Calculate route + ETA whenever both locations are available
  useEffect(() => {
    if (!isLoaded || !studentLocation || !busLocation) {
      setIsLoading(true);
      return;
    }

    setIsLoading(false);
    const directionsService = new google.maps.DirectionsService();
    
    directionsService.route(
      {
        origin: studentLocation,
        destination: busLocation,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK" && result.routes.length > 0) {
          const leg = result.routes[0].legs[0];
          const etaText = leg.duration?.text || "0 mins";
          setEta(etaText);
          setDirections(result);
        } else {
          console.warn("Directions service failed:", status);
          setEta("Unable to calculate route");
        }
      }
    );  
  }, [studentLocation, busLocation, isLoaded]);

  if (!isLoaded) return <p>Loading map...</p>;

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: "500px" }}>
      <GoogleMap
        center={studentLocation || busLocation || { lat: 40.7128, lng: -74.0060 }}
        zoom={14}
        mapContainerStyle={{ width: "100%", height: "100%" }}
      >
        {studentLocation && <Marker position={studentLocation} label="You" />}
        {busLocation && <Marker position={busLocation} label="Bus" />}
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>

      {isLoading && <p>Calculating route...</p>}
      {eta && <p className="mt-2 text-sm text-gray-600">Estimated Arrival Time: {eta}</p>}
    </div>
  );
};

export default StudentMap;
