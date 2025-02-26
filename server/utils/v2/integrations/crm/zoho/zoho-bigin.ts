import { logger } from "~/server/logger"
import { zohoIntegrationApiBaseUrls } from "~/utils/zohoBaseUrls"

export const newGetAllPipelinesFromZohoBigin: any = async ({ integrationData }: { integrationData: any }) => {
  try {
    const metadata = integrationData?.metadata
    const data: any = await $fetch(
    `${zohoIntegrationApiBaseUrls[metadata?.location]}/bigin/v2/settings/layouts?module=Pipelines`,
    {
      headers: {
        Authorization: `Zoho-oauthtoken ${metadata?.access_token}`,
      },
    })
    console.log("newGetAllPipelinesFromZohoBigin" ,{newGetAllPipelinesFromZohoBigin })
    return data
  } catch (error: any) {
    logger.error(`newGetAllPipelinesFromZohoBigin Error: ${JSON.stringify(error.message)}`)
    if(error.status === 401) {
      const regenerateAccessToken = await regenearateTokenWithRefreshTokenForZohoIntegration({ integrationData })
      return newGetAllPipelinesFromZohoBigin({integrationData: regenerateAccessToken})
    }
  }
}

export const newGetAllSubPipelinesFromZohoBigin: any = async ({ integrationData }:{ integrationData: any }) => {
  try {
    const metadata = integrationData?.metadata
    const data: any = await $fetch(
     `${zohoIntegrationApiBaseUrls[metadata?.location]}/bigin/v2/settings/fields?module=Pipelines`,
     {
       headers: {
         Authorization: `Zoho-oauthtoken ${metadata?.access_token}`,
       },
     },
    );
    logger.debug(`Get Sub Pipelines: ${JSON.stringify(data)}`);
    console.log( "newGetub Pipelines", { data })

    return data.fields.find((field: any) => field.api_name === "Sub_Pipeline")
      ?.pick_list_values;

  } catch (error: any) {
    logger.error(`newGetAllSubPipelinesFromZohoBigin Error: ${JSON.stringify(error.message)}`)
    if(error.status === 401) {
      const regenerateAccessToken = await regenearateTokenWithRefreshTokenForZohoIntegration({ integrationData })
      return newGetAllSubPipelinesFromZohoBigin({ integrationData: regenerateAccessToken})
    }
  }
}

export const newGenerateContactInZohoBigin: any = async ({body, integrationData} : { body: any, integrationData: any }) => {
  try {
    const metadata = integrationData?.metadata
    const data = await $fetch(`${zohoIntegrationApiBaseUrls[metadata?.location]}/bigin/v2/Contacts`, {
      method: "POST",
      body: { data: [body] },
      headers: {
        Authorization: `Zoho-oauthtoken ${metadata?.access_token}`,
      },
    });
    logger.debug(`Generated Contact: ${JSON.stringify(data)}`);
    return data;

  } catch (error: any) {
    logger.error(`newGenerateContactInZohoBigin Error: ${JSON.stringify(error.message)}`)
    if (error.status === 400) {
      return {
        data: [
          {
            details: {
              id: error.data.data[0].details?.duplicate_record?.id,
            },
          },
        ],
      };
    }
    if(error.status === 401) {
      const regenerateAccessToken = await regenearateTokenWithRefreshTokenForZohoIntegration({ integrationData })
      return newGenerateContactInZohoBigin({ body, integrationData: regenerateAccessToken })
    }
  }
}

export const newGenerateLeadInZohoBigin: any = async ({ body, integrationData }: { body: any, integrationData: any }) => {
  try { 
    const metadata = integrationData?.metadata
    const generatedPipeline = await $fetch(
      `${zohoIntegrationApiBaseUrls[metadata?.location]}/bigin/v2/Pipelines`,
      {
        method: "POST",
        body: { data: [body] },
        headers: {
          Authorization: `Zoho-oauthtoken ${metadata?.access_token}`,
        },
      },
    );
    logger.debug(`Generated Pipeline: ${JSON.stringify(generatedPipeline)}`);
    return generatedPipeline;
  } catch (error: any) {
    logger.error(`newGenerateLeadInZohoBigin Error: ${JSON.stringify(error.message)}`)
    if(error.status === 401) {
      const regenerateAccessToken = await regenearateTokenWithRefreshTokenForZohoIntegration({ integrationData })
      return newGenerateLeadInZohoBigin({ body, integrationData: regenerateAccessToken })
    }
  }
}

export const newUpdateNotesInZohoBigin: any = async ({ zohoBiginLeadId, body, integrationData } : { zohoBiginLeadId: string, body: any, integrationData: any }) => {
  try {
    const metadata = integrationData?.metadata
    const data = await $fetch(`${zohoIntegrationApiBaseUrls[metadata?.location]}/bigin/v2/Pipelines/${zohoBiginLeadId}/Notes`, {
      method: "POST",
      body: { 
        data: [
          {
            "Note_Title": body
          }
        ],
      },
      headers: {
        Authorization: `Zoho-oauthtoken ${metadata?.access_token}`,
      },
    });
    logger.debug(`updateNotesInZohoBigin: ${JSON.stringify(data)}`);
    return data;
  } catch(error: any) {
    logger.error(`newUpdateNotesInZohoBigin Error: ${JSON.stringify(error.message)}`)
    if(error.status === 401) {
      const regenerateAccessToken = await regenearateTokenWithRefreshTokenForZohoIntegration({ integrationData })
      return newUpdateNotesInZohoBigin({ zohoBiginLeadId, body, integrationData: regenerateAccessToken })
    }
  }
}