import { logger } from "~/server/logger";

// Assuming global.userConnections is defined somewhere in your application
declare global {
  var userConnections: Map<string, ((data: any) => void)[]> | undefined;
}

global.userConnections = globalThis.userConnections || new Map();

export default defineEventHandler(async (event) => {
  const { req, res } = event.node;

  const sessionId = getCookie(event, lucia.sessionCookieName) ?? getHeader(event, "Token") ?? null;
 
  if (!sessionId) {
    sendError(event, createError({ statusCode: 401, statusMessage: "Unauthorized" }));
    return;
  }

  const user: any = await lucia.validateSession(sessionId);

  const userId = event.context.user?.id || user.id!

  // Ensure global.userConnections is initialized
  if (!global.userConnections) {
    global.userConnections = new Map<string, ((data: any) => void)[]>();
  }

  setResponseHeaders(event, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "Access-Control-Allow-Origin": "*",
  });

  const sendEvent = (data: any) => {
    try {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
      logger.info(`[SSE] Sent to ${userId}: ${JSON.stringify(data)}`);
    } catch (err) {
      logger.error(`[SSE] Failed to send to ${userId}:`, err);
    }
  };

  if (!global.userConnections.has(userId)) {
    global.userConnections.set(userId, []);
  }
  global.userConnections.get(userId)!.push(sendEvent);

  const initPayload = {
    event: "init",
    message: "SSE initialized successfully",
  };
  try {
    res.write(`data: ${JSON.stringify(initPayload)}\n\n`);
    logger.info(`[SSE] Initial event sent to user: ${userId}`);
  } catch (err) {
    logger.error(`[SSE] Failed to send initial event to ${userId}`, err);
  }

  req.on("close", () => {
    logger.info(`[SSE] ❌ Client-side disconnect detected for user: ${userId}`);
    const connections = global.userConnections?.get(userId);
    if (connections) {
      global.userConnections?.set(
        userId,
        connections.filter((c) => c !== sendEvent),
      );
    }
  });

  req.on("aborted", () => {
    logger.warn(`[SSE] ⚠️ Client aborted the connection unexpectedly for user: ${userId}`);
  });
});



// // Assuming global.userConnections is defined somewhere in your application
// declare global {
//   var userConnections: Map<string, ((data: any) => void)[]> | undefined;
// }

// global.userConnections = globalThis.userConnections || new Map();

// export default defineEventHandler(async (event) => {
//   const { req, res } = event.node;
//   const userId = event.context.user?.id as string;

//   // Ensure global.userConnections is initialized
//   if (!global.userConnections) {
//     global.userConnections = new Map<string, ((data: any) => void)[]>();
//   }

//   setResponseHeaders(event, {
//     "Content-Type": "text/event-stream",
//     "Cache-Control": "no-cache",
//     Connection: "keep-alive",
//     "Access-Control-Allow-Origin": "*",
//   });

//   // Function to send messages to the client
//   const sendEvent = (data: any) => {
//     res.write(`data: ${JSON.stringify(data)}\n\n`);
//   };

//   // Store SSE connection for the user
//   if (!global.userConnections.has(userId)) {
//     global.userConnections.set(userId, []);
//   }
//   global.userConnections.get(userId)!.push(sendEvent);

//   res.write(
//     `data: ${JSON.stringify({
//       event: "init",
//       message: "SSE initialized succesfully",
//     })}\n\n`,
//   );

//   // Handle client disconnect
//   req.on("close", () => {
//     const connections = global.userConnections?.get(userId);
//     if (connections) {
//       global.userConnections?.set(
//         userId,
//         connections.filter((connection) => connection !== sendEvent),
//       );
//     }
//   });
// });
