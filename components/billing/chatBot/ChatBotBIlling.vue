<template>
  <div
    class="mb-[120px] mt-4 w-full self-center rounded-lg bg-[#fffff] shadow-3xl sm:mb-[120px] md:mb-0 lg:mb-0 xl:mb-0"
  >
    <div
      class="flex items-center justify-between rounded-t-xl border-b-[1px] border-[#80808036] px-[5px] py-5 text-[18px] font-bold sm:px-[5px] md:px-[30px] lg:px-[30px] xl:px-[30px]"
    >
      <span> Subscription Details </span>
    </div>
    <div>
      <div
        class="flex items-center justify-between gap-3 px-[5px] py-5 sm:px-[5px] md:px-[30px] lg:px-[30px] xl:px-[30px]"
      >
        <span class="font-medium"> Current plan </span>
        <div class="flex min-w-[80px] items-center justify-start">
          <span
            class="rounded-[11px] bg-[#d9dbe6] px-2.5 py-[3px] text-[12px] font-medium capitalize text-[#00000080]"
          >
            {{ usageDetails?.currentPlan?.replaceAll("_", " ")?.replace("chat", "") }}
          </span>
        </div>
      </div>
      <div
        class="flex items-center justify-between gap-3 px-[5px] py-5 font-medium sm:px-[5px] md:px-[30px] lg:px-[30px] xl:px-[30px]"
      >
        <span> Subscription status </span>
        <div class="flex min-w-[80px] items-center justify-start">
          <span
            :class="{
              'bg-[#3cb3714d] text-[#008026ba]': usageDetails?.subscriptionStatus === 'active',
              'bg-[#eb3930f3] text-white': usageDetails?.subscriptionStatus !== 'active'
            }"
            class="rounded-[11px] px-2.5 py-[3px] text-[12px] capitalize"
          >
            {{ usageDetails?.subscriptionStatus }}
          </span>
        </div>
      </div>

      <div
        class="flex items-center justify-between gap-3 px-[5px] py-5 font-medium sm:px-[5px] md:px-[30px] lg:px-[30px] xl:px-[30px]"
      >
        <span> Total chat sessions used </span>
        <span
          class="flex min-w-[80px] items-center justify-start rounded-xl text-[15px]"
        >
          {{ Number(usageDetails?.chatsUsedInPlan) }}
        </span>
      </div>
      <div
        class="flex items-center justify-between gap-3 rounded-b-lg px-[5px] py-5 font-medium sm:px-[5px] md:px-[30px] lg:px-[30px] xl:px-[30px]"
      >
        <span>Chat sessions included in your plan</span>
        <span
          class="flex min-w-[80px] items-center justify-start rounded-xl text-[15px]"
        >
          {{ usageDetails?.planSessions }}
        </span>
      </div>

      <div
        class="flex items-center justify-between gap-3 rounded-b-lg px-[5px] py-5 font-medium sm:px-[5px] md:px-[30px] lg:px-[30px] xl:px-[30px]"
      >
        <span> Balance chat sessions available in your plan </span>
        <span
          class="flex min-w-[80px] items-center justify-start rounded-xl text-[15px]"
        >
          {{ usageDetails?.chatsAvailableInPlan }}
        </span>
      </div>

      <div
        class="flex items-center justify-between gap-3 rounded-b-lg px-[5px] py-5 font-medium sm:px-[5px] md:px-[30px] lg:px-[30px] xl:px-[30px]"
      >
        <span> Extra chat sessions used</span>
        <span
          class="flex min-w-[80px] items-center justify-start rounded-xl text-[15px]"
        >
          {{ usageDetails?.extraChatsMade }}
        </span>
      </div>
      <!-- <div
          class="flex items-center justify-between gap-3 rounded-b-lg px-[5px] py-5 font-medium sm:px-[5px] md:px-[30px] lg:px-[30px] xl:px-[30px]"
        >
          <span> Extra chat sessions billing </span>
          <span
            class="flex min-w-[80px] items-center justify-start rounded-xl text-[15px]"
          >
            Rs. {{ usageDetails?.extraChatsCost }}
          </span>
        </div> -->
      <div
        class="flex items-center justify-between gap-3 px-[5px] py-5 font-medium sm:px-[5px] md:px-[30px] lg:px-[30px] xl:px-[30px]"
      >
        <span>Chat sessions available in wallet</span>
        <div class="flex min-w-[80px] items-center justify-start">
          <span
            class="flex min-w-[80px] items-center justify-start rounded-xl text-[15px]"
          >
            {{
              Number(usageDetails?.individualChatsCost) === 0
                ? 0
                : usageDetails?.walletBalance
            }}
          </span>
        </div>
      </div>
      <div
        v-if="usageDetails?.expiryDate"
        class="flex items-center justify-between gap-3 rounded-b-lg px-[5px] py-5 font-medium sm:px-[5px] md:px-[30px] lg:px-[30px] xl:px-[30px]"
      >
        <span> Billing Expiry Date </span>
        <span
          class="flex min-w-[80px] items-center justify-start rounded-xl text-[15px]"
        >
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
