"use client";

import { useEffect, useRef, useState } from "react";
import { getSocket } from "@/lib/socket";
import { useAuthStore } from "@/store/useAuthStore";

export const useTechnicianTracking = (active: boolean = false) => {
  const { user } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const watchId = useRef<number | null>(null);
  const lastSentTime = useRef<number>(0);
  const lastPosition = useRef<{ lat: number; lng: number } | null>(null);

  const THROTTLE_MS = 10000; // Send every 10 seconds
  const DISTANCE_THRESHOLD = 0.0001; // Small movement threshold (~10-15 meters)

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

      // Check if we should send update (Throttle or Distance)
      const shouldSend = 
        now - lastSentTime.current > THROTTLE_MS || 
        !lastPosition.current ||
        Math.abs(latitude - lastPosition.current.lat) > DISTANCE_THRESHOLD ||
        Math.abs(longitude - lastPosition.current.lng) > DISTANCE_THRESHOLD;

      if (shouldSend && socket) {
        socket.emit("technician:location:update", {
          latitude,
          longitude,
          accuracy,
          timestamp: now,
        });

        lastSentTime.current = now;
        lastPosition.current = { lat: latitude, lng: longitude };
        setError(null);
      }
    };

    const handleError = (error: GeolocationPositionError) => {
      let msg = "Error getting location";
      switch (error.code) {
        case error.PERMISSION_DENIED:
          msg = "Please allow location access to share your position";
          break;
        case error.POSITION_UNAVAILABLE:
          msg = "Location information is unavailable";
          break;
        case error.TIMEOUT:
          msg = "Location request timed out";
          break;
      }
      setError(msg);
      console.error("Geolocation error:", error);
    };

    watchId.current = navigator.geolocation.watchPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      maximumAge: 5000,
      timeout: 10000,
    });

    return () => {
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
      }
    };
  }, [active, user]);

  return { error };
};
