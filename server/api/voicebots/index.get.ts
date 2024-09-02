import { listVoicebots } from "~/server/utils/db/voicebots"

export default defineEventHandler(async(event) => {
  const organizationId = (await isOrganizationAdminHandler(event)) as string
  const voiceBotList = await listVoicebots(organizationId)
  return voiceBotList
})