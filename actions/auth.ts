"use server";

import { db } from "@/db";
import { hash } from "@node-rs/argon2";
import { cookies } from "next/headers";
import { lucia } from "@/lib/auth";
import { redirect } from "next/navigation";
import { verify } from "@node-rs/argon2";
import { userTable } from "@/db/schema";
import { generateIdFromEntropySize } from "lucia";
import { eq } from "drizzle-orm";
import { validateRequest } from "@/lib/validate-request";
import cloudinary from "@/lib/cloudinary";

export async function login(formData: FormData) {
  const username = formData.get("username");
  if (
    typeof username !== "string" ||
    username.length < 3 ||
    username.length > 31 ||
    !/^[a-z0-9_-]+$/.test(username)
  ) {
    return {
      error: "Invalid username",
    };
  }
  const password = formData.get("password");
  if (
    typeof password !== "string" ||
    password.length < 6 ||
    password.length > 255
  ) {
    return {
      error: "Invalid password",
    };
  }

  const existingUser = await db.query.userTable.findFirst({
    where: eq(userTable.username, username.toLocaleLowerCase()),
  });
  if (!existingUser) {
    return {
      error: "Incorrect username or password",
    };
  }

  const validPassword = await verify(existingUser.password_hash, password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
  if (!validPassword) {
    return {
      error: "Incorrect username or password",
    };
  }

  const session = await lucia.createSession(existingUser.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  const { user } = await validateRequest();
  if (user?.role === "admin") {
    return redirect("/admin");
  }
  return redirect("/");
}

export async function signup(formData: FormData) {
  const username = formData.get("username");
  if (
    typeof username !== "string" ||
    username.length < 3 ||
    username.length > 31 ||
    !/^[a-z0-9_-]+$/.test(username)
  ) {
    return {
      error: "Invalid username",
    };
  }
  const password = formData.get("password");
  if (
    typeof password !== "string" ||
    password.length < 6 ||
    password.length > 255
  ) {
    return {
      error: "Invalid password",
    };
  }

  const passwordHash = await hash(password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
  const userId = generateIdFromEntropySize(10);
  const user = {
    id: userId,
    username: username,
    role: "",
    phoneNumber: "",
    profileImg: "",
    password_hash: passwordHash,
  };

  const role = formData.get("role");
  if (typeof role === "string") {
    user.role = role;
  }

  const phoneNumber = formData.get("phoneNumber");
  if (typeof phoneNumber === "string") {
    user.phoneNumber = phoneNumber;
  }

  const profileImg = formData.get("profileImg");
  if (profileImg !== null && profileImg instanceof File) {
    const imageBuffer = await profileImg.arrayBuffer();
    const imageArray = Array.from(new Uint8Array(imageBuffer));
    const imageData = Buffer.from(imageArray);
    // Convert the image data to base64
    const imageBase64 = imageData.toString("base64");
    // Make request to upload to Cloudinary
    const result = await cloudinary.uploader.upload(
      `data:image/png;base64,${imageBase64}`,
      { folder: "crc-attendance-system" }
    );
    user.profileImg = result.secure_url;
  }

  await db.insert(userTable).values(user);

  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  return redirect("/");
}
