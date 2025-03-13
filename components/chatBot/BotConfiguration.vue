<template>
  <div class="mx-0 gap-3 py-2">
    <div class="text-[18px] font-bold mb-3 mt-1">Basic Configurations</div>
    <BotConfig :botDetails="props.botDetails" :refreshBot="props.refreshBot" />
    <div class="text-[18px] font-bold mb-3 mt-1"> Document </div>
    <DocumentManagement :documents="props.documents" />
    <div class="text-[18px] font-bold mb-3 mt-1"> Intent Management </div>
    <IntentManagement :botDetails="props.botDetails" :refreshBot="props.refreshBot" />
  </div>
</template>
<script setup lang="ts">
const props = defineProps < { botDetails: any; documents: any; refreshBot: () => void } > ();
</script>