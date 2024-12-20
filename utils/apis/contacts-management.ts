export const uploadNumber = async (files: File, botType: string) => {
  const form = new FormData();
  form.append("file", files);

  try {
    const data = await $fetch("/api/org/contacts/import", {
      method: "POST",
      body: form,
      params: {
        type: botType
      }
    });
     if (!data?.status) toast.error(data?.message ? data?.message : "File upload failed");
     else toast.success("File uploaded successfully");
  } catch (error: any) {
    console.error("Upload error:", error);
    toast.error(error.statusMessage);
  }
};


// Voice bot
export const getBucketContactsDetails = async (id: string) => {
  const getSingleBucketDetails = await $fetch<SelectChatBot & { documents: SelectDocument[] }>(
    `/api/org/contact-list/` + id,
  );
  return getSingleBucketDetails;
};