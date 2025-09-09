import { useState } from "react";
import RoleSelection from "@/components/RoleSelection";
import DriverLogin from "@/components/DriverLogin";
import DriverDashboard from "@/components/DriverDashboard";
import StudentTracker from "@/components/StudentTracker";

type AppState = 'role-selection' | 'driver-login' | 'driver-dashboard' | 'student-tracker';

interface DriverData {
  email: string;
  busNumber: string;
}

const Index = () => {
  const [currentState, setCurrentState] = useState<AppState>('role-selection');
  const [driverData, setDriverData] = useState<DriverData | null>(null);

  const handleRoleSelect = (role: 'driver' | 'student') => {
    if (role === 'driver') {
      setCurrentState('driver-login');
    } else {
      setCurrentState('student-tracker');
    }
  };

  const handleDriverLogin = (data: DriverData) => {
    setDriverData(data);
    setCurrentState('driver-dashboard');
  };

  const handleLogout = () => {
    setDriverData(null);
    setCurrentState('role-selection');
  };

  const handleBack = () => {
    setCurrentState('role-selection');
  };

  switch (currentState) {
    case 'driver-login':
      return <DriverLogin onLogin={handleDriverLogin} onBack={handleBack} />;
    
    case 'driver-dashboard':
      return driverData ? (
        <DriverDashboard driverData={driverData} onLogout={handleLogout} />
      ) : null;
    
    case 'student-tracker':
      return <StudentTracker onBack={handleBack} />;
    
    default:
      return <RoleSelection onSelectRole={handleRoleSelect} />;
  }
};

export default Index;
