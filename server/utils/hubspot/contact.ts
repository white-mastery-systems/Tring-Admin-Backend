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
        botIntegration?.integration?.metadata?.stage || "appointmentscheduled",
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
  return $fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
// Creating Leads or Deals IN Hubspot
export async function createDeals(token, ownerId, amount,dealStage, firstName, lastName) {
  try{
    
  const data = await $fetch("https://api.hubapi.com/crm/v3/objects/deals", {
    method: "POST",
    body:{
        properties: {
          amount: amount ?? '0',
          closedate: new Date().toISOString(),
          dealname: firstName + " " + lastName || "New Deal",
          pipeline: "default",
          dealstage: dealStage,
          hubspot_owner_id: ownerId,
        },
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
    console.log(data);

  }
  catch(errr){
  console.log(errr);
  
  }

}
