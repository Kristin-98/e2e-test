import {db} from "./db";
import {Todo} from "@/generated/prisma";

async function main() {
  const mockedTodos: Todo[] = [
  {id: "68adb32cadb5e00d52cc5b8c", text: "Feed the cat"},
  {id: "68adb33dad27cca777e24840", text: "Ignore the dog"},
  {id: "68adb34d08fd1c58a7f141b8", text: "Walk all the cats"},
]
for (const {id,...todo} of mockedTodos) {
    await db.todo.upsert({
        where: {id},
        update: todo,
        create: {id, ...todo},
    })
}
}

main()
  .then(async () => {
    await db.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await db.$disconnect()
    process.exit(1)
  })