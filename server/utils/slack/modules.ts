import { logger } from "~/server/logger";

export async function getAllChannelsFromSlack({
  token,
  refreshToken,
  integrationData,
}: {
  token: string;
  refreshToken: String;
  integrationData: any;
}) {
  try {
    const data: any = await $fetch<any>(
      "https://slack.com/api/conversations.list",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (!data.ok && data?.error === "invalid_auth") {
      console.log(`Slack access_token expired, ${JSON.stringify(data)}`);
      const newIntegrationData: any = await regenerateAccessTokenForSlack({
        integrationData,
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
    // if (!refreshToken) return;
    // if (error.status === 401) {
    //   //   return regenearateTokenWithRefreshToken({
    //   //     refreshToken: refreshToken,
    //   //   }).then(async (data: any) => {
    //   //     if (data?.access_token)
    //   //       updateIntegrationById(integrationData.id, {
    //   //         ...integrationData.metadata,
    //   //         access_token: data?.access_token,
    //   //       });
    //   //     return getAllChannelsFromSlack({
    //   //       token: data?.access_token,
    //   //       refreshToken: "",
    //   //       integrationData: integrationData,
    //   //     });
    //   //   });
    // }
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
        authorization: `Bearer ${integrationData?.accessToken}`,
      },
      body: {
        channel: channelId,
        text: `Lead Generated :tada:\nFirst Name: ${payload?.firstName}\nLast Name: ${payload?.lastName}\nEmail: ${payload?.email}\nPhone: ${payload?.countryCode}${payload?.mobile}`,
      },
    });

    if (!data.ok && data?.error === "invalid_auth") {
      const newIntegrationData = await regenerateAccessTokenForSlack({
        integrationData,
      });
      return await createSlackMessage(newIntegrationData, channelId, payload);
    }

    return data;
  } catch (error) {
    logger.error(`Error creating slack message: ${JSON.stringify(error)}`);
  }
};
