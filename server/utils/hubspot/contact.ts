import { logger } from "~/server/logger";
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
  firstName: string,
  lastName: string,
  botIntegration: any;
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
            lifecyclestage: "marketingqualifiedlead"
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
          botIntegration,
        });
    }
  }
}

export async function getOwners(token:string) {
  return $fetch("https://api.hubapi.com/crm/v3/owners", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
// Creating Leads or Deals IN Hubspot
export async function createDeals(
  token: string,
  ownerId: any,
  amount: any,
  dealStage: any,
  firstName: string,
  lastName: string,
) {
  try {
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
    return data
  } catch (error:any) {
    logger.error(`Hubspot Create Deal Error: ${error.message}`);
    throw new Error(error.message);
  }
}

export const getContactByEmail = async (token:string, email:string) => {
  try {
    const data = await $fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email`,{
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data;
  } catch (error:any) {
    logger.error(`Hubspot Get Contact By Email Error: ${error.message}`)
    return {}
  }
}


export const getMeetingLink = async (token:string) => {
  try {
    const data = await $fetch(`https://api.hubapi.com/scheduler/v3/meetings/meeting-links`,{
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if(data?.results?.length) {
      const link = data?.results?.find((item:any)=> item.slug === "tring" || item.slug.includes("tring")).link
      return (link)?? data?.results[0]?.link ?? null
    }
    return null;
  } catch (error:any) {
    console.log(error.message);
    return null
  }
}
