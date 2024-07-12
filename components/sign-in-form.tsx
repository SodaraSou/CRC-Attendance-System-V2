import Image from "next/image";
import { login } from "@/actions/auth";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignInForm() {
  return (
    <Card className="w-full max-w-lg text-[#362E8F]">
      <CardHeader>
        <Image
          src={"/CRCHearderLogo.png"}
          alt="profileImg"
          width={500}
          height={500}
        />
        <CardTitle className="text-2xl text-center">
          ប្រព័ន្ធគ្រប់គ្រងវត្តមាន
        </CardTitle>
      </CardHeader>
      <form action={login}>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">គោត្តនាម និងនាម</Label>
            <Input id="username" name="username" type="text" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">លេខសំងាត់</Label>
            <Input id="password" name="password" type="text" required />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            variant={"outline"}
            className="w-full bg-[#e41820] text-white"
          >
            ចូលប្រព័ន្ធ
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
