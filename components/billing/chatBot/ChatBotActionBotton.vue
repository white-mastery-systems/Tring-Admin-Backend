<script setup lang="ts">
import { XCircleIcon, Repeat, Wallet } from "lucide-vue-next";
import { useRouter } from "vue-router";

const props = defineProps({
  usageDetails: Object,
  subscriptionData: Object,
  usage: Object,
  query: Object,
});

const emit = defineEmits<{ (e: "change"): void }>();
</script>
<template>
  <div class="flex gap-2">
    <!-- {{ subscriptionData }} || sdfdsfjhhb -->
    <UiButton v-if="subscriptionData" variant="destructive" @click="$emit('change')" class="hidden lg:inline">
      Cancel Subscription
    </UiButton>
    <div v-if="subscriptionData" class="flex flex-col items-center justify-center gap-1 lg:hidden">
      <UiButton variant="destructive" @click="$emit('change')" cass="px-0"
        style="padding-left: 9px; padding-right: 9px">
        <component :is="XCircleIcon"></component>
      </UiButton>
      <div class="text-[4.5px]">Cancel Subscription</div>
    </div>
    <!-- :to="{ path: '/billing/view-wallet', query: { action: 'refill' } }" -->
    <!-- to="/billing/view-wallet" -->
    <NuxtLink v-if="!usage?.plan_code?.includes('free')"
      :to="{ path: '/billing/view-wallet', query: { type: query?.type } }"
      class="hover:brighten-50 font-regular flex items-center rounded-md bg-[#424bd1] p-2 px-2 text-sm text-[#FFFFFF] hover:bg-[#424bd1] hidden lg:flex">
      Refill Wallet
    </NuxtLink>
    <!-- to="/billing/view-wallet" -->
    <div class="flex flex-col items-center justify-center gap-1 lg:hidden">
      <NuxtLink v-if="!usage?.plan_code?.includes('free')"
        :to="{ path: '/billing/view-wallet', query: { type: query?.type } }"
        class="hover:brighten-50 font-regular grid items-center rounded-md bg-[#424bd1] p-2 px-2 text-sm text-[#FFFFFF] hover:bg-[#424bd1]">
        <div class="flex flex-col items-center justify-center">
          <component :is="Wallet"></component>
        </div>
      </NuxtLink>
      <div class="text-[4.5px]"> Refill Wallet </div>
    </div>
    <!-- :to="{ path: '/billing/view-wallet', query: { type: query?.type } }" -->
    <!-- to="/billing/view-all" -->
    <NuxtLink :to="{ path: '/billing/view-all', query: { type: query?.type } }"
      class="hover:brighten-50 font-regular items-center rounded-md bg-[#FFBC42] p-2 px-2 text-sm text-[#FFFFFF] hover:bg-[#FFBC42] hidden lg:flex">
      Change Plan</NuxtLink>
    <div class="flex flex-col items-center justify-center gap-1 lg:hidden">
      <!-- to="/billing/view-all" -->
      <NuxtLink :to="{ path: '/billing/view-all', query: { type: query?.type } }"
        class="hover:brighten-50 font-regular grid items-center rounded-md bg-[#FFBC42] p-2 px-2 text-sm text-[#FFFFFF] hover:bg-[#FFBC42]">
        <component :is="Repeat"></component>
      </NuxtLink>
      <div class="text-[4.5px]"> Change Plan </div>
    </div>
  </div>
</template>