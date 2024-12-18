<template>
  <page title="Billing" sub-title="Manage your subscription and billing information" :disableSelector="false"
    :disable-back-button="true" :disable-elevation="true">
    <template #actionButtons>
      <ChatBotActionBotton :usageDetails="usageDetails" :query="filters"
        :usage="usage" @change="handleOpenCancelModal">
      </ChatBotActionBotton>
    </template>
    <ConfirmationModal v-model:open="cancelModalState" title="Are you sure to cancel your subscription"
      description="This action is irreversible" @confirm="handleConfirmPaymentCancellation">
    </ConfirmationModal>
    <UiTabs default-value="Chat" class="w-full self-start">
      <UiTabsList class="grid w-full grid-cols-2">
        <!-- @click="selectedChannel('Chat')" -->
        <UiTabsTrigger value="Chat" @click="navigateToTab('chat')">
          Chat
        </UiTabsTrigger>
        <UiTabsTrigger value="Voice" @click="navigateToTab('voice')">
          Voice
        </UiTabsTrigger>
      </UiTabsList>
      <div v-if="isPageLoading" class="grid h-[90vh] place-items-center text-[#424BD1]">
        <Icon name="svg-spinners:90-ring-with-bg" class="h-20 w-20" />
      </div>
      <div v-else>
        <UiTabsContent value="Chat">
          <ChatBotBIlling :usageDetails="usageDetails" :usage="usage">
          </ChatBotBIlling>
        </UiTabsContent>
        <UiTabsContent value="Voice">
          <VoiceBotBilling :usage="usage">
          </VoiceBotBilling>
        </UiTabsContent>
      </div>
    </UiTabs>
  </page>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
definePageMeta({
  middleware: "user",
});
useHead({
  title: "Billing",
});

const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();
const filters: any = ref({
  type: "chat",
})
// const filters = computed(() => ({
//   type: route.query?.type ?? 'chat',
// }));
const {
  status,
  data: usage,
  refresh: usageRefresh,
} = await useLazyFetch("/api/org/usage", {
  server: false,
  query: filters,
  headers: {
    "time-zone": Intl.DateTimeFormat().resolvedOptions().timeZone,
  },
});

const organization = await $fetch("/api/org", {
  method: "GET",
});


watch(() => route.query.type, (newValue) => {
  if (newValue) filters.value.type = newValue;
})

const isPageLoading = computed(() => status.value === "pending");

const usageDetails = computed(() => {
  if (!usage.value) return;

  const extraChats = usage.value.used_quota - usage.value.max_quota;

  return {
    currentPlan: usage.value.plan_code,
    subscriptionStatus: usage.value.subscription_status,
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
    walletBalance: usage.value.wallet_balance,
    expiryDate: usage.value.expiry_date,
  };
});

const cancelModalState = ref(false);

onMounted(() => {
  if (!router.currentRoute.value.query.tab) {
    navigateToTab("chat");
  }

  const eventSource = new EventSource(
    `${config.public.chatBotUrl}/api/sse?organizationId=${organization.orgDetails.id}`,
  );
  eventSource.onmessage = async (event) => {
    const data = JSON.parse(event.data);

    if (data.event === "update") {
      console.log("Update event received, refreshing usage...");
      usageRefresh();
    }
  };
});

const handleOpenCancelModal = () => {
  cancelModalState.value = true;
};

const handleConfirmPaymentCancellation = async () => {
  await $fetch("/api/billing/subscription", {
    method: "DELETE",
    params: filters.value,
  });
  await usageRefresh();
};

const navigateToTab = async (tab: any) => {
  router.push({ query: { type: tab } });
};
</script>
