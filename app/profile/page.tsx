import { validateRequest } from "@/lib/validate-request";
import { redirect } from "next/navigation";

export default async function Page() {
  const { user } = await validateRequest();
  if (!user) {
    console.log(user);
    return redirect("/sign-in");
  }
  return <>Profile</>;
}
