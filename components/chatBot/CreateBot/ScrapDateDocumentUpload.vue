<script setup lang="ts">
import { ref, watch } from "vue";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { botStore } from "~/store/botStore";
import { useRoute } from "vue-router";
import { useDocumentUpload } from "~/composables/botManagement/chatBot/useDocumentUpload"; // Import the composable

const scrapData = botStore();
const text = ref(scrapData.scrapedData?.knowledge_base?.document_content || "");
const route = useRoute();
const props = defineProps<{
  IndustryType: string;
  refresh: () => void
}>();
const { createDocuments ,uploadStatus, isUploading, uploadError } = useDocumentUpload();
// Watch for changes in scrapData
watch(
  () => scrapData.scrapedData?.knowledge_base?.document_content,
  (newValue) => {
    if (newValue) {
      text.value = newValue;
    }
  },
  { deep:true, immediate: true } // This makes it run immediately on component creation, similar to onMounted
);

const clearTextField = () => {
  text.value = "";
};

// Expose method for parent access
defineExpose({ clearTextField });

const generatePDFAndUpload = async () => {
  if (!text.value.trim()) return;

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
  await props.refresh()
};

// Auto-generate PDF when text updates
watch(text, async (newText) => {
  if (newText.trim()) {
    await generatePDFAndUpload();
  }
});
onMounted(() => {
  if (text.value.trim()) {
    text.value = ''
  }
})
</script>

<template>
  <div class="w-full">
    <UiTextarea v-model="text" placeholder="" class="border p-2 h-40 text-[10px] sm:text-[10px] md:text-[14px]"
      :readonly="true">
    </UiTextarea>
  </div>
</template>