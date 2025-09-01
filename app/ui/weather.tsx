"use client";

import { useState } from "react";

interface WeatherData {
  city: string;
  temperature: number;
  description: string;
}

export default function WeatherApp() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function fetchWeather(searchCity: string) {
    try {
      setError(null);
      // Ändra till mitt api
      const res = await fetch(`/api/weather?city=${searchCity}`);
      if (!res.ok) {
        throw new Error("Stad hittades inte");
      }
      const data: WeatherData = await res.json();
      setWeather(data);
    } catch (err) {
      setWeather(null);
      setError((err as Error).message);
    }
  }

  return (
    <div>
      <input
        placeholder="Ange stad"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button onClick={() => fetchWeather(city)}>Sök</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {weather && (
        <div>
          <h2>{weather.city}</h2>
          <p>{weather.temperature}°C</p>
          <p>{weather.description}</p>
        </div>
      )}
    </div>
  );
}
