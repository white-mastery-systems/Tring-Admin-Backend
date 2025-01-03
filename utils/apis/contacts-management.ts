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

export const uploadBucketNumber = async (files: File, bucketId: string) => {
  const form = new FormData();
  form.append("file", files);

  try {
    const data = await $fetch(`/api/org/contact-list/${bucketId}/importContacts`, {
      method: "POST",
      body: form,
    });
    console.log(data, "data -- data")
    if (!data) toast.error(data?.message ? data?.message : "File upload failed");
    toast.success("File uploaded successfully");
  } catch (error: any) {
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

// Voice bot
export const getBucketDetailsAddCampaign = async (botType: string) => {
  const transformadBotType = botType === 'whatsapp' ? 'chat' : botType;
  const getSingleBucketDetails = await $fetch<SelectChatBot & { documents: SelectDocument[] }>(
    `/api/org/contact-list?type=${transformadBotType}`,
  );
  return getSingleBucketDetails;
};

export const getWhatsappTemplateList = async (integrationId: string) => {
  // const transformadBotType = botType === 'whatsapp' ? 'chat' : botType;
  const getTemplateDetails = await $fetch<any>(
    `/api/templates?q=${integrationId}&status=approved`,
  );
  // api / templates ? q = 8a43f116 - a52f - 470f - b49c - ed8bd90687e0 & status=approved
  return getTemplateDetails;
};
