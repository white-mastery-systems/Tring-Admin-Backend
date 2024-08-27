const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  const { systemPrompts, userInput } = await readBody(event);

  const requests = systemPrompts.map(async (prompt: string) => {
    try {
      const response = await $fetch<{ output: string }>("/ai/gen/", {
        method: "POST",
        body: JSON.stringify({
          provider: "openai",
          model_name: "gpt-4o-mini",
          messages: [
            { role: "system", content: prompt },
            { role: "user", content: userInput },
          ],
        }),
        baseURL: config.llmBaseUrl,
      });

      return response.output;
    } catch (error) {
      console.error("Error fetching response:", error);
      return null;
    }
  });

  const responses = await Promise.all(requests);

  return {
    status: 200,
    responses,
  };
});
