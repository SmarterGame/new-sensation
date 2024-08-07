import { handleAuth, handleLogin } from '@auth0/nextjs-auth0';

export const GET = handleAuth({
    login: handleLogin({
          authorizationParams: {
            audience: process.env.AUTH0_AUDIENCE,
            scope: process.env.AUTH0_SCOPE
          },
          returnTo: "/api/auth/login-handler"
    })
  });