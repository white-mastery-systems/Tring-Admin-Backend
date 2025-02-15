<template>
  <page title="Billing" sub-title="Manage your subscription and billing information" :disableSelector="false"
    :disable-back-button="true" :disable-elevation="true">
    <template #actionButtons>
      <ChatBotActionButton :usageDetails="usageDetails" :isPageLoading="isPageLoading" :query="route.query"
        :usage="orgBilling" @change="handleOpenCancelModal">
      </ChatBotActionButton>
    </template>
    <ConfirmationModal v-model:open="cancelModalState" title="Are you sure to cancel your subscription"
      description="This action is irreversible" @confirm="handleConfirmPaymentCancellation">
    </ConfirmationModal>
    <UiTabs v-model="selectedTab" :default-value="route.query.type ?? 'chat'" class="w-full self-start">
      <UiTabsList class="grid w-full grid-cols-2">
        <!-- @click="selectedChannel('Chat')" -->
        <UiTabsTrigger value="chat" @click="navigateToTab('chat')">
          Chat
        </UiTabsTrigger>
        <UiTabsTrigger value="voice" @click="navigateToTab('voice')">
          Voice
        </UiTabsTrigger>
      </UiTabsList>
      <div v-if="isPageLoading" class="grid h-[90vh] place-items-center text-[#424BD1]">
        <Icon name="svg-spinners:90-ring-with-bg" class="h-20 w-20" />
      </div>
      <div v-else>
        <UiTabsContent value="chat">
          <ChatBotBIlling :usageDetails="usageDetails" :usage="orgBilling">
          </ChatBotBIlling>
        </UiTabsContent>
        <UiTabsContent value="voice">
          <VoiceBotBilling :usage="orgBilling">
          </VoiceBotBilling>
        </UiTabsContent>
      </div>
    </UiTabs>
  </page>
</template>
<script setup lang="ts">
import { useBillingComposable } from '~/composables/billing/useBillingComposable';
import { useRoute, useRouter } from 'vue-router';

definePageMeta({
  middleware: 'user',
});

useHead({
  title: 'Billing',
});

const route = useRoute();
const router = useRouter();
const selectedTab = ref(route.query.type || 'chat')
const {
  cancelModalState,
  filters,
  orgBilling,
  usageDetails,
  isPageLoading,
  handleOpenCancelModal,
  handleConfirmPaymentCancellation,
  navigateToTab,
} = useBillingComposable();

watch(() => route.query.type,(newType) => {
  console.log(newType)
  selectedTab.value = newType
}, {immediate: true})
onMounted(() => {
  if (!route.query.type) { // If `type` is not present in the query
    router.push({ query: { type: 'chat' } });
  }
});

</script>
