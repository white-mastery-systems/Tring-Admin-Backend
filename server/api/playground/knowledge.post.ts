const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  const { questions, documentId } = await readBody(event);

  const questionList = Array.isArray(questions) ? questions : [questions];

  var apiResponses = [];

  const apiCalls = questionList.map((singleQuestion) =>
    singleQuestion === null
      ? apiResponses.push(null)
      : $fetch("/rag/knowledge", {
          method: "POST",
          body: {
            question: singleQuestion,
            document_id: documentId,
            provider: "openai",
          },
          baseURL: config.llmBaseUrl
        }),
  );

  apiResponses = await Promise.all(apiCalls);

  return apiResponses;
});
