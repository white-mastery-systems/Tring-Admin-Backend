// Assuming global.userConnections is defined somewhere in your application
declare global {
  var userConnections: Map<string, ((data: any) => void)[]> | undefined;
}

global.userConnections = globalThis.userConnections || new Map();

export default defineEventHandler(async (event) => {
  const { req, res } = event.node;
  const userId = event.context.user?.id as string;

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

  // Function to send messages to the client
  const sendEvent = (data: any) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  // Store SSE connection for the user
  if (!global.userConnections.has(userId)) {
    global.userConnections.set(userId, []);
  }
  global.userConnections.get(userId)!.push(sendEvent);

  res.write(
    `data: ${JSON.stringify({
      event: "init",
      message: "SSE initialized successfully",
    })}\n\n`,
  );

  // Handle client disconnect
  req.on("close", () => {
    const connections = global.userConnections?.get(userId);
    if (connections) {
      global.userConnections?.set(
        userId,
        connections.filter((connection) => connection !== sendEvent),
      );
    }
  });
});
