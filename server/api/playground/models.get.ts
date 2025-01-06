export default defineEventHandler(async (event) => {
  const { provider } = getQuery(event);

  if (!provider) {
    return sendError(event, createError({ statusCode: 400, statusMessage: "Provider is required" }));
  }

  try {
    return await $fetch(`/ai/models?provider=${provider}`, {
      method: "GET",
      baseURL: process.env.LLM_BASE_URL,
    });
  } catch (error) {
    console.error("Error fetching models:", error);
    return sendError(event, createError({ statusCode: 500, statusMessage: "Failed to fetch models" }));
  }
});
