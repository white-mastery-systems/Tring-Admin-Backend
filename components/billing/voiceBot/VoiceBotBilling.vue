<template>
  <div
    class="mt-4 mb-[120px] sm:mb-[120px] md:mb-0 lg:mb-0 xl:mb-0 w-full self-center rounded-lg bg-[#fffff] shadow-3xl">
    <div
      class="flex items-center justify-between rounded-t-xl border-b-[1px] border-[#80808036] px-[5px] py-5 text-[18px] font-bold sm:px-[5px] md:px-[30px] lg:px-[30px] xl:px-[30px]">
      <span> Subscription Details </span>
    </div>
    <!-- class="overflow-y-scroll h-screen-minus-15" -->
    <div>
      <div
        class="flex items-center justify-between gap-3 px-[5px] py-5 sm:px-[5px] md:px-[30px] lg:px-[30px] xl:px-[30px]">
        <span class="font-medium"> Current plan </span>
        <div class="flex min-w-[80px] items-center justify-start">
          <span class="rounded-[11px] bg-[#d9dbe6] px-2.5 py-[3px] text-[12px] font-medium capitalize text-[#00000080]">
            {{ usage?.plan_code?.replaceAll("_", " ")?.replace("chat", "") }}
          </span>
        </div>
      </div>
      <div
        class="flex items-center justify-between gap-3 px-[5px] py-5 font-medium sm:px-[5px] md:px-[30px] lg:px-[30px] xl:px-[30px]">
        <span> Subscription status </span>
        <div class="flex min-w-[80px] items-center justify-start">
          <span :class="{
            'bg-[#3cb3714d] text-[#008026ba]': usage?.subscription_status === 'active',
            'bg-[#eb3930f3] text-white': usage?.subscription_status !== 'active'
          }" class="rounded-[11px] px-2.5 py-[3px] text-[12px] capitalize">
            {{ usage?.subscription_status }}
          </span>
        </div>
      </div>

      <div
        class="flex items-center justify-between gap-3 px-[5px] py-5 font-medium sm:px-[5px] md:px-[30px] lg:px-[30px] xl:px-[30px]">
        <span> Total call minutes used </span>
        <span class="flex min-w-[80px] items-center justify-start rounded-xl text-[15px]">
          {{ Number(usage?.used_quota) }}
        </span>
      </div>
      <div
        class="flex items-center justify-between gap-3 rounded-b-lg px-[5px] py-5 font-medium sm:px-[5px] md:px-[30px] lg:px-[30px] xl:px-[30px]">
        <span> Call minutes included in your plan </span>
        <span class="flex min-w-[80px] items-center justify-start rounded-xl text-[15px]">
          {{ usage?.max_quota }}
        </span>
      </div>

      <div
        class="flex items-center justify-between gap-3 rounded-b-lg px-[5px] py-5 font-medium sm:px-[5px] md:px-[30px] lg:px-[30px] xl:px-[30px]">
        <span> Balance call minutes available in your plan </span>
        <span class="flex min-w-[80px] items-center justify-start rounded-xl text-[15px]">
          {{ usage?.available_sessions }}
        </span>
      </div>
      <div
        class="flex items-center justify-between gap-3 px-[5px] py-5 font-medium sm:px-[5px] md:px-[30px] lg:px-[30px] xl:px-[30px]">
        <span>Extra call minutes used</span>
        <div class="flex min-w-[80px] items-center justify-start">
          <span class="flex min-w-[80px] items-center justify-start rounded-xl text-[15px]">
            {{ usage?.extra_sessions }}
          </span>
        </div>
      </div>
      <div
        class="flex items-center justify-between gap-3 rounded-b-lg px-[5px] py-5 font-medium sm:px-[5px] md:px-[30px] lg:px-[30px] xl:px-[30px]">
        <span> Available wallet balance </span>
        <span class="flex min-w-[80px] items-center justify-start rounded-xl text-[15px]">
          {{ usage?.wallet_balance }}
        </span>
      </div>
      <div v-if="usage?.expiry_date"
        class="flex items-center justify-between gap-3 rounded-b-lg px-[5px] py-5 font-medium sm:px-[5px] md:px-[30px] lg:px-[30px] xl:px-[30px]">
        <span> Billing Expiry Date </span>
        <span class="flex min-w-[80px] items-center justify-start rounded-xl text-[15px]">
          {{ format(usage?.expiry_date, "MMMM d, yyyy") }}
        </span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { format } from "date-fns";

const props = defineProps({
  usage: Object,
});
</script>