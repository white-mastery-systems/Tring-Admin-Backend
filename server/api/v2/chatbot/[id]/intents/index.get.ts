import { listBotIntents } from "~/server/utils/db/bot";

const getChatBotIntents = z.object({
  id: z.string().uuid(),
});

export default defineEventHandler(async (event) => {
  const organizationId = (await isOrganizationAdminHandler(event)) as string;
  const { id: botId } = await isValidRouteParamHandler(event, getChatBotIntents);

  const data = await listBotIntents(botId);

  const scheduleFormTypes = ["schedule_call", "schedule_appointment", "site_visit"];

  // Group intents by type, special case for schedule_form, and skip 'form' intents
  const grouped = data.reduce((acc: any, curr: any) => {
    // Skip "form" intent
    if (curr.intent === "form") return acc;

    // Group schedule_form intents together
    if (curr.type === "schedule_form" && scheduleFormTypes.includes(curr.intent)) {
      if (!acc["schedule_form"]) acc["schedule_form"] = [];
      acc["schedule_form"].push(curr);
    } else {
      if (!acc[curr.type]) acc[curr.type] = [];
      acc[curr.type].push(curr);
    }

    return acc;
  }, {});

  // List of default intent types (order-preserved), excluding "form" and individual schedule intents
  const defaultIntentsForAllBot = "other\nsite_visit\nschedule_call\nvirtual_tour\nschedule_appointment\nform\nlocation\nimages\nbrochures";

  const splitIntents = defaultIntentsForAllBot
    .split("\n")
    .filter((intent) => 
      intent !== "other" && 
      intent !== "form" && 
      !scheduleFormTypes.includes(intent)
    );

  // ✅ Add combined 'schedule_form' at the end
  splitIntents.push("schedule_form");

  // return grouped

  const defaultIntents = splitIntents.map((type) => {
  const intents = grouped[type] || [];
    return {
      type,
      intents,
      isActive: intents.length === 0
        ? false
        : intents.some((i: any) => i.isActive === true)
          ? true
          : false,
    };
  });
  
  const customIntents = data.filter((item) => item.type === "custom");

  return {
    defaultIntents,
    customIntents
  }
});