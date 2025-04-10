export function useVoiceBotCleanJson() {
  /**
   * Minimal solution to handle JSON with document_content that contains newlines.
   * Specifically targets the format you're having issues with.
   * @param jsonString The raw JSON string with markdown code blocks
   * @returns Parsed JSON object or null if parsing fails
   */
  const cleanAndParseVoiceBotJson = (jsonString: string): any | null => {
    // Handle empty input
    if (!jsonString) {
      return null;
    }

    try {
      // First try standard JSON parsing (for simpler cases)
      return JSON.parse(jsonString);
    } catch (initialError) {
      try {
        // For the specific format with markdown and document_content
        if (jsonString.includes("```json") && jsonString.includes("document_content")) {
          // Extract just the raw content by removing code blocks
          const cleanedJson = jsonString
            .replace(/```json|```/g, '')
            .trim();

          // Extract the industry field
          const industryMatch = cleanedJson.match(/"industry"\s*:\s*"([^"]*)"/);
          const industry = industryMatch ? industryMatch[1] : "";

          // Extract document_content as raw text (everything after the field name)
          const docContentStart = cleanedJson.indexOf('"document_content":');

          if (docContentStart !== -1) {
            // Find where the actual content starts (after colon, whitespace, and opening quote)
            const contentStart = cleanedJson.indexOf(':', docContentStart) + 1;
            let actualStart = contentStart;

            // Skip whitespace
            while (actualStart < cleanedJson.length &&
              /\s/.test(cleanedJson[actualStart])) {
              actualStart++;
            }

            // Skip opening quote if present
            if (cleanedJson[actualStart] === '"') {
              actualStart++;
            }

            // Find where the content ends (before the closing quote and brace)
            let actualEnd = cleanedJson.lastIndexOf('}');

            // If there's a quote before the last brace, use that as the end
            const lastQuote = cleanedJson.lastIndexOf('"');
            if (lastQuote !== -1 && lastQuote < actualEnd) {
              actualEnd = lastQuote;
            }

            // Extract the document content
            const documentContent = cleanedJson.substring(actualStart, actualEnd);

            // Return the constructed object
            return {
              industry: industry,
              document_content: documentContent
            };
          }
        }

        // Remove markdown and try standard parsing again
        const cleanedContent = jsonString
          .replace(/```json|```/g, '')
          .trim();

        return JSON.parse(cleanedContent);
      } catch (error) {
        return null;
      }
    }
  };

  return { cleanAndParseVoiceBotJson };
}