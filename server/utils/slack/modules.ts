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
      (!data.ok && data.error === "token_revoked") || (!data.ok && data.error === "token_expired")
    ) {
      logger.error(`Slack access_token expired, ${JSON.stringify(data)}`);
      const newIntegrationData: any = await regenerateAccessTokenForSlack({
        integrationData: integrationData,
      });
      logger.info(`newIntegrationData regenerateAccessTokenForSlack - ${JSON.stringify(newIntegrationData)}`)
      if(newIntegrationData.ok) {
        logger.error(`newIntegrationData, ${JSON.stringify(newIntegrationData)}`);
  
        await updateIntegrationById(integrationId, { 
          metadata: {
          ...integrationData, 
          ...newIntegrationData
        }})
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
  integrationId
}: {
  token: string;
  refreshToken: String;
  integrationData: any;
  channelId: string;
  integrationId: string
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
      (!data.ok && data.error === "token_revoked") || (!data.ok && data.error === "token_expired")
    ) {
      // console.log(`Slack access_token expired, ${JSON.stringify(data)}`);
      const newIntegrationData: any = await regenerateAccessTokenForSlack({
        integrationData: integrationData,
      });
      if(newIntegrationData.ok) { 
        await updateIntegrationById(integrationId, { 
          metadata: {
          ...integrationData, 
          ...newIntegrationData
        }})
      // console.log("newIntegrationData", newIntegrationData);
      return await getAllChannelsFromSlack(newIntegrationData?.access_token, integrationId);
      }
    }
    // console.log({ data });
    return data;
  } catch (error: any) {
    logger.error(
      `getAllChannelsFromSlack: token:${token}, refreshToken: ${refreshToken}, integrationData: ${JSON.stringify(integrationData)}, error: ${JSON.stringify(error?.data)}`,
    );
  }
}

export const createSlackMessage: any = async (
  integrationData: any,
  channelId: string,
  payload: any,
  integrationId: any,
  notes: string
) => {
  try {
    const data: any = await $fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: {
        authorization: `Bearer ${integrationData?.access_token}`,
      },
      body: {
        channel: channelId,
        text: `*${notes ? notes : "Lead Generated" }* :tada:\nName: ${payload?.name}\nEmail: ${payload?.email}\nPhone: ${payload?.phone}\nBot Name: ${payload?.botName}`,
      },
    });
    // console.log(
    //   JSON.stringify({
    //     method: "POST",
    //     headers: {
    //       authorization: `Bearer ${integrationData?.access_token}`,
    //     },
    //     body: {
    //       channel: channelId,
    //       text: `Lead Generated :tada:\nFirst Name: ${payload?.firstName}\nLast Name: ${payload?.lastName}\nEmail: ${payload?.email}\nPhone: ${payload?.countryCode}${payload?.mobile}`,
    //     },
    //   }),
    // );
    // console.log({ data: JSON.stringify(data) });
     if (
      (!data.ok && data?.error === "invalid_auth") ||
      (!data.ok && data.error === "token_revoked") || (!data.ok && data.error === "token_expired")
    ){
      const newIntegrationData: any = await regenerateAccessTokenForSlack({
        integrationData: integrationData,
      });
      if(newIntegrationData.ok) {
        await updateIntegrationById(integrationId, { 
          metadata: {
          ...integrationData, 
          ...newIntegrationData
        }})
         return await createSlackMessage(newIntegrationData, channelId, payload, integrationId);
      }
    }

    return data;
  } catch (error) {
    logger.error(`Error creating slack message: ${JSON.stringify(error)}`);
  }
};
