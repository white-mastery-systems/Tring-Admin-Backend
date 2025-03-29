<template>
  <VoiceBotCRMConfig></VoiceBotCRMConfig>
  <UiSeparator orientation="horizontal" class="bg-[#E2E8F0]" />
  <PreRecordedAudio :botDetails="props.botDetails" :refreshBot="props.refreshBot" :loading="props.loading"
    :audioResponseData="audioResponseData" :audioDataRefresh="audioDataRefresh">
  </PreRecordedAudio>
  <UiSeparator orientation="horizontal" class="bg-[#E2E8F0]" />
  <LLMCaching :botDetails="props.botDetails" :refreshBot="props.refreshBot" :loading="props.loading"></LLMCaching>
  <UiSeparator orientation="horizontal" class="bg-[#E2E8F0]" />
  <Tools :botDetails="props.botDetails" :refreshBot="props.refreshBot" :loading="props.loading"
    :audioResponseData="audioResponseData" :audioDataRefresh="audioDataRefresh"></Tools>
</template>
<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();

// Using an alias for audioResponseData
const props = defineProps<{ botDetails: any; loading: boolean; refreshBot: () => void }>();
const {
  audioResponseData,
  loading,
  error,
  audioDataRefresh
} = usePrerecordedAudioMetadata(
  route.params.id,
  props.botDetails.organizationId
);
</script>