// composables/useDocumentUpload.ts
import { ref } from 'vue';

// Define a type for possible upload statuses
type UploadStatus = 'idle' | 'loading' | 'success' | 'error';

export function useDocumentUpload() {
  const uploadStatus = ref<UploadStatus>('idle');
  const uploadError = ref<string | null>(null);
  const isUploading = ref(false); // Simple boolean flag for convenience

  const createDocuments = async (botId: string, document: { name: string; files: File }) => {
    if (!botId || !document) {
      uploadError.value = "Missing required parameters";
      uploadStatus.value = 'error';
      isUploading.value = false;
      return false;
    }

    try {
      // Set loading state
      uploadStatus.value = 'loading';
      isUploading.value = true;
      uploadError.value = null;
      
      // Create FormData for file upload
      const form = new FormData();
      form.append("name", document.name);
      form.append("files", document.files);
      
      // Use $fetch as in your original code
      await $fetch(`/api/bots/${botId}/documents`, {
        method: "POST",
        body: form,
      });
      
      toast.success("Document added successfully");
      uploadStatus.value = 'success';
      isUploading.value = false;
      return true;
    } catch (err: any) {
      console.error("Error uploading document:", err);
      uploadError.value = err.message || "Failed to upload document";
      uploadStatus.value = 'error';
      isUploading.value = false;
      toast.error(err.message || "Failed to upload document");
      return false;
    }
  };

  // Reset the status (useful for forms)
  const resetUploadStatus = () => {
    uploadStatus.value = 'idle';
    uploadError.value = null;
    isUploading.value = false;
  };

  return {
    uploadStatus,
    uploadError,
    isUploading, // Convenient boolean flag
    createDocuments,
    resetUploadStatus
  };
}