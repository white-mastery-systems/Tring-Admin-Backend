import { zohoAuthApiBaseUrls } from "~/utils/zohoBaseUrls";
import { clientInfo } from "./clientInfo";

export async function regenearateTokenWithRefreshToken({
  location,
  refreshToken,
}: {
  location: string,
  refreshToken: any;
}) {
  const apiUrl = `${zohoAuthApiBaseUrls[location]}/oauth/v2/token?client_id=${clientInfo.clientId}&grant_type=refresh_token&client_secret=${clientInfo.clientSecret}&refresh_token=${refreshToken}`;

  return await $fetch(apiUrl, {
    method: "POST",
  });
}
