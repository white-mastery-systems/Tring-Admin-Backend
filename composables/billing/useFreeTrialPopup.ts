// ~/composables/useFreeTrialPopup.ts
import { inject, ref } from 'vue';

export function useFreeTrialPopup() {
  const freeTrialPopup = inject('freeTrialPopup');
  const orgBilling = ref<any[]>([]);

  const fetchOrgBillingPlans = async () => {
    try {
      orgBilling.value = await $fetch("/api/org/subscriptionPlans");
      checkIfAnyPlanIsFree();
    } catch (error) {
      console.error("Error fetching subscription plans:", error);
    }
  };

  const checkIfAnyPlanIsFree = () => {
    const isAnyPlanFree = orgBilling.value.every((plan) => plan.planCode.includes("_free"));
    if (isAnyPlanFree) {
      freeTrialPopup.value.planFree = true;
    } else {
      freeTrialPopup.value.planFree = false;
    }
  };

  return { fetchOrgBillingPlans };
}
