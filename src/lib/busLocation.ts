// src/lib/busLocation.ts
import { db } from "./firebase";
import {
  doc,
  setDoc,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  getDoc,
} from "firebase/firestore";

export type BusLocation = {
  lat: number;
  lng: number;
  lastUpdated: number; 
};

const busesCol = "buses";

export async function setBusLocation(
  busNumber: string,
  loc: { lat: number; lng: number }
) {
  try {
    if (!db) {
      throw new Error("Firebase database not initialized");
    }
    
    const ref = doc(db, busesCol, busNumber.trim());
    console.log("Setting bus location for:", busNumber, "at:", loc);
    
    await setDoc(
      ref,
      {
        lat: loc.lat,
        lng: loc.lng,
        lastUpdated: Date.now(),
        lastUpdatedServer: serverTimestamp(),
      },
      { merge: true }
    );
    
    console.log("Bus location updated successfully");
  } catch (error) {
    console.error("Error setting bus location:", error);
    throw error;
  }
}

export function subscribeBusLocation(
  busNumber: string,
  onChange: (loc: BusLocation | null) => void
) {
  try {
    if (!db) {
      console.error("Firebase database not initialized");
      onChange(null);
      return () => {};
    }
    
    const ref = doc(db, busesCol, busNumber.trim());
    console.log("Subscribing to bus location for:", busNumber);
    
    return onSnapshot(ref, (snap) => {
      if (!snap.exists()) {
        console.log("No bus location data found for:", busNumber);
        onChange(null);
        return;
      }
      
      const data = snap.data() as any;
      const location = {
        lat: data.lat,
        lng: data.lng,
        lastUpdated:
          typeof data.lastUpdated === "number"
            ? data.lastUpdated
            : (data.lastUpdated as Timestamp)?.toMillis?.() ?? Date.now(),
      };
      
      console.log("Bus location received:", location);
      onChange(location);
    }, (error) => {
      console.error("Error in bus location subscription:", error);
      onChange(null);
    });
  } catch (error) {
    console.error("Error setting up bus location subscription:", error);
    onChange(null);
    return () => {};
  }
}


export async function getBusLocationOnce(
  busNumber: string
): Promise<BusLocation | null> {
  try {
    if (!db) {
      throw new Error("Firebase database not initialized");
    }
    
    const ref = doc(db, busesCol, busNumber.trim());
    console.log("Fetching bus location for:", busNumber);
    
    const snap = await getDoc(ref);
    console.log("Bus location snapshot:", snap.exists() ? snap.data() : "No data");
    
    if (!snap.exists()) {
      console.log("No bus location found for:", busNumber);
      return null;
    }
    
    const data = snap.data() as any;
    const location = {
      lat: data.lat,
      lng: data.lng,
      lastUpdated:
        typeof data.lastUpdated === "number"
          ? data.lastUpdated
          : (data.lastUpdated as Timestamp)?.toMillis?.() ?? Date.now(),
    };
    
    console.log("Retrieved bus location:", location);
    return location;
  } catch (error) {
    console.error("Error getting bus location:", error);
    return null;
  }
}
