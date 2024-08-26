<script setup lang="ts">
  import { ref } from "vue";

  const systemPrompts = ref(["", "", "", ""]);
  const userInput = ref("");
  const results = ref<string[]>([]);

  const processInput = async () => {
    try {
      // Clear previous results
      results.value = [];

      // Create an array of requests for all system prompts
      const requests = systemPrompts.value.map((prompt) =>
        $fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer sk-proj-azKg61babYsOINknwRcwT3BlbkFJYde7fnIRqVRYovgv3vnj`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini", // or any model you want to use
            messages: [
              { role: "system", content: prompt },
              { role: "user", content: userInput.value },
            ],
          }),
        }),
      );

      // Wait for all requests to complete
      const responses = await Promise.all(requests);

      // Extract the results and update the results array
      results.value = responses.map((response, index) => {
        if (response) {
          const result = response.choices[0].message.content;
          return `\nResponse: ${result}`;
        } else {
          return `No response received for prompt: "${systemPrompts.value[index]}"`;
        }
      });
    } catch (error) {
      console.error("Error processing input:", error);
      results.value = ["Error occurred while fetching results."];
    }
  };
</script>

<template>
  <!-- <div class="min-h-screen bg-gray-100 px-4 py-8 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-7xl">
      <h1 class="mb-8 text-3xl font-bold text-gray-900">Tring AI Playground</h1>
    </div>
  </div> -->
  <Page title="Tring AI Playground" :disable-back-button="true">
    <div class="shadow-lg mb-8 overflow-hidden rounded-lg bg-white">
      <div class="space-y-6 p-6">
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div
            v-for="(prompt, index) in systemPrompts"
            :key="index"
            class="space-y-2"
          >
            <label
              :for="`system-prompt-${index}`"
              class="block text-sm font-medium text-gray-700"
            >
              System Prompt {{ index + 1 }}
            </label>
            <textarea
              :id="`system-prompt-${index}`"
              v-model="systemPrompts[index]"
              placeholder="Enter system prompt here..."
              class="min-h-[6rem] w-full resize-none rounded-md border px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
            ></textarea>
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
          <label
            for="user-input"
            class="block text-sm font-medium text-gray-700"
            >User Input</label
          >
          <textarea
            id="user-input"
            v-model="userInput"
            placeholder="Enter user input here..."
            class="min-h-[6rem] w-full resize-none rounded-md border px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          ></textarea>
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
