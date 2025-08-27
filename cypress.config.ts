import { Todo } from "@/generated/prisma";
import { defineConfig } from "cypress";
import { db } from "./prisma/db";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on("task", {
        async reseed() {
          await db.todo.deleteMany();
          const mockedTodos: Todo[] = [
            { id: "68adb32cadb5e00d52cc5b8c", text: "Feed the cat" },
            { id: "68adb33dad27cca777e24840", text: "Ignore the dog" },
            { id: "68adb34d08fd1c58a7f141b8", text: "Walk all the cats" },
          ];
          for (const { id, ...todo } of mockedTodos) {
            await db.todo.upsert({
              where: { id },
              update: todo,
              create: { id, ...todo },
            });
          }
          return null;
          // ta bort allt ur db
          // seeda om
        },
      });
    },
  },
});
