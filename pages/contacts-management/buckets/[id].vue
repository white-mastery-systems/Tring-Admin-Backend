<template>
  <Page title="Bucket Contacts" :bread-crumbs="[]" :disable-back-button="false">
    <template #actionButtons>
      <div class="flex gap-4">
        <div class="flex gap-2">
          <UiButton color="primary" @click="() => {
            if (bucketDetails?.type === 'voice') voicePopupState = true
            else chatPopupState = true
          }
            ">
            {{ (bucketDetails?.type === 'voice') ? 'Add Voice Contact' : 'Add Chat Contact' }}
          </UiButton>
        </div>
      </div>
    </template>
    <UiTabs :default-value="bucketType" :key="bucketType" class="w-full self-start">
      <UiTabsContent value="chat">
        <AddEditChatBotContacts typeOfAddContacts="insideBucket" :popupState="chatPopupState" @PopupState="chatPopupState = $event" />
      </UiTabsContent>
      <UiTabsContent value="voice">
        <AddEditVoiceBotContacts typeOfAddContacts="insideBucket" :popupState="voicePopupState" @PopupState="voicePopupState = $event" />
      </UiTabsContent>
    </UiTabs>
  </Page>
</template>
<script setup lang="ts">
import { Icon, UiBadge, UiButton } from "#components";
import { useRoute, useRouter } from "vue-router";
import { useBreadcrumbStore } from "~/store/breadcrumbs"; // Import the store
import { useBucketContacts } from "~/composables/useBucketContacts"; // I
definePageMeta({
  middleware: "user",
});
useHead({
  title: "Contacts"
});
const filters = reactive<{
  q: string;
  page: string;
  limit: string;
}>({
  q: "",
  page: "1",
  limit: "10",
});


const chatPopupState = ref(false)
const voicePopupState = ref(false)
const route = useRoute();
const breadcrumbStore = useBreadcrumbStore();
const { bucketDetails, loading, error, refreshBucket } = useBucketContacts(route.params.id);

onMounted(async () => {
  breadcrumbStore.setBreadcrumbs([
    {
      label: 'Segments',
      to: `/contacts-management/buckets`,
    },
    {
      label: `${bucketDetails.value?.name ?? 'No Name'}`,
      to: `/contacts-management/buckets/${route.params.id}`,
    },
  ]);
});

const bucketType = computed(() => bucketDetails.value?.type ?? "chat");
</script>
