<template>
  <Page title="Tring AI Playground" :disable-back-button="true">
    <template #actionButtons>
      <div class="flex items-center gap-2 overflow-scroll">
        <ModelProvider @providerChange="handleProviderChange" @modelChange="handleModelChange" />
        <PlaygroundSheet :system-prompt="systemPrompt" @update-variables="handleUpdateVariables" />
        <p class="pr-6">
          {{ fileNames }}
        </p>
        <label for="dropzone-file"
          class="button-align cursor-pointer rounded-md bg-[#424bd1] p-2 text-[14px] font-medium text-white hover:bg-[#424bd1] hover:brightness-90">
          <input id="dropzone-file" type="file" accept="application/pdf" class="hidden" @change="async (event) => {
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
      <div class="flex cursor-pointer items-center justify-end" @click="resetChatPrompt">
        <span class="flex items-center gap-1 font-medium hover:text-[#424bd1]">
          Reset
          <component :is="RotateCw" :size="16"></component>
        </span>
      </div>
      <div class="space-y-4 p-6 pb-0">
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div v-for="(prompt, index) in systemInstructions" :key="index" class="space-y-2 mb-2">
            <UiLabel :for="`system-prompt-${index}`" class="block text-sm font-medium text-gray-700">
              System Prompt {{ index + 1 }}
            </UiLabel>
            <UiTextarea :id="`system-prompt-${index}`" v-model="systemInstructions[index]"
              placeholder="Enter system prompt here..."
              class="min-h-[12rem] w-full resize-none rounded-md border px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus-visible:ring-offset-0">
            </UiTextarea>
          </div>
        </div>
      </div>
    </div>
    <div class="shadow-lg overflow-hidden rounded-lg bg-white pb-6">
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
            <UiButton @click="processUserInput" class="bg-[#FFBC42] text-white hover:bg-[#FFBC42] hover:brightness-90"
              :loading="isLoading">
              Process Input
              <!-- Process Input -->
            </UiButton>
          </div>
        </div>
      </div>
    </div>

    <div v-if="allProcessedResults?.length" class="pb-6">
      <div class="pb-4 pl-2 text-[22px] font-bold text-[#424BD1]">
        Processed Chat Prompts
      </div>
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div v-for="(chatList, chatListIndex) in allProcessedResults" :key="chatListIndex" class="p-2">
          <div class="pb-4 text-[18px] font-bold">
            Result {{ chatListIndex + 1 }}
          </div>
          <div class="field_shadow scrollable-container max-h-[50vh] overflow-y-scroll rounded-xl bg-[#ffffff]">
            <div class="min-h-full" v-for="(chatItem, itemIndex) in chatList" :key="itemIndex">
              <div v-if="chatItem?.user" class="min-h-full bg-[#ffffff] p-2">
                <div class="flex w-full flex-col items-end">
                  <div
                    class="field_shadow mt-2.5 flex w-[90%] flex-col items-end justify-center rounded-l-xl rounded-br-xl bg-[#766DDB] p-2.5 text-white">
                    <div>
                      {{ chatItem?.user }}
                    </div>
                  </div>
                </div>
                <div
                  class="field_shadow mt-2.5 flex min-h-[80px] w-[90%] flex-col gap-2 rounded-r-xl rounded-bl-xl bg-[#ffffff] p-5">
                  <div>
                    <MdText :content="safeParseJson(chatItem.response)?.response" />
                    <div class="flex flex-col">
                      <div class="flex flex-wrap items-center gap-2" v-if="chatItem.response.length">
                        <div class="flex items-center" v-for="(btn, btnIndex) in safeParseJson(
                          chatItem.response,
                        )?.canned" :key="btnIndex">
                          <p class="w-auto cursor-pointer rounded-xl p-2" :style="{
                            background: `hsl(347 66 39/ 0.15)`,
                          }" @click="
                              questionControl(btn.question, chatListIndex)
                              ">
                            {{ btn.title }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Page>
</template>
<script setup lang="ts">
  import { RotateCw, Upload } from "lucide-vue-next";
  import { computed, ref } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import {
    getCurrentPrompt,
    loadKnowledgeBase,
    playgroundRequests,
  } from "~/server/utils/playground";
  import type { DocumentResponse } from "~/utils/apis/playground";
  definePageMeta({
    middleware: "user",
  });


  useHead({
    title: "Settings | Playground",
  });

  interface UserResponse {
    user: string;
    response: string;
  }

  const router = useRouter();
  const route = useRoute();

  const provider = ref("");
  const model = ref("");

  const selectedFile = ref<File | null>(null);
  const documentId = ref(route.query.id as string);
  const isLoading = ref(false);

  const systemInstructions = ref(["", "", "", ""]);
  const userQueries: any = ref(["", "", "", ""]);
  const variables = ref({});
  const systemPrompt = ref("");
  const allProcessedResults = ref<UserResponse[][]>([]);

  onMounted(async () => {
    const prompt = await getCurrentPrompt();

    if (prompt) {
      systemInstructions.value = systemInstructions.value.map(() => prompt);
      systemPrompt.value = systemInstructions.value[0];
    }
    const savedData = localStorage.getItem("playground_Value");
    if (savedData) {
      try {
        const getChatPromptResponse = JSON.parse(savedData);
        if (Array.isArray(getChatPromptResponse)) {
          allProcessedResults.value = getChatPromptResponse;
        } else {
          console.error("Unexpected data format:", getChatPromptResponse);
        }
      } catch (error) {
        console.error("Error parsing saved data:", error);
      }
    }
  });

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
    isLoading.value = true;
    try {
      if (!provider.value || !model.value) {
        toast.error("Please select a provider and model");
        return;
      }

      if (!documentId.value) {
        toast.error("Please choose a document before chatting");
        isLoading.value = false;
        return;
      }
      const processedUserQueries: any = userQueries.value.map((query: any) =>
        query.trim() === "" ? null : query,
      );
      const allQueriesNull = processedUserQueries.every(
        (query: any) => query === null,
      );

      if (allQueriesNull) {
        toast.error("Please Enter Input");
        isLoading.value = false;
        return;
      }
      const knowledgeResults: any = await loadKnowledgeBase(
        processedUserQueries,
        documentId.value,
      );

      const validInstructions = systemInstructions.value
        .map((instruction, index) => ({ instruction, index }))
        .filter((item) => item.instruction.trim() !== "");

      if (validInstructions.length === 0) {
        console.error("No valid system instructions to process.");
        return;
      }

      const instructionsArray = validInstructions.map((item) => {
        const knowledgeEntry = knowledgeResults[item.index] || "";
        return item.instruction.replace("${CONTEXT}", knowledgeEntry);
      });

      const response = await playgroundRequests(
        instructionsArray,
        processedUserQueries,
        provider.value,
        model.value,
      );

      if (!response || !response.responses) {
        console.error("Error: No valid response received.");
        return;
      }

      if (allProcessedResults.value.length === 0) {
        allProcessedResults.value = [[], [], [], []];
      }

      userQueries.value.forEach((query: string, index: number) => {
        const responseValue = response.responses[index] || "No response";

        const pairObject = {
          user: query,
          response: responseValue,
        };

        const arrayIndex = index % 4;
        allProcessedResults.value[arrayIndex].push(pairObject);
        localStorage.setItem(
          "playground_Value",
          JSON.stringify(allProcessedResults.value),
        );
      });
    } catch (error) {
      toast.error("Error processing input");
      console.error("Error processing input:", error);
      isLoading.value = false;
    }
    isLoading.value = false;
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
        return instruction.replace(/\${(\w+)}/g, (match: any, key: any) => {
          return variables.value[key] || match;
        });
      },
    );
  };
  const safeParseJson = (jsonString: string) => {
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.error("Invalid JSON:", error);
      return null;
    }
  };

  const resetChatPrompt = () => {
    isLoading.value = true;
    localStorage.removeItem("playground_Value");
    allProcessedResults.value = [];
    isLoading.value = false;
  };

  const questionControl = (item: string, index: any) => {
    userQueries.value[index] = "";
    if (!Array.isArray(userQueries.value[index])) {
      userQueries.value[index] = []; // Initialize it as an empty array
    }
    userQueries.value[index] = item;
  };

  const handleProviderChange = (newProvider: string) => {
    provider.value = newProvider;
    model.value = ""; // Reset model when provider changes
  };

  const handleModelChange = (newModel: string) => {
    model.value = newModel;
  };
</script>
<style scoped>
  .scrollable-container::-webkit-scrollbar {
    display: block;
    width: 6px;
  }
  .scrollable-container::-webkit-scrollbar-thumb {
    background: #9ca3af;
    border-radius: 10px;
  }
  .scrollable-container::-webkit-scrollbar-track {
    max-height: 8px !important;
    margin-block: 1rem !important;
  }
</style>
