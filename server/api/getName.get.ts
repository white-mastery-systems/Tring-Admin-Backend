import OpenAI from "openai";

export default defineEventHandler(async (event) => {
  const chatId = getQuery(event).id;

  if (!chatId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Chat ID is required in the request body.",
    });
  }

  const message = await $fetch(`/api/org/chat/${chatId}/messages`);

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const systemMessage = `
      You are an assistant that analyzes text to extract a user's name and email address.
      Always provide the result in the following format:
      Name: Extracted Name
      Email: Extracted Email Address

      If either piece of information is not present, return 'Not provided' for that field.

      Here's the text to analyze:
      ${JSON.stringify(message[0].messages)}
    `;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: systemMessage,
        },
      ],
      max_tokens: 150,
      temperature: 0,
    });
    const result = response.choices[0].message.content;

    return { result };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to process the message with OpenAI.",
    });
  }
});
