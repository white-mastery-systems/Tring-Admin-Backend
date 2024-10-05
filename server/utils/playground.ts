interface Prompt {
  prompt: string;
}

export const playgroundRequests = async (
  systemInstructions: string[],
  userQueries: string[],
) => {
  try {
    const response = await $fetch("/api/playground", {
      method: "POST",
      body: { systemInstructions, userQueries },
    });
    return response;
  } catch (error) {
    console.error("Error fetching responses:", error);
    return null;
  }
};

export const loadKnowledgeBase = async (
  questions: string[],
  documentId: string,
) => {
  try {
    const knowledge = await $fetch("/api/playground/knowledge", {
      method: "POST",
      body: {
        questions,
        documentId,
      },
    });
    return knowledge;
  } catch (error) {
    console.error("Error fetching knowledge:", error);
    return null;
  }
};

export const getCurrentPrompt = async () => {
  try {
    const currentPrompt = await $fetch<Prompt>("/api/prompt");
    return currentPrompt.prompt;
  } catch (error) {
    console.error("Error retrieving current prompt:", error);
    return null;
  }
};