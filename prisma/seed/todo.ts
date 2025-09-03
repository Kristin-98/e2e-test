import { db } from "../db";

/*export async function seedTodos() {
  const mockedTodos: Todo[] = [
    {
      id: "68adb30b0c2c50f13d0a64e9",
      text: "Feed the cat",
    },
    {
      id: "68adb30b0c2c50f13d0a64ea",
      text: "Ignore the dog",
    },
    {
      id: "68adb30b0c2c50f13d0a64eb",
      text: "Walk all the cats",
    },
  ];

  for (const { id, ...todo } of mockedTodos) {
    await db.todo.upsert({
      where: { id },
      update: todo,
      create: { id, ...todo },
    });
  }
}*/

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
