import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.5b696f324b2c459097a3bbeab9671be9',
  appName: 'Student Bus Tracker',
  webDir: 'dist',
  server: {
    url: 'https://5b696f32-4b2c-4590-97a3-bbeab9671be9.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#ffffff",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: "default",
      backgroundColor: "#ffffff"
    }
  }
};

export default config;