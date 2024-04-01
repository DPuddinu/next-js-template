import { LibSQLAdapter } from '@lucia-auth/adapter-sqlite';
import { Spotify } from 'arctic';
import type { Session, User } from 'lucia';
import { Lucia, TimeSpan } from 'lucia';
import { cookies } from 'next/headers';
import { cache } from 'react';
import { globalForDb } from '../db';
import { DatabaseUser } from '../db/schema/auth';
import { env } from '../env.mjs';

const adapter = new LibSQLAdapter(globalForDb.conn, {
  user: 'user',
  session: 'user_session'
});

export const lucia = new Lucia(adapter, {
  sessionExpiresIn: new TimeSpan(1, 'h'),
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === 'production'
    }
  },
  getUserAttributes: (attributes) => {
    return {
      spotifyUserId: attributes.spotifyUserId,
      username: attributes.username
    };
  }
});

declare module 'lucia' {
  // eslint-disable-next-line unused-imports/no-unused-vars
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: Omit<DatabaseUser, 'id'>;
  }
}
export type UserSession = { user: User; session: Session };

export const getPageSession = cache(async (): Promise<UserSession> => {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
  if (!sessionId) {
    throw new Error(`Session not found`);
  }
  const { session, user } = await lucia.validateSession(sessionId);

  try {
    if (session && session.fresh) {
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    }
    if (!session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    }
  } catch {}
  if (!session) {
    throw new Error('Session not found');
  }
  return {
    user,
    session
  };
});

export const spotify = new Spotify(env.SPOTIFY_CLIENT_ID, env.SPOTIFY_CLIENT_SECRET, env.SPOTIFY_CALLBACK_URL);
