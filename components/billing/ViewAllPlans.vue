<template>

  <div v-if="isPageLoading" class="grid h-[80vh] place-items-center text-[#424BD1]">
    <Icon name="svg-spinners:90-ring-with-bg" class="h-20 w-20" />
  </div>
  <Page v-else title="Billing" :description="true" :disableSelector="true" customBackRouter="/Billing"
    :disable-back-button="(currentRoute === 'onboarding/billing')">
    <!-- router.options.history.state.back -->
    <div :class="[
        'grid gap-4 px-2.5 py-0',
        route.query.type === 'voice'
          ? 'xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-3'
          : 'xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-4',
      ]">
      <div :class="[
          'main_card_align field_shadow relative flex flex-col justify-between rounded-[13px] border-2 bg-[#ffffff] p-5 hover:border-yellow-500',
          orgBilling?.plan_code === list.plan_code
            ? 'border-2 border-yellow-500'
            : '',
          'w-full',
        ]" v-for="(list, index) in billingVariationDetails" :key="index">
        <div class="mb-[30px] text-[23px] font-bold text-[#424bd1]">
          {{ list.types }}
        </div>

        <div class="bill-content-align mb-[15px]">
          <div class="amount-align text-[30px] font-black">
            {{ list.amount }}
          </div>
          <div class="px-0 py-[2px] text-[15px] text-[#848199]">
            {{ list.status }}
          </div>
        </div>
        <!-- <div class="text-[30px] font-bold">
          {{ list.types }}
        </div> -->
        <div class="text-[15px] text-[#848199]">
          {{ list.benefitContent }}
        </div>
        <div class="flex min-h-[310px] flex-col items-start justify-start">
          <div class="flex items-center gap-2" v-for="(advancedList, ListIndex) in list.benefitList" :key="ListIndex">
            <span class="flex items-start">
              <TicIcon v-if="advancedList.availableInPlan" />
              <CloseIcon v-else />
              <!-- <img v-if="!list.listBenefit" src="assets\icons\check-circle.svg" width="15" />
              <img v-else src="assets\icons\checked-circle.svg" width="15" /> -->
            </span>
            <span class="min-h-[26px] px-0 py-[2px] text-[15px] text-[#848199]">
              {{ advancedList.content }}
            </span>
          </div>
        </div>
        <UiButton variant="outline"
          class="rounded-lg border border-indigo-700 px-4 py-2 font-semibold text-indigo-800 hover:border-transparent hover:bg-indigo-700 hover:text-white"
          :class="[
            orgBilling?.plan_code === list.plan_code
              ? 'bg-indigo-700 text-white'
              : '',
          ]" @click="choosePlan(list.plan_code)" :disabled="list.plan_code?.includes('chat_free')">
          {{
          orgBilling?.plan_code === list.plan_code ? (orgBilling?.plan_code === 'chat_free') ? "Current Plan" :
          "Subscribed" : findPlanLevel({ list, current: orgBilling?.plan_code })
          }}
        </UiButton>
      </div>
    </div>
  </Page>
  <div v-if="(currentRoute === 'onboarding/billing') && !isPageLoading"
    class="flex items-center justify-end w-[90%] cursor-pointer text-[#8080809c] pt-1">
    <div @click="proceedLogin()" class="flex items-center gap-2">
      <span class="flex items-center">
        Skip
      </span>
      <ArrowRight class="w-5 h-5" />
    </div>
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  layout: "auth",
});

import { useBillingVariation } from '~/composables/billing/useBillingVariation';
import { useUserDetailsComposable } from '~/composables/billing/useDetails';
import { usePlanSelection } from '~/composables/billing/usePlanSelection';
import { useRoute, useRouter } from 'vue-router';
import { usePlanLevel } from "~/composables/billing/usePlanLevel";
import { useBillingComposable } from '~/composables/billing/useBillingComposable';
import { ArrowRight } from 'lucide-vue-next'
import { useFreeTrialPopup } from '~/composables/billing/useFreeTrialPopup';

const props = withDefaults(defineProps<{ onBoardingAccount?: boolean }>(), {
  onBoardingAccount: false, // Default value for accept
});
const router = useRouter();
const route = useRoute();
const { userDetails, fetchUser } = useUserDetailsComposable()
const { fetchOrgBillingPlans } = useFreeTrialPopup()
fetchUser()

const formattedUserDetails = ref(null);

const billingVariationDetails = ref()
const BillingVariationPending = ref(false);
const { orgBilling, isPageLoading } = useBillingComposable();

import { watch, watchEffect } from 'vue';

watch(
  () => userDetails, // Only watching userDetails.value
  async (user) => {
    if (!user) {
      fetchUser();
      return; // Exit if user details are not available
    }

    const { billingVariation, pending } = await useBillingVariation(user.value);

    billingVariationDetails.value = billingVariation.value;
    BillingVariationPending.value = pending.value;
  },
  { immediate: true } // Runs immediately on component mount
);


// Reactive computed property for plan selection
const currentRoute = computed(() => {
  const fullPath = router.options.history.state.current
  if (!fullPath) return '';
  return fullPath.split('/auth/')[1] || '';
});


// Watch for updates to `orgBilling` and update `orgBillingDetails`// );

// Access additional composable methods
// Dynamically compute `usePlanSelection` based on updated values
const planSelection = computed(() => {
  return usePlanSelection((userDetails.value || {}), (orgBilling.value || {}), (route?.query || {}), (props.onBoardingAccount || {}));
});

// Access choosePlan reactively
const choosePlan = computed(() => planSelection.value?.choosePlan || (() => { }));
const { findPlanLevel } = usePlanLevel();

onMounted(() => {
  fetchOrgBillingPlans()
});

const proceedLogin = async () => {
  navigateTo("/signUpSuccess");
};
</script>