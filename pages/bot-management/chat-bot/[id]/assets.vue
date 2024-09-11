<template>
  <Page
    title="Assets Management"
    :disableSelector="true"
    :disable-back-button="false"
    :disable-elevation="true"
  >
    <template #actionButtons>
      <UiButton color="primary" @click="assetsModalState.open = true">
        Add Asset
      </UiButton>
    </template>
    <CreateEditAssetModal v-model="assetsModalState" />
    <div class="bot-manage-main-container"></div>
  </Page>
</template>
<script setup lang="ts">
  const assetsModalState = ref({ open: false, id: "" });
  definePageMeta({
    middleware: "admin-only",
  });

  import { ref } from "vue";
  const router = useRouter();
  const route = useRoute("bot-management-chat-bot-id-assets");
</script>
