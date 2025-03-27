// composables/useDocumentUpload.ts
import { ref } from 'vue';

// Define a type for possible upload statuses
type UploadStatus = 'idle' | 'pending' | 'success' | 'error';

// Create a single shared state across all instances
const uploadStatus = ref<UploadStatus>('idle');
const uploadError = ref<string | null>(null);
const isUploading = ref(false);

export function useDocumentUpload() {
  const createDocuments = async (botId: string, document: { name: string; files: File | File[] }) => {
    if (!botId || !document) {
      uploadError.value = "Missing required parameters";
      uploadStatus.value = 'error';
      isUploading.value = false;
      return false;
    }

    try {
      // Set loading state
      uploadStatus.value = 'pending';
      isUploading.value = true;
      uploadError.value = null;
      // Create FormData for file upload
      const form = new FormData();
      form.append("name", document.name);

      // Handle both single file and multiple files
      if (Array.isArray(document.files)) {
        document.files.forEach(file => {
          form.append("files", file);
        });
      } else {
        form.append("files", document.files);
      }

      // Use $fetch for API request
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
    isUploading,
    createDocuments,
    resetUploadStatus
  };
}