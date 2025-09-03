"use client";

import Image from "next/image";

interface WeatherData {
  city: string;
  temperature: number;
  description: string;
  icon: string;
}

interface FavoritesProps {
  favorites: WeatherData[];
  onRemove?: (city: string) => void;
}
export default function Favorites({ favorites, onRemove }: FavoritesProps) {
  if (favorites.length === 0) return null;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-3xl mt-6">
      {" "}
      {favorites.map((fav) => (
        <div key={fav.city}>
          <h2>{fav.city}</h2>
          <Image
            src={"http://openweathermap.org/img/wn/${fav.icon}@2x.png"}
            alt={fav.description}
            width={80}
            height={80}
            className="mx-auto"
          />
          <p>{fav.temperature}°C</p>
          <p>{fav.description}</p>
          {onRemove && <button onClick={() => onRemove(fav.city)}>x</button>}
        </div>
      ))}
    </div>
  );
}
