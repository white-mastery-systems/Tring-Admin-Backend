import { logger } from "~/server/logger";

export function getAllChannelsFromSlack({
  token,
  refreshToken,
  integrationData,
}: {
  token: string;
  refreshToken: String;
  integrationData: any;
}) {
  const data: any = $fetch<any>("https://slack.com/api/conversations.list", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch((err: any) => {
    logger.error(
      `getAllChannelsFromSlack: token:${token}, refreshToken: ${refreshToken}, integrationData: ${JSON.stringify(integrationData)}, error: ${JSON.stringify(err.data)}`,
    );
    if (!refreshToken) return;
    if (err.status === 401) {
      //   return regenearateTokenWithRefreshToken({
      //     refreshToken: refreshToken,
      //   }).then(async (data: any) => {
      //     if (data?.access_token)
      //       updateIntegrationById(integrationData.id, {
      //         ...integrationData.metadata,
      //         access_token: data?.access_token,
      //       });
      //     return getAllChannelsFromSlack({
      //       token: data?.access_token,
      //       refreshToken: "",
      //       integrationData: integrationData,
      //     });
      //   });
    }
  });
  return data;
}
