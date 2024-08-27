<script setup lang="ts">
  import { ref } from "vue";
  import { playgroundRequests } from "~/server/utils/playground";

  const systemPrompts = ref(["", "", "", ""]);
  const userInput = ref("");
  const results = ref<string[]>([]);

  const processInput = async () => {
  try {
    results.value = [];
    
    const filteredPrompts = systemPrompts.value
      .map((prompt, index) => ({ prompt, index })) 
      .filter(item => item.prompt.trim() !== "");   

    if (filteredPrompts.length === 0) {
      results.value = ["No valid system prompts to process."];
      return;
    }

    const promptsArray = filteredPrompts.map(item => item.prompt);
    
    const response = await playgroundRequests(promptsArray, userInput.value);

    if (!response || !response.responses) {
      results.value = ["Error: No valid response received."];
      return;
    }

    const promptResults = new Array(systemPrompts.value.length).fill(null);

    filteredPrompts.forEach((item, index) => {
      if (response.responses[index]) {
        promptResults[item.index] = `Response: ${response.responses[index]}`;
      }
    });

    results.value = promptResults.map((result, index) => {
      if (result) {
        return result;
      } else {
        return `No response received for prompt: "${systemPrompts.value[index]}"`;
      }
    }).filter(result => result !== null);
  } catch (error) {
    console.error("Error processing input:", error);
    results.value = ["Error occurred while fetching results."];
  }
};
</script>
<template>
  <Page title="Tring AI Playground" :disable-back-button="true">
    <div class="shadow-lg mb-8 overflow-hidden rounded-lg bg-white">
      <div class="space-y-6 p-6">
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div
            v-for="(prompt, index) in systemPrompts"
            :key="index"
            class="space-y-2"
          >
            <UiLabel
              :for="`system-prompt-${index}`"
              class="block text-sm font-medium text-gray-700"
            >
              System Prompt {{ index + 1 }}
            </UiLabel>
            <UiTextarea
              :id="`system-prompt-${index}`"
              v-model="systemPrompts[index]"
              placeholder="Enter system prompt here..."
              class="min-h-[14rem] w-full resize-none rounded-md border px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
            ></UiTextarea>
          </div>
        </div>

        <div class="mt-8 space-y-6">
          <div v-for="(result, index) in results" :key="index">
            <h2 class="mb-4 text-xl font-semibold text-gray-900">
              Result {{ index + 1 }}
            </h2>
            <p class="whitespace-pre-wrap text-gray-700">{{ result }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="shadow-lg overflow-hidden rounded-lg bg-white">
      <div class="space-y-6 p-6">
        <div class="space-y-2">
          <UiLabel
            for="user-input"
            class="block text-sm font-medium text-gray-700"
            >User Input</UiLabel
          >
          <UiTextarea
            id="user-input"
            v-model="userInput"
            placeholder="Enter user input here..."
            class="min-h-[6rem] w-full resize-none rounded-md border px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          ></UiTextarea>
        </div>

        <div class="flex justify-end">
          <UiButton @click="processInput" color="primary"
            >Process Input</UiButton
          >
        </div>
      </div>
    </div>
  </Page>
</template>
