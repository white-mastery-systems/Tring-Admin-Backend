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
    <div class="header-align px-2">
      <div class="text-[20px] font-bold">Billing</div>
      <div class="text-[12px]">
        Manage your subscription and billing information
      </div>
    </div>
    <div class="details-card rounded-lg">
      <div
        class="content-align billing-table-header-align flex items-center justify-between rounded-t-xl text-[18px] font-bold"
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
      <div class="list-content-align flex items-center justify-between gap-3">
        <span class="font-medium"> Current Plan </span>
        <div class="flex w-[160px] items-center justify-center">
          <span
            class="creator-chip rounded-[11px] text-[12px] font-medium lowercase"
          >
            {{ usage?.plan_code }}
          </span>
        </div>
      </div>
      <div
        class="list-content-align flex items-center justify-between gap-3 font-medium"
      >
        <span> Subscription status </span>
        <div class="flex w-[160px] items-center justify-center">
          <span class="active-chip rounded-[11px] text-[12px]"> active </span>
        </div>
      </div>
      <div
        class="list-content-align flex items-center justify-between gap-3 font-medium"
      >
        <span> Total chat sessions in plan </span>
        <span
          class="flex w-[160px] items-center justify-center rounded-xl text-[15px]"
        >
          {{ usageDetails?.planSessions }}
        </span>
      </div>
      <div
        class="list-content-align flex items-center justify-between gap-3 rounded-b-lg font-medium"
      >
        <span> chat sessions used in plan </span>
        <span
          class="flex w-[160px] items-center justify-center rounded-xl text-[15px]"
        >
          {{ usageDetails?.chatsUsedInPlan }}
        </span>
      </div>

      <div
        class="list-content-align flex items-center justify-between gap-3 rounded-b-lg font-medium"
      >
        <span> available chat sessions in plan </span>
        <span
          class="flex w-[160px] items-center justify-center rounded-xl text-[15px]"
        >
          {{ usageDetails?.chatsAvailableInPlan }}
        </span>
      </div>

      <div
        class="list-content-align flex items-center justify-between gap-3 rounded-b-lg font-medium"
      >
        <span> extra chat sessions </span>
        <span
          class="flex w-[160px] items-center justify-center rounded-xl text-[15px]"
        >
          {{ usageDetails?.extraChatsMade }}
        </span>
      </div>

      <div
        class="list-content-align flex items-center justify-between gap-3 rounded-b-lg font-medium"
      >
        <span> extra chat session billing </span>
        <span
          class="flex w-[160px] items-center justify-center rounded-xl text-[15px]"
        >
          {{ usageDetails?.extraChatsCost }}
        </span>
      </div>
    </div>
  </div>
</template>
<style scoped>
  .header-align {
    height: 70px;
    padding: 4px 25px;
    border-bottom: 1px solid rgb(128, 128, 128, 0.21);
  }

  .billing-table-header-align {
    border-bottom: 1px solid rgb(128, 128, 128, 0.21);
  }

  .details-card {
    margin-top: 30px;
    /* border: 1px solid rgb(128, 128, 128, 0.5); */
    background-color: white;
    box-shadow: 0px 2px 24px 0px #0000000d;
    width: 97%;
    align-self: center;
  }

  .content-align {
    /* border-bottom: 1px solid rgb(128, 128, 128, 0.5); */
    padding: 20px 30px;
  }

  .list-content-align {
    padding: 20px 30px 20px 30px;
  }

  .content-align:last-child {
    border-bottom: none;
  }

  .creator-chip {
    padding: 3px 10px;
    color: rgba(0, 0, 0, 0.5);
    background-color: #d9dbe6;
  }

  .active-chip {
    padding: 3px 10px;
    color: rgb(0, 128, 38, 0.73);
    background: rgb(60, 179, 113, 0.3);
  }
</style>
