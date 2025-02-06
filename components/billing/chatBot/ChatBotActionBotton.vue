<template>
  <div class="flex items-center justify-end gap-2">
    <div v-if="query?.type === 'chat'" class="flex items-center justify-between gap-1 cursor-pointer"
      @click="creditBalanceModalState.open = true">
      <div class="flex flex-col items-center gap-1">
        <UiButton
          class="flex items-center justify-center font-regular text-center text-sm gap-1 bg-[#3ea52e33] hover:bg-[#3ea52e33] hover:brightness-100 px-2">
          <span>
            <WhatsappIcon class="text-[#1ABB00] w-6 h-6 md:w-6 md:h-6 lg:w-5 lg:h-5" />
          </span>
          <div class="text-center text-[#000000] text-[4px] lg:text-[12px] hidden lg:flex">
            <span>
              Credits :
            </span>
            <span>
              {{ usageDetails.whatsappWalletBalance ?? 0 }}
            </span>
          </div>
        </UiButton>
        <span class="text-[4px] lg:text-[12px] flex sm:flex lg:hidden">
          WhatsApp Credits
        </span>
      </div>
    </div>
    <NuxtLink :to="{ path: '/billing/view-all', query: { type: query?.type } }"
      class="hover:brighten-50 font-regular items-center rounded-md bg-[#FFBC42] p-2 px-2 text-sm text-[#FFFFFF] hover:bg-[#FFBC42] hidden lg:flex min-w-auto md:min-w-auto lg:min-w-[149px] max-h-[40px]">
      Renew/Change Plan</NuxtLink>
    <div class="flex flex-col items-center justify-center gap-1 lg:hidden">
      <!-- to="/billing/view-all" -->
      <NuxtLink :to="{ path: '/billing/view-all', query: { type: query?.type } }"
        class="hover:brighten-50 font-regular grid items-center rounded-md bg-[#FFBC42] p-2 px-2 text-sm text-[#FFFFFF] hover:bg-[#FFBC42] min-w-auto md:min-w-auto lg:min-w-[149px] max-h-[40px]">
        <component :is="Repeat"></component>
      </NuxtLink>
      <div class="text-[4px]"> Renew/Change Plan </div>
    </div>
    <NuxtLink v-if="!usage?.plan_code?.includes('free') && (userLocationDetails.country === 'IN') && cancelSubscription"
      :to="{ path: '/billing/view-wallet', query: { type: query?.type } }"
      class="hover:brighten-50 font-regular flex items-center rounded-md bg-[#424bd1] p-2 px-2 text-sm text-[#FFFFFF] hover:bg-[#424bd1] hidden lg:flex min-w-[93px] max-h-[40px]">
      Refill Wallet
    </NuxtLink>
    <!-- to="/billing/view-wallet" -->
    <div v-if="!usage?.plan_code?.includes('free') && (userLocationDetails.country === 'IN') && cancelSubscription"
      class="flex flex-col items-center justify-center gap-1 lg:hidden">
      <NuxtLink :to="{ path: '/billing/view-wallet', query: { type: query?.type } }"
        class="hover:brighten-50 font-regular grid items-center rounded-md bg-[#424bd1] p-2 px-2 text-sm text-[#FFFFFF] hover:bg-[#424bd1]">
        <div class="flex flex-col items-center justify-center">
          <component :is="Wallet"></component>
        </div>
      </NuxtLink>
      <div class="text-[4px]"> Refill Wallet </div>
    </div>
    <UiButton v-if="cancelSubscription" variant="destructive" @click="$emit('change')" class="hidden lg:inline">
      Cancel Subscription
    </UiButton>
    <div v-if="cancelSubscription" class="flex flex-col items-center justify-center gap-1 lg:hidden">
      <UiButton variant="destructive" @click="$emit('change')" cass="px-0"
        style="padding-left: 9px; padding-right: 9px">
        <component :is="XCircleIcon"></component>
      </UiButton>
      <div class="text-[4px]">Cancel Subscription</div>
    </div>
    <div>
      <AddWhatsappWalletBalance v-model="creditBalanceModalState" :usageDetails="usageDetails" @success="() => {
        creditBalanceModalState.open = false;
      }" />
    </div>
    <!-- :to="{ path: '/billing/view-wallet', query: { action: 'refill' } }" -->
    <!-- to="/billing/view-wallet" -->
    <!-- :to="{ path: '/billing/view-wallet', query: { type: query?.type } }" -->
    <!-- to="/billing/view-all" -->
    <!-- {{ userDetails.address.country }}
     {{ userLocationDetails.country }} -->
  </div>
</template>
<script setup lang="ts">
import { XCircleIcon, Repeat, Wallet } from "lucide-vue-next";

const props = defineProps({
  usageDetails: Object,
  subscriptionData: Object,
  usage: Object,
  query: Object,
});
const userLocationDetails = ref(await getLocationDetail())
const emit = defineEmits<{ (e: "change"): void }>();
const creditBalanceModalState = ref({ open: false });


const cancelSubscription = computed(() => {
  if (!props.usage.expiry_date) {
    return false; // Return a default value
  }
  const currentDate = new Date();
  const expirationDate = new Date(props.usage.expiry_date);
  // Compare dates (ignoring time)
  const isExpired = (currentDate.setHours(0, 0, 0, 0) <= expirationDate.setHours(0, 0, 0, 0));

  // console.log(usage.expiry_date, 'usage.expiry_date');
  return isExpired;
});
</script>