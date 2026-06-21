import { useState, useEffect } from "react";

const KEY = "tm_city";
const LAT_KEY = "tm_lat";
const LNG_KEY = "tm_lng";
const PINCODE_KEY = "tm_pincode";

export const POPULAR_CITIES = [
  "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai",
  "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Surat",
  "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane",
  "Bhopal", "Visakhapatnam", "Patna", "Vadodara", "Ludhiana",
];

export function useCity() {
  const [city, setCityState] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem(KEY) ?? "";
  });

  const setCity = (c: string) => {
    if (c) localStorage.setItem(KEY, c);
    else localStorage.removeItem(KEY);
    setCityState(c);
  };

  return { city, setCity };
}

export function getStoredCity(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(KEY) ?? "";
}

export type StoredLocation = { lat: number | null; lng: number | null; pincode: string };

export function getStoredLocation(): StoredLocation {
  if (typeof window === "undefined") return { lat: null, lng: null, pincode: "" };
  const lat = localStorage.getItem(LAT_KEY);
  const lng = localStorage.getItem(LNG_KEY);
  return {
    lat: lat ? Number(lat) : null,
    lng: lng ? Number(lng) : null,
    pincode: localStorage.getItem(PINCODE_KEY) ?? "",
  };
}

export function setStoredCoords(lat: number, lng: number) {
  localStorage.setItem(LAT_KEY, String(lat));
  localStorage.setItem(LNG_KEY, String(lng));
}

export function setStoredPincode(pincode: string) {
  if (pincode) localStorage.setItem(PINCODE_KEY, pincode);
  else localStorage.removeItem(PINCODE_KEY);
}

export function clearStoredCoords() {
  localStorage.removeItem(LAT_KEY);
  localStorage.removeItem(LNG_KEY);
}

export function useStoredLocation() {
  const [loc, setLoc] = useState<StoredLocation>(() => getStoredLocation());

  useEffect(() => {
    setLoc(getStoredLocation());
  }, []);

  const useMyLocation = (): Promise<StoredLocation> =>
    new Promise((resolve, reject) => {
      if (typeof navigator === "undefined" || !navigator.geolocation) {
        reject(new Error("Geolocation is not supported on this device"));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setStoredCoords(lat, lng);
          const next = { lat, lng, pincode: getStoredLocation().pincode };
          setLoc(next);
          resolve(next);
        },
        (err) => reject(new Error(err.message || "Could not get your location")),
        { enableHighAccuracy: true, timeout: 10_000 },
      );
    });

  const setPincode = (pincode: string) => {
    setStoredPincode(pincode);
    setLoc((l) => ({ ...l, pincode }));
  };

  const clear = () => {
    clearStoredCoords();
    setStoredPincode("");
    setLoc({ lat: null, lng: null, pincode: "" });
  };

  return { ...loc, useMyLocation, setPincode, clear };
}
