const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  const { question, documentId } = await readBody(event);

  return await $fetch("/rag/knowledge", {
    method: "POST",
    body: {
      question: question,
      document_id: documentId,
      provider: "openai",
    },
    baseURL: config.llmBaseUrl,
  });
});
