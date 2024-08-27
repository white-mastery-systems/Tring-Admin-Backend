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
