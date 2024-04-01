import { lucia, spotify } from '@/lib/auth/lucia';
import spotifyApi from '@/lib/axios/config';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema/auth';
import { OAuth2RequestError, SpotifyTokens } from 'arctic';
import { eq } from 'drizzle-orm';
import { generateId } from 'lucia';
import { cookies } from 'next/headers';

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const storedState = cookies().get('spotify_oauth_state')?.value ?? null;

  if (!code || !state || !storedState || state !== storedState) {
    return new Response(null, {
      status: 400
    });
  }

  try {
    const tokens = await spotify.validateAuthorizationCode(code);

    spotifyApi.defaults.headers.common.Authorization = `Bearer ${tokens.accessToken}`;
    const { data: spotifyUserResponse } = await spotifyApi.get('/me');

    const spotifyUser: SpotifyUser = await spotifyUserResponse;
    const existingUser = (await db.select().from(users).where(eq(users.spotifyUserId, spotifyUser.id)))[0];
    if (existingUser) {
      await createSession(existingUser.id, tokens);

      return new Response(null, {
        status: 302,
        headers: {
          Location: '/dashboard'
        }
      });
    }
    const userId = generateId(15);
    await db.insert(users).values([
      {
        id: userId,
        spotifyUserId: spotifyUser.id,
        username: spotifyUser.display_name,
        image: spotifyUser.images[1].url
      }
    ]);

    await createSession(userId, tokens);
    return new Response(null, {
      status: 302,
      headers: {
        Location: '/dashboard'
      }
    });
  } catch (e) {
    console.log(e);
    if (e instanceof OAuth2RequestError && e.message === 'bad_verification_code') {
      // invalid code
      return new Response(null, {
        status: 400
      });
    }
    return new Response(null, {
      status: 500
    });
  }
}

async function createSession(userId: string, tokens: SpotifyTokens) {
  const session = await lucia.createSession(userId, {});

  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
}

interface SpotifyUser {
  id: string;
  display_name: string;
  images: {
    url: string;
    height: number;
    width: number;
  }[];
}
