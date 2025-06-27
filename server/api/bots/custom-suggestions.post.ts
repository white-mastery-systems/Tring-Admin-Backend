import { GoogleGenerativeAI } from "@google/generative-ai";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    if (!body.industry) {
      throw createError({
        statusCode: 400,
        message: "Industry is required",
      });
    }
    const GEMINI_API_KEY = useRuntimeConfig().geminiApiKey;
    if (!GEMINI_API_KEY) {
      throw createError({
        statusCode: 500,
        message: "API key is not configured",
      });
    }

    const prompt = `
      **Instructions**:

      You are given an industry in the variable ${body.industry}.
      
      **Generate** a JSON object with the following structure, strictly adhering to these rules:

      - The "type" field should be set to the value of ${body.industry} (e.g., "Retail", "Healthcare").
      - The "roles" section should include **3-4 role** specific to the industry:
        - name: The name of the role in this industry.
        - description: A brief description of the role and its responsibilities in this industry.
        - value: Same as the "name" field.
      
      - The "goals" section should include **3-4 goal** relevant to the purpose in this industry:
        - name: The name of the goal.
        - description: A description explaining how this goal aligns with the  purpose in the industry.
        - value: Same as the "description" field.

      - The "custom_form_name" (replacing "custom_form_name" with an appropriate form name for the industry) must:
        - Be a relevant form for the tasks in the industry (e.g., 'registration_form', 'appointment_form', 'enquiry_form').
        - Contain **3-4 fields** using **only** the following types: 'text', 'number', 'email', 'phone', 'date', 'time'.
        - Each field in the array must include:
          - 'type': The field type (e.g., 'text', 'email', etc.).
          - 'label': The display label for the field.
          - 'model': The model key for the form field.
          - 'required': A boolean indicating whether the field is required (set to 'true').
          - 'placeholder': A placeholder text for the field.
          - 'errorMessage': A validation error message for the field if not filled correctly.

      **Output format** (Do **not** include extra fields or comments):

      {
        "type": "${body.industry}",
        "roles": [
          {
            "name": "Role Name",
            "description": "Describe the responsibilities of this role in this industry.",
            "value": "Role Name"
          },...
        ],
        "goals": [
          {
            "name": "Goal Title",
            "description": "Explain how this goal supports the purpose in the industry.",
            "value": "Goal Description"
          }, ...
        ],
        "your_custom_form_name": [
          {
            "type": "text | number | email | phone | date | time",
            "label": "Field Label",
            "model": "fieldModel",
            "required": true,
            "placeholder": "Enter value",
            "errorMessage": "Validation error"
          },
          {
            "type": "text | number | email | phone | date | time",
            "label": "Field Label",
            "model": "fieldModel",
            "required": true,
            "placeholder": "Enter value",
            "errorMessage": "Validation error"
          },...
        ]
      }

      **Do not** include any extra comments or explanations outside of the required JSON structure.
      ---

      ### ✅ Example Output (for "Healthcare" industry):
      {
        "type": "Healthcare",
        "roles": [
          {
            "name": "Patient Support Assistant",
            "description": "Assists patients with booking appointments, answering healthcare queries, and providing reminders for follow-ups.",
            "value": "Patient Support Assistant"
          }
        ],
        "goals": [
          {
            "name": "Increase Appointment Bookings",
            "description": "Ensure that patients can easily book and reschedule their appointments via the chatbot, reducing wait times and improving patient flow.",
            "value": "Ensure that patients can easily book and reschedule their appointments via the chatbot, reducing wait times and improving patient flow."
          }
        ],
        "appointment_form": [
          {
            "type": "text",
            "label": "Full Name",
            "model": "fullName",
            "required": true,
            "placeholder": "Enter your full name",
            "errorMessage": "Name is required"
          },
          {
            "type": "email",
            "label": "Email Address",
            "model": "email",
            "required": true,
            "placeholder": "Enter your email",
            "errorMessage": "Invalid email"
          },
          {
            "type": "date",
            "label": "Preferred Appointment Date",
            "model": "appointmentDate",
            "required": true,
            "placeholder": "Pick a date",
            "errorMessage": "Invalid date"
          }
        ]
      }
    `;

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
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
      message: error.message,
    });
  }
});
