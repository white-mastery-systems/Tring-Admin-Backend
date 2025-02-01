// composables/useSubscriptionCheck.ts
import { ref, onMounted, watch } from 'vue';
// import { useRoute } from 'vue-router';

export const useSubscriptionCheck = () => {
  // const route = useRoute();
  const isAnyPlanFree = ref(false);

  const checkSubscription = async () => {
    try {
      const orgBilling = await $fetch("/api/org/subscriptionPlans");
      isAnyPlanFree.value = orgBilling.every((plan: any) => plan.planCode.includes("_free"));
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