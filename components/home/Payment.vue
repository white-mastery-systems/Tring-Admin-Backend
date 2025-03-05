<!-- <script setup>
const verifyCard = async (cardDetails) => {
  try {
    const data = await $fetch('/api/create-verification-token', {
      method: 'POST',
      body: cardDetails
    });

    const options = {
      key: "rzp_test_VWufllq6ZPU2tU", // Replace with your Razorpay key
      amount: 100, // Amount in paise (₹1)
      currency: "INR",
      name: "Your Business",
      description: "Card Verification",
      order_id: data.id,
      handler: async (response) => {
        await verifyPayment(response);
      },
      prefill: {
        name: cardDetails.name,
        email: cardDetails.email,
        contact: cardDetails.phone
      },
      theme: {
        color: "#3399cc"
      },
      modal: {
        ondismiss: function () {
          console.log("Verification canceled");
        }
      }
    };

    const rzp = new Razorpay(options);
    rzp.open();
  } catch (error) {
    console.error('Error:', error);
  }
};

const verifyPayment = async (response) => {
  try {
    const data = await $fetch('/api/verify-payment', {
      method: 'POST',
      body: response
    });
    if (data.verified) {
      console.log("Card verification successful.");
    } else {
      console.error("Card verification failed.");
    }
  } catch (error) {
    console.error('Verification Error:', error);
  }
};
</script>

<template>
  <button @click="verifyCard({ name: 'John Doe', email: 'john@example.com', phone: '9876543210' })">
    Verify Card
  </button>
</template> -->
<script setup>
import { ref, watch } from "vue";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const text = ref("");

const generatePDFAndUpload = async () => {
  if (!text.value.trim()) return; // Prevent calling API with empty text

  const pdf = new jsPDF();

  // Create a temporary div to render text properly
  const tempDiv = document.createElement("div");
  tempDiv.style.width = "180mm"; // A4 width
  tempDiv.style.padding = "10px";
  tempDiv.style.fontFamily = "Arial, sans-serif";
  tempDiv.style.whiteSpace = "pre-wrap"; // Preserve line breaks
  tempDiv.innerText = text.value;
  document.body.appendChild(tempDiv);

  // Convert text content to image
  const canvas = await html2canvas(tempDiv);
  const imgData = canvas.toDataURL("image/png");

  // Add image to PDF
  pdf.addImage(imgData, "PNG", 10, 10, 180, 0);

  // Cleanup temporary div
  document.body.removeChild(tempDiv);

  // Convert PDF to Blob
  const pdfBlob = pdf.output("blob");

  // Convert Blob to File (Required for API)
  const pdfFile = new File([pdfBlob], "document.pdf", { type: "application/pdf" });

  // Prepare Payload
  const payload = {
    botId: 'b75338b4-9163-4ad7-8a0f-a7cc11834b11',
    document: {
      name: pdfFile.name,
      files: pdfFile, // Send generated PDF
    },
  };

  // Upload to API
  await createDocument(payload.botId, payload.document);

  // Update documents list
  // documents.value = await listDocumentsByBotId(paramId.params.id);
};

// **Watch for text changes and call API automatically**
watch(text, async (newText) => {
  if (newText.trim()) {
    await generatePDFAndUpload();
  }
});
</script>

<template>
  <div class="p-4 w-full">
    <UiTextarea v-model="text" placeholder="Enter text..." class="border p-2 h-40" :readonly="true"></UiTextarea>
    <UiButton @click="generatePDFAndUpload" class="flex mt-2 text-white px-4 py-2 rounded">
      Download PDF
    </UiButton>
  </div>
</template>



<!-- we can use like this 

  const { text, generatePDFAndUpload } = usePdfUploader();
  const uploadPDF = async () => {
  const botId = "b75338b4-9163-4ad7-8a0f-a7cc11834b11"; // Replace dynamically if needed
  await generatePDFAndUpload(botId, createDocument);
  };

<div class="p-4 w-full">
  <UiTextarea v-model="text" placeholder="Enter text..." class="border p-2 h-40"></UiTextarea>
  <UiButton @click="uploadPDF" class="flex mt-2 text-white px-4 py-2 rounded">
    Download PDF
  </UiButton>
</div> -->