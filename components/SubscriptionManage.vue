<template>
  <div v-if="isPageLoading" class="grid h-[80vh] place-items-center text-[#424BD1]">
    <Icon name="svg-spinners:90-ring-with-bg" class="h-20 w-20" />
  </div>
  <page v-else title="Billing" sub-title="Manage your subscription and billing information" :disableSelector="false"
    :disable-back-button="true" :disable-elevation="true">
    <template #actionButtons>
      <div class="flex gap-2">
        <UiButton variant="destructive" @click="cancelModalState = true">
          Cancel Subscription
        </UiButton>
        <UiButton color="primary">
          <NuxtLink to="/billing/view-wallet" class="align_border">Refill Wallet</NuxtLink>
        </UiButton>
        <NuxtLink to="/billing/view-all"
          class="hover:brighten-50 align_border grid items-center rounded-md bg-[#FFBC42] px-2 text-sm font-bold text-[#FFFFFF] hover:bg-[#FFBC42]">
          Change Plan</NuxtLink>
      </div>
    </template>
    <ConfirmationModal :open="cancelModalState" title="Are you sure to cancel your subscription"
      description="This action is irreversible" @confirm="() => { }">
    </ConfirmationModal>
    <div class="mt-4 w-full self-center rounded-lg bg-[#fffff] shadow-3xl">
      <div
        class="flex items-center justify-between rounded-t-xl border-b-[1px] border-[#80808036] px-[5px] py-5 text-[18px] font-bold sm:px-[5px] md:px-[30px] lg:px-[30px] xl:px-[30px]">
        <span> Subscription Details </span>
      </div>
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
          <span class="rounded-[11px] bg-[#3cb3714d] px-2.5 py-[3px] text-[12px] capitalize text-[#008026ba]">
            active
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

      <div
        class="flex items-center justify-between gap-3 rounded-b-lg px-[5px] py-5 font-medium sm:px-[5px] md:px-[30px] lg:px-[30px] xl:px-[30px]">
        <span> Extra chat sessions billing </span>
        <span class="flex min-w-[80px] items-center justify-start rounded-xl text-[15px]">
          Rs. {{ usageDetails?.extraChatsCost }}
        </span>
      </div>
    </div>
  </page>
</template>
<script setup lang="ts">
const { status, data: usage } = await useLazyFetch("/api/org/usage", {
  server: false,
  query: { type: "chat" },
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
    extraChatsCost:
      extraChats < 0
        ? 0
        : extraChats * Number(usage.value.extra_sessions_cost),
  };
});

const cancelModalState = ref(false);
</script>
