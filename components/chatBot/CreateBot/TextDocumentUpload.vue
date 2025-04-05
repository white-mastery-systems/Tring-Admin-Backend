<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { botStore } from "~/store/botStore";
import { useRoute } from "vue-router";
import { useDocumentUpload } from "~/composables/botManagement/chatBot/useDocumentUpload"; // Import the composable

const scrapData = botStore();
const text = ref('');
const selectedIndex = ref(0); // Set default index to 0
const route = useRoute();
const props = defineProps<{
  contentSuggestions: any; // Adjust type based on actual response structure
  loading: boolean;
  IndustryType: string;
  refresh: () => void;
}>();
const { createDocuments, uploadStatus, isUploading, uploadError } = useDocumentUpload();

// Replace your onMounted with this watch
watch(
  () => props.contentSuggestions?.suggestions,
  (newSuggestions) => {
    if (newSuggestions?.length > 0) {
      text.value = newSuggestions[0].content;
      selectedIndex.value = 0; // Also reset the selected index to 0
    }
  },
  { immediate: true } // This makes it run immediately on component creation, similar to onMounted
);
// Set default text to first suggestion if available
onMounted(() => {
  if (props.contentSuggestions?.suggestions?.length > 0) {
    text.value = props.contentSuggestions.suggestions[0].content;
  }
});

const clearTextField = () => {
  text.value = "";
  selectedIndex.value = null; // Clear selection when text is cleared
};

// Expose method for parent access
const generatePDFAndUpload = async () => {
  if (!text.value.trim()) {
    // toast.error("Please enter some text before generating the PDF.");
    return;
  }
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
  // Upload to API
  await createDocuments(payload.botId, payload.document);
  await props.refresh();
};

const selectCard = (content: any, index: any) => {
  text.value = content;
  selectedIndex.value = index;
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
                {{ card.content }}
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