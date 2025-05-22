import { orgUsage } from "~/server/utils/v2/db/orgPlanUsage";


export default defineEventHandler(async (event) => {
  const timeZoneHeader = event.node?.req?.headers["time-zone"];
  const timeZone = Array.isArray(timeZoneHeader)
    ? timeZoneHeader[0]
    : timeZoneHeader || "Asia/Kolkata";
  const organizationId = (await isOrganizationAdminHandler(event)) as string;
  const query = await isValidQueryHandler(event, z.object({
    type: z.string().optional(),
    country: z.string().optional()
  }))

  const userCountry = query.country || "India"

  if(query.type) {
    const data = await orgUsage(organizationId, timeZone, query?.type, userCountry)

    return data
  }

  const [ chat, voice ] = await Promise.all([
    orgUsage(organizationId, timeZone, "chat", userCountry),
    orgUsage(organizationId, timeZone, "voice", userCountry)
  ])

  return { 
    billingUsages: {
      chat,
      voice
    }
  }
});
