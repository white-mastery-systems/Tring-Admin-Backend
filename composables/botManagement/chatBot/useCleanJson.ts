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

      // Step 2: Alternative approach - parse the JSON content directly
      try {
        // Try direct parsing first
        return JSON.parse(jsonContent);
      } catch (parseError) {
        // If that fails, try to extract the fields manually
        const industryMatch = jsonContent.match(/"industry"\s*:\s*"([^"]*)"/);
        const contentStartIndex = jsonContent.indexOf('"document_content"') + '"document_content"'.length;

        if (industryMatch && contentStartIndex > 0) {
          // Find the proper end of the document_content (accounting for nested quotes)
          let documentContent = "";
          let inQuote = false;
          let depth = 0;
          let foundColon = false;

          // Skip whitespace and colon after "document_content"
          let i = contentStartIndex;
          while (i < jsonContent.length && !foundColon) {
            if (jsonContent[i] === ':') {
              foundColon = true;
            }
            i++;
          }

          // Skip whitespace after colon
          while (i < jsonContent.length && /\s/.test(jsonContent[i])) {
            i++;
          }

          // If we found a quote, start extracting the content
          if (jsonContent[i] === '"') {
            i++; // Skip the opening quote
            const startPos = i;

            // Extract until we find the closing quote (not escaped)
            while (i < jsonContent.length) {
              if (jsonContent[i] === '\\' && i + 1 < jsonContent.length) {
                i += 2; // Skip escaped character
                continue;
              }

              if (jsonContent[i] === '"' && jsonContent[i - 1] !== '\\') {
                break; // Found the closing quote
              }

              i++;
            }

            documentContent = jsonContent.substring(startPos, i);
          }

          // Reconstruct a clean JSON object
          const industry = industryMatch[1];
          const cleanJson = {
            industry: industry,
            document_content: documentContent
          };

          return cleanJson;
        }

        // If all else fails, throw the original error
        throw parseError;
      }
    } catch (error) {
      console.error("Error in cleanAndParseJson:", error);

      // Log specific character positions around the error for debugging
      if (error instanceof SyntaxError) {
        const message = error.message || '';
        const posMatch = message.match(/position (\d+)/);

        if (posMatch && posMatch[1]) {
          const pos = parseInt(posMatch[1]);
          const start = Math.max(0, pos - 20);
          const end = Math.min(jsonString.length, pos + 20);

          console.error(`Text around error position: '${jsonString.substring(start, pos)}' 💥 '${jsonString.substring(pos, end)}'`);
        }
      }

      toast.error("Error parsing JSON");
      return null;
    }
  };

  return { cleanAndParseJson };
}