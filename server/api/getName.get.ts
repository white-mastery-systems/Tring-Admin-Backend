import OpenAI from "openai";

const config = useRuntimeConfig()
interface UserInfo {
  name: string | null; // Name can be a string or null if not provided
  email: string;       // Email is a required string
}


export default defineEventHandler(async (event) => {
  const chatId = getQuery(event).id;

  if (!chatId) {
    throw createError({
      statusCode: 400,
      statusMessage:
        "Chat ID is missing. Please include 'chatId' in the request body.",
    });
  }

  const message = await $fetch(`/api/org/chat/${chatId}/messages`);

  const client = new OpenAI({
    apiKey: config.openaiApiKey,
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
    const formattedResult = JSON.stringify(result);

    return extractUserInfo(formattedResult)
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error: Unable to process the message with OpenAI. Please try again later.",
    });
  }
});

function extractUserInfo(input: string): UserInfo {
  const nameMatch = input.match(/Name:\s*(.*?)\s*Email:/);
  const emailMatch = input.match(/Email:\s*([^\\\s]+)/); // Match without trailing backslashes and whitespace

  const name = nameMatch ? nameMatch[1].replace(/\\n/g, '').replace(/^\"|\"$/g, '').trim() : null; // Remove \n and surrounding "
  const email = emailMatch ? emailMatch[1].replace(/\"$/, '').trim() : ''; // Remove trailing "

  return { name, email };
}

