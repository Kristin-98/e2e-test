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
  onSelect?: (city: string) => void;
}
export default function Favorites({
  favorites,
  onRemove,
  onSelect,
}: FavoritesProps) {
  if (favorites.length === 0) return null;
  return (
    <div className="max-w-5xl mt-6">
      <h3 className="text-2xl mb-4 text-center text-black">Mina favoriter</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {favorites.map((fav) => (
          <div
            data-testid={`favorite-${fav.city}`}
            className="bg-white/20 backdrop-blur-xl shadow-lg p-6 rounded-2xl text-center flex flex-col items-center"
            key={fav.city}
            onClick={() => onSelect && onSelect(fav.city)} // NY
          >
            <h4 className="text-xl mb-2">{fav.city}</h4>
            <Image
              src={`http://openweathermap.org/img/wn/${fav.icon}@2x.png`}
              alt={fav.description}
              width={80}
              height={80}
              className="mx-auto"
            />
            <p className="mt-2 text-lg">{fav.temperature}°C</p>
            <p className="capitalize">{fav.description}</p>
            {onRemove && (
              <button
                className="mt-4 px-4 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 shadow-md transition"
                onClick={(e) => {
                  e.stopPropagation(); // Förhindra att click på "x" triggar onSelect
                  onRemove(fav.city);
                }}
              >
                x
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
