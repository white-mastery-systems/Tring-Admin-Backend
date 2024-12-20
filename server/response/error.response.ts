export const errorResponse = (event: any, statusCode: number, statusMessage: string, data?: any) =>
  sendError(
    event,
    createError({
      statusCode,
      statusMessage,
      data,
    })
);