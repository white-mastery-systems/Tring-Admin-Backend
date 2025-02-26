import { zohoAuthApiBaseUrls } from "~/utils/zohoBaseUrls";
import { logger } from "~/server/logger";

//this is only for client CRM Connection server side don't change it /it never changes
export const newClientInfo = {
  clientId: "1000.7ZU032OIFSMR5YX325O4W3BNSQXS1U",
  clientSecret: "922f18d9e0d820fbebb9d93fee5cc8201e58fbda8c",
};

export async function regenearateTokenWithRefreshTokenForZohoIntegration({
  integrationData
}: {
  integrationData: any
}) {
  try {
    const clientLocation = integrationData?.metadata?.location
    const apiUrl = `${zohoAuthApiBaseUrls[clientLocation]}/oauth/v2/token?client_id=${newClientInfo.clientId}&grant_type=refresh_token&client_secret=${newClientInfo.clientSecret}&refresh_token=${integrationData.metadata.refresh_token}`;

    const response = await $fetch(apiUrl, {
      method: "POST",
    });

    const metadata = { ...integrationData.metadata, response }
  
    const updatedIntegrationData = await updateIntegrationById(integrationData.id, {
      metadata: metadata
    })
    return updatedIntegrationData
  } catch (error: any) {
    logger.error(`regenearateTokenWithRefreshToken Error: ${JSON.stringify(error.message)}`)
  }
}
