<template>
  <div class="relative h-full">
    <!-- Main content with gradient background -->
    <div class="absolute inset-0 bg-gradient-to-br from-yellow-50 via-pink-50 to-blue-50 -z-10"></div>
    
    <!-- Grid background image -->
    <div class="absolute inset-0 z-0 flex items-center justify-center w-[50%]">
      <img src="assets/icons/Line-grid-Black.png" alt="grid background" class="w-[50%] h-full object-cover opacity-5" />
    </div>
    
    <div class="relative z-10 p-4 sm:p-4 md:p-8 bg-gradient-to-br from-yellow-50 via-pink-50 to-blue-50 -z-10">
      <!-- Title Section -->
      <div class="text-center mb-8">
        <h1 class="text-[18px] sm:text-[18px] md:text-[26px] font-bold text-gray-800">
          Start your <span class="text-indigo-600">14 Days Free Trial Now</span>
          <span class="text-amber-400 inline-block relative pl-2" style="top: -10px">
            <img src="assets/icons/Star-Yellow.svg" alt="star" class="w-4 h-4 sm:w-4 sm:h-4 md:w-8 md:h-8 mt-4 sm:mt-4 md:mt-0" />
          </span>
        </h1>
        
        <p class="text-[#333333] mt-2 text-[12px] sm:text-[12px] md:text-[14px] font-semibold">
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
            {{ list.status.toLowerCase() }}
          </p>
          
          <!-- Price Section -->
          <div class="mb-6">
            <div class="flex items-baseline">
              <span class="text-3xl font-bold" :class="(orgBilling?.plan_code === list.plan_code) ? 'text-white' : 'text-gray-900'">
                {{ list.amount }}
              </span>
              <span v-if="list.plan_code != 'chat_enterprise'" class="text-sm ml-1" :class="(orgBilling?.plan_code === list.plan_code) ? 'text-indigo-100' : 'text-gray-500'">
                /month
              </span>
            </div>
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
          <span v-if="index != 2" class="text-xs text-gray-700 pt-4 text-center font-semibold">No upfront cost, charged only if you continue post-trial</span>
          <span v-if="index === 2" class="text-xs  pt-4 text-gray-700 text-center font-semibold">
            Custom needs? Reach out to us.
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "billing-account",
  middleware: "guest-only",
});

import { useBillingVariation } from '~/composables/billing/useBillingVariation';
import { useUserDetailsComposable } from '~/composables/billing/useDetails';
import { useRoute, useRouter } from 'vue-router';
import { useBillingComposable } from '~/composables/billing/useBillingComposable';
import { Check, X } from 'lucide-vue-next';
import { watch } from 'vue';

const props = withDefaults(defineProps<{ onBoardingAccount?: boolean }>(), {
  onBoardingAccount: false, // Default value for accept
});
const router = useRouter();
const route = useRoute();
const { userDetails, fetchUser } = useUserDetailsComposable();
const config = useRuntimeConfig();
const billingVariationDetails = ref();
const BillingVariationPending = ref(false);
const indianUser = ref(false);
const { orgBilling, organization } = useBillingComposable();


const { billingVariation, isIndianUser, pending, error } = useBillingVariation(userDetails, route.query.type);

// 2. Then use watch to react to changes:
watch(
  () => [userDetails.value, route.query.type, isIndianUser.value],
  ([queryType, isIndian]) => {
    if (!userDetails.value) {
      fetchUser();
    }
    indianUser.value = isIndian;
    
    if (props.onBoardingAccount) {
      if (queryType === 'chat') {
        billingVariationDetails.value = billingVariation.value;
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
onMounted(async() => {
  await fetchUser();
  if (!route.query.type) { // If `type` is not present in the query
    router.push({ query: { type: 'chat' } });
  }
});

// const config = useRuntimeConfig();

const chooseFreeTrialPlan = async (plan: string) => {
  if (!userDetails.value) {
    await fetchUser();
  }
  console.log(plan, "plan -- plan", indianUser.value, 'isIndianUser.value -- isIndianUser.value', isIndianUser.value);
  console.log(config.public.zohoIndianChatSubscription, "config.public -- config.public", userDetails.value, "userDetails.value  --- userDetails.value")
  const encodedName = encodeURIComponent(userDetails.value.username);
  const encodedEmail = encodeURIComponent(userDetails.value.email);

  if (isIndianUser.value) {
    if (plan === 'chat_intelligence' || plan === 'chat_super_intelligence') {
      return navigateTo(`${config.public.zohoIndianChatSubscription}/chat_intelligence?first_name=${encodedName}&email=${encodedEmail}`, {
        external: true,
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
      });
    }
    if (plan === 'voice_lucid') {
      return navigateTo(`${config.public.zohoIndianVoiceFluentSubscription}/voice_fluent?first_name=${encodedName}&email=${encodedEmail}`, {
        external: true,
      });
    }
  } else {
    if (plan === 'chat_intelligence' || plan === 'chat_super_intelligence') {
      return navigateTo(`${config.public.zohoInternationalChatSubscription}/chat_intelligence?first_name=${encodedName}&email=${encodedEmail}`, {
        external: true,
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
      });
    }
    if (plan === 'voice_lucid') {
      return navigateTo(`${config.public.zohoInternationalVoiceFluentSubscription}/voice_fluent?first_name=${encodedName}&email=${encodedEmail}`, {
        external: true,
      });
    }
  }

  // Add a return statement for other cases
  return null;
};
</script>