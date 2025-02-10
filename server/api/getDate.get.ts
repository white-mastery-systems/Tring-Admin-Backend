import OpenAI from "openai";

export default defineEventHandler(async (event) => {
  // const { id:chatId, siteVisit="false"} = getQuery(event);
  const { id: chatId, siteVisit="false" } = await isValidQueryHandler(event,
    z.object({
      id: z.string(),
      siteVisit: z.string().optional(),
    }),
  );

  if (!chatId) {
    throw createError({ statusCode: 400, statusMessage: "Chat ID is missing. Please include 'chatId' in the request body.",});
  }

  const message = await $fetch(`/api/org/chat/${chatId}/messages`, {
    method: "GET",
    query: { siteVisit, },
    headers: {
      "Content-Type": "application/json",
      "time-zone": Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Kolkata",
    },
  });
 
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const systemMessage = `
      You are a strict assistant whose sole responsibility is to extract the user's site visiting date and time from the provided text. Your answer must follow these instructions exactly:
      1. Your output must be in the following format only:
        Date: [Extracted Date]
        Time: [Extracted Time]

      2. Extraction Guidelines:
      - If the text does not contain a date, return "Not provided" for the Date field.
      - If the text does not contain a time, return "Not provided" for the Time field. 
      - Do not assume or generate a date and time based on the current date and time.  
      - If multiple dates and times are mentioned, always extract the **last mentioned date and time** in the text. .

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
    console.log(`Extracted Date & time: ${JSON.stringify(response)}`);

    const result = response.choices[0].message.content;
    const formattedResult = JSON.stringify(result);

    return { date: extractDate(formattedResult), time: extractTime(formattedResult) };
  } catch (error) {
    throw createError({ statusCode: 500, statusMessage: "Internal Server Error: Unable to process the message with OpenAI. Please try again later.",});
  }
});

function extractDate(input: string) {
  const dateRegex =/\b(?:\d{4}-\d{2}-\d{2}|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2}(?:st|nd|rd|th)?\b)\b/gi;
  const match = input.match(dateRegex);
  return match ? match[0].trim() : null;
}

function extractTime(input: string) {
  const timeRegex =/\b\d{1,2}:\d{2}(?:\s*[APMapm]{2})?\b/;
  const match = input.match(timeRegex);
  return match ? match[0].trim() : null;
}