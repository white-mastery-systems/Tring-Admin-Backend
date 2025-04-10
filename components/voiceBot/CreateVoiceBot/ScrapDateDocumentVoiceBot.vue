<script setup lang="ts">
import { ref, watch, onMounted, computed } from "vue";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { botStore } from "~/store/botStore";
import { useRoute } from "vue-router";
import { useDocumentUpload } from "~/composables/botManagement/chatBot/useDocumentUpload";

const scrapData = botStore();
const route = useRoute();
const props = defineProps<{
  refresh: () => void
}>();

// Get data from store or localStorage
const localStorageData = ref(null);
const text = ref("");

// Try to load from localStorage
const loadFromLocalStorage = () => {
  try {
    const savedData = localStorage.getItem('voiceBotScrapedData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      localStorageData.value = parsedData;
      return parsedData;
    }
    return null;
  } catch (err) {
    console.error("Failed to get voice bot data from localStorage:", err);
    return null;
  }
};

// Initialize data
onMounted(() => {
  // Initial load attempt
  const storeData = scrapData.voiceBotScrapedData?.document_content;
  const localData = loadFromLocalStorage();

  if (storeData) {
    text.value = storeData;
  } else if (localData && localData.document_content) {
    text.value = localData.document_content;

    // Update store with localStorage data
    if (!scrapData.voiceBotScrapedData && localData) {
      scrapData.voiceBotScrapedData = localData;
    }
  }
});

// Watch for localStorage changes
watch(localStorageData, (newValue) => {
  if (newValue && newValue.document_content) {
    text.value = newValue.document_content;
  }
}, { deep: true });

// Watch for store changes (primary source)
watch(() => scrapData.voiceBotScrapedData?.document_content, (newValue) => {
  if (newValue) {
    text.value = newValue;
  } else {
    // If store data is removed, try to fall back to localStorage
    const localData = loadFromLocalStorage();
    if (localData && localData.document_content) {
      text.value = localData.document_content;
    }
  }
}, { deep: true, immediate: true });

// Watch for empty text and try to reload
watch(() => text.value, (newValue) => {
  if (!newValue || newValue.trim() === '') {
    // Text is empty, try to load from localStorage
    const localData = loadFromLocalStorage();
    if (localData && localData.document_content) {
      text.value = localData.document_content;
    }
  }
}, { immediate: true });

const clearTextField = () => {
  text.value = "";
};

// Expose method for parent access
defineExpose({ clearTextField });

const { createDocuments, uploadStatus, isUploading, uploadError } = useDocumentUpload();
</script>

<template>
  <div class="w-full">
    <UiTextarea v-model="text" placeholder="Content will appear here"
      class="border p-2 h-40 text-[10px] sm:text-[10px] md:text-[14px]" :readonly="true">
    </UiTextarea>
    <!-- <UiButton @click="generatePDFAndUpload" class="flex mt-2 text-white px-4 py-2 rounded">
      Download PDF
    </UiButton> -->
  </div>
</template>