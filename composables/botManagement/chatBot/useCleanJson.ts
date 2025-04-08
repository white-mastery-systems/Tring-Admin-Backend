export function useCleanJson() {
  /**
   * Removes Markdown code blocks (```json ... ```) and parses JSON.
   * @param jsonString The raw JSON string with possible Markdown formatting.
   * @returns Parsed JSON object or null if parsing fails.
   */
  const cleanAndParseJson = (jsonString: string): any | null => {
    try {
      // Handle empty input
      if (!jsonString) {
        return null;
      }

      // Step 1: Extract content between ```json and ```
      let jsonContent = jsonString;

      if (jsonString.includes("```json")) {
        const startMarker = "```json";
        const endMarker = "```";

        const startIndex = jsonString.indexOf(startMarker) + startMarker.length;
        const endIndex = jsonString.lastIndexOf(endMarker);

        if (startIndex > 0 && endIndex > startIndex) {
          jsonContent = jsonString.substring(startIndex, endIndex).trim();
        }
      }

      // Step 2: Parse the JSON content
      return JSON.parse(jsonContent);

    } catch (initialError) {
      console.error("Initial parsing error:", initialError);

      try {
        // Step 3: Handle potential nested structure issues
        // Sometimes JSON might have escaped characters or malformed sections

        // First try to clean any common issues
        const cleanedContent = jsonString
          .replace(/```json|```/g, '') // Remove all markdown code markers
          .trim();

        // Try parsing again with cleaned content
        return JSON.parse(cleanedContent);

      } catch (secondaryError) {
        console.error("Secondary parsing error:", secondaryError);

        // Step 4: Advanced handling for complex cases
        try {
          // Try to extract the structure by handling sections separately
          const brandMatch = /"brand"\s*:\s*\{[^}]*\}/.exec(jsonString);
          const chatbotMatch = /"chatbot"\s*:\s*\{[^}]*\}/.exec(jsonString);
          const knowledgeBaseStart = jsonString.indexOf('"knowledge_base"');

          if (brandMatch && chatbotMatch && knowledgeBaseStart > -1) {
            // Manually reconstruct the JSON
            const reconstructed = `{
              ${brandMatch[0]},
              ${chatbotMatch[0]},
              "knowledge_base": {
                "document_content": ${JSON.stringify(
              extractDocumentContent(jsonString)
            )}
              }
            }`;

            return JSON.parse(reconstructed);
          }

          return null;
        } catch (finalError) {
          console.error("Final parsing attempt failed:", finalError);
          return null;
        }
      }
    }
  };

  /**
   * Helper function to extract document_content from malformed JSON
   */
  const extractDocumentContent = (jsonString: string): string => {
    const contentStartMarker = '"document_content"';
    const startIndex = jsonString.indexOf(contentStartMarker);

    if (startIndex === -1) return "";

    // Find the colon after the marker
    const colonIndex = jsonString.indexOf(':', startIndex);
    if (colonIndex === -1) return "";

    // Find the first non-whitespace character after the colon
    let contentStart = colonIndex + 1;
    while (contentStart < jsonString.length &&
      [' ', '\n', '\t', '\r'].includes(jsonString[contentStart])) {
      contentStart++;
    }

    // Check if content starts with a quote
    const isQuoted = jsonString[contentStart] === '"';
    if (isQuoted) contentStart++;

    // Find the end of the content
    let contentEnd = contentStart;
    let depth = 1; // We're already inside the knowledge_base object

    while (contentEnd < jsonString.length && depth > 0) {
      if (jsonString[contentEnd] === '{') depth++;
      else if (jsonString[contentEnd] === '}') depth--;

      // If we're at quoted content, look for the closing quote
      if (isQuoted && jsonString[contentEnd] === '"' &&
        jsonString[contentEnd - 1] !== '\\') {
        break;
      }

      contentEnd++;
    }

    // Adjust end position if needed
    if (isQuoted) contentEnd--;

    return jsonString.substring(contentStart, contentEnd);
  };

  return { cleanAndParseJson };
}