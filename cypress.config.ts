import { spawn } from "child_process";
import { defineConfig } from "cypress";
import { MongoMemoryReplSet } from "mongodb-memory-server";
import waitOn from "wait-on";
import { seedTodos } from "./prisma/seed/todo";

export default defineConfig({
  e2e: {
    async setupNodeEvents(on, config) {
      // 1. Skapa in-memory db replica
      const db = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
      const dbUri = db.getUri("cypress-test");

      // 2. Starta Next.js servern annan port. ansluter till 1.
      const server = spawn(
        "npx",
        ["next", "dev", "--turbopack", "-p", "3100"],
        {
          env: {
            NODE_ENV: "test",
            DATABASE_URL: dbUri,
          },
          stdio: "inherit",
        }
      );
      // 3. Vänta på att Nextjs servern är igång innan cypress
      await waitOn({ resources: ["http://localhost:3100"], timeout: 60_000 });

      // 4. Städa upp processerna mongo db och next.js servern
      // 5. Reseeda om databsen så att testerna blir oberoende av varandra
      on("task", {
        async reseed() {
          await db.todo.deleteMany();
          await seedTodos();

          return null;
        },
      });
    },
  },
});
