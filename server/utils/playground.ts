interface Prompt {
  prompt: string;
}

export const createModelConfiguration = (provider: string) => {
  const baseConfig = {
    temperature: 0,
  };
  if (provider === "groq" || provider === "openai") {
    return {
      temperature: 0,
      response_format: { type: "json_object" },
    };
  } else if (provider === "google") {
    return {
      temperature: 0,
      response_mime_type: "application/json",
    };
  }
  return baseConfig;
};

export const playgroundRequests = async (
  systemInstructions: string[],
  userQueries: string[],
  provider: string,
  model: string,
) => {
  try {
    const response = await $fetch("/api/playground", {
      method: "POST",
      body: {
        systemInstructions,
        userQueries,
        provider,
        model,
        modelConfig: createModelConfiguration(provider),
      },
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

export const getProviderModels = async (provider: string) => {
  try {
    const response = await $fetch<string[]>(
      `/api/playground/models?provider=${provider}`,
      {
        method: "GET",
      },
    );
    return response;
  } catch (error) {
    return null;
  }
};
