import { GoogleGenerativeAI } from "@google/generative-ai";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    
    if (!body.chatHistory) {
      throw createError({
        statusCode: 400,
        message: 'Chat history is required'
      });
    }
    const GEMINI_API_KEY = useRuntimeConfig().geminiApiKey;
    if (!GEMINI_API_KEY) {
      throw createError({
        statusCode: 500,
        message: 'API key is not configured'
      });
    }

    const prompt = `    
        You will be provided with a chat history between an assistant and a user. Your task is to generate a very short call summary from the assistant's perspective, capturing the key topics and any important details discussed. Additionally, if the user's name appears anywhere in the chat, extract and return it; otherwise, return "USER". 

        Here is the conversation so far:
        ${JSON.stringify(body.chatHistory)}

        Please provide your output in the following JSON format:
        {
        "chatSummary": string
        }
    `;

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-002",
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 1,
      },
    });

    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text());

  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: error.message
    });
  }
});