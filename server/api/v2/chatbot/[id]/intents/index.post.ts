import { logger } from "~/server/logger";
import { errorResponse } from "~/server/response/error.response";
import { createBotIntent, getIntentByBotIdAndType } from "~/server/utils/db/bot";

const db = useDrizzle()

const intentItemSchema = z.object({
  description: z.string().min(2, "Description too short"),
  link: z.string().url("Invalid URL").min(5, "Link too short").optional(),
  uploads: z.array(z.any()).optional(),
  metadata: z.any().optional(),
  isActive: z.boolean().optional(),
});

export const zodInsertChatBotIntent = z.object({
  type: z.enum([
    "schedule_form", 
    "location",
    "virtual_tour",
    "images",
    "brochures",
    "custom"
  ]),
  intent: z.string().min(2, "Intent too short").optional(),
  intents: z.array(intentItemSchema).optional(),
  description: z.string().optional(),
  link: z.string().url().min(5, "Link too short").optional(),
  metadata: z.record(z.any()).optional(),
  uploads: z.array(z.any()).optional()
}).refine((data) => {
  // Require `link` only when intent is "location" or "virtual_tour"
  if (["location", "virtual_tour"].includes(data.intent)) {
    return !!data.link; 
  }
  return true;
}, {
  message: "Link is required for 'location' and 'virtual_tour' intents",
  path: ["link"],
});

export default defineEventHandler(async (event) => {
  try {
    const organizationId = (await isOrganizationAdminHandler(event)) as string;

    const { id: botId } = await isValidRouteParamHandler(
      event,
      checkPayloadId("id"),
    );

    const body = await isValidBodyHandler(event, zodInsertChatBotIntent);

    // Validate uniqueness if `intent` is provided (single intent flow)
    if (body?.intent) {
      const isAlreadyExists = await db.query.botIntentSchema.findFirst({
        where: and(
          eq(botIntentSchema.botId, botId),
          ilike(botIntentSchema.intent, body?.intent)
        )
      });

      if (isAlreadyExists) {
        return sendError(
          event,
          createError({
            statusCode: 400,
            statusMessage:
              "Intent Name Already Exists: The specified intent name is already in use. Please choose a different name or verify that the intent does not already exist.",
          }),
        );
      }
    }

    let customFields = body?.metadata;
    if (body.type === "custom") {
      customFields = body?.metadata?.fields.map((i: any) => ({
        ...i,
        model: i.label,
        required: true,
        placeholder: i.label.charAt(0).toUpperCase() + i.label.slice(1),
        errorMessage: `Invalid ${i.label}`
      }));
    }

    const existingIntentsOfType = await getIntentByBotIdAndType(botId, body.type);
    let nextIndex = existingIntentsOfType.length + 1;

    let createdIntents = [];

    // ✅ MULTI-INTENT FLOW: Only if not custom
    if (body.type !== "custom" && Array.isArray(body.intents) && body.intents.length > 0) {
      for (const item of body.intents) {
        const intentName = `${body.type}_${nextIndex++}`;

        const newIntent = await createBotIntent({
          type: body.type,
          description: item.description,
          link: item.link,
          intent: intentName,
          metadata: item.metadata,
          uploads: item.uploads,
          botId,
          organizationId
        });

        createdIntents.push(newIntent);
      }

      return isValidReturnType(event, createdIntents);
    }

    // ✅ SINGLE INTENT FLOW (for 'custom' or others without `intents`)
    const intentName = body?.intent ?? `${body.type}_${nextIndex}`;

    const botIntent = await createBotIntent({
      ...body,
      intent: intentName,
      metadata: body.type === "custom" ? { fields: customFields } : body.metadata,
      botId,
      organizationId
    });

    return isValidReturnType(event, botIntent);

  } catch (error: any) {
    logger.error(`Chatbot Intent Creation Error: ${JSON.stringify(error.message)}`);
    return errorResponse(event, 500, "Unable to create intent");
  }
});
