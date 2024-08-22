<script setup lang="ts">
const { status, data: usage } = await useLazyFetch("/api/org/usage", {
  server: false,
});
const isPageLoading = computed(() => status.value === "pending");

const usageDetails = computed(() => {
  if (!usage.value) return;

  const extraChats = usage.value.used_quota - usage.value.max_quota;

  return {
    currentPlan: usage.value.plan_code,
    subscriptionStatus: "active",
    planSessions: usage.value.max_quota,
    chatsUsedInPlan:
      usage.value.used_quota < usage.value.max_quota
        ? usage.value.used_quota
        : usage.value.max_quota,
    chatsAvailableInPlan:
      usage.value.max_quota < usage.value.used_quota
        ? 0
        : usage.value.max_quota - usage.value.used_quota,
    extraChatsMade: extraChats > 0 ? extraChats : 0,
    extraChatsCost: extraChats < 0 ? 0 : extraChats * 10,
  };
});
</script>
<template>
  <div v-if="isPageLoading" class="grid h-[80vh] place-items-center text-[#424BD1]">
    <Icon name="svg-spinners:90-ring-with-bg" class="h-20 w-20" />
  </div>
  <div v-else class="flex flex-col justify-center">
    <div class="px-2 h-[70px] px-6 py-[3px] border-b-[1px] border-[#80808036]">
      <div class="text-[20px] font-bold">Billing</div>
      <div class="text-[12px]">
        Manage your subscription and billing information
      </div>
    </div>
    <div class="rounded-lg mt-[30px] bg-[#fffff] w-[97%] self-center field_shadow">
      <div
        class="flex items-center justify-between rounded-t-xl text-[18px] font-bold border-b-[1px] border-[#80808036] py-5 px-[30px]">
        <span> Subscription Details </span>

        <UiButton class="hover:brighten-50 bg-[#FFBC42] font-medium text-[#FFFFFF] hover:bg-[#FFBC42]">
          <NuxtLink to="/billing/view-all" class="align_border">Change Plan</NuxtLink>
        </UiButton>
      </div>
      <div class="flex items-center justify-between gap-3 py-5 px-[30px]">
        <span class="font-medium"> Current plan </span>
        <div class="flex min-w-[80px] items-center justify-center">
          <span class="rounded-[11px] text-[12px] text-[#00000080] bg-[#d9dbe6] font-medium lowercase px-2.5 py-[3px]">
            {{ usage?.plan_code }}
          </span>
        </div>
      </div>
      <div class="flex items-center justify-between gap-3 font-medium py-5 px-[30px]">
        <span> Subscription status </span>
        <div class="flex min-w-[80px] items-center justify-center">
          <span class="rounded-[11px] text-[12px] text-[#008026ba] bg-[#3cb3714d] px-2.5 py-[3px]"> active </span>
        </div>
      </div>
      <div class="flex items-center justify-between gap-3 font-medium py-5 px-[30px]">
        <span> Total chat sessions used </span>
        <span class="flex min-w-[80px] items-center justify-center rounded-xl text-[15px]">
          {{ usageDetails?.planSessions }}
        </span>
      </div>
      <div class="flex items-center justify-between gap-3 rounded-b-lg font-medium py-5 px-[30px]">
        <span>Chat sessions included in plan</span>
        <span class="flex min-w-[80px] items-center justify-center rounded-xl text-[15px]">
          {{ usageDetails?.chatsUsedInPlan }}
        </span>
      </div>

      <div class="flex items-center justify-between gap-3 rounded-b-lg font-medium py-5 px-[30px]">
        <span> Balance chat sessions available in your plan </span>
        <span class="flex min-w-[80px] items-center justify-center rounded-xl text-[15px]">
          {{ usageDetails?.chatsAvailableInPlan }}
        </span>
      </div>

      <div class="flex items-center justify-between gap-3 rounded-b-lg font-medium py-5 px-[30px]">
        <span> Extra chat sessions </span>
        <span class="flex min-w-[80px] items-center justify-center rounded-xl text-[15px]">
          {{ usageDetails?.extraChatsMade }}
        </span>
      </div>

      <div class="flex items-center justify-between gap-3 rounded-b-lg font-medium py-5 px-[30px]">
        <span> Extra chat session billing </span>
        <span class="flex min-w-[80px] items-center justify-center rounded-xl text-[15px]">
          {{ usageDetails?.extraChatsCost }}
        </span>
      </div>
    </div>
  </div>
</template>