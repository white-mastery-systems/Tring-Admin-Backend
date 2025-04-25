import { GoogleGenerativeAI } from "@google/generative-ai";

export default defineEventHandler(async (event) => {
  try {
    await isOrganizationAdminHandler(event);
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
      You will be given a full chat history between a **user** and an **assistant**.
      Your task is to perform the following:
      ---
      ### ✅ TASK 1: Generate a Short Summary (Using the User's Name)
      1. Write a **very short call summary** from the **assistant's perspective**, highlighting the main topics and important details discussed.
      2. If the **user's name** appears anywhere in the chat, extract it and use it **within the summary** (e.g., "Alex asked about...").  
        If no name is found, use **"USER"** as the default in the summary.
      ---
      ### ✅ TASK 2: Identify Inadequate Responses
      Objective: Identify all instances where the assistant's response fails to properly address the user's question.
      Failure Criteria:
        A response is considered a failure if it is:
        - Incomplete: The answer does not fully respond to the user's query.
        - Irrelevant: The answer does not align with the user's question.
        - Evasive: The assistant avoids directly answering the question or provides vague responses.
        - Off-topic: The answer drifts away from the user's original question or context.
        - Too vague or generic: The response is overly general and doesn't provide a specific, useful answer.
        - Repetitive: The response repeats previously provided information without directly answering the user's question.
      Task: Classify and return all messages where the assistant's response does not meet the above criteria. Provide these instances in a list format for further review.
      ---
      ### 📌 RULES for Identifying Failures
      Only include user - assistant message pairs where:
      1. The **user is asking a question** or making a **clear request**  
      2. The **very next message** is from the **assistant**  
      3. The assistant's response **does not fully or correctly address** the user's message
      If there are **no such failures**, return an **empty array** '[]'.  
      If there are failures, return them as an array of message pairs in this format:
      [
        { "role": "user", "content": "..." },
        { "role": "assistant", "content": "..." }
      ]
      ---
      ### 🔄 Input Format:
      The conversation will be provided like this:
      ${JSON.stringify(body.chatHistory)}
      ---
      ### 📤 Output Format:
      Return your final result in this JSON structure:
      {
        "chatSummary": "string",
        "inadequateMessages": [ 
          { "role": "user", "content": "..." },
          { "role": "assistant", "content": "..." }
        ]
      }
      If no inadequate Messages are found, return:
      {
        "chatSummary": "string",
        "inadequateMessages": []
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