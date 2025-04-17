import { GoogleGenerativeAI } from "@google/generative-ai";

export default defineEventHandler(async (event) => {
  try {
    const requestBody = await readBody(event);

    if (!requestBody.conversations) {
      throw createError({
        statusCode: 400,
        message: "Chat history is required",
      });
    }

    const { geminiApiKey } = useRuntimeConfig();
    if (!geminiApiKey) {
      throw createError({
        statusCode: 500,
        message: "API key is not configured",
      });
    }

    const analysisPrompt = `
      Analyze the following conversation between a USER and an ASSISTANT (bot):

      ${requestBody.conversations}

      1. Group all similar user questions together (questions with the same intent or asking for the same information in different ways)
      2. For each group of similar questions:
        - Create a descriptive title that summarizes the topic/intent
        - Include all instances of the question and corresponding bot responses
        - Generate 3 improved response suggestions that would better address the user's needs

      Return your analysis as a JSON array where each element is an object with the structure:
      [
        {
          "title": "Descriptive title summarizing the question intent",
          "instances": [
            {
              "user_question": "The exact user question text",
              "bot_response": "The exact bot response text"
            },
            // more instances of similar questions...
          ],
          "suggestions": [
            "First improved response suggestion",
            "Second improved response suggestion", 
            "Third improved response suggestion"
          ]
        },
        // more question groups...
      ]

      IMPORTANT GUIDELINES:
      - Group questions by intent, not just by similar wording
      - All instances should include the exact user question and bot response text
      - Each suggestion should be complete, specific, and directly address the user's request
      - Suggestions should be significantly better than the original bot responses
      - Provide varied response options with different approaches or information
      - If the bot's responses are already excellent, suggest further improvements
      - Return ONLY the JSON response, no additional text or explanation
    `;

    const googleGenAI = new GoogleGenerativeAI(geminiApiKey);
    const generativeModel = googleGenAI.getGenerativeModel({
      model: "gemini-1.5-flash-002",
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 1,
      },
    });

    const aiResponse = await generativeModel.generateContent(analysisPrompt);
    return JSON.parse(aiResponse.response.text());
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: error.message,
    });
  }
});
