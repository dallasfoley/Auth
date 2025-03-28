import { db } from "@/drizzle/db";
import { sessions } from "@/drizzle/schema";
import { eq, and, gt } from "drizzle-orm";

export async function getUserFromSession(sessionToken: string) {
  const now = new Date();

  try {
    const session = await db.query.sessions.findFirst({
      where: and(
        eq(sessions.sessionToken, sessionToken),
        gt(sessions.expiresAt, now)
      ),
      with: {
        user: true,
      },
    });

    if (!session) {
      return null;
    }

    return session.user;
  } catch (error) {
    console.error("Error getting user from session:", error);
    return null;
  }
}
