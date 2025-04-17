<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { botStore } from "~/store/botStore";
import { useRoute } from "vue-router";

const scrapData = botStore();
const text = ref('');
const selectedIndex = ref(0); // Set default index to 0
const route = useRoute();

const props = defineProps<{
  contentSuggestions: any; // Adjust type based on actual response structure
  loading: boolean;
  refresh: () => void;
}>();

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

watch(() => props.contentSuggestions.knowledgeBase, (newObject) => {
  if (newObject) {
    text.value = newObject;
  }
});

// Expose method for parent access
const generatePDFAndUpload = async () => {
  if (!text.value.trim()) {
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

  await props.refresh();
};

const selectCard = (content: any, index: number) => {
  text.value = content;
  selectedIndex.value = index;
};

defineExpose({ clearTextField, generatePDFAndUpload, text });
</script>

<template>
  <div class="relative w-full border rounded-lg p-4">
    <div :class="{ 'opacity-30 pointer-events-none': props.loading }">
      <UiTextarea v-model="text" placeholder="" class="border-none p-2 h-40 text-[10px] sm:text-[10px] md:text-[14px]">
      </UiTextarea>
    </div>

    <!-- Loading Overlay -->
    <div v-if="props.loading" class="absolute inset-0 flex items-center justify-center z-50">
      <Icon name="svg-spinners:90-ring-with-bg" class="h-12 w-12 animate-spin" style="color: #FFBC42;" />
    </div>
  </div>
</template>

<style scoped>
.pointer-events-none {
  pointer-events: none;
}
</style>