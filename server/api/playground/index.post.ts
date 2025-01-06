export default defineEventHandler(async (event) => {
  const { systemInstructions, userQueries, provider, model, modelConfig } =
    await readBody(event);

  const responses = await Promise.all(
    systemInstructions.map(async (instruction: any, index: any) => {
      if (instruction === null) return null;

      try {
        const response = await $fetch<{ output: string }>("/ai/gen/", {
          method: "POST",
          body: JSON.stringify({
            provider,
            model_name: model,
            messages: [
              { role: "system", content: instruction },
              { role: "user", content: userQueries[index] },
            ],
            model_configuration: modelConfig,
          }),
          baseURL: process.env.LLM_BASE_URL,
        });

        return response.output;
      } catch (error) {
        console.error(
          `Error fetching response for instruction ${index}:`,
          error,
        );
        return null;
      }
    }),
  );

  return { status: 200, responses };
});
