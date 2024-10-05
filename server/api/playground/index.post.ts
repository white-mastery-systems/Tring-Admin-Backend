const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  const { systemInstructions, userQueries } = await readBody(event);

  var responses = [];
  var response: any;

  const requests = systemInstructions.map(
    async (instruction: string, index: number) => {
      try {
        instruction === null ? responses.push(null) : 
        response = await $fetch<{ output: string }>("/ai/gen/", {
          method: "POST",
          body: JSON.stringify({
            provider: "openai",
            model_name: "gpt-4o-mini",
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

  responses = await Promise.all(requests);

  return {
    status: 200,
    responses,
  };
});
