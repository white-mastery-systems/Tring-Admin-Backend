import { logger } from "~/server/logger";

export async function getAllChannelsFromSlack(integrationData: any, integrationId: string) {
  try {
    // console.log({ integrationData, integrationId })
    const data: any = await $fetch<any>(
      "https://slack.com/api/conversations.list",
      {
        headers: {
          Authorization: `Bearer ${integrationData?.access_token}`,
        },
      },
    );
    if (
      (!data.ok && data?.error === "invalid_auth") ||
      (!data.ok && data.error === "token_revoked") ||  (!data.ok && data.error === "token_expired")
    ) {
      logger.error(`Slack access_token expired, ${JSON.stringify(data)}`);
      const newIntegrationData: any = await regenerateAccessTokenForSlack({
        integrationData: integrationData,
      });
      if(newIntegrationData.ok) {
        logger.error(`newIntegrationData, ${JSON.stringify(newIntegrationData)}`);
        await updateIntegrationById(integrationId, {...integrationData, ...newIntegrationData})
        return await getAllChannelsFromSlack(newIntegrationData, integrationId);
      }
    }
    // console.log("success", { data });

    return data
  
  } catch (error: any) {
    logger.error(
      `getAllChannelsFromSlack: integrationData: ${JSON.stringify(integrationData)}, error: ${JSON.stringify(error?.data)}`,
    );
  }
}

export async function joinSlackChannel({
  token,
  refreshToken,
  integrationData,
  channelId,
}: {
  token: string;
  refreshToken: String;
  integrationData: any;
  channelId: string;
}) {
  try {
    const data: any = await $fetch<any>(
      "https://slack.com/api/conversations.join",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        method: "POST",
        body: new URLSearchParams({
          channel: channelId,
        }),
      },
    );
    logger.info(`${JSON.stringify(data)}`);
    if (
      (!data.ok && data?.error === "invalid_auth") ||
      (!data.ok && data.error === "token_revoked")
    ) {
      console.log(`Slack access_token expired, ${JSON.stringify(data)}`);
      const newIntegrationData: any = await regenerateAccessTokenForSlack({
        integrationData: integrationData,
      });
      console.log("newIntegrationData", newIntegrationData);
      return await getAllChannelsFromSlack(newIntegrationData?.access_token);
    }
    console.log({ data });
    return data;
  } catch (error: any) {
    logger.error(
      `getAllChannelsFromSlack: token:${token}, refreshToken: ${refreshToken}, integrationData: ${JSON.stringify(integrationData)}, error: ${JSON.stringify(error?.data)}`,
    );
  }
}

export const createSlackMessage = async (
  integrationData: any,
  channelId: string,
  payload: any,
) => {
  try {
    const data: any = await $fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: {
        authorization: `Bearer ${integrationData?.access_token}`,
      },
      body: {
        channel: channelId,
        text: `Lead Generated :tada:\nName: ${payload?.name}\nEmail: ${payload?.email}\nPhone: ${payload?.phone}`,
      },
    });
    console.log(
      JSON.stringify({
        method: "POST",
        headers: {
          authorization: `Bearer ${integrationData?.access_token}`,
        },
        body: {
          channel: channelId,
          text: `Lead Generated :tada:\nFirst Name: ${payload?.firstName}\nLast Name: ${payload?.lastName}\nEmail: ${payload?.email}\nPhone: ${payload?.countryCode}${payload?.mobile}`,
        },
      }),
    );
    console.log({ data: JSON.stringify(data) });
    if (
      (!data.ok && data?.error === "invalid_auth") ||
      (!data.ok && data.error === "token_revoked")
    ) {
      const newIntegrationData = await regenerateAccessTokenForSlack({
        integrationData: integrationData,
      });
      return await createSlackMessage(newIntegrationData, channelId, payload);
    }

    return data;
  } catch (error) {
    logger.error(`Error creating slack message: ${JSON.stringify(error)}`);
  }
};
