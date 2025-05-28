import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"
import { createZohoBillingCustomCredit } from "~/server/utils/v2/billing/wallet"
import { createCustomCredit, getAllOrgCustomCredits } from "~/server/utils/v2/db/custom-credits"

export default defineEventHandler(async (event) => {
  try {
    const organizationId = (await isOrganizationAdminHandler(event)) as string

    const organizationDetail = await getOrganizationById(organizationId)
    
    const body = await isValidBodyHandler(event, z.object({
      price: z.number().min(500)
    }))

    const adminConfig = await getAdminConfig()

    const existingOrgCustomCredits = await getAllOrgCustomCredits(organizationId)
    const orgName = organizationDetail?.name!
    const orgShortName = getShortName(orgName)

    const count = existingOrgCustomCredits.length + 1

    const creditName = orgName.length > 5 ? `${orgShortName}_custom_credit_${count}` : `${orgName}_custom_credit_${count}`
   
    const customCredit = {
      "addon_code": creditName,
      "name": creditName,
      "unit_name": "pcs",
      "price_brackets": [
         {  
          "price": body?.price
         }
      ],
      "type": "one_time",
      "applicable_to_all_plans": true,
      "product_id": "1964689000000608003"
    }

    await createZohoBillingCustomCredit(customCredit, adminConfig?.metaData)

    const data = await createCustomCredit({
      creditName,
      price: body?.price,
      organizationId
    })

    return data
    
  } catch (error: any) {
    logger.error(`Zoho Billing - Add custom credits API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to add custom credits")
  }
})


const getShortName = (name: string, maxLength: number = 3) => {
  // Remove special characters and split into words
  const words = name
    .replace(/[^\w\s]/g, "") // remove punctuation like ( ) .
    .split(/\s+/)             // split by spaces
    .filter(Boolean);         // remove empty strings

  // Get the first letter of each word
  const initials = words.map(word => word[0].toUpperCase());

  // Join the first maxLength letters
  return initials.slice(0, maxLength).join("");
}
