import { generateHubspotAccessTokenWithRefreshToken } from "./auth";

export async function createContactInHubspot({
  token,
  refreshToken,
  body,
  integrationData,
}: {
  token: string;
  refreshToken: string;
  body: any;
  integrationData: any;
}) {
  try {
    return $fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
      method: "POST",
      body: { data: [body] },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (err: any) {
    if (err.status === 401) {
      const generatedResponse =
        await generateHubspotAccessTokenWithRefreshToken(refreshToken);
      if (generatedResponse?.response?.access_token)
        createContactInHubspot({
          token: generatedResponse?.response?.access_token,
          refreshToken: refreshToken,
          body: body,
          integrationData: integrationData,
        });
    }
    console.log(err);
  }
}
