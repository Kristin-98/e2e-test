"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";

interface WeatherData {
  city: string;
  temperature: number;
  description: string;
}

export default function WeatherApp() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const favoriteCity = Cookies.get("favoriteCity");
    if (favoriteCity) {
      fetchWeather(favoriteCity);
    }
  }, []);

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
  function handleSaveFavorite() {
    if (weather) {
      Cookies.set("favoriteCity", weather.city);
      alert(`${weather.city} sparad som favoritstad!`);
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
          <button onClick={handleSaveFavorite}>Spara som favorit</button>
        </div>
      )}
    </div>
  );
}
