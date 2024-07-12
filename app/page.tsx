import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/validate-request";
import Profile from "@/components/profile";

export default async function Home() {
  const { user } = await validateRequest();
  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="p-4 md:p-10 flex flex-col justify-center items-center">
      <Profile user={user} />
    </div>
  );
}
