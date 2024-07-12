import UserLayout from "@/app/user-layout";
import SignInForm from "@/components/sign-in-form";

export default function SignInPage() {
  return (
    <UserLayout>
      <div className="p-4 md:p-10 flex flex-col justify-center items-center">
        <SignInForm />
      </div>
    </UserLayout>
  );
}
