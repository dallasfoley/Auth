import { NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { cookies } from "next/headers";
import { randomUUID } from "crypto";

import { db } from "@/drizzle/db";
import { users, sessions } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    console.log("Login attempt for:", email);

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user || !user.password) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Verify password
    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      console.log("Password verification result: fail");
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }
    console.log("Password verification result: success");
    // Create session
    console.log("Creating session for user:", user.id);
    const sessionToken = randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Session expires in 7 days

    await db.insert(sessions).values({
      sessionToken,
      userId: user.id,
      expiresAt,
    });

    // Set session cookie
    console.log("Setting session cookie:", sessionToken);
    (await cookies()).set({
      name: "session-token",
      value: sessionToken,
      httpOnly: true,
      path: "/",
      secure: process.env.COOKIE_SECURE === "true",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "An error occurred during login" },
      { status: 500 }
    );
  }
}
