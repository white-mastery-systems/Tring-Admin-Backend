import { getIntentByBotIdAndType } from "~/server/utils/db/bot";

const db = useDrizzle();

export default defineEventHandler(async (event) => {
  await isOrganizationAdminHandler(event);

  const { id: botId } = await isValidRouteParamHandler(
    event,
    checkPayloadId("id"),
  );
  const { intentId } = await isValidRouteParamHandler(
    event,
    checkPayloadId("intentId"),
  );

  const intent = await deleteBotIntent(botId, intentId);

  if(!["custom", "schedule_form"].includes(intent?.type!)) {
    const botAllIntentsByType = await getIntentByBotIdAndType(botId, intent?.type!);

    for (let i = 0; i < botAllIntentsByType.length; i++) {
      const newName = `${botAllIntentsByType[i].type}_${i + 1}`;
      await db.update(botIntentSchema)
        .set({ intent: newName })
        .where(eq(botIntentSchema.id, botAllIntentsByType[i].id));
    }
  }
 
  return isValidReturnType(event, intent);
});
