const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  const { systemInstructions, userQueries, provider, model } = await readBody(event);

  const requests = systemInstructions.map(
    async (instruction: string, index: number) => {
      try {
        const response = await $fetch<{ output: string }>("/ai/gen/", {
          method: "POST",
          body: JSON.stringify({
            provider: provider || "openai",
            model_name: model || "gpt-4o-mini",
            messages: [
              { role: "system", content: instruction },
              { role: "user", content: userQueries[index] },
            ],
          }),
          baseURL: config.llmBaseUrl,
        });

        return response.output;
      } catch (error) {
        console.error(
          `Error fetching response for instruction ${index}:`,
          error,
        );
        return null;
      }
    },
  );

  const responses = await Promise.all(requests);

  return {
    status: 200,
    responses,
  };
});
