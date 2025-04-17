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

    const analysisPrompt = `Analyze the following conversation between a USER and an ASSISTANT (bot):
    
    ${requestBody.conversations}
    
    1. Identify all questions asked by the USER that weren't properly answered by the ASSISTANT
    2. Filter out similar questions (questions asking for the same information in different ways)
    3. For each unique unanswered question, generate 3 possible answer suggestions that would improve the bot's response quality
    
    Return your analysis as a JSON array where each element is an object with the structure:
    [
      {
        "question": "The unanswered question text",
        "suggestions": ["First suggestion", "Second suggestion", "Third suggestion"]
      },
      ...
    ]
    
    IMPORTANT GUIDELINES:
    - Only include actual questions that need answers
    - If a question was answered partially, include it
    - Each suggestion should be complete, helpful, and direct
    - Focus on accuracy and helpfulness in your suggestions
    - If there are no unanswered questions, return an empty array
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
