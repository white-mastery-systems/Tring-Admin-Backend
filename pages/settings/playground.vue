<script setup lang="ts">
  import { ref, computed } from "vue";
  import { useRouter, useRoute } from "vue-router";
  import {
    getCurrentPrompt,
    loadKnowledgeBase,
    playgroundRequests,
  } from "~/server/utils/playground";
  import type { DocumentResponse } from "~/utils/apis/playground";
  import { Upload } from "lucide-vue-next";
  useHead({
    title: "Settings | Playground",
  });

interface UserResponse {
  user: string;
  response: string;
}

  const router = useRouter();
  const route = useRoute();

  const selectedFile = ref<File | null>(null);
  const documentId = ref(route.query.id as string);
  const isPageLoading = ref(false)

  const systemInstructions = ref(["", "", "", ""]);
  const userQueries = ref(["Pricing details", "Pricing details", "Pricing details", "Pricing details"]);
  const processedResults = ref<string[]>([]);
  const variables = ref({});
  const systemPrompt = ref("Hello ${da} and ${dg}");
const allProcessedResults = ref<UserResponse[][]>([]); // Store all results globally or in a parent scope

  const handleFileChange = async (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      selectedFile.value = file;

      const response: DocumentResponse = await addPlaygroundDocument({
        name: file.name,
        files: file,
      });
      documentId.value = response.id;

      router.push({
        path: route.path,
        query: { id: response.id },
      });
    }
  };

const processUserInput = async () => {
  try {
    if (!documentId.value) {
      toast.error("Please choose a document before chatting");
      return;
    }

    // Load knowledge base
    const knowledgeResults: any = await loadKnowledgeBase(
      userQueries.value,
      documentId.value,
    );

    const validInstructions = systemInstructions.value
      .map((instruction, index) => ({ instruction, index }))
      .filter((item) => item.instruction.trim() !== "");

    if (validInstructions.length === 0) {
      console.error("No valid system instructions to process.");
      return;
    }

    const instructionsArray = validInstructions.map(item => {
      const knowledgeEntry = knowledgeResults[item.index] || "";
      return item.instruction.replace("${CONTEXT}", knowledgeEntry);
    });

    // Fetch the responses
    const response = await playgroundRequests(instructionsArray, userQueries.value);

    if (!response || !response.responses) {
      console.error("Error: No valid response received.");
      return;
    }

    // Initialize allProcessedResults if it's empty
    if (allProcessedResults.value.length === 0) {
      allProcessedResults.value = [[], [], [], []];
    }

    // Process each user query and its response
    userQueries.value.forEach((query: string, index: number) => {
      const responseValue = response.responses[index] || "No response"; // Handle missing response

      // Create the input-response pair object
      const pairObject = {
        user: query,
        response: responseValue, // No need to stringify, as it's already in the correct format
      };

      // Add the pair to the appropriate array (0, 1, 2, or 3)
      const arrayIndex = index % 4;
      allProcessedResults.value[arrayIndex].push(pairObject);
      localStorage.setItem('playground_Value', JSON.stringify(allProcessedResults.value))
    });

    // Log all processed results in the desired format

  } catch (error) {
    console.error("Error processing input:", error);
  }
};

  const fileNames = computed(() => {
    return selectedFile.value ? selectedFile.value.name : "";
  });

  const handleUpdateVariables = (newVariables: any) => {
    variables.value = newVariables.reduce((acc: any, v: any) => {
      acc[v.name] = v.value;
      return acc;
    }, {});

    systemInstructions.value = systemInstructions.value.map(
      (instruction: string) => {
        return instruction.replace(/\${(\w+)}/g, (match: any, key:any) => {
          return variables.value[key] || match;
        });
      },
    );
  };
const safeParseJson = (jsonString: string) => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    // console.error('Invalid JSON:', error);
    return null; // Return null or a fallback object
  }
};

  onMounted(async () => {
    const prompt = await getCurrentPrompt();

    if (prompt) {
      systemInstructions.value = systemInstructions.value.map(() => prompt);
      systemPrompt.value = systemInstructions.value[0];
    }
    const savedData = localStorage.getItem('playground_Value');
    if (savedData) {
      allProcessedResults.value = JSON.parse(savedData);
    }
  });
</script>

<template>
  <Page title="Tring AI Playground" :disable-back-button="true" class="relative">
    <template #actionButtons>
      <div class="flex items-center gap-2">
        <PlaygroundSheet :system-prompt="systemPrompt" @update-variables="handleUpdateVariables" />
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
          <span class="hidden lg:inline"> Choose File </span>
          <span class="lg:hidden">
            <component :is="Upload" :size="20"></component>
          </span>
        </label>
      </div>
    </template>

    <div class="shadow-lg mb-4 overflow-hidden rounded-lg bg-white">
      <div class="space-y-4 p-6 pb-0">
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div v-for="(prompt, index) in systemInstructions" :key="index" class="space-y-2">
            <UiLabel :for="`system-prompt-${index}`" class="block text-sm font-medium text-gray-700">
              System Prompt {{ index + 1 }}
            </UiLabel>
            <UiTextarea :id="`system-prompt-${index}`" v-model="systemInstructions[index]"
              placeholder="Enter system prompt here..."
              class="min-h-[12rem] w-full resize-none rounded-md border px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus-visible:ring-offset-0">
            </UiTextarea>
          </div>
        </div>
        <!-- {{allProcessedResults}} || asfa -->
        <!-- <pre>{{ JSON.stringify(allProcessedResults, null, 2) }} || zsfadfa</pre> -->
      </div>
    </div>

    <div class="shadow-lg overflow-hidden rounded-lg bg-white">
      <div class="space-y-4 p-6 pt-0">
        <div class="space-y-2">
          <UiLabel for="user-input" class="block text-sm font-medium text-gray-700">User Input</UiLabel>
          <div class="flex flex-row gap-6">
            <!-- First User Input -->
            <UiTextarea id="user-input-1" v-model="userQueries[0]" placeholder="Enter first input here..."
              class="min-h-[0.5rem] w-full resize-none rounded-md border px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus-visible:ring-offset-0" />

            <!-- Second User Input -->
            <UiTextarea id="user-input-2" v-model="userQueries[1]" placeholder="Enter second input here..."
              class="min-h-[0.5rem] w-full resize-none rounded-md border px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus-visible:ring-offset-0" />

            <!-- Third User Input -->
            <UiTextarea id="user-input-3" v-model="userQueries[2]" placeholder="Enter third input here..."
              class="min-h-[0.5rem] w-full resize-none rounded-md border px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus-visible:ring-offset-0" />

            <!-- Fourth User Input -->
            <UiTextarea id="user-input-4" v-model="userQueries[3]" placeholder="Enter fourth input here..."
              class="min-h-[0.5rem] w-full resize-none rounded-md border px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus-visible:ring-offset-0" />

          </div>
          <div class="flex items-center justify-end pt-3">
            <UiButton @click="processUserInput" color="primary">Process Input</UiButton>
          </div>
        </div>
      </div>
    </div>

    <div v-if="true">
      <div class="bg-[#ffffff] grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div v-for="(chatList, chatListIndex) in allProcessedResults" :key="chatListIndex"
          class="p-2 max-h-[50vh] scrollable-container overflow-y-scroll field_shadow rounded-xl">
          <!-- {{chatList}} || asda -->
          <div v-if="true" class="bg-[#ffffff] p-2 min-h-full" v-for="(chatItem, itemIndex) in chatList"
            :key="itemIndex">
            <div class="flex w-full flex-col items-end">
              <div
                class="w-[90%] mt-2.5 flex flex-col items-end justify-center rounded-l-xl rounded-br-xl bg-[#ffffff] p-2.5 text-black field_shadow">
                <div>
                  {{ chatItem.user }}
                </div>
              </div>

            </div>
            <div
              class="w-[90%] field_shadow mt-2.5 flex min-h-[80px] flex-col gap-2 rounded-r-xl rounded-bl-xl bg-[#ffffff] p-5">
              <div>
                <MdText :content="safeParseJson(chatItem.response).response" />
                <div class="flex flex-col" v-if="false">
                  <div class="flex flex-wrap items-center gap-2">
                    <!-- v-for="(btn, btnIndex) in safeParseJson(messageList.content)?.canned" :key="btnIndex" -->
                    {{ safeParseJson(chatItem.response).response }}
                  </div>
                </div>
              </div>
              <!-- <div class="self-end text-[12px] text-[#00000066]">
                    {{ formatDate(new Date(messageList.createdAt), "hh:mma") }}
                    date
                  </div> -->
            </div>
          </div>
          <div v-if="false" class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div v-for="(chatItem, itemIndex) in chatList" :key="itemIndex"
              class="p-2.5 text-black rounded-l-xl rounded-br-xl mt-2.5 overflow-hidden">
              <div class="flex w-full flex-col items-end">
                <div
                  class="w-[90%] mt-2.5 flex flex-col items-end justify-center rounded-l-xl rounded-br-xl bg-[#ffffff] p-2.5 text-black field_shadow">
                  <div>
                    {{ chatItem.user }}
                  </div>
                </div>
              </div>

              <div class="field_shadow mt-2.5 flex flex-col gap-2 rounded-r-xl rounded-bl-xl p-5">
                <div class="overflow-y-auto max-h-[150px]"> <!-- Added max height and overflow for scrolling -->
                  <!-- <MdText :content="safeParseJson(chatItem.response)" /> -->
                  <div class="flex flex-col">
                    <div class="flex flex-wrap items-center gap-2">
                      <!-- {{ chatItem.response }} -->
                      {{ safeParseJson(chatItem.response).response }}
                    </div>
                  </div>
                </div>
                <div class="self-end text-[12px] text-[#00000066]">
                  <!-- Add date formatting here if needed -->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="isPageLoading" class="absolute flex items-center justify-center bg-white">
      <Icon name="svg-spinners:90-ring-with-bg" class="h-20 w-20" />
    </div>
    <!-- <div v-if="isPageLoading" class="grid h-[90vh] place-items-center text-[#424BD1]">
      <Icon name="svg-spinners:90-ring-with-bg" class="h-20 w-20" />
    </div>
    <div v-if="isPageLoading" class="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
      <Icon name="svg-spinners:90-ring-with-bg" class="h-20 w-20" />
    </div> -->
  </Page>
</template>
<style scoped>
.scrollable-container::-webkit-scrollbar {
  display: block;
  width: 4px;
}
.scrollable-container::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
   
}
.scrollable-container::-webkit-scrollbar-track {
  max-height: 15px !important;
  margin-block: 1rem !important;
}
</style>