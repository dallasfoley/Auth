import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { db } from "@/drizzle/db";
import { sessions } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function POST() {
  try {
    const sessionToken = (await cookies()).get("session-token")?.value;

    if (sessionToken) {
      // Delete session from database
      await db.delete(sessions).where(eq(sessions.sessionToken, sessionToken));

      // Clear cookie
      (await cookies()).delete("session-token");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "An error occurred during logout" },
      { status: 500 }
    );
  }
}
