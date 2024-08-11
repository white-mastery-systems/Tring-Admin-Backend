import { readFileSync } from "fs";
import { join } from "path";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const webHookId = query.hostedpage_id as string;

  const tokenUrl = "https://accounts.zoho.in/oauth/v2/token";
  const apiUrl = `https://www.zohoapis.in/billing/v1/hostedpages/${webHookId}`;

  // Load credentials from JSON file
  const credentialsPath = join(process.cwd(), "zoho_config.json");
  const credentials = JSON.parse(readFileSync(credentialsPath, "utf-8"));

  // Function to get the access token
  async function getAccessToken() {
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

  // Function to fetch data from the Zoho API
  async function fetchFromZohoApi(accessToken: string) {
    try {
      console.log("Attempting to fetch from Zoho API...");
      console.log("Credentials:", credentials)
      const response = await $fetch(apiUrl, {
        method: "GET",
        headers: {
          Authorization: `Zoho-oauthtoken ${accessToken}`,
          "X-com-zoho-subscriptions-organizationid":
            credentials.organization_id,
          "Content-Type": "application/json",
        },
      });
      console.log("Successfully fetched data from Zoho API");
      return response;
    } catch (error) {
      console.error("Error in fetchFromZohoApi:", error);

      if (error instanceof Error) {
        const response = (error as any).response;
        if (response && response.status === 401) {
          console.log("Token expired, refreshing token...");
          const newAccessToken = await getAccessToken();
          return await fetchFromZohoApi(newAccessToken);
        } else {
          throw error;
        }
      } else {
        throw new Error("An unexpected error occurred.");
      }
    }
  }

  try {
    const currentAccessToken = credentials.access_token;

    // Fetch data from Zoho API
    const response = await fetchFromZohoApi(currentAccessToken);

    console.log(response);

    return { webHookId, response };
  } catch (error) {
    return {
      error: "Failed to fetch data from Zoho API",
      details: error,
    };
  }
});
