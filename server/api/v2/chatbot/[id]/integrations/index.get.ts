import { listBotIntegrations } from "~/server/utils/db/bot";

const zodQueryValidator = z.object({
  q: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
  type: z.string().optional(),
  crm: z.string().optional(),
});

export default defineEventHandler(async (event) => {
  const organizationId = (await isOrganizationAdminHandler(event)) as string;

  const { id: botId } = await isValidRouteParamHandler(
    event,
    checkPayloadId("id"),
  );
  const query = await isValidQueryHandler(event, zodQueryValidator)

  const botDetail = await getBotDetails(botId)

  let data = await listBotIntegrations(botId, query);

  if(botDetail?.emailRecipients && Array.isArray(botDetail?.emailRecipients) && query.type === "communication") {
    data.push({
      integration: {
        name: "-",
        crm: "email",
        type: "communication",
        emails: botDetail?.emailRecipients,
        status: "active"
      }
    })
  }

  return data
});
