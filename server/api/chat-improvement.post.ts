import { GoogleGenerativeAI } from "@google/generative-ai";

export default defineEventHandler(async (event) => {
  try {
    const requestBody = await readBody(event);

    if (!requestBody.conversations) {
      throw createError({
        statusCode: 400,
        message: "Conversations is required",
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
      You are given a structured multi-turn conversation between a USER and an ASSISTANT. Each message contains:
      - "chatId" — a unique ID for the message  
      - "role" — either "user" or "assistant"  
      - "content" — the message text
      The messages are ordered chronologically.
      ---
      ### YOUR TASK
      You MUST identify every instance where the ASSISTANT **fails to properly respond to a USER question**.
      An assistant response is considered a **failure** if it is:
      - Incomplete  
      - Irrelevant  
      - Evasive  
      - Off-topic  
      - Too vague or generic  
      - A repetition of previous information without answering the actual question
      ---
      ### INSTRUCTIONS (FOLLOW STRICTLY)
      #### 1. **Filter Messages**
      Only include USER messages where the following conditions are true:
      - The USER is asking a question or making a clear request
      - The IMMEDIATE next message is from the ASSISTANT
      - The ASSISTANT's reply does NOT fully or correctly address the user's message
      #### 2. **Group by Intent**
      Group all filtered USER messages by shared **intent** — what the user is trying to accomplish (not just similar wording).
      #### 3. **Format Output**
      For each group, return an object with this exact structure:
      {
        "title": "Short title describing the shared user intent",
        "instances": [
          {
            "chatId": "chatId of the USER message",
            "question": "Exact content of the USER message",
            "response": "Exact content of the failed ASSISTANT reply"
          }
          // More instances...
        ],
        "suggestions": [
          "Improved full assistant response #1",
          "Improved full assistant response #2 (different tone or level of detail)",
          "Improved full assistant response #3 (alternative approach or added value)"
        ]
      }
      You MUST return an array of these objects:
      [
        {
          "title": "...",
          "instances": [...],
          "suggestions": [...]
        },
        ...
      ]
      ---
      ### STRICT RULES (DO NOT VIOLATE)
      - ✅ **Include only USER questions with failed ASSISTANT replies**
      - ✅ **Preserve the exact 'chatId', question text, and response text from input**
      - ✅ **Group by intent, not by how the question is worded**
      - ✅ **Provide 3 unique, helpful, complete response suggestions per group**
      - ❌ **Do NOT include correctly answered questions**
      - ❌ **Do NOT rewrite user questions or bot replies in 'instances'**
      - ❌ **Do NOT include any text outside the JSON array**
      ---
      ### FINAL REQUIREMENT
      Return **only** a valid, properly structured JSON array as described above.  
      **No markdown. No explanations. No commentary. No headers.**
      If you break any formatting or rules, the output will be considered invalid.
      ---
      ### CONVERSATIONS DATA
      ${JSON.stringify(requestBody.conversations)}
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
