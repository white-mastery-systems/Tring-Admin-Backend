import { logger } from "~/server/logger";

const clientId = "2d35af31-b5cc-4408-8eb6-377fe23592b5";
const clientSecret = "bc65ff3e-204c-4367-8b85-eb409ec9af13";

export const getHubspotAccessToken = async (body: any) => {
  const redirectUri = body?.redirectUri;
  const authCode = body?.authCode;
  try {
    const response: any = await $fetch(
      "https://api.hubapi.com/oauth/v1/token",
      {
        method: "POST",
        params: {
          grant_type: "authorization_code",
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          code: authCode,
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );
    return { status: true, response };
  } catch (error: any) {
    logger.error(`Error fetching access token:, ${error}`);
    return { status: false };
  }
};

export const generateHubspotAccessTokenWithRefreshToken = async (
  refreshToken: string,
) => {
  try {
    const response: any = await $fetch(
      "https://api.hubapi.com/oauth/v1/token",
      {
        method: "POST",
        params: {
          grant_type: "refresh_token",
          client_id: clientId,
          client_secret: clientSecret,
          refresh_token: refreshToken,
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );
    return { status: true, response };
  } catch (error: any) {
    logger.error(`Error fetching access token:, ${error}`);
    return { status: false };
  }
};
