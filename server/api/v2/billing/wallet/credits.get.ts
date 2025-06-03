import { count } from "drizzle-orm";
import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"
import { inrCreditPriceList, usdCreditPriceList } from "~/server/utils/v2/billing/addonList";


export default defineEventHandler(async (event) => {
  try {
    const organizationId = (await isOrganizationAdminHandler(event)) as string

    const query = await isValidQueryHandler(event, z.object({
      countryCode: z.string().default("IN"),
    }))

    const allCredits = query.countryCode === "IN" ? inrCreditPriceList : usdCreditPriceList
    
    return allCredits
  } catch (error: any) {
    logger.error(`Zoho billing - Get All credits API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to get credits")
  }
})