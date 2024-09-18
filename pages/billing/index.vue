<script setup lang="ts">
import { format } from "date-fns";
import { XCircleIcon, Wallet, Repeat  } from "lucide-vue-next";
  const {
    status,
    data: usage,
    refresh: usageRefresh,
  } = await useLazyFetch<{
    usage_quota: number;
    max_quota: number;
    plan_code: string;
    used_quota: number;
    extra_sessions_cost: number;
  }>("/api/org/usage", {
    server: false,
  });
  const {
    status: subscriptionLoadingStatus,
    data: subscriptionData,
    refresh: subscriptionRefresh,
  } = await useLazyFetch<any>("/api/billing/subscription", {
    server: false,
  });
  const isPageLoading = computed(() => status.value === "pending");

  const usageDetails = computed(() => {
    if (!usage.value) return;

    const extraChats = usage.value.used_quota - usage.value.max_quota;
    // console.log(subscriptionData.value?.wallet_balance, "WALLET BALANCE");
    return {
      currentPlan: usage.value.plan_code,
      subscriptionStatus: "active",
      planSessions: usage.value.max_quota,
      chatsUsedInPlan: usage.value.used_quota,
      chatsAvailableInPlan:
        usage.value.max_quota < usage.value.used_quota
          ? 0
          : usage.value.max_quota - usage.value.used_quota,
      extraChatsMade: extraChats > 0 ? extraChats : 0,
      extraChatsCost:
        extraChats < 0
          ? 0
          : extraChats * Number(usage.value.extra_sessions_cost),
      individualChatsCost: Number(usage.value.extra_sessions_cost),
      walletBalance: usage.value?.wallet_balance,
    };
  });

  const cancelModalState = ref(false);
  const handleOpenCancelModal = () => {
    cancelModalState.value = true;
  };
  const handleConfirmPaymentCancellation = async () => {
    await $fetch("/api/billing/subscription", {
      method: "DELETE",
    });
    await subscriptionRefresh();
    await usageRefresh();
  };
</script>
<template>
  <div v-if="isPageLoading" class="grid h-[90vh] place-items-center text-[#424BD1]">
    <Icon name="svg-spinners:90-ring-with-bg" class="h-20 w-20" />
  </div>
  <page v-else title="Billing" sub-title="Manage your subscription and billing information" :disableSelector="false"
    :disable-back-button="true" :disable-elevation="true">
    <template #actionButtons>
      <div class="flex gap-2">
        <UiButton v-if="subscriptionData" variant="destructive" @click="handleOpenCancelModal" class="hidden lg:inline">
          Cancel Subscription
        </UiButton>
        <div class="flex flex-col items-center justify-center gap-1 lg:hidden">
          <UiButton v-if="subscriptionData" variant="destructive" @click="handleOpenCancelModal" cass="px-0"
            style="padding-left: 9px; padding-right: 9px">
            <component :is="XCircleIcon"></component>
          </UiButton>
          <div class="text-[4.5px]">Cancel Subscription</div>
        </div>
        <NuxtLink v-if="!usage?.plan_code?.includes('free')" to="/billing/view-wallet"
          class="hover:brighten-50 font-regular flex items-center rounded-md bg-[#424bd1] p-2 px-2 text-sm text-[#FFFFFF] hover:bg-[#424bd1] hidden lg:flex">
          Refill Wallet
        </NuxtLink>
        <div class="flex flex-col items-center justify-center gap-1 lg:hidden">
          <NuxtLink v-if="!usage?.plan_code?.includes('free')" to="/billing/view-wallet"
            class="hover:brighten-50 font-regular grid items-center rounded-md bg-[#424bd1] p-2 px-2 text-sm text-[#FFFFFF] hover:bg-[#424bd1]">
            <div class="flex flex-col items-center justify-center">
              <component :is="Wallet"></component>
            </div>
          </NuxtLink>
          <div class="text-[4.5px]"> Refill Wallet </div>
        </div>
        <NuxtLink to="/billing/view-all"
          class="hover:brighten-50 font-regular items-center rounded-md bg-[#FFBC42] p-2 px-2 text-sm text-[#FFFFFF] hover:bg-[#FFBC42] hidden lg:flex">
          Change Plan</NuxtLink>
        <div class="flex flex-col items-center justify-center gap-1 lg:hidden">
          <NuxtLink to="/billing/view-all"
            class="hover:brighten-50 font-regular grid items-center rounded-md bg-[#FFBC42] p-2 px-2 text-sm text-[#FFFFFF] hover:bg-[#FFBC42]">
            <component :is="Repeat"></component>
          </NuxtLink>
          <div class="text-[4.5px]"> Change Plan </div>
        </div>
      </div>
    </template>
    <ConfirmationModal v-model:open="cancelModalState" title="Are you sure to cancel your subscription"
      description="This action is irreversible" @confirm="handleConfirmPaymentCancellation">
    </ConfirmationModal>
    <div class="mt-4 w-full self-center rounded-lg bg-[#fffff] shadow-3xl">
      <div
        class="flex items-center justify-between rounded-t-xl border-b-[1px] border-[#80808036] px-[5px] py-5 text-[18px] font-bold sm:px-[5px] md:px-[30px] lg:px-[30px] xl:px-[30px]">
        <span> Subscription Details </span>
      </div>
      <div class="overflow-y-scroll h-screen-minus-15">
        <div
          class="flex items-center justify-between gap-3 px-[5px] py-5 sm:px-[5px] md:px-[30px] lg:px-[30px] xl:px-[30px]">
          <span class="font-medium"> Current plan </span>
          <div class="flex min-w-[80px] items-center justify-start">
            <span
              class="rounded-[11px] bg-[#d9dbe6] px-2.5 py-[3px] text-[12px] font-medium capitalize text-[#00000080]">
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
          class="flex items-center justify-between gap-3 px-[5px] py-5 font-medium sm:px-[5px] md:px-[30px] lg:px-[30px] xl:px-[30px]">
          <span>Chat sessions available in wallet</span>
          <div class="flex min-w-[80px] items-center justify-start">
            <span class="flex min-w-[80px] items-center justify-start rounded-xl text-[15px]">
              {{
              Number(usageDetails?.individualChatsCost) === 0
              ? 0
              : (Math.floor(
              Number(usageDetails?.walletBalance) /
              Number(usageDetails?.individualChatsCost),
              ) ?? 0)
              }}
            </span>
          </div>
        </div>
        <div
          class="flex items-center justify-between gap-3 rounded-b-lg px-[5px] py-5 font-medium sm:px-[5px] md:px-[30px] lg:px-[30px] xl:px-[30px]">
          <span> Billing Expiry Date </span>
          <span class="flex min-w-[80px] items-center justify-start rounded-xl text-[15px]">
            {{ format(subscriptionData.subscription_metadata.current_term_ends_at, "MMMM d, yyyy") }}
          </span>
        </div>
      </div>
      <div v-if="subscriptionData?.subscription_metadata?.current_term_ends_at"
        class="flex items-center justify-between gap-3 rounded-b-lg px-[5px] py-5 font-medium sm:px-[5px] md:px-[30px] lg:px-[30px] xl:px-[30px]">
        <span> Billing Expiry Date </span>
        <span class="flex min-w-[80px] items-center justify-start rounded-xl text-[15px]">
          {{ format(subscriptionData?.subscription_metadata?.current_term_ends_at, "MMMM d, yyyy") }}
        </span>
      </div>
    </div>
  </page>
</template>
<!-- //TODO Bread crumps for all the pages //TODO leads button is larger in size
(priority) //TODO table scrolling should be removed //TODO free plan should not
be able to use more than 50 sessions //TODO billing items should be seperated by
lines //TODO we should create a new user if the bot id and org id doesn't match
happens when i bet a bot from other org in the same browser i opened and
conversed with other org bot //TODO chatbot Customization //TODO chat bot
preview exactly how it is //TODO ask sateesh to add padding fields in bot
customisation -->
<!-- //TODO https://github.com/shadcn-ui/ui/issues/1151 -->
<!-- //TODO https://www.bigin.com/developer/docs/apis/field-meta.html -->
