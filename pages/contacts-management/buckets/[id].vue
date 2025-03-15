<template>
  <Page title="Bucket Contacts" :bread-crumbs="[]" :disable-back-button="false">
    <template #actionButtons>
      <div class="flex gap-4">
        <div class="flex gap-2">
          <UiButton color="primary" @click="() => {
            if (getBucketDetails?.type === 'voice') voicePopupState = true
            else chatPopupState = true
          }
            ">
            {{ (getBucketDetails?.type === 'voice') ? 'Add Voice Contact' : 'Add Chat Contact' }}
          </UiButton>
          {{voicePopupState}} || asdad
          {{chatPopupState}}
          {{ getBucketDetails?.type }} || ---- asiu
        </div>
      </div>
    </template>
    <UiTabs :default-value="getBucketDetails?.type ?? 'chat'" class="w-full self-start">
      <UiTabsContent value="chat">
        <AddEditChatBotContacts typeOfAddContacts="insideBucket" :popupState="chatPopupState" @PopupState="chatPopupState = $event" />
      </UiTabsContent>
      <UiTabsContent value="voice">
        asdsadas
        <AddEditVoiceBotContacts typeOfAddContacts="insideBucket" :popupState="voicePopupState" @PopupState="voicePopupState = $event" />
      </UiTabsContent>
    </UiTabs>
  </Page>
</template>
<script setup lang="ts">
import { Icon, UiBadge, UiButton } from "#components";
import { useRoute, useRouter } from "vue-router";
import { useBreadcrumbStore } from "~/store/breadcrumbs"; // Import the store

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

// const {
  //   status,
  //   data: contactsList,
  //   refresh: contactsRefresh,
  // } = await useLazyFetch("/api/org/contact-list", {
    //   server: false,
    //   query: filters,
    //   default: () => [],
    // });
    
const getBucketDetails = ref([])
onMounted(async () => {
  getBucketDetails.value = await getBucketContactsDetails(route.params.id);

  breadcrumbStore.setBreadcrumbs([
    {
      label: 'Segments',
      to: `/contacts-management/buckets`,
    },
    {
      label: `${getBucketDetails.value?.name} ?? 'No Name'`,
      to: `/contacts-management/buckets/${route.params.id}`,
    },
  ]);
});
</script>
