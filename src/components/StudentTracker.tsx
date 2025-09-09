import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StudentMap from "@/components/StudentMap";

interface StudentTrackerProps {
  onBack: () => void;
}

const StudentTracker = ({ onBack }: StudentTrackerProps) => {
  const [busNumber, setBusNumber] = useState("");
  const [tracking, setTracking] = useState(false);

  const handleTrack = () => {
    if (busNumber.trim() !== "") {
      setTracking(true);
    }
  };

  const handleStop = () => {
    setTracking(false);
    setBusNumber("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-blue-50 p-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Student Tracker</h1>
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
        </div>

        {!tracking ? (
          <div className="space-y-4">
            <Input
              placeholder="Enter Bus Number"
              value={busNumber}
              onChange={(e) => setBusNumber(e.target.value)}
            />
            <Button onClick={handleTrack} className="w-full">
              Track Bus
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="h-[700px]">
              <StudentMap busNumber={busNumber} />
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={handleStop}>
                Stop Tracking
              </Button>
              <Button variant="outline" onClick={onBack}>
                Back
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentTracker;
