import { listVoicebots } from "~/server/utils/db/voicebots"

const zodQueryValidator = z.object({
  active: z.string().optional(),
  q: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional()
})

export default defineEventHandler(async(event) => {
  const timeZoneHeader = event.node?.req?.headers["time-zone"];
  const timeZone = Array.isArray(timeZoneHeader) ? timeZoneHeader[0] : timeZoneHeader || "Asia/Kolkata";
  const organizationId = (await isOrganizationAdminHandler(event)) as string
  const query = await isValidQueryHandler(event, zodQueryValidator)
  const voiceBotList = await listVoicebots(organizationId, query, timeZone)
  return voiceBotList
})