interface DeleteBuckerNumber {
  id: string,
  queryId: any,
  onSuccess: () => void
}

export const bucketNumber = async ({
  queryId,
  id,
  onSuccess,
}:DeleteBuckerNumber) => {
  try {
    const deleteIntegration = await $fetch<DeleteBuckerNumber>(
      `/api/org/contact-list/${queryId}/contacts/${id}`,
      {
        method: "DELETE",
      },
    );
    onSuccess();
    console.log(deleteIntegration, 'deleteIntegration')
    toast.success("Removed successfully");
    return deleteIntegration;
  } catch (err: any) {
    toast.error(err.data.statusMessage);
  }
}


// campaings

export const deleteSingleNumber = async ({
  id,
  onSuccess,
}:DeleteBuckerNumber) => {
  try {
    const deleteIntegration = await $fetch<DeleteBuckerNumber>(
      `/api/org/campaign/${id}`,
      {
        method: "DELETE",
      },
    );
    onSuccess();
    console.log(deleteIntegration, 'deleteIntegration')
    toast.success("Removed successfully");
    return deleteIntegration;
  } catch (err: any) {
    toast.error(err.data.statusMessage);
  }
}
