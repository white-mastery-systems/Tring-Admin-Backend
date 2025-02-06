import { createOrgWhatsappSession, getOrgWhatsappSessions } from "~/server/utils/db/whatsappSessions";

export default defineEventHandler(async (event) => {
  const body = await isValidBodyHandler(event, z.object({
    organizationId: z.string(),
    pid: z.string(),
    mobile: z.string(),
    countryCode: z.string(),
    integrationId: z.string()
  }))
  const orgSubscriptionDetail = await getOrgSubscriptionStatus(body.organizationId, "chat")
  let whatsappWalletBalance = orgSubscriptionDetail?.whatsappWallet || 0
  const whatsappSessionPrice = parseFloat((1 * 1.5).toFixed(2))
  whatsappWalletBalance = Math.max(0, parseFloat((whatsappWalletBalance - whatsappSessionPrice).toFixed(2)));

  const whatsappSessionExist = await getOrgWhatsappSessions(body.organizationId, body.pid, body.mobile)

  if (whatsappSessionExist) {
    const createdAt = new Date(whatsappSessionExist.createdAt);
    const now = new Date();
    const hoursDifference = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
  
    if (hoursDifference > 24) {
      // Handle the case where the session is older than 24 hours
      const data = await createOrgWhatsappSession(body)
      await updateOrgWhatsappSessions(body.organizationId, whatsappWalletBalance)
      return data
    }
    return whatsappSessionExist
  } else {
    // Handle the case where the session does not exist
    const data = await createOrgWhatsappSession(body)
    await updateOrgWhatsappSessions(body.organizationId, whatsappWalletBalance)
    return data
  }
})