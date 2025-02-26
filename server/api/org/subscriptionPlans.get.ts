import { getOrgSubscriptionPlanByOrgId } from "~/server/utils/db/organization"
import { getSubscriptionByOrganizationId } from "~/server/utils/v2/db/zohoSubscription"

export default defineEventHandler(async (event) => {
  const organizationId = await isOrganizationAdminHandler(event) as string

  let orgSubscription: any = await getSubscriptionByOrganizationId(organizationId)

  orgSubscription = orgSubscription.map((i: any) => ({
    type: i.serviceType,
    planCode: i.pricingPlanCode,
    subscriptionStatus: i.pricingPlanCode === "voice_free" ? "inactive" : i.subscriptionStatus 
  }))

  return orgSubscription
})