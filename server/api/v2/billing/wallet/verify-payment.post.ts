import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"

const zodAddonCreation = z.object({
  hostedpageId: z.string(),
})

export default defineEventHandler(async (event) => {
  try {
    const orgId = (await isOrganizationAdminHandler(event)) as string
    const userId = event.context.user?.id
    if (!userId) {
      return errorResponse(event, 400, "User Not Found: The specified user could not be found. Please check the user ID.")
    }

    const body = await isValidBodyHandler(event, zodAddonCreation)
    const query = await isValidQueryHandler(event, z.object({
      type: z.string().optional()
    }))

    const adminConfig = await getAdminConfig()

    const hostedPageData = await getZohoBillingHostedPageDetails(body.hostedpageId, adminConfig?.metaData)
    let addons =  hostedPageData.data.invoice.sub_total
   
    const existingAddon = await getOrganizationById(orgId)
    updateOrganization(orgId, { wallet: existingAddon?.wallet + addons })

    return { status: "Addon payment Successful" }
  } catch (error: any) {
    logger.error(`Addon verify payent API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to verify the addon payment")
  }
})