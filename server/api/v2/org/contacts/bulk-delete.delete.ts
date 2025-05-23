import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"
import { deleteBulkContactsByIds } from "~/server/utils/v2/db/contacts"

export default defineEventHandler(async (event) => {
  try {
    await isOrganizationAdminHandler(event)
    const body = await isValidBodyHandler(event, z.object({
     contactIds: z.string().array()
    }))
    
    await deleteBulkContactsByIds(body.contactIds)
 
    return true
  
  } catch (error: any) {
    logger.error(`Contact - Bulk Delete API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to delete contacts")
  }
})