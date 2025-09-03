import { db } from "../db";
import { seedFavorites } from "./todo";

async function main() {
  await seedFavorites();
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
