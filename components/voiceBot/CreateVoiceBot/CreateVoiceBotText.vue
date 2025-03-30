<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { botStore } from "~/store/botStore";
import { useRoute } from "vue-router";
import { useDocumentUpload } from "~/composables/botManagement/chatBot/useDocumentUpload";

const scrapData = botStore();
const text = ref('');
const selectedIndex = ref(0); // Set default index to 0
const route = useRoute();

const props = defineProps<{
  contentSuggestions: any; // Adjust type based on actual response structure
  refresh: () => void;
}>();

// Uncomment if you need document upload functionality
// const { createDocuments, uploadStatus, isUploading, uploadError } = useDocumentUpload();

// Set default text to first suggestion if available
onMounted(() => {
  if (props.contentSuggestions.knowledgeBase) {
    text.value = props.contentSuggestions?.knowledgeBase;
  }
});

const clearTextField = () => {
  text.value = "";
  selectedIndex.value = null; // Clear selection when text is cleared
};

watch(
  () => text.value,
  (newText) => {
    if (scrapData.voiceBotScrapedData) {
      console.log("scrapData.voiceBotScrapedData", scrapData.voiceBotScrapedData);
      scrapData.voiceBotScrapedData = { document_content: newText };
    }
  }
);

watch(() => props.contentSuggestions.knowledgeBase, (newObject) => {
  console.log('newObject', newObject);
  if (newObject) {
    text.value = newObject;
  }
});

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

  // Uncomment if you need to use document upload functionality
  // await createDocuments(payload.botId, payload.document);
  await props.refresh();
};

const selectCard = (content: any, index: number) => {
  text.value = content;
  selectedIndex.value = index;
};

defineExpose({ clearTextField, generatePDFAndUpload });
</script>

<template>
  <div class="w-full border rounded-lg p-4">
    <!-- Removed debugging text output -->
    <UiTextarea v-model="text" placeholder="" class="border-none p-2 h-40 text-[10px] sm:text-[10px] md:text-[12px]">
    </UiTextarea>
    <!-- Suggestion cards section (uncommented for reference) -->
    <!-- <div class="grid grid-cols-3 gap-4 mt-4" v-if="props.contentSuggestions">
      <div
        v-for="(card, index) in props.contentSuggestions.suggestions"
        :key="index"
        class="p-4 border rounded-lg shadow cursor-pointer max-h-[80px] overflow-y-auto"
        :class="selectedIndex === index ? 'bg-blue-50 border-blue-300' : 'bg-white'"
        @click="selectCard(card.content, index)"
      >
        <h3 class="font-medium text-gray-800 text-[14px]">{{card.title}}</h3>
        <p class="text-sm text-gray-600 text-[12px]">
          {{card.content}}
        </p>
      </div>
    </div> -->
  </div>
</template>