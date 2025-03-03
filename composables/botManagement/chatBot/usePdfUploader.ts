import { ref } from "vue";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const usePdfUploader = () => {
  const text = ref("");

  const generatePDFAndUpload = async (botId: string, createDocument: Function) => {
    if (!botId) {
      console.error("Bot ID is required");
      return;
    }

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

    // Convert Blob to File
    const pdfFile = new File([pdfBlob], "document.pdf", { type: "application/pdf" });

    // Prepare Payload
    const payload = {
      botId,
      document: {
        name: pdfFile.name,
        files: pdfFile, // Send generated PDF
      },
    };

    // Upload to API
    await createDocument(payload.botId, payload.document);
  };

  return {
    text,
    generatePDFAndUpload,
  };
};

export default usePdfUploader;
