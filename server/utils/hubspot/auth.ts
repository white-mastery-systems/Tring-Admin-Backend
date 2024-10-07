import { logger } from "~/server/logger";

const clientId = "e53831e3-2ce1-4213-8845-28148a16dc4c";
const clientSecret = "b9f95de6-1b2a-4d50-bbe7-fc45579bb6db";

export const getHubspotAccessToken = async (body: any) => {;
  const redirectUri = body?.redirectUri
  const authCode = body?.authCode
  try {
    const response: any = await $fetch('https://api.hubapi.com/oauth/v1/token', {
      method: "POST",
      params: {
        grant_type: 'authorization_code',
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        code: authCode
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    return { status: true, response }
      
  } catch (error: any) {
     logger.error(`Error fetching access token:, ${error}`)
     return { status: false }
  }
}

export const generateHubspotAccessTokenWithRefreshToken = async (refreshToken: string) => {
  try {
    const response: any = await $fetch('https://api.hubapi.com/oauth/v1/token', {
      method: "POST",
      params: {
        grant_type: 'refresh_token',
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    return { status: true, response }
  } catch (error: any) {
    logger.error(`Error fetching access token:, ${error}`)
    return { status: false }
  }
}
