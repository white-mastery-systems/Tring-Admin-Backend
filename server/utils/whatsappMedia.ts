import { logger } from "../logger";

export const uploadMedia = async (
  phoneId: string,
  accessToken: string,
  media: any,
  mediaType: string,
): Promise<any> => {
  const uploadMediaApiEndpoint = `https://graph.facebook.com/v21.0/${phoneId}/media`;

  const { data, filename, ...rest } = media
  const file = new File([data], filename!, rest);
  
  const form = new FormData();
  form.append('file', file);
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

export const createWhatsappMediaSession = async (accessToken: string, fileLength: string, fileType: string) => {
  try { 
    const createWhatsappMediaSessionApiUrl = `https://graph.facebook.com/v21.0/3404499776522072/uploads?file_length=${fileLength}&file_type=${fileType}`

    const createWhatsappMediaSessionResponse = await $fetch(createWhatsappMediaSessionApiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      }
    })
    logger.info("Whatsapp media session created successfully");
    return createWhatsappMediaSessionResponse
  } catch(error) {
    logger.error({
      message: "Error occurred while creating whatsapp media session",
      error: JSON.stringify(error),
      errorData: error?.data,
    })
    throw new Error("Failed to create whatsapp media session");
  }
}

export const uploadWhatsappMediaSession = async (accessToken: string, file: any, mediaSessionId: string) => {
  try {
    const uploadWhatsappMediaSessionApiUrl = `https://graph.facebook.com/v21.0/${mediaSessionId}`

    const response = await $fetch(uploadWhatsappMediaSessionApiUrl, {
      method: "POST",
      headers: {
        Authorization: `OAuth ${accessToken}`,
        // 'Content-Type': 'application/octet-stream',
      },
      body: file
    })
    logger.info("Whatsapp media session file uploaded successfully");
    return response
  } catch (error) {
     logger.error({
      message: "Error occurred while upload whatsapp media session file",
      error: JSON.stringify(error),
      errorData: error?.data,
    });
    throw new Error("Failed to upload whatsapp media session file");
  }
}