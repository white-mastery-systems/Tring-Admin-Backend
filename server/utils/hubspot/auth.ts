import { logger } from "~/server/logger";

const clientId = "ae187200-936d-44f3-8e59-5bab2f50aa3c";
const clientSecret = "ebf7f5a1-51ea-4a18-8147-995c841bd390";

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
