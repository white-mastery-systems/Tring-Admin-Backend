export const playgroundRequests = async (
  systemPrompts: string[],
  userInput: string,
) => {
  try {
    const response = await $fetch("/api/playground", {
      method: "POST",
      body: { systemPrompts, userInput },
    });
    return response;
  } catch (error) {
    console.error("Error fetching responses:", error);
    return null;
  }
};

export const loadKnowledgeBase = async (
  question: string,
  documentId: string,
) => {
  console.log("loading", question, documentId);
  try {
    const knowledge = await $fetch("/api/playground/knowledge", {
      method: "POST",
      body: {
        question,
        documentId,
      },
    });
    return knowledge;
  } catch (error) {
    console.error("Error fetching knowledge:", error);
    return null;
  }
};
