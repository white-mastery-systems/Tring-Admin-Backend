import { logger } from "../logger";

export const uploadMedia = async (
  phoneId: string,
  accessToken: string,
  media: any,
  mediaType: string,
): Promise<any> => {
  const uploadMediaApiEndpoint = `https://graph.facebook.com/v21.0/${phoneId}/media`;

  const form = new FormData();
  form.append('file', media);
  form.append('type', mediaType);
  form.append('messaging_product', 'whatsapp');

  try {
    const uploadMediaApiResponse = await $fetch(uploadMediaApiEndpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: form,
    });
    logger.info("Media uploaded successfully");
    return uploadMediaApiResponse;
  } catch (error) {
    logger.error({
      message: "Error occurred while uploading media",
      error: JSON.stringify(error),
      errorData: error?.data,
    });
    throw new Error("Failed to upload media");
  }
};

export const retrieveMediaUrl = async (
  mediaId: string,
  accessToken: string,
): Promise<any> => {
  const retrieveMediaUrlApiEndpoint = `https://graph.facebook.com/v21.0/${mediaId}`;

  try {
    const retrieveMediaUrlApiResponse = await $fetch(
      retrieveMediaUrlApiEndpoint,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    logger.info("Media URL retrieved successfully");
    return retrieveMediaUrlApiResponse;
  } catch (error) {
    logger.error({
      message: "Error occurred while retrieving media URL",
      error: JSON.stringify(error),
      errorData: error?.data,
    });
    throw new Error("Failed to retrieve media URL");
  }
};
