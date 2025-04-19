import { getOrgPlanUsageByOrgId } from "~/server/utils/v2/db/planUsage"
import { getSubscriptionByOrganizationId } from "~/server/utils/v2/db/zohoSubscription"
import momentTz from "moment-timezone"
import { getAllPricing } from "~/server/utils/db/pricing"

export default defineEventHandler(async (event) => {
  const organizationId = await isOrganizationAdminHandler(event) as string

   const [adminDetails, orgSubscription, orgSubscriptionPlanUsages, pricingPlans] = await Promise.all([
    getOrganizationById(organizationId),
    getSubscriptionByOrganizationId(organizationId),
    getOrgPlanUsageByOrgId(organizationId),
    getAllPricing()
  ]);
  
  const updatedSubscriptions = await Promise.all(orgSubscription.map(async (subscription: any) => {
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
    const usedQuota = subscriptionPlanUsage?.interactionsUsed || 0
    const maxQuota = maxPlan?.sessions || 0
    const availableQuota = Math.max(maxQuota - usedQuota, 0)

    // Compute remaining trial days if in trial
    let remainingDaysForTrialEnd: number | undefined;
    if (subscriptionPlanUsage?.originalSubscriptionStatus === "trial" || subscriptionPlanUsage?.pricingPlanCode === "chat_free" || subscriptionPlanUsage?.pricingPlanCode === "voice_free") {
      const trialEndDate = subscription.endDate ? momentTz(subscription.endDate, "YYYY-MM-DD").startOf("day") : momentTz(adminDetails?.createdAt).add(14, "days").startOf("day")
      const currentDate = momentTz().startOf('day');
      const daysRemaining = trialEndDate.diff(currentDate, "days");
      remainingDaysForTrialEnd = daysRemaining
    }
    
    let computedStatus = (pricingPlanCode === "chat_free" || pricingPlanCode === "voice_free")
      ? "trial"
      : subscriptionStatus;

    if(subscriptionPlanUsage?.subscriptionStatus !== "active") {
      computedStatus = "inactive"
    }

    if(remainingDaysForTrialEnd !== undefined && remainingDaysForTrialEnd <=0) {
      remainingDaysForTrialEnd = 0
      computedStatus = "inactive"
      await updateOrgZohoSubscription(organizationId, serviceType, { subscriptionStatus: "inactive" })
    }

    return {
      type: serviceType,
      planCode: pricingPlanCode,
      subscriptionStatus: computedStatus,
      availableQuota,
      ...(remainingDaysForTrialEnd !== undefined && remainingDaysForTrialEnd !== 0 && { remainingDaysForTrialEnd }) // Only include if trial is active
    };
  }))

  return updatedSubscriptions
})