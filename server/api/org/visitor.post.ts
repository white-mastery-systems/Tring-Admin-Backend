import { logger } from "~/server/logger"
import { createOrgVisitors, getOrgVisitor, updateOrgVisitor } from "~/server/utils/db/organization"

export default defineEventHandler(async (event) => {
  const body = await isValidBodyHandler(event, z.object({
    organizationId: z.string(),
    visitorId: z.string()
  }))

  logger.info(`Visitor API - Create or Update Visitor: ${JSON.stringify(body)}`)

  const isAlreadyExist = await getOrgVisitor(body.organizationId, body.visitorId)
  const data = isAlreadyExist
      ? await updateOrgVisitor(body.visitorId)
      : await createOrgVisitors(body)
 
  return isValidReturnType(event, data)
})