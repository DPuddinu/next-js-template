import SignOutBtn from '@/components/auth/SignOutBtn';
import { getUserAuth } from '@/lib/auth/utils';

export default async function Home() {
  const { session } = await getUserAuth();
  return (
    <main className="flex flex-col gap-2">
      <h1 className="my-2 text-2xl font-bold">Profile</h1>
      <pre className="my-2 rounded-lg bg-secondary p-4">{session?.user.username}</pre>
      <SignOutBtn />
    </main>
  );
}
