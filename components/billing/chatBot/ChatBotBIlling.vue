<template>
  <div
    class="px-2 sm:px-2 md:px-0 mb-[120px] mt-4 w-full self-center rounded-lg bg-[#fffff] shadow-3xl sm:mb-[120px] md:mb-0 lg:mb-0 xl:mb-0">
    <div
      class="flex items-center justify-between rounded-t-xl border-b-[1px] border-[#80808036] px-[5px] py-5 text-[18px] font-bold sm:px-[5px] md:px-[30px] lg:px-[30px] xl:px-[30px]">
      <span> Subscription Details </span>
    </div>
    <div>
      <div
        class="flex items-center justify-between gap-3 px-[5px] py-5 sm:px-[5px] md:px-[30px] lg:px-[30px] xl:px-[30px]">
        <span class="font-medium"> Current plan </span>
        <div class="flex min-w-[80px] items-center justify-start">
          <span class="rounded-[11px] bg-[#d9dbe6] px-2.5 py-[3px] text-[12px] font-medium capitalize text-[#00000080]">
            {{ usageDetails?.currentPlan?.replaceAll("_", " ")?.replace("chat", "") }}
          </span>
        </div>
      </div>
      <div
        class="flex items-center justify-between gap-3 px-[5px] py-5 font-medium sm:px-[5px] md:px-[30px] lg:px-[30px] xl:px-[30px]">
        <span> Subscription status </span>
        <div class="flex min-w-[80px] items-center justify-start">
          <span :class="{
            'bg-[#ECFDF3] text-[#027A48]': usageDetails?.subscriptionStatus === 'active',
            'bg-[#FFF6ED] text-[#E04F16]': usageDetails?.subscriptionStatus === 'inactive',
            'bg-[#EFF8FF] text-[#1093DE]': usageDetails?.subscriptionStatus === 'trial',
            'bg-[#FEE4E2] text-[#D92D20]': usageDetails?.subscriptionStatus === 'cancelled'
          }" class="rounded-[11px] px-2.5 py-[3px] text-[12px] capitalize">
            {{ usageDetails?.subscriptionStatus }}
          </span>
        </div>
      </div>

      <div
        class="flex items-center justify-between gap-3 px-[5px] py-5 font-medium sm:px-[5px] md:px-[30px] lg:px-[30px] xl:px-[30px]">
        <span> Total chat sessions used </span>
        <span class="flex min-w-[80px] items-center justify-start rounded-xl text-[15px]">
          {{ Number(usageDetails?.chatsUsedInPlan) }}
        </span>
      </div>
      <div
        class="flex items-center justify-between gap-3 rounded-b-lg px-[5px] py-5 font-medium sm:px-[5px] md:px-[30px] lg:px-[30px] xl:px-[30px]">
        <span>Chat sessions included in your plan</span>
        <span class="flex min-w-[80px] items-center justify-start rounded-xl text-[15px]">
          {{ usageDetails?.planSessions }}
        </span>
      </div>

      <div
        class="flex items-center justify-between gap-3 rounded-b-lg px-[5px] py-5 font-medium sm:px-[5px] md:px-[30px] lg:px-[30px] xl:px-[30px]">
        <span> Balance chat sessions available in your plan </span>
        <span class="flex min-w-[80px] items-center justify-start rounded-xl text-[15px]">
          {{ usageDetails?.chatsAvailableInPlan }}
        </span>
      </div>

      <div
        class="flex items-center justify-between gap-3 rounded-b-lg px-[5px] py-5 font-medium sm:px-[5px] md:px-[30px] lg:px-[30px] xl:px-[30px]">
        <span> Extra chat sessions used</span>
        <span class="flex min-w-[80px] items-center justify-start rounded-xl text-[15px]">
          {{ usageDetails?.extraChatsMade }}
        </span>
      </div>
      <!-- toolip for whatsapp session used -->
      <div
        class="flex items-center justify-between gap-3 rounded-b-lg px-[5px] py-5 font-medium sm:px-[5px] md:px-[30px] lg:px-[30px] xl:px-[30px]">
        <div class="flex items-center gap-3">
          <span> WhatsApp sessions used </span>
        </div>
        <span class="flex min-w-[80px] items-center justify-start rounded-xl text-[15px]">
          {{ usageDetails?.whatsappSessions }}
        </span>
      </div>
      <div v-if="usageDetails?.expiryDate"
        class="flex items-center justify-between gap-3 rounded-b-lg px-[5px] py-5 font-medium sm:px-[5px] md:px-[30px] lg:px-[30px] xl:px-[30px]">
        <span> Billing Expiry Date </span>
        <span class="flex min-w-[80px] items-center justify-start rounded-xl text-[15px]">
          {{ format(new Date(usageDetails?.expiryDate), "MMMM d, yyyy") }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { format } from "date-fns";

const props = defineProps({
  usageDetails: Object,
  subscriptionData: Object,
  usage: Object,
});
</script>
