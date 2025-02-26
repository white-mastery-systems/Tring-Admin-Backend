export const errorResponse = (
  event: any,
  statusCode: number = 500,
  statusMessage: string = "Internal Server Error",
  data?: any
) =>
  sendError(
    event,
    createError({
      statusCode,
      statusMessage,
      data,
    })
  );