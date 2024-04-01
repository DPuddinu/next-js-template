import { getPageSession } from '@/lib/auth/lucia';
import { redirect } from 'next/navigation';

export type AuthSession = {
  session: {
    user: {
      id: string;
      spotifyUserId: string;
      username: string;
    };
    id: string;
  } | null;
};
export const getUserAuth = async (): Promise<AuthSession> => {
  const session = await getPageSession();
  if (!session?.user) return { session: null };
  return {
    session: {
      user: {
        id: session.user.id,
        spotifyUserId: session.user.spotifyUserId,
        username: session.user.username
      },
      id: session.session.id
    }
  };
};

export const checkAuth = async () => {
  const { session } = await getPageSession();
  if (!session) redirect('/');
};
