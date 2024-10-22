import { logger } from "~/server/logger";

const db = useDrizzle()

export const generateLeadsInZohoCliq: any = async(metaData: any, body: any, integrationId: string) => {
  try {
    // console.log("generateLeadsInZohoCliq",{ metaData, body })
     const data = await $fetch("https://cliq.zoho.in/company/60021334729/api/v2/channelsbyname/testing/message", {
      method: "POST",
      headers: { 
        Authorization: `Zoho-oauthtoken ${metaData.access_token}`
      },
      body: {
        text: body
      }
    })
    return data

  } catch (error) {
    logger.error(`generateLeadsInZohoCliq Error: ${JSON.stringify(error)}`)
    const integrationData = metaData
    if (error instanceof Error) {
      const response = (error as any).response;
      logger.error(`Error: generateLeadsInZohoCliq:----${JSON.stringify(response)}`)
      if (response && response.status === 401) {
         const newAuthInfo = await regenerateCliqAccessToken(integrationData?.refresh_token)
        logger.info(`generateLeadsInZohoCliq Access-Token----${JSON.stringify(newAuthInfo)}`)
          if(newAuthInfo) {
          const updateIntegration = await db.update(integrationSchema).set({
            metaData: {
              ...integrationData,
              newAuthInfo
            }
          }).where(integrationSchema.id, integrationId)
          
          return await generateLeadsInZohoCliq(newAuthInfo, body);
          }
      } else {
        logger.error(`Error: generateLeadsInZohoCliq:----${JSON.stringify(error)}`)
        return { status: false }
      }
    }
  }
}
