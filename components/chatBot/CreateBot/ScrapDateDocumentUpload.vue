<script setup>
import { ref, watch } from "vue";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { botStore } from "~/store/botStore";
import { useRoute } from "vue-router";
import { useBotDocuments } from '~/composables/botManagement/chatBot/useBotDocuments';

const scrapData = botStore();
const text = ref(scrapData.scrapedData?.knowledge_base?.document_content || "");
const route = useRoute();
const { status, documents, refresh } = useBotDocuments(route.params.id);
// Watch for changes in scrapData
watch(
  () => scrapData.scrapedData?.knowledge_base?.document_content,
  (newValue) => {
    if (newValue) {
      text.value = newValue;
    }
  }
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
  const pdfFile = new File([pdfBlob], "document.pdf", { type: "application/pdf" });
  // Prepare Payload
  const payload = {
    botId: route.params.id,
    document: {
      name: pdfFile.name,
      files: pdfFile,
    },
  };

  // Upload to API
  await createDocument(payload.botId, payload.document);
  await refresh()
};

// Auto-generate PDF when text updates
watch(text, async (newText) => {
  if (newText.trim()) {
    await generatePDFAndUpload();
  }
});

</script>

<template>
  <div class="w-full">
    <UiTextarea v-model="text" placeholder="" class="border p-2 h-40" :readonly="true">
    </UiTextarea>
    <!-- <UiButton @click="generatePDFAndUpload" class="flex mt-2 text-white px-4 py-2 rounded">
      Download PDF
    </UiButton> -->
  </div>
</template>