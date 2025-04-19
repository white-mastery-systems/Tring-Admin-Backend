<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from "vue";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { botStore } from "~/store/botStore";
import { useRoute } from "vue-router";
import { useDocumentUpload } from "~/composables/botManagement/chatBot/useDocumentUpload";

const scrapData = botStore();
const text = ref('');
const originalText = ref(''); // To track if content has changed
const selectedIndex = ref(0);
const route = useRoute();
const profiles = ref([]);
const isJsonData = ref(false);
const previousLoadingState = ref(false);
const needsInitialUpload = ref(true);

const props = defineProps<{
  contentSuggestions: any;
  loading: boolean;
  IndustryType: string;
  documents: any;
  refresh: () => void;
}>();

const { createDocuments, uploadStatus, isUploading, uploadError } = useDocumentUpload();

// Process JSON data if it exists
const processJsonContent = (content) => {
  if (!content) return content;

  try {
    // Check if content is a string that needs parsing
    const jsonData = typeof content === 'string' ? JSON.parse(content) : content;

    // Set flag that we have JSON data
    isJsonData.value = true;

    // Store the profiles for display
    if (Array.isArray(jsonData)) {
      profiles.value = jsonData;
    } else {
      profiles.value = [jsonData];
    }

    // Format the data nicely for the textarea
    return formatJsonToText(jsonData);
  } catch (error) {
    // Not JSON data, reset flag and return original
    isJsonData.value = false;
    return content;
  }
};

// Format JSON to readable text
const formatJsonToText = (data) => {
  if (Array.isArray(data)) {
    // For an array, format the first item
    return formatSingleProfile(data[0]);
  } else {
    // For a single object
    return formatSingleProfile(data);
  }
};

// Format a single profile object to readable text
const formatSingleProfile = (profile) => {
  if (!profile) return '';

  let result = '';
  for (const [section, content] of Object.entries(profile)) {
    result += `${section}\n\n${content}\n\n`;
  }
  return result;
};

// Force clear the text area - this is a more direct approach
const forceTextClear = () => {
  text.value = '';
  originalText.value = '';
  selectedIndex.value = null;
  needsInitialUpload.value = true; // Reset flag when forcing text clear
  nextTick(() => {
    text.value = '';  // Apply again on next tick to ensure it takes effect
  });
};

// Watch for loading state changes with higher priority
watch(
  () => props.loading,
  (isLoading) => {
    // Only act when changing from not loading to loading
    if (isLoading && !previousLoadingState.value) {
      forceTextClear();
      selectedIndex.value = null;
    }
    previousLoadingState.value = isLoading;
  },
  { immediate: true }  // This will run immediately when the component is created
);
// Watch for changes to text.value to unselect when user edits
watch(
  () => text.value,
  (newText) => {
    if (!props.contentSuggestions?.suggestions?.length) return;

    if (selectedIndex.value !== null) {
      const selectedSuggestion = props.contentSuggestions.suggestions[selectedIndex.value];
      if (selectedSuggestion) {
        const processedContent = processJsonContent(selectedSuggestion.content);
        if (newText !== processedContent) {
          selectedIndex.value = null;
        }
      }
    }
  }
);

// Modified onMounted to respect loading state
onMounted(() => {
  if (props.loading) {
    // If initially loading, make sure text is empty
    forceTextClear();
    selectedIndex.value = null;
  } else if (props.contentSuggestions?.suggestions?.length > 0) {
    const processedContent = processJsonContent(props.contentSuggestions.suggestions[0].content);
    text.value = processedContent; // Uncomment this line
    originalText.value = text.value; // Store the original text for comparison
    selectedIndex.value = 0; // Set initial selection
  }
});

const clearTextField = () => {
  text.value = "";
  selectedIndex.value = null;
  needsInitialUpload.value = true; // Reset flag when clearing text
};
// Expose method for parent access
const generatePDFAndUpload = async () => {
  if (!text.value.trim() && !props.documents.length) {
    toast.error("Please enter some text before generating the document.");
    return;
  }

  // Check if content has changed from the original OR if this needs initial upload
  const hasContentChanged = text.value !== originalText.value;

  // Proceed with API call if content has changed OR if this is the initial upload
  if (hasContentChanged || needsInitialUpload.value) {
    const pdf = new jsPDF();

    // Create a temporary div
    const tempDiv = document.createElement("div");
    tempDiv.style.width = "180mm";
    tempDiv.style.padding = "10px";
    tempDiv.style.fontFamily = "Arial, sans-serif";
    tempDiv.style.whiteSpace = "pre-wrap";
    tempDiv.innerText = text.value;
    document.body.appendChild(tempDiv);

    // Convert text content to image
    const canvas = await html2canvas(tempDiv);
    const imgData = canvas.toDataURL("image/png");

    pdf.addImage(imgData, "PNG", 10, 10, 180, 0);
    document.body.removeChild(tempDiv);

    // Convert PDF to Blob
    const pdfBlob = pdf.output("blob");
    const pdfFile = new File([pdfBlob], `${props.IndustryType}-document.pdf`, { type: "application/pdf" });

    // Prepare Payload
    const payload = {
      botId: route.params.id,
      document: {
        name: pdfFile.name,
        files: pdfFile,
      },
    };
    console.log("Payload for upload:", payload);
    if (text.value.trim()) {
      // Upload to API
      await createDocuments(payload.botId, payload.document);
      await props.refresh();
    } else {
      console.log("Text is empty, skipping API call");
    }

    // Update original text to current text since we've uploaded it
    originalText.value = text.value;

    // Mark that we no longer need the initial upload for this content
    needsInitialUpload.value = false;
  } else {
    // Optionally notify the user that no changes were detected
    console.log("No changes detected, skipping upload");
  }
};
const selectCard = (content: any, index: any) => {
  const processedContent = processJsonContent(content);
  text.value = processedContent;
  originalText.value = text.value; // Update original text when card is selected
  selectedIndex.value = index;
  needsInitialUpload.value = true; // Reset flag when a new card is selected
};

defineExpose({ clearTextField, generatePDFAndUpload });
</script>

<template>
  <div class="relative w-full border rounded-lg p-4">
    <!-- Main Content -->
    <div>
      <UiTextarea v-model="text" placeholder="" class="border-none p-2 h-40 text-[12px] sm:text-[12px] md:text-[14px]">
      </UiTextarea>

      <div v-if="props.contentSuggestions || props.loading"
        class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <!-- Show actual suggestions if they exist -->
        <template v-if="props.contentSuggestions?.suggestions?.length > 0">
          <div v-for="(card, index) in props.contentSuggestions.suggestions" :key="index"
            class="relative p-4 border rounded-lg shadow cursor-pointer max-h-[80px] overflow-y-auto"
            :class="selectedIndex === index ? 'bg-blue-50 border-blue-300' : 'bg-white'"
            @click="selectCard(card.content, index)">
            <!-- Card content with conditional blur/disable -->
            <div :class="{ 'opacity-30 pointer-events-none': props.loading }">
              <h3 class="font-medium text-gray-800 text-[12px] sm:text-[12px] md:text-[14px]">
                {{ card.title }}
              </h3>
              <p class="text-gray-600 text-[10px] sm:text-[10px] md:text-[12px]">
                {{ card.content && card.content.substring(0, 100) + (card.content.length > 100 ? '...' : '') }}
              </p>
            </div>
            <!-- Pulse animation for loading state -->
            <div v-if="props.loading" class="absolute inset-0 bg-white bg-opacity-90">
              <div class="animate-pulse h-full p-4">
                <div class="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div class="h-2 bg-gray-200 rounded w-full mb-1"></div>
                <div class="h-2 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </template>

        <!-- Show three dummy/skeleton cards when loading and no suggestions -->
        <template v-else-if="props.loading">
          <div v-for="i in 3" :key="'skeleton-' + i"
            class="relative p-4 border rounded-lg shadow max-h-[100px] overflow-hidden bg-gray-50">
            <!-- Skeleton content with pulse animation -->
            <div class="animate-pulse">
              <div class="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div class="h-2 bg-gray-200 rounded w-full mb-1"></div>
              <div class="h-2 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>