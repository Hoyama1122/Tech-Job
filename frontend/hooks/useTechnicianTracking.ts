"use client";

import { useEffect, useRef, useState } from "react";
import { getSocket } from "@/lib/socket";
import { useAuthStore } from "@/store/useAuthStore";

type LatLng = {
  lat: number;
  lng: number;
};

// คำนวณระยะทางจริง (เมตร)
const getDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) => {
  const R = 6371000;
  const toRad = (v: number) => (v * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

export const useTechnicianTracking = (active: boolean = false) => {
  const { user } = useAuthStore();

  const [error, setError] = useState<string | null>(null);

  const watchId = useRef<number | null>(null);
  const lastSentTime = useRef<number>(0);
  const lastPosition = useRef<LatLng | null>(null);

  
  const HEARTBEAT_MS = 15000; 
  const DISTANCE_THRESHOLD = 15; 
  const MAX_ACCURACY = 50; 

  useEffect(() => {
  
    if (!active || !user || user.role !== "TECHNICIAN") {
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
        watchId.current = null;
      }
      return;
    }

   
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    const socket = getSocket();

    const handleSuccess = (position: GeolocationPosition) => {
      const { latitude, longitude, accuracy } = position.coords;
      const now = Date.now();

     
      if (accuracy > MAX_ACCURACY) return;

      const distance = lastPosition.current
        ? getDistance(
            latitude,
            longitude,
            lastPosition.current.lat,
            lastPosition.current.lng,
          )
        : Infinity;

      const timeSinceLast = now - lastSentTime.current;

      const moved = distance > DISTANCE_THRESHOLD;
      const heartbeat = timeSinceLast > HEARTBEAT_MS;

    
      if (!moved && !heartbeat) return;

     
      if (!socket?.connected) {
        console.warn("Socket not connected");
        return;
      }

      const payload = {
        latitude,
        longitude,
        accuracy,
        timestamp: now,
        type: moved ? "move" : "heartbeat",
      };

      socket.emit("technician:location:update", payload);

      lastSentTime.current = now;

     
      if (moved) {
        lastPosition.current = { lat: latitude, lng: longitude };
      }

      setError((prev) => (prev ? null : prev));

     
    };

    const handleError = (err: GeolocationPositionError) => {
      let msg = "Error getting location";

      switch (err.code) {
        case err.PERMISSION_DENIED:
          msg = "Please allow location access to share your position";
          break;
        case err.POSITION_UNAVAILABLE:
          msg = "Location information is unavailable";
          break;
        case err.TIMEOUT:
          msg = "Location request timed out";
          break;
      }

      setError((prev) => (prev !== msg ? msg : prev));
      console.error("Geolocation error:", err);
    };

    watchId.current = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 10000,
      },
    );

    return () => {
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
        watchId.current = null;
      }
    };
  }, [active, user]);

  return { error };
};