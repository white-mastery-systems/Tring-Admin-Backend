import { generateHubspotAccessTokenWithRefreshToken } from "./auth";

export async function createContactInHubspot({
  token,
  refreshToken,
  body,
  firstName,
  lastName,
  botIntegration,
}: {
  token: string;
  refreshToken: string;
  body: any;
  integrationData: any;
}) {
  try {
    const data = await $fetch(
      "https://api.hubapi.com/crm/v3/objects/contacts",
      {
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
      },
    );
    const ownerIds = await getOwners(token);

    if (ownerIds.results.length) {
      let { id: hubspotOwnerId } = ownerIds.results.pop();
      await createDeals(
        token,
        hubspotOwnerId,
        0,
        botIntegration?.metadata?.stage || "appointmentscheduled",
        firstName || "",
        lastName || "",
      );
    } else {
      logger.error({ level: "error", message: "No owner found" });
    }
  } catch (err: any) {
    if (err.status === 401) {
      const generatedResponse =
        await generateHubspotAccessTokenWithRefreshToken(refreshToken);
      if (generatedResponse?.response?.access_token)
          updateIntegrationById(botIntegration.id, {
               ...botIntegration.metadata,
               access_token: generatedResponse?.response?.access_token,
           });
        createContactInHubspot({
          token: generatedResponse?.response?.access_token,
          refreshToken: refreshToken,
          body: body,
          firstName,
          lastName,
        });
    }
  }
}

export async function getOwners(token) {
  return $fetch("https://api.hubapi.com/crm/v3/owners", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
// Creating Leads or Deals IN Hubspot
export async function createDeals(
  token,
  ownerId,
  amount,
  dealStage,
  firstName,
  lastName,
) {
  try {
    // Logging the request body for debugging
    console.log({
      properties: {
        amount: amount || "0", // Ensure the correct amount is passed
        closedate: new Date().toISOString(),
        dealname: firstName + " " + lastName || "New Deal", // Fallback in parentheses
        pipeline: "default",
        dealstage: dealStage,
        hubspot_owner_id: ownerId,
      },
    });

    // Making the POST request
    const data = await $fetch("https://api.hubapi.com/crm/v3/objects/deals", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json", // Adding Content-Type header
      },
      body: JSON.stringify({
        properties: {
          amount: amount || "0", // Ensure the correct amount is passed
          closedate: new Date().toISOString(),
          dealname: firstName + " " + lastName || "New Deal",
          pipeline: "default",
          dealstage: dealStage,
          hubspot_owner_id: ownerId,
        },
      }),
    });

    // Logging the response
    console.log(data);
  } catch (error) {
    // Logging any errors
    console.log(error);
  }
}
