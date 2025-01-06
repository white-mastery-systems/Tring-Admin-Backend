import { logger } from "~/server/logger";

const clientId = "7763394615058.7867610213248";
const clientSecret = "546e3e06304360fe178e2736ca6b068c";

export async function regenerateAccessTokenForSlack({
  integrationData,
}: {
  integrationData: any;
}) {
  try {
    // console.log({ integrationData })
    const response = await $fetch(
      "https://slack.com/api/oauth.v2.access",
      {
        method: "POST",
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: "refresh_token",
          refresh_token: integrationData?.refresh_token,
        }),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );
   
    // console.log(`regenerating token: ${JSON.stringify(response)}`);
    return response;
  } catch (error) {
    logger.info(
      `Error regenerating slack access token: ${JSON.stringify(error)}`,
    );
  }
}

export async function generateAccessTokenFromCodeForSlack({
  code,
}: {
  code: string;
}) {
  try {
    const response: any = await $fetch(
      "https://slack.com/api/oauth.v2.access",
      {
        method: "POST",
        body: new URLSearchParams({
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: `${process.env.REDIRECT_URL}/slack`,
        }),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );

    console.log(
      `generateAccessTokenFromCodeForSlack, ${JSON.stringify(response)}`,
    );
    // Get access-token and refresh-token
    // const accessTokenWithRefreshToken = await $fetch(`https://slack.com/api/oauth.v2.exchange`,
    // {
    //   method: "POST",
    //   body: new URLSearchParams({
    //     token: response?.access_token,
    //     client_id: clientId,
    //     client_secret: clientSecret,
    //   }),
    //   headers: {
    //     "Content-Type": "application/x-www-form-urlencoded",
    //   },
    // })

    return response;
  } catch (error) {
    logger.info(
      `Error generating slack access token: ${JSON.stringify(error)}`,
    );
  }
}
