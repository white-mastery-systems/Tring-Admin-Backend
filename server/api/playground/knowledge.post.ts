const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  const { questions, documentId } = await readBody(event);

  const questionList = Array.isArray(questions) ? questions : [questions];

  const apiCalls = questionList.map((singleQuestion) =>
    $fetch("/rag/knowledge", {
      method: "POST",
      body: {
        question: singleQuestion,
        document_id: documentId,
        provider: "openai",
      },
      baseURL: config.llmBaseUrl,
    }),
  );

  const apiResponses = await Promise.all(apiCalls);

  return apiResponses;
});
