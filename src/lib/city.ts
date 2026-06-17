import { useState, useEffect } from "react";

const KEY = "tm_city";

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
