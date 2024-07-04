import { logout } from "./actions";
import { Button } from "@/components/ui/button";

export default async function SignOutPage() {
  return (
    <form action={logout}>
      <Button>Sign out</Button>
    </form>
  );
}
