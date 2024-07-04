import { validateRequest } from "@/lib/validate-request";
import Link from "next/link";

export default async function Home() {
  const { user } = await validateRequest();

  return (
    <main>
      {user && <Link href={"/sign-out"}>Sign Out</Link>}
      {!user && <Link href={"/sign-in"}>Sign In</Link>}
    </main>
  );
}
