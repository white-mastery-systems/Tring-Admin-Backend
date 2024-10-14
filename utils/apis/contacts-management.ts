export const uploadNumber = async (files: File) => {
  const form = new FormData();
  form.append("file", files);

  try {
    await $fetch("/api/org/contacts/import", {
      method: "POST",
      body: form,
    });

    toast.success("File uploaded successfully");
  } catch (error) {
    toast.error("File upload failed");
    console.error("Upload error:", error);
  }
};
