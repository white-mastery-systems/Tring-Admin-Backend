import { logger } from "~/server/logger";
import countriesData from "~/assets/country-codes.json";
import { createOrgWhatsappSession, getOrgWhatsappSessions } from "~/server/utils/db/whatsappSessions";
import { updateSubscriptionPlanUsageById } from "~/server/utils/v2/db/planUsage";

export default defineEventHandler(async (event) => {
  const body = await isValidBodyHandler(event, z.object({
    organizationId: z.string(),
    pid: z.string(),
    mobile: z.string(),
    countryCode: z.string(),
    integrationId: z.string()
  }))
  try {
    const { organizationId, pid, mobile } = body
    
    const [orgZohoSubscription, orgDetail, orgPlanUsage, adminDetail] = await Promise.all([
       getOrgZohoSubscription(organizationId, "chat"),
       getOrganizationById(organizationId),
       getOrgPlanUsage(organizationId, "chat"),
       getAdminByOrgId(organizationId)
    ])
    const adminCountry = adminDetail?.address?.country || "India"
    const planPricingDetail = await getSubcriptionPlanDetailByPlanCode(orgZohoSubscription?.pricingPlanCode!, adminCountry)
    
    let whatsappWalletBalance = orgDetail?.wallet || 0
    
    const reduceAmount = countriesData.find((item)=> item.dial_code == body.countryCode)?.WhatsappSessionCost || 1.5
   
    if(orgZohoSubscription?.subscriptionStatus !== "active" && whatsappWalletBalance < reduceAmount) {
      return { status: false, whatsappWalletBalance, organizationName: orgDetail?.name, revisited: false }
    }
   
    const whatsappSessionPrice = parseFloat((1 * reduceAmount).toFixed(2));
    whatsappWalletBalance = Math.max(0, parseFloat((whatsappWalletBalance - whatsappSessionPrice).toFixed(2)));
    
    const usedSessions = (orgPlanUsage?.interactionsUsed || 0) + 1 
    const maxSessions = planPricingDetail?.sessions || 0
    
    let totalExtraSessions = orgPlanUsage?.extraInteractionsUsed || 0
    if(usedSessions > maxSessions) {
      const extraWhatsappSessionPrice =  (1 * planPricingDetail?.extraSessionCost!) + reduceAmount
      if(extraWhatsappSessionPrice > whatsappWalletBalance) {
        return { status: false, whatsappWalletBalance, organizationName: orgDetail?.name, revisited: false }
      } else {
        totalExtraSessions = totalExtraSessions + 1
        whatsappWalletBalance = Math.max(0, parseFloat(((orgDetail?.wallet || 0)- extraWhatsappSessionPrice).toFixed(2)));
      }
    }
    const whatsappSessionExist = await getOrgWhatsappSessions(organizationId, pid, mobile)
  
    if (whatsappSessionExist) {
      const createdAt = new Date(whatsappSessionExist.createdAt);
      const now = new Date();
      const hoursDifference = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60); // hours
    
      if (hoursDifference > 2) {
        await Promise.all([
          createOrgWhatsappSession(body),
          updateOrganization(organizationId, { wallet: whatsappWalletBalance }),
          updateSubscriptionPlanUsageById(orgPlanUsage?.id!, {
            interactionsUsed: usedSessions,
            extraInteractionsUsed: totalExtraSessions
          })
        ])
        return { status: true, whatsappWalletBalance, organizationName: orgDetail?.name, revisited: true }
      }
        return { status: true, whatsappWalletBalance, organizationName: orgDetail?.name, revisited: false }
    } else {
      await Promise.all([
        createOrgWhatsappSession(body),
        updateOrganization(organizationId, { wallet: whatsappWalletBalance }),
        updateSubscriptionPlanUsageById(orgPlanUsage?.id!, { 
          interactionsUsed: usedSessions,
          extraInteractionsUsed: totalExtraSessions
        })
      ])
      return { status: true, whatsappWalletBalance, organizationName: orgDetail?.name, revisited: false }
    }
  } catch (error:any) {
    logger.error(`Whatsapp Session Error: ${error?.message}`)
    return { status: true, revisited: false };
  }
})