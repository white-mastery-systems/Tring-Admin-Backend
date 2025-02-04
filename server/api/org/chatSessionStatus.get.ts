import { getOrgSubscriptionStatus } from "~/server/utils/db/organization"

export default defineEventHandler(async (event) => {
  const query = await isValidQueryHandler(event, z.object({
    orgId: z.string()
  }))

  const orgSubscriptionStatus = await getOrgSubscriptionStatus(query.orgId, "chat")

  const organizationDetail = await getOrganizationById(orgSubscriptionStatus?.organizationId!)

  return {
    organizationId: orgSubscriptionStatus?.id,
    organizationName: organizationDetail?.name,
    whatsappWalletBalance: orgSubscriptionStatus?.whatsappWallet,
    status: orgSubscriptionStatus?.status
  }
}) 