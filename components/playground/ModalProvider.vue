<template>
  <div class="flex items-center gap-2">
    <UiSelect v-model="selectedProvider">
      <UiSelectTrigger class="min-w-[110px]">
        <UiSelectValue placeholder="Select a Channel" />
      </UiSelectTrigger>
      <UiSelectContent>
        <UiSelectItem v-for="(list, index) in providerOptions" :key="index" :value="list.value">
          {{ list.label }}
        </UiSelectItem>
      </UiSelectContent>
    </UiSelect>
    <UiSelect v-model="selectedModel">
      <UiSelectTrigger class="min-w-[190px]">
        <UiSelectValue placeholder="Select a Channel" />
      </UiSelectTrigger>
      <UiSelectContent>
        <UiSelectItem v-for="(list, index) in modelOptions[selectedProvider] || []" :key="index" :value="list.value">
          {{ list.label }}
        </UiSelectItem>
      </UiSelectContent>
    </UiSelect>
    <!-- <Dropdown v-model="selectedProvider" :options="providerOptions" optionLabel="label" optionValue="value"
      placeholder="Select a provider" class="w-full md:w-14rem" @change="onProviderChange" />

    <Dropdown v-model="selectedModel" :options="modelOptions[selectedProvider] || []" optionLabel="label"
      optionValue="value" placeholder="Select a model" class="w-full md:w-14rem" :disabled="!selectedProvider" /> -->
  </div>
</template>

<script setup lang="ts">
const providerOptions = [
  { value: 'anthropic', label: 'Anthropic' },
  { value: 'openai', label: 'OpenAI' },
  { value: 'google', label: 'Google' },
  { value: 'groq', label: 'Groq' }
];

const modelOptions = {
  anthropic: [
    { value: 'claude-3-opus-20240229', label: 'Claude 3 Opus' },
    { value: 'claude-3-sonnet-20240229', label: 'Claude 3 Sonnet' },
    { value: 'claude-3-haiku-20240307', label: 'Claude 3 Haiku' },
    { value: 'claude-2.1', label: 'Claude 2.1' },
    { value: 'claude-2.0', label: 'Claude 2.0' },
    { value: 'claude-instant-1.2', label: 'Claude Instant 1.2' }
  ],
  openai: [
    { value: 'gpt-4-0125-preview', label: 'GPT-4 0125 Preview' },
    { value: 'gpt-4-turbo-preview', label: 'GPT-4 Turbo Preview' },
    { value: 'gpt-4-1106-preview', label: 'GPT-4 1106 Preview' },
    { value: 'gpt-4', label: 'GPT-4' },
    { value: 'gpt-3.5-turbo-0125', label: 'GPT-3.5 Turbo 0125' },
    { value: 'gpt-3.5-turbo-1106', label: 'GPT-3.5 Turbo 1106' },
    { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' }
  ],
  google: [
    { value: 'gemini-pro', label: 'Gemini Pro' },
    { value: 'gemini-ultra', label: 'Gemini Ultra' },
    { value: 'palm-2', label: 'PaLM 2' }
  ],
  groq: [
    { value: 'mixtral-8x7b-32768', label: 'Mixtral 8x7B 32768' },
    { value: 'llama2-70b-4096', label: 'LLaMA 2 70B 4096' },
    { value: 'llama2-13b-chat', label: 'LLaMA 2 13B Chat' },
    { value: 'llama2-7b-chat', label: 'LLaMA 2 7B Chat' }
  ]
};

const selectedProvider = ref('');
const selectedModel = ref('');

const onProviderChange = () => {
  selectedModel.value = '';
};
</script>