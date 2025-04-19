<template>
  <Page title="Contacts" :disable-back-button="true">
    <template #actionButtons>
      <div class="flex gap-4">
        <div class="flex gap-2">
          <UiButton color="primary" @click="() => {
            if (botChannel === 'voice') voicePopupState = true
            else chatPopupState = true
            }
              ">
            {{ (botChannel === 'voice') ? 'Add Voice Contact' : 'Add Chat Contact' }}
          </UiButton>
        </div>
      </div>
    </template>
    <UiTabs default-value="chat" class="w-full self-start mt-1">
      <UiTabsList class="grid w-full grid-cols-2">
        <UiTabsTrigger value="chat" @click="selectedChannel('chat')">
          Chat Bot
        </UiTabsTrigger>
        <UiTabsTrigger value="voice" @click="selectedChannel('voice')">
          Voice Bot
        </UiTabsTrigger>
      </UiTabsList>
      <UiTabsContent value="chat">
        <AddEditChatBotContacts typeOfAddContacts="insideContact" :popupState="chatPopupState"
          @PopupState="chatPopupState = $event" />
      </UiTabsContent>
      <UiTabsContent value="voice">
        <AddEditVoiceBotContacts typeOfAddContacts="insideContact" :popupState="voicePopupState"
          @PopupState="voicePopupState = $event" />
      </UiTabsContent>
    </UiTabs>
  </Page>
</template>
<script setup lang="ts">
import { Icon, UiBadge, UiButton } from "#components";
import { useBreadcrumbStore } from "~/store/breadcrumbs"; // Import the store

definePageMeta({
  middleware: "user",
});
useHead({
  title: "Contacts"
});
const chatPopupState = ref(false)
const voicePopupState = ref(false)
const botChannel = ref("chat")
const breadcrumbStore = useBreadcrumbStore();

breadcrumbStore.setBreadcrumbs([
  {
    label: "Contacts", // Dynamic name
    to: `/contacts-management/contacts`,
  }
]);


const selectedChannel = (value: any) => {
  botChannel.value = value
  if (chatPopupState.value) chatPopupState.value = false
  if (voicePopupState.value) voicePopupState.value = false
}
</script>


