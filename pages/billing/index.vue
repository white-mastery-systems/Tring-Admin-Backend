<template>
  <page title="Billing" sub-title="Manage your subscription and billing information" :disableSelector="false"
    :disable-back-button="true" :disable-elevation="true">
    <template #actionButtons>
      <ChatBotActionBotton :usageDetails="usageDetails" :query="route.query" :usage="orgBilling" @change="handleOpenCancelModal">
      </ChatBotActionBotton>
    </template>
    <ConfirmationModal v-model:open="cancelModalState" title="Are you sure to cancel your subscription"
      description="This action is irreversible" @confirm="handleConfirmPaymentCancellation">
    </ConfirmationModal>
    <UiTabs :default-value="route.query.type ?? 'chat'" class="w-full self-start">
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
import { useRoute } from 'vue-router';

definePageMeta({
  middleware: 'user',
});

useHead({
  title: 'Billing',
});

const route = useRoute();
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
</script>
