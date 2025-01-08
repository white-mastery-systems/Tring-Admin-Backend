import { getOrgSubscriptionPlanByOrgId } from "~/server/utils/db/organization"

export default defineEventHandler(async (event) => {
  const organizationId = await isOrganizationAdminHandler(event) as string

  let orgSubscription: any = await getOrgSubscriptionPlanByOrgId(organizationId)

  orgSubscription = orgSubscription.map((i: any) => ({
    type: i.botType,
    planCode: i.planCode
  }))

  return orgSubscription
})