import { db } from "../db";

export async function seedFavorites() {
  const mockedFavorites = [
    {
      city: "Stockholm",
      temperature: 22,
      description: "Soligt",
      icon: "01d",
    },
    {
      city: "Göteborg",
      temperature: 18,
      description: "Molnigt",
      icon: "03d",
    },
  ];

  for (const fav of mockedFavorites) {
    await db.favoriteCity.upsert({
      where: { city: fav.city },
      update: fav,
      create: fav,
    });
  }
}
