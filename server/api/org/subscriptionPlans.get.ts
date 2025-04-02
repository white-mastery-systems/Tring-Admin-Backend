import { getOrgPlanUsageByOrgId } from "~/server/utils/v2/db/planUsage"
import { getSubscriptionByOrganizationId } from "~/server/utils/v2/db/zohoSubscription"
import momentTz from "moment-timezone"
import { getAllPricing } from "~/server/utils/db/pricing"

export default defineEventHandler(async (event) => {
  const organizationId = await isOrganizationAdminHandler(event) as string

   const [orgSubscription, orgSubscriptionPlanUsages, pricingPlans] = await Promise.all([
    getSubscriptionByOrganizationId(organizationId),
    getOrgPlanUsageByOrgId(organizationId),
    getAllPricing()
  ]);
  
  const updatedSubscriptions = orgSubscription.map((subscription: any) => {
    const { serviceType, pricingPlanCode, subscriptionStatus, endDate } = subscription;

    const subscriptionPlanUsage = orgSubscriptionPlanUsages.find((usage) => usage.serviceType === serviceType);

    // Determine the correct pricing plan
    const maxPlan = pricingPlans.find((plan) => {
      if (subscriptionPlanUsage?.pricingPlanCode === "chat_free" || subscriptionPlanUsage?.pricingPlanCode === "voice_free") {
        return serviceType === "chat" ? plan.planCode === "chat_free" : plan.planCode === "voice_free";
      }
      if (subscriptionPlanUsage?.originalSubscriptionStatus === "trial") {
        return serviceType === "chat" ? plan.planCode === "chat_intelligence" : plan.planCode === "voice_free";
      }
      return pricingPlanCode === plan.planCode;
    });

    // Compute remaining trial days if in trial
    let remainingDaysForTrialEnd: number | undefined;
    if (subscriptionPlanUsage?.originalSubscriptionStatus === "trial" && endDate) {
      const trialEndDate = momentTz(subscription.endDate, "YYYY-MM-DD").startOf("day");
      const currentDate = momentTz().startOf('day');
      const daysRemaining = trialEndDate.diff(currentDate, "days");
      remainingDaysForTrialEnd = daysRemaining
    }

    return {
      type: serviceType,
      planCode: pricingPlanCode,
      subscriptionStatus,
      maxQuota: maxPlan?.sessions ?? null,
      ...(remainingDaysForTrialEnd !== undefined && { remainingDaysForTrialEnd }) // Only include if trial is active
    };
  });

  return updatedSubscriptions
})