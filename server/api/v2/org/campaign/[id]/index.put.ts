import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"
import { updateNewCampaignById } from "~/server/utils/v2/db/campaign"

export default defineEventHandler(async (event) => {
  try {
    await isOrganizationAdminHandler(event)
    const { id: campaignId } = await isValidRouteParamHandler(event, checkPayloadId("id"))

    const body = await isValidBodyHandler(event, z.object({
      campaignName: z.string()
    }))

    const data = await updateNewCampaignById(campaignId, body)

    return data
  } catch (error: any) {
    logger.error(`Campaign update API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to update campaign")
  }
})