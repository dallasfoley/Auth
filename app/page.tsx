import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { getUserFromSession } from "@/lib/auth";

export default async function Home() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session-token")?.value;
  const user = sessionToken ? await getUserFromSession(sessionToken) : null;

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Welcome, {user.name}!</h1>
          <p className="mt-2 text-gray-600">You are successfully logged in.</p>
        </div>
        <div className="flex justify-center">
          <form action="/api/auth/logout" method="POST">
            <Button type="submit" className="w-full">
              Sign Out
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
