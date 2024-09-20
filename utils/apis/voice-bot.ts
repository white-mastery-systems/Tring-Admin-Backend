interface DeleteBuckerNumber {
  id: string,
  queryId: any,
  onSuccess: () => void
}
interface DeleteExoPhone {
  id: string,
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
}:DeleteExoPhone) => {
  try {
    const deleteIntegration = await $fetch<DeleteExoPhone>(
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
export const deleteSingleUser = async ({
  id,
  onSuccess,
}:DeleteExoPhone) => {
  try {
    const deleteIntegration = await $fetch<DeleteExoPhone>(
      `/api/user/${id}`,
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

export const deleteSingleExoPhone = async ({
  id,
  onSuccess,
}:DeleteExoPhone) => {
  try {
    const deleteIntegration = await $fetch<DeleteExoPhone>(
      `/api/org/integrations/number-integration/${id}`,
      {
        method: "DELETE",
      },
    );
    onSuccess();
    toast.success("Removed successfully");
    return deleteIntegration;
  } catch (err: any) {
    toast.error(err.data.statusMessage);
  }
}
