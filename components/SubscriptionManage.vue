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
  <div
    v-if="isPageLoading"
    class="grid h-[80vh] place-items-center text-[#424BD1]"
  >
    <Icon name="svg-spinners:90-ring-with-bg" class="h-20 w-20" />
  </div>
  <div v-else class="flex flex-col justify-center">
    <div class="h-[70px] border-b-[1px] border-[#80808036] px-2 px-6 py-[3px]">
      <div class="text-[20px] font-bold">Billing</div>
      <div class="text-[12px]">
        Manage your subscription and billing information
      </div>
    </div>
    <div
      class="field_shadow mt-[30px] w-[97%] self-center rounded-lg bg-[#fffff]"
    >
      <div
        class="flex items-center justify-between rounded-t-xl border-b-[1px] border-[#80808036] px-[30px] py-5 text-[18px] font-bold"
      >
        <span> Subscription Details </span>

        <UiButton
          class="hover:brighten-50 bg-[#FFBC42] font-medium text-[#FFFFFF] hover:bg-[#FFBC42]"
        >
          <NuxtLink to="/billing/view-all" class="align_border"
            >Change Plan</NuxtLink
          >
        </UiButton>
      </div>
      <div class="flex items-center justify-between gap-3 px-[30px] py-5">
        <span class="font-medium"> Current plan </span>
        <div class="flex min-w-[80px] items-center justify-start">
          <span
            class="rounded-[11px] bg-[#d9dbe6] px-2.5 py-[3px] text-[12px] font-medium capitalize text-[#00000080]"
          >
            {{ usage?.plan_code?.replace("_", " ") }}
          </span>
        </div>
      </div>
      <div
        class="flex items-center justify-between gap-3 px-[30px] py-5 font-medium"
      >
        <span> Subscription status </span>
        <div class="flex min-w-[80px] items-center justify-start">
          <span
            class="rounded-[11px] bg-[#3cb3714d] px-2.5 py-[3px] text-[12px] capitalize text-[#008026ba]"
          >
            active
          </span>
        </div>
      </div>
      <div
        class="flex items-center justify-between gap-3 px-[30px] py-5 font-medium"
      >
        <span> Total chat sessions used </span>
        <span
          class="flex min-w-[80px] items-center justify-start rounded-xl text-[15px]"
        >
          {{
            Number(usageDetails?.planSessions) +
            Number(usageDetails?.extraChatsMade)
          }}
        </span>
      </div>
      <div
        class="flex items-center justify-between gap-3 rounded-b-lg px-[30px] py-5 font-medium"
      >
        <span>Chat sessions included in your plan</span>
        <span
          class="flex min-w-[80px] items-center justify-start rounded-xl text-[15px]"
        >
          {{ usageDetails?.chatsUsedInPlan }}
        </span>
      </div>

      <div
        class="flex items-center justify-between gap-3 rounded-b-lg px-[30px] py-5 font-medium"
      >
        <span> Balance chat sessions available in your plan </span>
        <span
          class="flex min-w-[80px] items-center justify-start rounded-xl text-[15px]"
        >
          {{ usageDetails?.chatsAvailableInPlan }}
        </span>
      </div>

      <div
        class="flex items-center justify-between gap-3 rounded-b-lg px-[30px] py-5 font-medium"
      >
        <span> Extra chat sessions used</span>
        <span
          class="flex min-w-[80px] items-center justify-start rounded-xl text-[15px]"
        >
          {{ usageDetails?.extraChatsMade }}
        </span>
      </div>

      <div
        class="flex items-center justify-between gap-3 rounded-b-lg px-[30px] py-5 font-medium"
      >
        <span> Extra chat session billing </span>
        <span
          class="flex min-w-[80px] items-center justify-start rounded-xl text-[15px]"
        >
          Rs. {{ usageDetails?.extraChatsCost }}

          <!-- ({{
            Number(usageDetails?.extraChatsMade) /
            Number(
              Number(usageDetails?.extraChatsCost) /
                Number(usageDetails?.extraChatsMade),
            )
          }}) -->
        </span>
      </div>
    </div>
  </div>
</template>
<!-- //TODO Bread crumps for all the pages //TODO leads button is larger in size
(priority) //TODO table scrolling should be removed //TODO free plan should not
be able to use more than 50 sessions //TODO billing items should be seperated by
lines //TODO we should create a new user if the bot id and org id doesn't match
happens when i bet a bot from other org in the same browser i opened and
conversed with other org bot //TODO chatbot Customization //TODO chat bot
preview exactly how it is //TODO ask sateesh to add padding fields in bot
customisation -->
