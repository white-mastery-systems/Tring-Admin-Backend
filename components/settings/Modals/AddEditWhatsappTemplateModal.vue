<script setup lang="ts">
    const whatsppModalState = defineModel<{ open: boolean; id: any }>({
    default: {
      open: false,
      id: "",
    },
  });
    const emit = defineEmits<{ (e: "confirm"): void }>();
    watch(whatsppModalState, (newValue) => {
      if (!newValue.open) {
        emit("confirm");
      }
    })

</script>
<template>
  <DialogWrapper
    v-model="whatsppModalState"
    :title="whatsppModalState.id ? 'Modify Template' : 'Add Template'"
    class="grid grid-cols-2 rounded-lg"
  >
    <UiTabs  default-value="form" class="w-full self-start">
      <UiTabsList class="grid w-full grid-cols-2">
        <UiTabsTrigger value="form" > Template </UiTabsTrigger>
        <UiTabsTrigger value="preview"  > Template Preview </UiTabsTrigger>
      </UiTabsList>
      <UiTabsContent value="form"  >
      <WhatappForm @confirm="whatsppModalState.open = false;emit('confirm');":whatsppModalState="{...whatsppModalState}"/>
      </UiTabsContent>
        <UiTabsContent value="preview" >
          <WhatappTemplatePreview />
        </UiTabsContent>
    </UiTabs>
  </DialogWrapper>
</template>
