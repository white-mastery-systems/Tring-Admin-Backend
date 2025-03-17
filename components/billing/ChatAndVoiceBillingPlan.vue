<template>
  <!-- <div v-if="isPageLoading" class="grid h-[80vh] place-items-center text-[#424BD1] w-full sm-w-full md:min-w-[900px]">
    <Icon name="svg-spinners:90-ring-with-bg" class="h-20 w-20" />
  </div> -->
  <div class="relative">
    <div v-if="isPageLoading" class="grid h-[80vh] place-items-center text-[#424BD1] w-full sm-w-full md:min-w-[900px] absolute top-0 left-0 right-0 z-50">
      <Icon name="svg-spinners:90-ring-with-bg" class="h-10 w-10" />
  </div>
    <div :class="[
      'grid gap-4 px-2.5 py-0 w-full sm-w-full md:min-w-[900px]',
      route.query.type === 'voice'
        ? 'xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-3'
        : (props.onBoardingAccount) ? 'xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-3' : 'xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-4',
    ]">
      <!-- bg-[#18181b] -->
      <!-- (orgBilling?.plan_code === list.plan_code ? strokeWhiteColor : strokeBlackColor) -->
      <div :class="[
        'main_card_align field_shadow relative flex flex-col justify-between rounded-[13px] border-2  p-5 hover:border-yellow-500',
        orgBilling?.plan_code === list.plan_code
          ? 'border-2 border-gray-600 bg-[#18181b] text-[#ffffff]'
          : 'bg-[#ffffff] text-[#18181b]',
        'w-full',
      ]" v-for="(list, index) in billingVariationDetails" :key="index">
        <div class="mb-[20px] text-[23px] font-bold"
          :class="(orgBilling?.plan_code === list.plan_code) ? 'text-[#ffffff]' : 'text-[#18181b]'">
          {{ list.types }}
        </div>

        <div class="bill-content-align mb-[15px]">
          <div class="amount-align text-[30px] font-black">
            {{ list.amount }}
          </div>
          <div class="px-0 py-[2px] text-[15px]">
            {{ list.status }}
          </div>
        </div>
        <!-- <div class="text-[30px] font-bold">
          {{ list.types }}
        </div> -->
        <div class="text-[15px]">
          {{ list.benefitContent }}
        </div>
        <div class="flex min-h-[245px] flex-col items-start justify-start gap-1">
          <div class="flex items-center gap-2" v-for="(advancedList, ListIndex) in list.benefitList" :key="ListIndex">
            <span class="flex items-start">
              <TicIcon :strokeColor="(orgBilling?.plan_code === list.plan_code ? strokeWhiteColor : strokeBlackColor)"
                v-if="advancedList.availableInPlan" />
              <CloseIcon v-else />
              <!-- <img v-if="!list.listBenefit" src="assets\icons\check-circle.svg" width="15" />
              <img v-else src="assets\icons\checked-circle.svg" width="15" /> -->
            </span>
            <span class="min-h-[26px] px-0 py-[2px] text-[15px]">
              {{ advancedList.content }}
            </span>
          </div>
        </div>
        <UiButton variant="outline" class="rounded-lg border border-[#18181b] px-4 py-2 font-semibold text-[#18181b]
          hover:border-transparent hover:opacity-50" :class="[
            orgBilling?.plan_code === list.plan_code
              ? 'text-[#18181b]'
              : '',
          ]" @click="choosePlan(list.plan_code)" :disabled="list.plan_code?.includes('chat_free')">
          <!-- bg-indigo-700 -->
          {{
          orgBilling?.plan_code === list.plan_code ? (orgBilling?.plan_code === 'chat_free') ? "Current Plan" :
          "Subscribed" : findPlanLevel({ list, current: orgBilling?.plan_code })
          }}
        </UiButton>
      </div>
    </div>
    <div v-if="(currentRoute === 'onboarding/billing') && !isPageLoading"
      class="sticky right-[72px] bottom-0 cursor-pointer text-[#8080809c] pt-4 pr-3">
      <div @click="proceedLogin()" class="flex items-center justify-end gap-2">
        <span class="flex items-center">
          Continue with the free plan
        </span>
        <ArrowRight class="w-5 h-5" />
      </div>
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
import { useFreeTrial } from '~/store/freeTrailStore'

const props = withDefaults(defineProps<{ onBoardingAccount?: boolean }>(), {
  onBoardingAccount: false, // Default value for accept
});
const correctedUrl = ref('');
const router = useRouter();
const route = useRoute();
const freeTrialPopup = useFreeTrial()
const { userDetails, fetchUser } = useUserDetailsComposable()
fetchUser()

const strokeBlackColor = ref("#18181b");
const strokeWhiteColor = ref("#ffffff");
const billingVariationDetails = ref()
const BillingVariationPending = ref(false);
const { orgBilling, organization, isPageLoading } = useBillingComposable();

import { watch, watchEffect } from 'vue';

watch(
  () => [userDetails.value, route.query.type], // Watching both userDetails and queryType
  async ([user]) => {
    if (!user) {
      fetchUser();
      // return; // Exit if user details are not available
    }
    const { billingVariation, pending } = await useBillingVariation(user, route.query.type);
    if (props.onBoardingAccount) {
      if (route.query.type === 'chat') { 
        billingVariationDetails.value = billingVariation.value.slice(1)
      } else {
        billingVariationDetails.value = billingVariation.value
      }
    } else {
      billingVariationDetails.value = billingVariation.value;
    }
    BillingVariationPending.value = pending.value;
  },
  { immediate: true } // Runs immediately on component mount
);


// Reactive computed property for plan selection
const currentRoute = computed(() => {
  const route = router.currentRoute.value;
  const fullPath = route.path; // Get only the path (excluding query params)
  if (!fullPath) return '';

  return fullPath.split('/auth/')[1] || '';
});


// Watch for updates to `orgBilling` and update `orgBillingDetails`// );

// Access additional composable methods
// Dynamically compute `usePlanSelection` based on updated values
const planSelection = computed(() => {
  return usePlanSelection((userDetails.value || {}), (orgBilling.value || {}), (organization.value || {}), (route?.query || {}), (props.onBoardingAccount || {}));
});

// Access choosePlan reactively
const choosePlan = computed(() => planSelection.value?.choosePlan || (() => { }));
const { findPlanLevel } = usePlanLevel();

onMounted(() => {
  // if ((route.name !== 'auth-onboarding-billing')) {
    if (!route.query.type) { // If `type` is not present in the query
      router.push({ query: { type: 'chat' } });
    }
    // const currentUrl = router.options.history.state.back || 'billing/view-all';
    // if (!currentUrl.includes('?type=chat') && !currentUrl.includes('?type=voice')) {
    //   correctedUrl.value = `/billing?type=chat`;
    // } else if (currentUrl.includes('?type=voice')) {
    //   correctedUrl.value = `/billing?type=voice`;
    // } else if (currentUrl.includes('?type=chat')) {
    //   correctedUrl.value = `/billing?type=chat`;
    // }
  // }
});
// onMounted(async() => {
//   const orgBilling = await $fetch("/api/org/subscriptionPlans");
//   // const isAnyPlanFree = orgBilling[1].planCode.includes("_free")
//   const isAnyPlanFree = orgBilling.every((plan: any) => plan.planCode.includes("_free"))
//   if (isAnyPlanFree) freeTrialPopup.planFree = true
//   else freeTrialPopup.planFree = false
// });

const proceedLogin = async () => {
  navigateTo("/signUpSuccess");
};
</script>