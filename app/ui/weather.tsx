"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Activity from "./activity";
import Favorites from "./favorites";

interface WeatherData {
  city: string;
  temperature: number;
  description: string;
  icon: string;
}

export default function WeatherApp() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<WeatherData[]>([]);

  async function loadFavorites() {
    try {
      const res = await fetch("/api/favorites");
      if (res.ok) {
        const data: WeatherData[] = await res.json();
        setFavorites(data);
      }
    } catch (err) {
      console.error("Kunde inte hämta favoriter", err);
    }
  }

  useEffect(() => {
    loadFavorites();
  }, []);

  async function fetchWeather(searchCity: string) {
    try {
      setError(null);
      const res = await fetch(`/api/weather?city=${searchCity}`);
      if (!res.ok) {
        throw new Error(`Kunde inte hitta väder för ${searchCity}`);
      }
      const data: WeatherData = await res.json();
      setWeather(data);
    } catch (err) {
      setWeather(null);
      setError((err as Error).message);
    }
  }

  async function handleSaveFavorite() {
    if (!weather) return;
    if (favorites.some((fav) => fav.city === weather.city)) {
      alert(`${weather.city} finns redan bland favoriter!`);
      return;
    }

    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(weather),
      });
      if (res.ok) setFavorites((prev) => [...prev, weather]);
    } catch (err) {
      console.error("Kunde inte spara favorit", err);
    }
  }

  async function handleRemoveFavorite(city: string) {
    try {
      const res = await fetch(`/api/favorites?city=${city}`, {
        method: "DELETE",
      });
      if (res.ok)
        setFavorites((prev) => prev.filter((fav) => fav.city !== city));
    } catch (err) {
      console.error("Kunde inte ta bort favorit", err);
    }
  }

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen p-4 bg-cover bg-center"
      style={{ backgroundImage: "url('/clouds.jpg')" }}
    >
      <div className="w-full max-w-md rounded-2xl bg-white/20 backdrop-blur-xl shadow-lg p-6 text-center text-black">
        <h1 className="text-2xl font-bold mb-4">🌤️ Väder</h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchWeather(city);
          }}
          className="flex gap-2 mb-6"
        >
          <input
            placeholder="Ange stad"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg bg-white/30 text-black placeholder-black/70 "
          />
          <button
            type="submit"
            onClick={() => fetchWeather(city)}
            className="px-4 py-2 rounded-lg bg-yellow-400/90 hover:bg-yellow-500 text-black font-semibold shadow-md transition"
          >
            Sök
          </button>
        </form>

        {error && <p className="text-red-300 mb-4">{error}</p>}

        {weather && (
          <div className="space-y-3">
            <h2 className="text-xl font-bold">{weather.city}</h2>
            <Image
              src={`http://openweathermap.org/img/wn/${weather.icon}@2x.png`}
              alt={weather.description}
              width={100}
              height={100}
              className="mx-auto"
            />
            <p className="text-4xl font-semibold">{weather.temperature}°C</p>
            <p className="italic">{weather.description}</p>

            <button
              onClick={handleSaveFavorite}
              className="mt-4 px-4 py-2 rounded-lg border-1 border-yellow-400 hover:border-yellow-500"
            >
              Spara som favorit
            </button>
          </div>
        )}
        <div>
          <Activity />
        </div>
      </div>
      <div className="mt-6 w-full max-w-md z-10">
        <Favorites favorites={favorites} onRemove={handleRemoveFavorite} />
      </div>
    </div>
  );
}
