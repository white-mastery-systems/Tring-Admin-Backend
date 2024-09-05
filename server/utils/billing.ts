import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { ZohoHostedPageApiResponse } from "./types";

const credentialsPath = join(process.cwd(), "zoho_config.json");
const credentials = JSON.parse(readFileSync(credentialsPath, "utf-8"));

// Function to get the access token
export async function getAccessToken() {
  const tokenUrl = "https://accounts.zoho.in/oauth/v2/token";
  const params = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: credentials.client_id,
    client_secret: credentials.client_secret,
    refresh_token: credentials.refresh_token,
  });

  try {
    const tokenResponse = await $fetch<{
      access_token: string;
      expires_in: number;
      scope: string;
      api_domain: string;
      token_type: string;
    }>(tokenUrl, {
      method: "POST",
      body: params,
    });

    return tokenResponse.access_token;
  } catch (error) {
    throw new Error(`Failed to fetch access token: ${error}`);
  }
}

export async function fetchFromZohoApi(accessToken: string, webHookId: string) {
  const apiUrl = `https://www.zohoapis.in/billing/v1/hostedpages/${webHookId}`;
  try {
    const response = await $fetch<ZohoHostedPageApiResponse>(apiUrl, {
      method: "GET",
      headers: {
        Authorization: `Zoho-oauthtoken ${accessToken}`,
        "X-com-zoho-subscriptions-organizationid": credentials.organization_id,
        "Content-Type": "application/json",
      },
    });

    return response;
  } catch (error) {
    console.error("Error in fetchFromZohoApi:", error);

    if (error instanceof Error) {
      const response = (error as any).response;
      if (response && response.status === 401) {
        const newAccessToken = await getAccessToken();
        credentials.access_token = newAccessToken;
        writeFileSync(
          credentialsPath,
          JSON.stringify(credentials, null, 2),
          "utf-8",
        );
        return await fetchFromZohoApi(newAccessToken, webHookId);
      } else {
        throw error;
      }
    } else {
      throw new Error("An unexpected error occurred.");
    }
  }
}
