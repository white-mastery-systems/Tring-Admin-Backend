import { clientInfo } from "./clientInfo";
// const logger=useLog

export async function regenearateTokenWithRefreshToken({
  refreshToken,
}: {
  refreshToken: any;
}) {
  const apiUrl = `https://accounts.zoho.in/oauth/v2/token?client_id=${clientInfo.clientId}&grant_type=refresh_token&client_secret=${clientInfo.clientSecret}&refresh_token=${refreshToken}`;

  return await $fetch(apiUrl, {
    method: "POST",
  });
}
