import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"
import { getContactGroupByName, updateContactGroupById } from "~/server/utils/v2/db/contact-group"

export default defineEventHandler(async (event) => {
  try {
    const organizationId = (await isOrganizationAdminHandler(event)) as string
    const { id: contactGroupId } = await isValidRouteParamHandler(event, checkPayloadId("id"))

    const body = await isValidBodyHandler(event, z.object({
      groupName: z.string().optional(),
      crmId: z.string().optional(),
    }))

    const isAlreadyExists = await getContactGroupByName(body?.groupName!, organizationId, "update", contactGroupId)
    if(isAlreadyExists) return errorResponse(event, 400, "Contact group name already exists")

    const data = await updateContactGroupById(contactGroupId, body)
    
    return data

  } catch (error: any) {
    logger.error(`Update Contact group by id API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to update contact group")
  }
})