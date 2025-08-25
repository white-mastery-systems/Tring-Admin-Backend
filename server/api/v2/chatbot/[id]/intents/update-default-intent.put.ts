
import { logger } from "~/server/logger";
import { errorResponse } from "~/server/response/error.response";

const db = useDrizzle()

const intentItemSchema = z.object({
  id: z.string().optional(),
  intent: z.string().optional(),
  description: z.string().min(2, "Description too short").optional(),
  link: z.string().url("Invalid URL").min(5, "Link too short").optional(),
  uploads: z.array(z.any()).optional(),
  metadata: z.any().optional(),
  isActive: z.boolean().optional(),
});

const zodIntentUpdate = z.object({
  type: z.string(),
  intents: z.array(intentItemSchema).optional(),
  isActive: z.boolean().optional(),
})

export default defineEventHandler(async (event) => {
  try {
    const organizationId = await isOrganizationAdminHandler(event);
    const { id: botId } = await isValidRouteParamHandler(event, checkPayloadId("id"));
    const body: any = await isValidBodyHandler(event, zodIntentUpdate);

    // ===== Early exit if empty array for non-custom types =====
    if (body.type !== "custom" && body?.type !== "schedule_form" && Array.isArray(body.intents) && body.intents.length === 0) {
      const existing = await getIntentByBotIdAndType(botId, body.type);
      for (const item of existing) {
        await db.delete(botIntentSchema).where(eq(botIntentSchema.id, item.id));
      }
      return true;
    }

    // ===== Handle regular intent updates (for non-custom types) =====
    if (body.type !== "custom" && Array.isArray(body.intents) && body?.type !== "schedule_form") {
      const existing = await getIntentByBotIdAndType(botId, body.type);

      const incomingIds = new Set(body.intents.filter((i: any) => i.id).map((i: any) => i.id));
      const toDelete = existing.filter((e) => !incomingIds.has(e.id));

      // Delete removed intents
      for (const item of toDelete) {
        await db.delete(botIntentSchema).where(eq(botIntentSchema.id, item.id));
      }

      // Re-fetch and reindex existing
      const remaining = await getIntentByBotIdAndType(botId, body.type);

      for (let i = 0; i < remaining.length; i++) {
        const existingItem = remaining[i];
        const update = body.intents.find((i: any) => i.id === existingItem.id);
        const intentName = `${body.type}_${i + 1}`;

        if (update) {
          await db.update(botIntentSchema)
            .set({
              ...update,
              intent: intentName,
              updatedAt: new Date(),
            })
            .where(eq(botIntentSchema.id, existingItem.id));
        }
      }

      // Add new intents
      let nextIndex = remaining.length + 1;
      for (const intent of body.intents) {
        if (!intent.id) {
          const newIntentName = `${body.type}_${nextIndex++}`;
          await createBotIntent({
            ...intent,
            intent: newIntentName,
            botId,
            organizationId,
            type: body.type,
          });
        }
      }

      return true;
    }

    // schedule_form
    if (body.type === "schedule_form") {
      const scheduleForms = await getIntentByBotIdAndType(botId, body.type);

      for (let i = 0; i < scheduleForms.length; i++) {
       const existingItem = scheduleForms[i];
       const update = body.intents.find((i: any) => i.id === existingItem.id);
    
       if (update) {
         await db.update(botIntentSchema)
          .set({
            ...update,
            updatedAt: new Date(),
          })
          .where(eq(botIntentSchema.id, existingItem.id));
       }
      }
       
      const botDetails = await getBotDetails(botId);
      const currentTools = new Set(botDetails?.defaultTools || []);
      const scheduleCallIntent = body.intents.find((j: any) => j.intent === "schedule_call")

      for (const intent of body.intents) {
         const { naturalConversation } = intent.metadata || {};
         if (naturalConversation) {
           currentTools.add(intent.intent);
         } else {
           currentTools.delete(intent.intent);
         }
       }

       await updateBotDetails(botId, { 
        defaultTools: Array.from(currentTools),
        scheduleCallWithVoice: scheduleCallIntent?.metadata?.voicebotId ? true : false,
        voiceBotId:  scheduleCallIntent?.metadata?.voicebotId ?? null
      });
       return true
    }
    

  } catch (error: any) {
    logger.error(`Chatbot update intents API Error: ${JSON.stringify(error.message)}`);
    return errorResponse(event, 500, "Unable to update chatbot intents");
  }
});

