// composables/useSubscriptionCheck.ts
import { ref, onMounted, watch } from 'vue';
// import { useRoute } from 'vue-router';

export const useSubscriptionCheck = () => {
  // const route = useRoute();
  const isAnyPlanFree = ref(false);
  const subcribed = ref(false);

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
      const walletControl = orgBilling.find((plan: any) => plan.type === "chat");
      const allFreePlan = orgBilling.every((plan: any) => plan.planCode.includes("_free"));
      if (walletControl.subscriptionStatus === "cancelled" || walletControl.subscriptionStatus === "inactive" || walletControl.planCode.includes("_free")) {
        subcribed.value = false;
      } else {
        subcribed.value = true;
      }
      // console.log(allFreePlan, "allFreePlan -- allFreePlan")
      // Check if ALL plans are either inactive or cancelled
      const allPlansInactiveOrCancelled = orgBilling.every(plan =>
        plan.subscriptionStatus === "inactive" ||
        plan.subscriptionStatus === "cancelled"
      );

      if (allFreePlan) {
        isAnyPlanFree.value = true;
      } else {
        isAnyPlanFree.value = allPlansInactiveOrCancelled;
      }

    } catch (error) {
      console.error("Failed to fetch subscription details:", error);
      isAnyPlanFree.value = false;
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
    subcribed,
    checkSubscription, // Expose the function
  };
};