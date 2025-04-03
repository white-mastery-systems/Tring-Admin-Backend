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
  refresh: () => void;
}>();
const { createDocuments, uploadStatus, isUploading, uploadError } = useDocumentUpload();
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
  const pdfFile = new File([pdfBlob], "document.pdf", { type: "application/pdf" });
  // Prepare Payload
  const payload = {
    botId: route.params.id,
    document: {
      name: pdfFile.name,
      files: pdfFile,
    },
  };
console.log("generatePDFAndUpload -- generatePDFAndUpload",isUploading)
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
    <!-- Main Content with Conditional Blur -->
    <div :class="{ 'opacity-30 pointer-events-none': props.loading }">
      <UiTextarea v-model="text" placeholder="" class="border-none p-2 h-40 text-[12px] sm:text-[12px] md:text-[14px]">
      </UiTextarea>

      <div v-if="props.contentSuggestions" class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div v-for="(card, index) in props.contentSuggestions.suggestions" :key="index"
          class="p-4 border rounded-lg shadow cursor-pointer max-h-[80px] overflow-y-auto"
          :class="selectedIndex === index ? 'bg-blue-50 border-blue-300' : 'bg-white'"
          @click="selectCard(card.content, index)">
          <h3 class="font-medium text-gray-800 text-[12px] sm:text-[12px] md:text-[14px]">
            {{ card.title }}
          </h3>
          <p class="text-gray-600 text-[10px] sm:text-[10px] md:text-[12px]">
            {{ card.content }}
          </p>
        </div>
      </div>
    </div>

    <!-- Loading Overlay -->
    <div v-if="props.loading" class="absolute inset-0 flex items-center justify-center z-50">
      <Icon name="svg-spinners:90-ring-with-bg" class="h-12 w-12 animate-spin" style="color: #FFBC42;" />
    </div>
  </div>
</template>