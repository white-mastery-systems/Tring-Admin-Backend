import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"

export default defineEventHandler(async (event) => {
  try {
    isOrganizationAdminHandler(event)
    const body = await isValidBodyHandler(event, z.object({
      name: z.string()
    }))
    const response = await createSubAccountInPlivo({ name: body.name })
    return response
  } catch (error: any) {
    logger.error(`Plivo Sub-account API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to create a sub-account in Plivo")
  }
})