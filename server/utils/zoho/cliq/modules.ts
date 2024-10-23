import { logger } from "~/server/logger";

const db = useDrizzle()

export const generateLeadsInZohoCliq: any = async(metaData: any, channelId: string, body: any, integrationId: string) => {
  try {
    // console.log("generateLeadsInZohoCliq",{ metaData, body })
     const data = await $fetch(`https://cliq.zoho.in/api/v2/channels/${channelId}/message`, {
      method: "POST",
      headers: { 
        Authorization: `Zoho-oauthtoken ${metaData.access_token}`
      },
      body: {
        text: `Lead generated:\n${body}`
      }
    })
    return data

  } catch (error) {
    logger.error(`generateLeadsInZohoCliq Error: ${JSON.stringify(error)}, metadata- ${metaData}, body - ${body}`)
    const integrationData = metaData
    if (error instanceof Error) {
      const response = (error as any).response;
      logger.error(`Error: generateLeadsInZohoCliq:----${JSON.stringify(response)}`)
      if (response && response.status === 401) {
         const newAuthInfo = await regenerateCliqAccessToken(integrationData?.refresh_token)
        logger.info(`generateLeadsInZohoCliq Access-Token----${JSON.stringify(newAuthInfo)}`)
          if(newAuthInfo) {
          const updateIntegration = await db.update(integrationSchema).set({
            metadata: {
              ...integrationData,
              ...newAuthInfo
            },
            updatedAt: new Date()
          }).where(eq(integrationSchema.id, integrationId))
          
          return await generateLeadsInZohoCliq(newAuthInfo,channelId, body);
          }
      } else {
        logger.error(`Error: generateLeadsInZohoCliq:----${JSON.stringify(error)}`)
        return { status: false }
      }
    }
  }
}


export const getZohoCliqChannels: any = async (id: string, metadata: any) => {
   try {
    const data = await $fetch(`https://cliq.zoho.in/api/v2/channels`,
      {
        method: "GET",
        headers: { 
          Authorization: `Zoho-oauthtoken ${metadata?.access_token}`
        },
      }
    )
   return data

  } catch (error) {
     const integrationData = metadata
    if (error instanceof Error) {
      const response = (error as any).response;
      logger.error(`Error: zohoCliqChannels:----${JSON.stringify(response)}`)
      if (response && response.status === 401) {
         const newAuthInfo = await regenerateCliqAccessToken(integrationData?.refresh_token)
         logger.info(`zohoCliqChannels Access-Token----${JSON.stringify(newAuthInfo)}`)
          if(newAuthInfo) {
          await db.update(integrationSchema).set({
            metadata: {
              ...integrationData,
              ...newAuthInfo
            },
            updatedAt: new Date()
          }).where(eq(integrationSchema.id, id))
          
          return await getZohoCliqChannels(id, newAuthInfo);
          }
      } else {
        logger.error(`Error: zohoCliqChannels:----${JSON.stringify(error)}`)
        return { status: false }
      }
    }
  }
}