// composables/useSubscriptionCheck.ts
import { ref, onMounted, watch } from 'vue';
// import { useRoute } from 'vue-router';

export const useSubscriptionCheck = () => {
  // const route = useRoute();
  const isAnyPlanFree = ref(false);

  // const checkSubscription = async () => {
  //   try {
  //     const orgBilling = await $fetch("/api/org/subscriptionPlans");
  //     console.log("Subscription Plans:", orgBilling.subscriptionStatus)
  //     isAnyPlanFree.value = orgBilling.every((plan: any) => plan.planCode.includes("_free"));
  //   } catch (error) {
  //     console.error("Failed to fetch subscription details:", error);
  //   }
  // };
  const checkSubscription = async () => {
    try {
      const orgBilling = await $fetch("/api/org/subscriptionPlans");

      // Check if any plan is free
      const hasFreePlan = orgBilling.some((plan: any) =>
        plan.planCode.includes("_free")
      );
      // Check if all plans are either "inactive" or "cancelled"
      const allInactiveOrCancelled = orgBilling.every(
        (plan: any) =>
          plan.subscriptionStatus === "inactive" || plan.subscriptionStatus === "cancelled"
      );
      // Set isAnyPlanFree based on both conditions
      isAnyPlanFree.value = hasFreePlan || allInactiveOrCancelled;
    } catch (error) {
      console.error("Failed to fetch subscription details:", error);
    }
  };



  onMounted(async () => {
    await checkSubscription();
  });

  // watch(route, async () => {
  //   await checkSubscription();
  // });

  return {
    isAnyPlanFree,
    checkSubscription, // Expose the function
  };
};