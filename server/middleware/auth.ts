import { verifyRequestOrigin } from "lucia";
import type { Session, User } from "lucia";
import jwt from "jsonwebtoken"

const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  // if (event.method !== "GET" && !event.path.startsWith("/api/auth")) {
  //   const originHeader = getHeader(event, "Origin") ?? null;
  //   const hostHeader = getHeader(event, "Host") ?? null;
  //   if (
  //     !originHeader ||
  //     !hostHeader ||
  //     !verifyRequestOrigin(originHeader, [hostHeader])
  //   ) {
  //     return event.node.res.writeHead(403).end();
  //   }
  // }

    // console.log({ HEADERS: event.node.req.headers })
    // const accessToken = event.node.req.headers['authorization'];
    // const refreshToken = getCookie(event, "refreshToken")

    // console.log({ accessToken , refreshToken})

    // if (!accessToken && !refreshToken) {
    //   event.context.user = null;
    //   return;
    // }
    // try {
    //   const decodedAccessToken = jwt.verify(accessToken, config.secretKey);
    //   // console.log({ decodedAccessToken })
    //   event.context.user = decodedAccessToken!
    // } catch (error) {
    //   if (!refreshToken) {
    //      return sendError(
    //         event,
    //         createError({
    //           statusCode: 401,
    //           statusMessage: "Access Denied. No refresh token provided",
    //         }),
    //     )
    //   }
    //   try {
    //   const decodedRefreshToken = jwt.verify(refreshToken, config.secretKey);
    //   const newAccessToken = jwt.sign(decodedRefreshToken, config.secretKey, { expiresIn: '1h' });
    //     setCookie(event, 'refreshToken', refreshToken, {
    //       httpOnly: true,
    //       sameSite: 'strict',
    //     });

    //       appendHeaders(event, {
    //        Authorization: newAccessToken
    //      });

    //     event.context.user = decodedRefreshToken
    //   } catch (error) {
    //     return sendError(
    //         event,
    //         createError({
    //           statusCode: 400,
    //           statusMessage: "Invalid token",
    //         }),
    //     )
    //   }
    // }

  const sessionId = getCookie(event, lucia.sessionCookieName) ?? null;
  if (!sessionId) {
    event.context.session = null;
    event.context.user = null;
    return;
  }

  const { session, user } = await lucia.validateSession(sessionId);
  if (session && session.fresh) {
    appendResponseHeader(
      event,
      "Set-Cookie",
      lucia.createSessionCookie(session.id).serialize(),
    );
  }
  if (!session) {
    appendResponseHeader(
      event,
      "Set-Cookie",
      lucia.createBlankSessionCookie().serialize(),
    );
  }
  event.context.session = session;
  event.context.user = user;
});

declare module "h3" {
  interface H3EventContext {
    user: User | null;
    session: Session | null;
  }
}
