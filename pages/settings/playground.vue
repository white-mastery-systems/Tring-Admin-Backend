<script setup lang="ts">
  import { ref } from "vue";
  import {
    loadKnowledgeBase,
    playgroundRequests,
  } from "~/server/utils/playground";
  import type { DocumentResponse } from "~/utils/apis/playground";
import { File, Upload, Folder } from 'lucide-vue-next';

  const file = ref<HTMLInputElement["files"]>();

  const docId = ref("");

  const systemPrompts = ref(["", "", "", ""]);
  const userInput = ref("");
  const results = ref<string[]>([]);

  const handleFileChange = async (event: any) => {
    const file = event.target.files[0];
    if (file) {
      // Add the playground document with the file and docId
      const response: DocumentResponse = await addPlaygroundDocument({
        name: file.name,
        files: file,
      });

      docId.value = response.id;
    }
  };
  const processInput = async () => {
    try {
      results.value = [];
      const knowledge = await loadKnowledgeBase(userInput.value, docId.value);

      const filteredPrompts = systemPrompts.value
        .map((prompt, index) => ({ prompt, index }))
        .filter((item) => item.prompt.trim() !== "");

      if (filteredPrompts.length === 0) {
        results.value = ["No valid system prompts to process."];
        return;
      }

      const processedPrompts = filteredPrompts.map((item) => {
        const updatedPrompt = item.prompt.replace("{{CONTEXT}}", knowledge);
        return { ...item, prompt: updatedPrompt };
      });

      const promptsArray = processedPrompts.map((item) => item.prompt);

      const response = await playgroundRequests(promptsArray, userInput.value);

      if (!response || !response.responses) {
        results.value = ["Error: No valid response received."];
        return;
      }

      const promptResults = new Array(systemPrompts.value.length).fill(null);

      filteredPrompts.forEach((item, index) => {
        if (response.responses[index]) {
          promptResults[item.index] = `${response.responses[index]}`;
        }
      });

      results.value = promptResults
        .map((result, index) => {
          if (result) {
            return result;
          } else {
            return `No response received for prompt: "${systemPrompts.value[index]}"`;
          }
        })
        .filter((result) => result !== null);
    } catch (error) {
      console.error("Error processing input:", error);
      results.value = ["Error occurred while fetching results."];
    }
  };
  const fileNames = computed(() => {
    if (!file.value) {
      return "";
    }
    return Array.from(file.value)
      .map((f) => f.name)
      .join(", ");
  });
</script>
<template>
  <Page title="Tring AI Playground" :disable-back-button="true">
    <template #actionButtons>
      <div class="flex items-center gap-2">
        <p class="pr-6">
          {{ fileNames }}
        </p>
        <label for="dropzone-file"
          class="button-align cursor-pointer rounded-md bg-[#424bd1] p-2 text-[14px] font-medium text-white hover:bg-[#424bd1] hover:brightness-90">
          <input id="dropzone-file" type="file" accept="application/pdf" class="hidden" @change="
              async (event) => {
                handleFileChange(event);
              }
            " v-bind="$attrs" />
          <span class="hidden lg:inline">
            Choose File
          </span>
          <span class="lg:hidden">
            <component :is="Upload" :size="20"></component>
          </span>
        </label>
      </div>
    </template>
    <div class="shadow-lg mb-4 overflow-hidden rounded-lg bg-white">
      <div class="space-y-4 p-6 pb-0">
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div v-for="(prompt, index) in systemPrompts" :key="index" class="space-y-2">
            <UiLabel :for="`system-prompt-${index}`" class="block text-sm font-medium text-gray-700">
              System Prompt {{ index + 1 }}
            </UiLabel>
            <UiTextarea :id="`system-prompt-${index}`" v-model="systemPrompts[index]"
              placeholder="Enter system prompt here..."
              class="min-h-[12rem] w-full resize-none rounded-md border px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus-visible:ring-offset-0">
            </UiTextarea>
          </div>
        </div>
        <div :class="results.length > 0 ? 'mt-8 h-64' : ''">
          <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div v-for="(result, index) in results" :key="index" class="space-y-2">
              <h2 class="block text-sm font-medium text-gray-700">
                Result {{ index + 1 }}
              </h2>
              <div class="h-52 overflow-y-auto rounded-md border px-3">
                <p class="whitespace-pre-wrap text-gray-700">{{ result }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="shadow-lg overflow-hidden rounded-lg bg-white pb-9">
      <div class="space-y-4 p-6 pt-0">
        <div class="space-y-2">
          <UiLabel for="user-input" class="block text-sm font-medium text-gray-700">User Input</UiLabel>
          <div class="flex flex-row gap-6">
            <UiTextarea id="user-input" v-model="userInput" placeholder="Enter user input here..."
              class="min-h-[0.5rem] w-full resize-none rounded-md border px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus-visible:ring-offset-0">
            </UiTextarea>
            <div class="flex items-center">
              <UiButton @click="processInput" color="primary">Process Input</UiButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Page>
</template>
