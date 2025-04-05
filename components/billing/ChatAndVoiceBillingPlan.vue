<template>
  <div>
   <div v-if="showLoader" class="grid h-[80vh] place-items-center text-[#424BD1] w-full">
    <Icon name="svg-spinners:90-ring-with-bg" class="h-10 w-10" />
  </div>
    
    <!-- Use v-show instead of v-else to prevent complete DOM removal/rebuild -->
    <div v-else
      class="grid gap-6 w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 transition-opacity duration-2000"
      :class="isPageLoading ? 'opacity-0' : 'opacity-100'"
    >
       <template v-if="!isPageLoading">
         <div v-for="(list, index) in billingVariationDetails" :key="list.plan_code" :class="[
           'relative flex flex-col rounded-xl shadow-md border-2 p-6 transition-all',
           orgBilling?.plan_code === list.plan_code
             ? 'border-indigo-600 border-2 bg-indigo-600'
             : 'border-gray-100 bg-white hover:border-amber-400',
         ]">
           <!-- Plan Title -->
           <h2 class="text-xl font-bold mb-1"
             :class="(orgBilling?.plan_code === list.plan_code) ? 'text-white' : 'text-gray-800'">
             {{ list.types }}
           </h2>
   
           <!-- Plan Purpose -->
           <p class="text-sm mb-4"
             :class="(orgBilling?.plan_code === list.plan_code) ? 'text-indigo-100' : 'text-gray-600'">
              {{ list.status.toLowerCase() }}
           </p>
   
           <!-- Price Section -->
           <div class="mb-6">
             <div class="flex items-baseline">
               <span class="text-3xl font-bold"
                 :class="(orgBilling?.plan_code === list.plan_code) ? 'text-white' : 'text-gray-900'">
                 {{ list.amount }}
               </span>
               <span class="text-sm ml-1"
                 :class="(orgBilling?.plan_code === list.plan_code) ? 'text-indigo-100' : 'text-gray-500'">
                 <span v-if="list.plan_code != 'chat_enterprise'">
                   /month
                 </span>
               </span>
             </div>
           </div>
   
           <!-- Features List with Updated Icons -->
           <div class="flex-grow">
             <div class="space-y-3 mb-6">
               <div v-for="(advancedList, ListIndex) in list.benefitList" :key="ListIndex" class="flex items-center gap-2">
                 <!-- Updated check/x icons using Lucide -->
                 <span class="mt-0.5 flex-shrink-0">
                   <div v-if="advancedList.availableInPlan"
                     class="w-5 h-5 rounded-full bg-[#F0F6FF] flex items-center justify-center">
                     <Check class="h-3 w-3 text-[#424BD1]" />
                   </div>
                   <div v-else class="w-5 h-5 rounded-full bg-[#E5E5E5] flex items-center justify-center">
                     <X class="h-3 w-3 text-[#3D3D3D]" />
                   </div>
                 </span>
                 <span class="text-sm"
                   :class="(orgBilling?.plan_code === list.plan_code) ? 'text-white' : 'text-gray-700'">
                   {{ advancedList.content }}
                 </span>
               </div>
             </div>
           </div>
   
           <!-- Addons Section -->
           <div class="mb-6" v-if="false">
             <h3 class="text-sm font-medium mb-2"
               :class="(orgBilling?.plan_code === list.plan_code) ? 'text-white' : 'text-gray-700'">
               Addons
             </h3>
             <div class="space-y-2">
               <!-- Use fake addon data to match the image -->
               <div class="flex items-center gap-2">
                 <span class="font-medium"
                   :class="(orgBilling?.plan_code === list.plan_code) ? 'text-amber-300' : 'text-indigo-600'">+</span>
                 <span class="text-sm"
                   :class="(orgBilling?.plan_code === list.plan_code) ? 'text-indigo-100' : 'text-gray-600'">
                   AI on WhatsApp
                 </span>
               </div>
               <div class="flex items-center gap-2">
                 <span class="font-medium"
                   :class="(orgBilling?.plan_code === list.plan_code) ? 'text-amber-300' : 'text-indigo-600'">+</span>
                 <span class="text-sm"
                   :class="(orgBilling?.plan_code === list.plan_code) ? 'text-indigo-100' : 'text-gray-600'">
                   {{ index === 0 ? 'Upto 200 extra chats' : index === 1 ? 'Upto 1000 extra chats' : 'Unlimited extra chats' }}
                 </span>
               </div>
               <div v-if="index < 2" class="flex items-center gap-2">
                 <span class="font-medium"
                   :class="(orgBilling?.plan_code === list.plan_code) ? 'text-amber-300' : 'text-indigo-600'">+</span>
                 <span class="text-sm"
                   :class="(orgBilling?.plan_code === list.plan_code) ? 'text-indigo-100' : 'text-gray-600'">
                   No Ting AI branding
                 </span>
               </div>
             </div>
           </div>
           
           <UiButton class="w-full py-2 px-4 rounded-lg font-medium transition-colors button_shadow" :class="[
             orgBilling?.plan_code === list.plan_code
               ? 'bg-amber-400 text-white hover:bg-amber-500 border-2 border-amber-400'
               : (list.plan_code?.includes('chat_free') ? 'bg-white text-gray-500 border border-gray-300' : 'bg-white text-[#FFBC42] border border-[#FFBC4280] hover:bg-gray-50'),
             list.plan_code?.includes('chat_free') ? 'opacity-70 cursor-not-allowed' : ''
           ]" @click="choosePlan(list.plan_code)" :disabled="list.plan_code?.includes('chat_free')">
             {{
             orgBilling?.plan_code === list.plan_code ? (orgBilling?.plan_code === 'chat_free') ? "Current Plan" :
             "Subscribed" : findPlanLevel({ list, current: orgBilling?.plan_code })
             }}
           </UiButton>
         </div>
       </template>
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
import { ArrowRight, Check, X } from 'lucide-vue-next'
import { useFreeTrial } from '~/store/freeTrailStore'
import { watch, watchEffect } from 'vue';

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
// const IndianUser = ref(false);
const { billingVariation, pending, isIndianUser } = await useBillingVariation(userDetails, route.query.type);
const showLoader = ref(true);


watch(
  () => route.query.type,
  (newType, oldType) => {
    if (newType !== oldType) {
      // Set isPageLoading and showLoader to true when tab changes
      isPageLoading.value = true;
      showLoader.value = true;
    }
  }
);

watch(
  () => [userDetails.value, route.query.type, isIndianUser.value],
  async ([user, queryType, isIndian]) => {
    // Your existing logic
    if (!userDetails.value) {
      fetchUser();
      // return; // Exit if user details are not available
    }
    billingVariationDetails.value = billingVariation.value;
    BillingVariationPending.value = pending.value;

    isPageLoading.value = false;

    // Keep the loader visible for the entire duration of the transition
    setTimeout(() => {
      showLoader.value = false;
    }, 500); // Match this to your duration-2000 (2 seconds)
  },
  { deep: true, immediate: true }
);

// Reactive computed property for plan selection
const currentRoute = computed(() => {
  const route = router.currentRoute.value;
  const fullPath = route.path; // Get only the path (excluding query params)
  if (!fullPath) return '';

  return fullPath.split('/auth/')[1] || '';
});


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
  // }
});
</script>

<!-- No additional styles needed as we're using Tailwind classes directly -->