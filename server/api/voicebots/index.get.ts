import { listVoicebots } from "~/server/utils/db/voicebots"

const zodQueryValidator = z.object({
  active: z.string().optional(),
  q: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional()
})

export default defineEventHandler(async(event) => {
  const organizationId = (await isOrganizationAdminHandler(event)) as string
  const query = await isValidQueryHandler(event, zodQueryValidator)
  const voiceBotList = await listVoicebots(organizationId, query)
  return voiceBotList
})