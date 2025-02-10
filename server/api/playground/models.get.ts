const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  const { provider } = getQuery(event);

 if (!provider) {
   return sendError(
     event,
     createError({
       statusCode: 400,
       statusMessage:
         "Provider Required: The provider is missing from the request. Please specify a valid provider to proceed.",
     }),
   );
 }

  try {
    return await $fetch(`/ai/models?provider=${provider}`, {
      method: "GET",
      baseURL: config.llmBaseUrl
    });
  } catch (error) {
    console.error("Error fetching models:", error);
    return sendError(
      event,
      createError({
        statusCode: 500,
        statusMessage:
          "Internal Server Error: Failed to fetch models. Please try again later or contact support if the issue persists.",
      }),
    );
  }
});
