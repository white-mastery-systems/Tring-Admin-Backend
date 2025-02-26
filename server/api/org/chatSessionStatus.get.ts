export default defineEventHandler(async (event) => {
  const query = await isValidQueryHandler(event, z.object({
    orgId: z.string()
  }))

  const orgChatSubscription = await getOrgZohoSubscription(query?.orgId, "chat")

  const organizationDetail = await getOrganizationById(query?.orgId)

  return {
    organizationId: orgChatSubscription?.id,
    organizationName: organizationDetail?.name,
    whatsappWalletBalance: organizationDetail?.wallet,
    status: orgChatSubscription?.subscriptionStatus
  }
}) 