<script setup lang="ts">
import { ref, watch } from "vue";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { botStore } from "~/store/botStore";
import { useRoute } from "vue-router";

const scrapData = botStore();
const text = ref('')
// const text = ref(scrapData.scrapedData?.knowledge_base?.document_content || "");
const route = useRoute();
const props = defineProps<{
  contentSuggestions: any; // Adjust type based on actual response structure
  refresh: () => void;
}>();
// Watch for changes in scrapData
// watch(
//   () => scrapData.scrapedData?.knowledge_base?.document_content,
//   (newValue) => {
//     if (newValue) {
//       text.value = newValue;
//     }
//   }
// );
const clearTextField = () => {
  text.value = "";
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

  // Upload to API
  await createDocument(payload.botId, payload.document);
  await props.refresh()
};

defineExpose({ clearTextField, generatePDFAndUpload });
// Auto-generate PDF when text updates
// watch(text, async (newText) => {
//   if (newText.trim()) {
//     await generatePDFAndUpload();
//   }
// });

</script>

<template>
  <div class="w-full border rounded-lg p-4">
    <UiTextarea v-model="text" placeholder="" class="border-none p-2 h-40">
    </UiTextarea>
    <div class="grid grid-cols-3 gap-4 mt-4" v-if="false">
      <div v-for="(card, index) in 3" :key="index" class="p-4 border rounded-lg shadow bg-white">
        <!-- <h3 class="font-semibold text-gray-800">Lorem Ipsum is simply dummy text of the printing</h3> -->
        <p class="text-sm text-gray-600">
          Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown...
        </p>
      </div>
    </div>
    <!-- <div class="flex justify-end mt-2">
      <UiButton type="button" @click="generatePDFAndUpload" class="flex mt-2 text-white px-4 py-2 rounded">
        Upload Document
      </UiButton>
    </div> -->
  </div>
</template>