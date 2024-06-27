import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { postsTable, usersTable } from "@/db/schema";

export default async function Home() {
  const post = await db.query.postsTable.findMany();
  return (
    <main>
      <form
        action={async () => {
          "use server";
          await db.insert(postsTable).values({
            title: "Hello",
            content: "dara",
            userId: 1,
          });
        }}
      >
        <Button>Submit</Button>
      </form>
      {post.map((post) => (
        <>{post.title}</>
      ))}
    </main>
  );
}
