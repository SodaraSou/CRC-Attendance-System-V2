import Image from "next/image";
import { signup } from "@/actions/auth";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignUpForm() {
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
      <form action={signup}>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="username">គោត្តនាម និងនាម</Label>
            <Input id="username" name="username" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="role">តួនាទី</Label>
            <Input type="text" id="role" name="role" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">លេខទូរស័ព្ទ</Label>
            <Input type="text" id="phoneNumber" name="phoneNumber" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">លេខសំងាត់</Label>
            <Input type="password" id="password" name="password" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="profileImg">រូបភាព</Label>
            <Input type="file" id="profileImg" name="profileImg" required />
          </div>
          <Button
            type="submit"
            variant={"outline"}
            className="w-full bg-[#e41820] text-white"
          >
            ចុះឈ្មោះ
          </Button>
        </CardContent>
      </form>
    </Card>
  );
}
