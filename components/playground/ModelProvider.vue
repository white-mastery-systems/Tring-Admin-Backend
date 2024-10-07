<template>
  <div class="flex items-center gap-2">
    <UiSelect v-model="selectedProvider" @update:modelValue="onProviderChange">
      <UiSelectTrigger class="min-w-[110px]">
        <UiSelectValue placeholder="Select a Provider" />
      </UiSelectTrigger>
      <UiSelectContent>
        <UiSelectItem
          v-for="(list, index) in providerOptions"
          :key="index"
          :value="list.value"
        >
          {{ list.label }}
        </UiSelectItem>
      </UiSelectContent>
    </UiSelect>
    <UiSelect v-model="selectedModel" @update:modelValue="onModelChange">
      <UiSelectTrigger class="min-w-[190px]">
        <UiSelectValue placeholder="Select a Model" />
      </UiSelectTrigger>
      <UiSelectContent>
        <UiSelectItem
          v-for="(model, index) in modelOptions"
          :key="index"
          :value="model"
        >
          {{ model }}
        </UiSelectItem>
      </UiSelectContent>
    </UiSelect>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { getProviderModels } from "~/server/utils/playground";

const emit = defineEmits(["providerChange", "modelChange"]);

const providerOptions = [
  { value: "anthropic", label: "Anthropic" },
  { value: "openai", label: "OpenAI" },
  { value: "google", label: "Google" },
  { value: "groq", label: "Groq" },
];

const selectedProvider = ref("");
const selectedModel = ref("");
const modelOptions = ref<string[]>([]);

const fetchModelsForProvider = async (provider: string): Promise<void> => {
  try {
    const modelList = await getProviderModels(provider);
    modelOptions.value = modelList as string[];

    const firstModel = (provider === "openai") ? "gpt-4o-mini" : modelList[0];
    if (firstModel && !modelList?.includes(selectedModel.value)) {
      selectedModel.value = firstModel;
      emit("modelChange", selectedModel.value);
    }
  } catch (error) {
    console.error("Failed to fetch models", error);
    modelOptions.value = [];
  }
};

const onProviderChange = async (newProvider: string) => {
  emit("providerChange", newProvider);
  await fetchModelsForProvider(newProvider);
};

const onModelChange = (newModel: string) => {
  emit("modelChange", newModel);
};

watch(selectedProvider, async (newProvider) => {
  if (newProvider) {
    await fetchModelsForProvider(newProvider);
  }
});

onMounted(async () => {
  if (providerOptions.length > 0) {
    selectedProvider.value = providerOptions[1].value;
    onProviderChange(selectedProvider.value);
    selectedModel.value = modelOptions.value[21];
  }
});
</script>