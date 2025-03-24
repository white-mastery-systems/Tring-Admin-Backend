import { defineEventHandler, readBody } from "h3";
import {
  ArraySchema,
  GoogleGenerativeAI,
  SchemaType,
} from "@google/generative-ai";

const getGenAI = () => {
  return new GoogleGenerativeAI(useRuntimeConfig().geminiApiKey);
};

async function generateContentSuggestions(industry: string) {
  const genAI = getGenAI();

  // Define the response schema to ensure properly structured output
  const schema: ArraySchema = {
    description: `Document content suggestions for ${industry} industry`,
    type: SchemaType.ARRAY,
    items: {
      type: SchemaType.OBJECT,
      properties: {
        title: {
          type: SchemaType.STRING,
          description: "Title of the document",
          nullable: false,
        },
        content: {
          type: SchemaType.STRING,
          description: "Brief description or summary of the document content",
          nullable: false,
        },
      },
      required: ["title", "content"],
    },
  };

  // Get the generative model with schema configuration
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash-002",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: schema,
      temperature: 1,
    },
  });

  // Create prompt for content generation
  const prompt = `
    Generate **3 distinct, professionally written content suggestions** for a comprehensive company overview document tailored to the **${industry}** sector. Follow these instructions *strictly*:  

    ---

    ### **Requirements**:  
    1. **Structure**: Each suggestion must include *all* of the following sections (minimum **1,000 words total per document**):  
      - **1. Company Overview**: Mission, vision, core values, and brief history (150–200 words).  
      - **2. Core Services/Products**: Detailed descriptions, use cases, and benefits (200–250 words).  
      - **3. Industry Expertise**: Specialized knowledge, certifications, case studies, and sector-specific challenges addressed (200–250 words).  
      - **4. Why Choose Us?**: 3–5 unique selling propositions (USPs), client testimonials, awards, or recognitions (150–200 words).  
      - **5. Engagement & Partnership Models**: Customizable service tiers, collaboration frameworks (e.g., subscriptions, bespoke projects), and SLAs (150–200 words).  
      - **6. Contact Us**: Placeholders for address, phone, email, website, and social media links (50–100 words).  

    2. **Customization**:  
      - Replace *all* instances of **[Industry]** with the exact **${industry}** name.  
      - Align content with the sector’s trends, regulations, and innovations (e.g., AI in healthcare, sustainability in manufacturing).  

    3. **Diversity**:  
      - Each suggestion must focus on a **unique theme** (e.g., *innovation-driven*, *client-centric*, *sustainability-focused*).  
      - Vary section emphasis (e.g., highlight R&D in one, customer success stories in another).  

    4. **Tone**: Formal, persuasive, and authoritative, targeting B2B clients or investors.  

    5. **Formatting**:  
      - Use **bold headings** for sections.  
      - Avoid markdown beyond headings.  
      - Include **[placeholder brackets]** for company-specific details (e.g., *[Company Name]*).  
    `;

  const result = await model.generateContent(prompt);
  return JSON.parse(result.response.text());
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    if (!body.industry) {
      return {
        statusCode: 400,
        body: { error: "Industry parameter is required" },
      };
    }

    // Generate content suggestions
    const contentSuggestions = await generateContentSuggestions(body.industry);

    return {
      industry: body.industry,
      suggestions: contentSuggestions,
    };
  } catch (error) {
    console.error("API error:", error);
    return {
      statusCode: 500,
      body: { error: "Failed to generate content suggestions" },
    };
  }
});
