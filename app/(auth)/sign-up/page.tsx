import SignUpForm from "@/components/sign-up-form";
import UserLayout from "@/app/user-layout";

export default function Page() {
  return (
    <UserLayout>
      <div className="p-4 md:p-10 flex flex-col justify-center items-center">
        <SignUpForm />
      </div>
    </UserLayout>
  );
}
