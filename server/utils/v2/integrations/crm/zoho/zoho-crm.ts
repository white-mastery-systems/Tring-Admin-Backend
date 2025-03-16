import { logger } from "~/server/logger";
import { zohoIntegrationApiBaseUrls } from "~/utils/zohoBaseUrls";
import { regenearateTokenWithRefreshTokenForZohoIntegration } from "./auth";

export const newGetAllLayoutsFromZohoCRM: any = async ({
  integrationData,
}: {
  integrationData: any;
}) => {
  try {
    const response = await $fetch(
      `${zohoIntegrationApiBaseUrls[integrationData?.metadata?.location]}/crm/v6/settings/layouts?module=Leads`,
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${integrationData?.metadata?.access_token}`,
        },
      })


    console.log("new GetAllLayoutsFromZohoCRM",{ response })
    return response
  } catch (error: any) {
    logger.error(`new getAllLayoutsFromZohoCRM Error: ${JSON.stringify(error.message)}`)
    if (error.status === 401) {
      const regenerateAccessToken = await regenearateTokenWithRefreshTokenForZohoIntegration({ integrationData })
      return newGetAllLayoutsFromZohoCRM({ integrationData: regenerateAccessToken })
    }
    throw new Error(error)
  }
}

export const newGetFieldMetadataFromZohoCRM: any = async ({
  integrationData
}:  {
  integrationData: any
}) => {
  try {
    const metadata = integrationData?.metadata
    await $fetch(`${zohoIntegrationApiBaseUrls[metadata?.location]}/crm/v6/settings/fields?module=Leads`, {
      method: "GET",
      headers: {
        Authorization: `Zoho-oauthtoken ${metadata?.access_token}`,
      },
    })
  } catch(error: any) {
    logger.error(`new getFieldMetadataFromZohoCRM Error: ${JSON.stringify(error.message)}`)
    if(error.status === 401) {
      const regenerateAccessToken = await regenearateTokenWithRefreshTokenForZohoIntegration({ integrationData })
      return newGetFieldMetadataFromZohoCRM({ integrationData: regenerateAccessToken })
    }
  }
}

export const newGenerateLeadInZohoCRM: any = async ({
  body,
  integrationData
}: {
  body: any
  integrationData: any
}) => {
  try {
    const metadata = integrationData?.metadata
    const data: any = await $fetch(`${zohoIntegrationApiBaseUrls[metadata?.location]}/crm/v6/Leads`, {
      method: "POST",
      body: { data: [body] },
      headers: {
        Authorization: `Zoho-oauthtoken ${metadata?.access_token}`,
      },
    })
    logger.info(`new generateLeadInZohoCRM data: ${JSON.stringify(data)}`)
    newUpdateNotesInZohoCRM({
      zohoCrmLeadId: data.data[0]?.details?.id,
      integrationData: integrationData,
      body: body?.Notes,
    });
    return data
  } catch (error: any) {
    logger.error(`new generateLeadInZohoCRM Error: ${JSON.stringify(error.message)}`)
    if(error.status === 401) {
      const regenerateAccessToken = await regenearateTokenWithRefreshTokenForZohoIntegration({ integrationData })
      return newGenerateLeadInZohoCRM({ body, integrationData: regenerateAccessToken })
    }
  }
}

export const newUpdateNotesInZohoCRM: any = async ({
  zohoCrmLeadId,
  integrationData,
  body
}: {
  zohoCrmLeadId: string,
  integrationData: any,
  body: any
}) => {
  try {
    const metadata = integrationData?.metadata
    const data = await $fetch(`${zohoIntegrationApiBaseUrls[metadata?.location]}/crm/v7/Leads/${zohoCrmLeadId}/Notes`, {
      method: "POST",
      body: { 
        data: [
          {
            "Note_Content": body
          }
        ],
      },
      headers: {
        Authorization: `Zoho-oauthtoken ${metadata?.access_token}`,
      },
    });
    logger.debug(`new updateNotesInZohoCRM: ${JSON.stringify(data)}`);
    return data;
  } catch (error: any) {
    logger.error(`new updateNotesInZohoCRM Error: ${JSON.stringify(error.message)}`)
    if(error.status === 401) {
      const regenerateAccessToken = await regenearateTokenWithRefreshTokenForZohoIntegration({ integrationData })
      return newUpdateNotesInZohoCRM({zohoCrmLeadId, body, integrationData: regenerateAccessToken })
    }
  }
}