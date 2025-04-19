<template>
  <div class="mx-0 gap-3 py-1">
    <div class="text-[14px] sm:text-[14px] md:text-[16px] lg:text-[18px] font-bold mb-6 mt-3">Basic Configurations</div>
    <BotConfig :botDetails="props.botDetails" :refreshBot="props.refreshBot" />
    <UiSeparator class="my-6"></UiSeparator>
    <DocumentManagement :botDetails="props.botDetails" :documents="props.documents" :refreshBot="props.refreshBot"
      :refresh="props.refresh" />
    <div class="mb-6 mt-1">
      <UiSeparator class="h-[0.5px]"></UiSeparator>
    </div>
    <IntentManagement :botDetails="props.botDetails" :refreshBot="props.refreshBot" />
  </div>
</template>
<script setup lang="ts">
const props = defineProps < { botDetails: any; documents: any; refreshBot: () => void, refresh: () => void } > ();
</script>