import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useLazyFetch } from 'nuxt/app'; // Adjust this if your app uses a custom fetch method

export const useBillingComposable = () => {
  const route = useRoute();
  const router = useRouter();
  const config = useRuntimeConfig();

  const cancelModalState = ref(false);

  const filters = computed(() => ({
    type: route?.query?.type ?? 'chat',
  }));

  const {
    status,
    data: orgBilling,
    refresh: usageRefresh,
  } = useLazyFetch("/api/org/usage", {
    server: false,
    query: filters,
    headers: {
      "time-zone": Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  });
  // const organization = ref(null);
  const { data: organization, status: orgStatus, error, refresh } = useFetch("/api/org", { method: "GET" });


  const isPageLoading = computed(() => status.value === "pending");

  const usageDetails = computed(() => {
    if (!orgBilling.value) return;

    const extraChats = orgBilling.value.used_quota - orgBilling.value.max_quota;

    return {
      currentPlan: orgBilling.value.plan_code,
      subscriptionStatus: orgBilling.value.subscription_status,
      planSessions: orgBilling.value.max_quota,
      chatsUsedInPlan: orgBilling.value.used_quota,
      chatsAvailableInPlan:
        orgBilling.value.max_quota < orgBilling.value.used_quota
          ? 0
          : orgBilling.value.max_quota - orgBilling.value.used_quota,
      extraChatsMade: extraChats > 0 ? extraChats : 0,
      extraChatsCost:
        extraChats < 0
          ? 0
          : extraChats * Number(orgBilling.value.extra_sessions_cost),
      individualChatsCost: Number(orgBilling.value.extra_sessions_cost),
      walletBalance: orgBilling.value.wallet_balance,
      expiryDate: orgBilling.value.expiry_date,
      whatsappSessions: orgBilling.value.whatsapp_sessions,
      whatsappWalletBalance: orgBilling.value.whatsapp_wallet_balance,
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

  const navigateToTab = async (tab: string) => {
    router.push({ query: { type: tab } });
  };

  onMounted(async () => {
    // organization.value = await useFetch("/api/org", { method: "GET" });

    const eventSource = new EventSource(
      `${config.public.chatBotUrl}/api/sse?organizationId=${organization.value.orgDetails.id}`,
    );

    eventSource.onmessage = async (event) => {
      const data = JSON.parse(event.data);

      if (data.event === "update") {
        usageRefresh();
      }
    };
  });

  watch(
    () => route?.query?.type,
    (newValue) => {
      if (newValue) filters.value.type = newValue;
    },
  );

  return {
    cancelModalState,
    filters,
    orgBilling,
    usageDetails,
    isPageLoading,
    organization,
    handleOpenCancelModal,
    handleConfirmPaymentCancellation,
    navigateToTab,
    refresh,
  };
};
