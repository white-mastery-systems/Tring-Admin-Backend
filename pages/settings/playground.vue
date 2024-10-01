<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { loadKnowledgeBase, playgroundRequests } from '~/server/utils/playground'
import type { DocumentResponse } from '~/utils/apis/playground'
import { Upload } from 'lucide-vue-next'

useHead({
  title: 'Settings | Playground',
})

const router = useRouter()
const route = useRoute()

const selectedFile = ref<File | null>(null)
const documentId = ref(route.query.id as string)

const systemInstructions = ref(['', '', '', ''])
const userQueries = ref(['', '', '', ''])
const knowledgeBaseResults = ref<string[]>([])
const processedResults = ref<string[]>([])

const handleFileChange = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    selectedFile.value = file
    // Add the playground document with the file and documentId
    const response: DocumentResponse = await addPlaygroundDocument({
      name: file.name,
      files: file,
    })
    documentId.value = response.id

    // Navigate to the same route with the documentId as a query parameter
    router.push({
      path: route.path,
      query: { id: response.id },
    })
  }
}

const processUserInput = async () => {
  try {
    processedResults.value = []

    if (!documentId.value) {
      toast.error('Please choose a document before chatting')
      return
    }

    const knowledgeResults = await loadKnowledgeBase(userQueries.value, documentId.value)

    // Filter and map system instructions
    const validInstructions = systemInstructions.value
      .map((instruction, index) => ({ instruction, index }))
      .filter((item) => item.instruction.trim() !== '')

    // Check if we have valid system instructions to process
    if (validInstructions.length === 0) {
      processedResults.value = ['No valid system instructions to process.']
      return
    }

    const updatedInstructions = validInstructions.map((instructionItem, idx) => {
      const knowledgeEntry = knowledgeResults[idx] || ''
      const updatedInstruction = instructionItem.instruction.replace(
        '${CONTEXT}',
        knowledgeEntry,
      )
      return { ...instructionItem, instruction: updatedInstruction }
    })

    const instructionsArray = updatedInstructions.map((item) => item.instruction)

    const response = await playgroundRequests(instructionsArray, userQueries.value)

    if (!response || !response.responses) {
      processedResults.value = ['Error: No valid response received.']
      return
    }

    const resultsArray = new Array(systemInstructions.value.length).fill(null)

    validInstructions.forEach((item, index) => {
      if (response.responses[index]) {
        resultsArray[item.index] = `${response.responses[index]}`
      }
    })

    processedResults.value = resultsArray
      .map((result, index) => {
        if (result) {
          return result
        } else {
          return `No response received for instruction: "${systemInstructions.value[index]}"`
        }
      })
      .filter((result) => result !== null)
  } catch (error) {
    console.error('Error processing input:', error)
    processedResults.value = ['Error occurred while fetching results.']
  }
}

const fileNames = computed(() => {
  return selectedFile.value ? selectedFile.value.name : ''
})
</script>

<template>
  <Page title="Tring AI Playground" :disable-back-button="true">
    <template #actionButtons>
      <div class="flex items-center gap-2">
        <p class="pr-6">
          {{ fileNames }}
        </p>
        <label
          for="dropzone-file"
          class="button-align cursor-pointer rounded-md bg-[#424bd1] p-2 text-[14px] font-medium text-white hover:bg-[#424bd1] hover:brightness-90"
        >
          <input
            id="dropzone-file"
            type="file"
            accept="application/pdf"
            class="hidden"
            @change="
              async (event) => {
                handleFileChange(event);
              }
            "
            v-bind="$attrs"
          />
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
          <div
            v-for="(prompt, index) in systemInstructions"
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
              v-model="systemInstructions[index]"
              placeholder="Enter system prompt here..."
              class="min-h-[12rem] w-full resize-none rounded-md border px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus-visible:ring-offset-0"
            >
            </UiTextarea>
          </div>
        </div>
        <div :class="processedResults.length > 0 ? 'mt-8 h-64' : ''">
          <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div
              v-for="(result, index) in processedResults"
              :key="index"
              class="space-y-2"
            >
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
          <UiLabel
            for="user-input"
            class="block text-sm font-medium text-gray-700"
            >User Input</UiLabel
          >
          <div class="flex flex-row gap-6">
            <!-- First User Input -->
            <UiTextarea
              id="user-input-1"
              v-model="userQueries[0]"
              placeholder="Enter first input here..."
              class="min-h-[0.5rem] w-full resize-none rounded-md border px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus-visible:ring-offset-0"
            />

            <!-- Second User Input -->
            <UiTextarea
              id="user-input-2"
              v-model="userQueries[1]"
              placeholder="Enter second input here..."
              class="min-h-[0.5rem] w-full resize-none rounded-md border px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus-visible:ring-offset-0"
            />

            <!-- Third User Input -->
            <UiTextarea
              id="user-input-3"
              v-model="userQueries[2]"
              placeholder="Enter third input here..."
              class="min-h-[0.5rem] w-full resize-none rounded-md border px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus-visible:ring-offset-0"
            />

            <!-- Fourth User Input -->
            <UiTextarea
              id="user-input-4"
              v-model="userQueries[3]"
              placeholder="Enter fourth input here..."
              class="min-h-[0.5rem] w-full resize-none rounded-md border px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus-visible:ring-offset-0"
            />

            <div class="flex items-center">
              <UiButton @click="processUserInput" color="primary"
                >Process Input</UiButton
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </Page>
</template>
