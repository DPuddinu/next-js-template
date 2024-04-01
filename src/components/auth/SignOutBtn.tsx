import { lucia } from "@/lib/auth/lucia";
import { getUserAuth } from "@/lib/auth/utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Button } from "../ui/button";

export default function SignOutBtn() {

  return (
    <form action={logout}>
      <Button variant='destructive' type="submit">
        Sign out
      </Button>
    </form>
  );
}

async function logout(): Promise<ActionResult> {
  'use server';
  const { session } = await getUserAuth();
  if (!session) {
    return {
      error: 'Unauthorized'
    };
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
  return redirect('/');
}

interface ActionResult {
  error: string | null;
}