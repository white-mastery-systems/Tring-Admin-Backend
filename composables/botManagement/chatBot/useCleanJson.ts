export function useCleanJson() {
  /**
   * Removes Markdown code blocks (```json ... ```) and parses JSON.
   * @param jsonString The raw JSON string with possible Markdown formatting.
   * @returns Parsed JSON object or null if parsing fails.
   */
  const cleanAndParseJson = (jsonString: string): any | null => {
    try {
      // Remove the Markdown block (```json at the start and ``` at the end)
      const cleanedJson = jsonString.replace(/^```json\n|\n```$/g, "");

      // Parse the JSON string into an object
      return JSON.parse(cleanedJson);
    } catch (error) {
      toast.error("Error parsing JSON:", error);
      console.error("Error parsing JSON:", error);
      return null;
    }
  };

  return { cleanAndParseJson };
}
