<template>
  <div class="relative h-full">
    <!-- Loading spinner -->
    <!-- <div v-if="isPageLoading" class="grid place-items-center text-[#424BD1] w-full sm-w-full md:min-w-[900px] absolute top-0 left-0 right-0 z-50">
      <Icon name="svg-spinners:90-ring-with-bg" class="h-10 w-10" />
    </div> -->
    
    <!-- Main content with gradient background -->
    <div class="absolute inset-0 bg-gradient-to-br from-yellow-50 via-pink-50 to-blue-50 -z-10"></div>
    
    <!-- Grid background image -->
    <div class="absolute inset-0 z-0 flex items-center justify-center w-[50%]">
      <img src="assets/icons/Line-grid-Black.png" alt="grid background" class="w-[50%] h-full object-cover opacity-5" />
    </div>
    
    <div class="relative z-10 p-8">
      <!-- Title Section -->
      <div class="text-center mb-8">
        <h1 class="text-2xl md:text-3xl font-bold text-gray-800">
          Start your <span class="text-indigo-600">14 Days Free Trial Now</span>
          <span class="text-amber-400 inline-block relative pl-4" style="top: -10px">
            <img src="assets/icons/Star-Yellow.svg" alt="star" class="w-8 h-8" />
          </span>
        </h1>
        
        <p class="text-[#333333] mt-2 text-[20px] font-semibold">
          No payment required, and you'll only be charged if you choose to<br>
          continue after end of trial period
        </p>
      </div>

      <!-- Card Container -->
      <div :class="[
        'grid gap-6 w-full max-w-6xl mx-auto',
        route.query.type === 'voice'
          ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          : (props.onBoardingAccount) ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-3',
      ]">
        <!-- Card for each billing plan -->
        <div 
          v-for="(list, index) in billingVariationDetails" 
          :key="index"
          :class="[
            'relative flex flex-col rounded-xl shadow-md border-2 p-6 transition-all',
            orgBilling?.plan_code === list.plan_code
              ? 'border-indigo-600 border-2 bg-indigo-600'
              : 'border-gray-100 bg-white hover:border-amber-400',
          ]"
        >
          <!-- Plan Title -->
          <h2 class="text-xl font-bold mb-1" :class="(orgBilling?.plan_code === list.plan_code) ? 'text-white' : 'text-gray-800'">
            {{ list.types }}
          </h2>
          
          <!-- Plan Purpose -->
          <p class="text-sm mb-4" :class="(orgBilling?.plan_code === list.plan_code) ? 'text-indigo-100' : 'text-gray-600'">
            for {{ list.status.toLowerCase() }}
          </p>
          
          <!-- Price Section -->
          <div class="mb-6">
            <div class="flex items-baseline">
              <span class="text-3xl font-bold" :class="(orgBilling?.plan_code === list.plan_code) ? 'text-white' : 'text-gray-900'">
                {{ list.amount }}
              </span>
              <span class="text-sm ml-1" :class="(orgBilling?.plan_code === list.plan_code) ? 'text-indigo-100' : 'text-gray-500'">
                /month
              </span>
            </div>
            <button 
              class="text-sm font-medium mt-1" 
              :class="(orgBilling?.plan_code === list.plan_code) ? 'text-amber-300 hover:text-amber-200' : 'text-indigo-600 hover:text-indigo-700'"
              @click="choosePlan(list.plan_code)"
            >
              Calculate your price
            </button>
          </div>
          
          <!-- Features List with Updated Icons -->
          <div class="flex-grow">
            <div class="space-y-3 mb-6">
              <div 
                v-for="(advancedList, ListIndex) in list.benefitList" 
                :key="ListIndex"
                class="flex items-center gap-2"
              >
                <!-- Updated check/x icons using Lucide -->
                <span class="mt-0.5 flex-shrink-0">
                  <div v-if="advancedList.availableInPlan" class="w-5 h-5 rounded-full bg-[#F0F6FF] flex items-center justify-center">
                    <Check class="h-3 w-3 text-[#424BD1]" />
                  </div>
                  <div v-else class="w-5 h-5 rounded-full bg-[#E5E5E5] flex items-center justify-center">
                    <X class="h-3 w-3 text-[#3D3D3D]" />
                  </div>
                </span>
                <span class="text-sm" :class="(orgBilling?.plan_code === list.plan_code) ? 'text-white' : 'text-gray-700'">
                  {{ advancedList.content }}
                </span>
              </div>
            </div>
          </div>
          
          <!-- Addons Section -->
          <div class="mb-6" v-if="false">
            <h3 class="text-sm font-medium mb-2" :class="(orgBilling?.plan_code === list.plan_code) ? 'text-white' : 'text-gray-700'">
              Addons
            </h3>
            <div class="space-y-2">
              <!-- Use fake addon data to match the image -->
              <div class="flex items-center gap-2">
                <span class="font-medium" :class="(orgBilling?.plan_code === list.plan_code) ? 'text-amber-300' : 'text-indigo-600'">+</span>
                <span class="text-sm" :class="(orgBilling?.plan_code === list.plan_code) ? 'text-indigo-100' : 'text-gray-600'">
                  AI on WhatsApp
                </span>
              </div>
              <div class="flex items-center gap-2">
                <span class="font-medium" :class="(orgBilling?.plan_code === list.plan_code) ? 'text-amber-300' : 'text-indigo-600'">+</span>
                <span class="text-sm" :class="(orgBilling?.plan_code === list.plan_code) ? 'text-indigo-100' : 'text-gray-600'">
                  {{ index === 0 ? 'Upto 200 extra chats' : index === 1 ? 'Upto 1000 extra chats' : 'Unlimited extra chats' }}
                </span>
              </div>
              <div v-if="index < 2" class="flex items-center gap-2">
                <span class="font-medium" :class="(orgBilling?.plan_code === list.plan_code) ? 'text-amber-300' : 'text-indigo-600'">+</span>
                <span class="text-sm" :class="(orgBilling?.plan_code === list.plan_code) ? 'text-indigo-100' : 'text-gray-600'">
                  No Ting AI branding
                </span>
              </div>
            </div>
          </div>
          
          <!-- CTA Button -->
          <button
            class="w-full py-2 px-4 rounded-lg font-medium transition-colors button_shadow"
            :class="[
              orgBilling?.plan_code === list.plan_code
                ? 'bg-amber-400 text-white hover:bg-amber-500 border-2 border-amber-400'
                : (list.plan_code?.includes('chat_free') ? 'bg-white text-gray-500 border border-gray-300' : 'bg-white text-[#FFBC42] border border-[#FFBC4280] hover:bg-gray-50'),
              list.plan_code?.includes('chat_free') ? 'opacity-70 cursor-not-allowed' : ''
            ]"
            @click="chooseFreeTrialPlan(list.plan_code)"
            :disabled="list.plan_code?.includes('chat_free')"
          >
          <!-- Start free trial -->
            {{
              orgBilling?.plan_code === list.plan_code 
                ? (orgBilling?.plan_code === 'chat_free' ? "Current Plan" : "Subscribed") 
                : (index === 2 ? "Contact sales" : "Start free trial")
            }}
          </button>
        </div>
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
import { ArrowRight, Check, X } from 'lucide-vue-next';
import { useFreeTrial } from '~/store/freeTrailStore';

const props = withDefaults(defineProps<{ onBoardingAccount?: boolean }>(), {
  onBoardingAccount: false, // Default value for accept
});
const correctedUrl = ref('');
const router = useRouter();
const route = useRoute();
const freeTrialPopup = useFreeTrial();
const { userDetails, fetchUser } = useUserDetailsComposable();
const config = useRuntimeConfig();
const strokeBlackColor = ref("#18181b");
const strokeWhiteColor = ref("#ffffff");
const billingVariationDetails = ref();
const BillingVariationPending = ref(false);
const indianUser = ref(false);
const { orgBilling, organization, isPageLoading } = useBillingComposable();

import { watch, watchEffect } from 'vue';

const { billingVariation, userLocationDetails, isIndianUser, pending, error } = useBillingVariation(userDetails, route.query.type);

// 2. Then use watch to react to changes:
watch(
  () => [userDetails.value, route.query.type, isIndianUser.value],
  ([user, queryType, isIndian]) => {
    if (!userDetails.value) {
      fetchUser();
    }
    console.log(isIndian, "isIndianUser -- isIndianUser", userDetails.value, "userDetails.value -- userDetails.value");
    indianUser.value = isIndian;
    
    if (props.onBoardingAccount) {
      if (queryType === 'chat') {
        billingVariationDetails.value = billingVariation.value.slice(1);
      } else {
        billingVariationDetails.value = billingVariation.value;
      }
    } else {
      billingVariationDetails.value = billingVariation.value;
    }
    
    BillingVariationPending.value = pending.value;
  },
  { deep: true, immediate: true }
);

// watch(
//   () => [userDetails.value, route.query.type], // Watching both userDetails and queryType
//   async ([user]) => {
//     if (!user) {
//       fetchUser();
//       // return; // Exit if user details are not available
//     }
//     const { billingVariation, userLocationDetails,isIndianUser, pending } = await useBillingVariation(user, route.query.type);
//     console.log(isIndianUser.value, "isIndianUser -- isIndianUser")
//     indianUser.value = isIndianUser.value;
//     if (props.onBoardingAccount) {
//       if (route.query.type === 'chat') { 
//         billingVariationDetails.value = billingVariation.value.slice(1);
//       } else {
//         billingVariationDetails.value = billingVariation.value;
//       }
//     } else {
//       billingVariationDetails.value = billingVariation.value;
//     }
//     BillingVariationPending.value = pending.value;
//   },
//   { deep: true, immediate: true } // Runs immediately on component mount
// );

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

onMounted(async() => {
  await fetchUser();
  if (!route.query.type) { // If `type` is not present in the query
    router.push({ query: { type: 'chat' } });
  }
});

const proceedLogin = async () => {
  navigateTo("/signUpSuccess");
};
// userDetails.value
// const isIndianUser = computed(() => {
//     return userDetails.value?.countryCode === "+91" && userLocationDetails.value?.country === "IN";
//   });

// const config = useRuntimeConfig();

const chooseFreeTrialPlan = async (plan: string) => {
  if (!userDetails.value) {
    await fetchUser();
  }
  console.log(plan, "plan -- plan", indianUser.value, 'isIndianUser.value -- isIndianUser.value', isIndianUser.value);
  console.log(config.public.zohoIndianChatSubscription, "config.public -- config.public", userDetails.value, "userDetails.value  --- userDetails.value")
  const encodedName = encodeURIComponent(userDetails.value.username);
  const encodedEmail = encodeURIComponent(userDetails.value.email);
  console.log('tummy --- -asdsa')
console.log(encodedName, "encodedName -- encodedName")
  // Get URLs from runtime config
  // const urls = {
  //   indian: {
  //     chat: config.public.zohoIndianChatSubscription,
  //     voiceFluent: config.public.zohoIndianVoiceFluentSubscription,
  //     voiceLucid: config.public.zohoIndianVoiceLucidSubscription,
  //     contactUs: config.public.contactUsUrl
  //   },
  //   international: {
  //     chat: config.public.zohoInternationalChatSubscription,
  //     voiceFluent: config.public.zohoInternationalVoiceFluentSubscription,
  //     voiceLucid: config.public.zohoInternationalVoiceLucidSubscription,
  //     contactUs: config.public.contactUsUrl
  //   }
  // };
  // console.log(urls, 'urls -- urls', isIndianUser.value, "isIndianUser.value -- isIndianUser.value");
  if (isIndianUser.value) {
    console.log("isIndianUser.value -- isIndianUser.value inside --- inside");
    if (plan === 'chat_intelligence' || plan === 'chat_super_intelligence') {
      return navigateTo(`${config.public.zohoIndianChatSubscription}/chat_intelligence?first_name=${encodedName}&email=${encodedEmail}`, {
        external: true,
        open: { target: '_blank' },
      });
    }
    if (plan === 'chat_enterprise') {
      return navigateTo(config.public.contactUsUrl, {
        external: true,
        open: { target: '_blank' },
      });
    }
    if (plan === 'voice_fluent') {
      return navigateTo(`${config.public.zohoIndianVoiceFluentSubscription}/voice_fluent?first_name=${encodedName}&email=${encodedEmail}`, {
        external: true,
        open: { target: '_blank' },
      });
    }
    if (plan === 'voice_lucid') {
      return navigateTo(`${config.public.zohoIndianVoiceLucidSubscription}/voice_lucid?first_name=${encodedName}&email=${encodedEmail}`, {
        external: true,
        open: { target: '_blank' },
      });
    }
  } else {
    if (plan === 'chat_intelligence' || plan === 'chat_super_intelligence') {
      return navigateTo(`${config.public.zohoInternationalChatSubscription}/chat_intelligence?first_name=${encodedName}&email=${encodedEmail}`, {
        external: true,
        open: { target: '_blank' },
      });
    }
    if (plan === 'chat_enterprise') {
      return navigateTo(config.public.contactUsUrl, {
        external: true,
        open: { target: '_blank' },
      });
    }
    if (plan === 'voice_fluent') {
      return navigateTo(`${config.public.zohoInternationalVoiceFluentSubscription}/voice_fluent?first_name=${encodedName}&email=${encodedEmail}`, {
        external: true,
        open: { target: '_blank' },
      });
    }
    if (plan === 'voice_lucid') {
      return navigateTo(`${config.public.zohoInternationalVoiceLucidSubscription}/voice_lucid?first_name=${encodedName}&email=${encodedEmail}`, {
        external: true,
        open: { target: '_blank' },
      });
    }
  }

  // Add a return statement for other cases
  return null;
};
</script>