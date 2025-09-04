import { db } from "@/prisma/db";
import TodoList from "./ui/todo-list";
import WeatherApp from "./ui/weather";

export default async function Home() {
  const favorites = await db.favoriteCity.findMany();

  return (
    <main>
      {/* <TodoList defaultTodos={todos} /> */}
      <WeatherApp initialFavorites={favorites} />
    </main>
  );
}
