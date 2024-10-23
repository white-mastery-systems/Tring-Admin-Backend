import { generateHubspotAccessTokenWithRefreshToken } from "./auth";

export async function createContactInHubspot({
  token,
  refreshToken,
  body,
  firstName,
  lastName,
}: {
  token: string;
  refreshToken: string;
  body: any;
  integrationData: any;
}) {
  try {
    return $fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
      method: "POST",
      body: {
        properties: {
          email: body?.botUser?.email,
          firstname: firstName,
          lastname: lastName,
          phone: `${body?.botUser?.countryCode}${body?.botUser?.mobile}`,
          company: "HubSpot",
          website: "hubspot.com",
          lifecyclestage: "marketingqualifiedlead",
        },
      },
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
        });
    }
  }
}

export async function getOwners(token) {
  return $fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
// Creating Leads or Deals IN Hubspot
export async function createDeals(token, ownerId, amount,dealStage, firstName, lastName) {
  return $fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      properties: {
        amount: amount ?? 0,
        closedate: new Date(),
        dealname: firstName + " " + lastName,
        pipeline: "default",
        dealstage: dealStage,
        hubspot_owner_id: ownerId,
      },
    },
  });
}
