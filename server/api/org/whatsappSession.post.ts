import { createOrgWhatsappSession, getOrgWhatsappSessions } from "~/server/utils/db/whatsappSessions";

export default defineEventHandler(async (event) => {
  const body = await isValidBodyHandler(event, z.object({
    organizationId: z.string(),
    pid: z.string(),
    mobile: z.string(),
    countryCode: z.string(),
    integrationId: z.string()
  }))
  const { organizationId } = body
  
  const [orgZohoSubscription, orgDetail, orgPlanUsage] = await Promise.all([
     getOrgZohoSubscription(organizationId, "chat"),
     getOrganizationById(organizationId),
     getOrgPlanUsage(organizationId, "chat")
  ])
  
  let whatsappWalletBalance = orgDetail?.wallet || 0

  if(orgZohoSubscription?.subscriptionStatus !== "active" && whatsappWalletBalance <= 0) {
    return{ status: false, whatsappWalletBalance, organizationName: orgDetail?.name }
  }
 
  const whatsappSessionPrice = parseFloat((1 * 1.5).toFixed(2))
  whatsappWalletBalance = Math.max(0, parseFloat((whatsappWalletBalance - whatsappSessionPrice).toFixed(2)));

  const whatsappSessionExist = await getOrgWhatsappSessions(organizationId, body.pid, body.mobile)

  if (whatsappSessionExist) {
    const createdAt = new Date(whatsappSessionExist.createdAt);
    const now = new Date();
    const hoursDifference = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60); // hours
  
    if (hoursDifference > 2) {
      await createOrgWhatsappSession(body)
      await updateOrganization(organizationId, { wallet: whatsappWalletBalance })
      await updateSubscriptionPlanUsage(
        organizationId,
        { interactionsUsed: (orgPlanUsage?.interactionsUsed || 0) + 1 }
      )
      return { status: true, whatsappWalletBalance, organizationName: orgDetail?.name }
    }
    return { status: true, whatsappWalletBalance, organizationName: orgDetail?.name }
  } else {
    await createOrgWhatsappSession(body)
    await updateOrganization(organizationId, { wallet: whatsappWalletBalance })
    await updateSubscriptionPlanUsage(
      organizationId,
      { interactionsUsed: (orgPlanUsage?.interactionsUsed || 0) + 1 }
    )
    return { status: true, whatsappWalletBalance, organizationName: orgDetail?.name }
  }
})