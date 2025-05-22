import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"
import { createContactGroup, getContactGroupByName } from "~/server/utils/v2/db/contact-group"

const zodInsertContactGroup = z.object({
  groupName: z.string()
})

export default defineEventHandler(async (event) => {
  try {
    const organizationId = (await isOrganizationAdminHandler(event)) as string
    const body = await isValidBodyHandler(event, zodInsertContactGroup)
    
    const isAlreadyExists = await getContactGroupByName(body?.groupName, organizationId, "insert")
    if(isAlreadyExists) return errorResponse(event, 400, "Contact group name already exists")
      
    const data: any = await createContactGroup({
      ...body,
      organizationId,
    }) 
    
    return data
  } catch (error: any) {
    logger.error(`Create contact group API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to create contact group")
  }
})