import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"

const defaultCredits = [
  {
    plan: "wallet_credits_super",
    price: 1000
  },
    {
    plan: "wallet_credits_pro",
    price: 5000,
  },
  {
    plan: "wallet_credits_ultra",
    price: 10000,
  },
  {
    plan: "wallet_credits_supreme",
    price: 20000,
  },
  {
    plan: "wallet_credits_max",
    price: 50000,
  },
];

export default defineEventHandler(async (event) => {
  try {
    const organizationId = (await isOrganizationAdminHandler(event)) as string

    const orgZohoBillingCredits = await getAllOrgCustomCredits(organizationId)
    
    const customCredits = orgZohoBillingCredits.map((i: any) => ({
      plan: i.creditName,
      price: i.price
    }))

    const allCredits = [...defaultCredits, ...customCredits]
    
    return allCredits
  } catch (error: any) {
    logger.error(`Zoho billing - Get All credits API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to get credits")
  }
})