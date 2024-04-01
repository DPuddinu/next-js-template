import { spotify } from '@/lib/auth/lucia';
import { env } from '@/lib/env.mjs';
import { generateState } from 'arctic';
import { cookies } from 'next/headers';

export async function GET(): Promise<Response> {
  const state = generateState();
  const url = await spotify.createAuthorizationURL(state, {
    scopes: env.SPOTIFY_SCOPES.split(' ')
  });
  cookies().set('spotify_oauth_state', state, {
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: 'lax'
  });
  return Response.redirect(url);
}
