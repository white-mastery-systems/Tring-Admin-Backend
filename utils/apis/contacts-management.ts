export const uploadNumber = async (files: File) => {
  const form = new FormData();
  form.append("file", files);

  try {
    const data = await $fetch("/api/org/contacts/import", {
      method: "POST",
      body: form,
    });
     if (!data?.status) toast.error(data?.message);
     else toast.success("File uploaded successfully");
  } catch (error) {
    toast.error("File upload failed");
    console.error("Upload error:", error);
  }
};


// Voice bot
export const getBucketContactsDetails = async (id: string) => {
  const getSingleBucketDetails = await $fetch<SelectChatBot & { documents: SelectDocument[] }>(
    `/api/org/contact-list/` + id,
  );
  return getSingleBucketDetails;
};