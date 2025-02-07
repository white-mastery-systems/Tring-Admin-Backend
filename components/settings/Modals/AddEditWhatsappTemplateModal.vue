<template>
  <DialogWrapper
    v-model="addWhatsappTemplateModalState"
    :title="
      addWhatsappTemplateModalState.id ? 'Modify Template' : 'Add Template'
    "
    class="xl:max-h-[90%] xl:max-w-[90%]"
  >
    <UiTabs default-value="form" class="w-full self-start">
      <UiTabsList class="grid w-full grid-cols-2">
        <UiTabsTrigger value="form"> Template </UiTabsTrigger>
        <UiTabsTrigger value="preview"> Template Preview </UiTabsTrigger>
      </UiTabsList>
      <UiTabsContent value="form">
        <WhatsappForm
          @confirm="
            addWhatsappTemplateModalState.open = false;
            emit('confirm');
            getApiStatus = true;
          "
          :open="addWhatsappTemplateModalState.open"
          :id="addWhatsappTemplateModalState.id"
          :getStatus="getApiStatus"
          @getApistatus="getApiStatus = false"
        />
      </UiTabsContent>
      <UiTabsContent value="preview">
        <WhatsappTemplatePreview />
      </UiTabsContent>
    </UiTabs>
  </DialogWrapper>
</template>
<script setup lang="ts">
  const addWhatsappTemplateModalState = defineModel<{ open: boolean; id: any }>({
    default: {
      open: false,
      id: "",
    },
  });
  const emit = defineEmits<{ (e: "confirm"): void }>();
  const getApiStatus = ref(true);
</script>