import { GoogleGenerativeAI } from "@google/generative-ai";

export default defineEventHandler(async (event) => {
  try {
    // await isOrganizationAdminHandler(event);
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
        You are given a list of inadequate message pairs from a USER and an ASSISTANT. Each message includes:
        - "chatId": a unique identifier for the message
        - "role": either "user" or "assistant"
        - "content": the message text
        Messages are in chronological order and have already been filtered to include only assistant responses that fail to properly answer the user's question or request.
        ---
        ### 🎯 YOUR TASK
        Group the given user-assistant message pairs by **precise user intent** — what the user is specifically trying to accomplish.
        🧠 Be highly specific when determining intent:
        - Different goals or actions (e.g., “navigate to a page” vs. “open a modal”) should be separate groups
        - Slightly different requests (e.g., “change button text dynamically” vs. “change button action dynamically”) should be separate
        - If user intent is unclear, group conservatively — prefer smaller, distinct clusters over broad groups
        - Extract only the plain text inside the "response" field from the given JSON. Do not include any other keys or formatting. generate just the clean response string.
        - Remove all instances of "||" from the given text and return the cleaned-up response as plain text.
        Then return a JSON array where each group has:
        - A **descriptive title** summarizing the shared specific intent
        - A list of **message pairs** in this format:
        {
            "chatId": "chatId of the USER message",
            "question": "Exact content of the USER message",
            "response": "Exact content of the failed ASSISTANT reply"
        }
        - A list of **3 improved full assistant responses**, each one complete, helpful, and distinct in tone, depth, or perspective
        ---
        ### 📤 OUTPUT FORMAT
        Return a JSON array like this:
        [{
            "title": "Short, specific title describing the shared user intent",
            "instances": [
            {
                "chatId": "chatId",
                "question": "Exact USER message content",
                "response": "Exact failed ASSISTANT reply"
            }
            // More instances...
            ],
            "suggestions": [
            "Improved assistant response #1 (complete and helpful)",
            "Improved assistant response #2 (different tone or level of detail)",
            "Improved assistant response #3 (alternative approach or added value)"
            ]
        }]
        ---
        ### ❗ STRICT RULES
        - ✅ Use **only the provided message pairs** — do NOT include others
        - ✅ Preserve the exact "chatId", "question", and "response" values
        - ✅ Group by **specific user intent**, not just general themes or similar wording
        - ✅ Split into **smaller, focused groups** if there is any variation in what the user is trying to achieve
        - ✅ Provide 3 **unique, high-quality** assistant responses per group
        - ❌ Do NOT rewrite or paraphrase original messages inside 'instances'
        - ❌ Do NOT return any text outside the JSON array
        - ❌ Do NOT add headers, markdown, or explanations
        ---
        ### 🔄 INPUT FORMAT
        All inadequate messages will be passed in this format:
        ${JSON.stringify(requestBody.conversations)}
        Process only this data and return a **valid structured JSON array**.
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
