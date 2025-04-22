import parsePhoneNumber from "libphonenumber-js";
import { logger } from "~/server/logger";

// POC only: Using access_token as optional for now. Make it required and remove null type after POC is complete.90-[ ]
const calendlyToken = "eyJraWQiOiIxY2UxZTEzNjE3ZGNmNzY2YjNjZWJjY2Y4ZGM1YmFmYThhNjVlNjg0MDIzZjdjMzJiZTgzNDliMjM4MDEzNWI0IiwidHlwIjoiUEFUIiwiYWxnIjoiRVMyNTYifQ.eyJpc3MiOiJodHRwczovL2F1dGguY2FsZW5kbHkuY29tIiwiaWF0IjoxNzQ0OTUwMzY3LCJqdGkiOiI1ZDlhMGIxMC0zNmI0LTQ5YzUtYjE1NC1jZjVjMjE5NTRjNjIiLCJ1c2VyX3V1aWQiOiJkMWMyOTE2YS04ZGQ4LTRlM2QtYTM5My0xNWE1NDA3N2FlNzIifQ.GBnz00xkUT1rD3WAIo8iQQgGgc3KoJdijMuK245PNR46MmiFNjJK8oQWKiXg0FlEpBUTuHSPBIxAiSGesZImoA"
export const getAllScheduledEvents = async (access_token?: string, userUri?:string) => {
  try {
    const userurl = userUri ?? "https://api.calendly.com/users/d1c2916a-8dd8-4e3d-a393-15a54077ae72"
    const url = `https://api.calendly.com/scheduled_events?user=${userurl}&status=active&count=100`;

    const list:any = await $fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${(access_token) ?? calendlyToken}` },
    });
    if(Array.isArray(list?.collection) && !list?.collection.length){ return []}
    return [...list?.collection]
  } catch (error: any) {
    logger.error(`Get all scheduled events - Error: ${error.message}`)
    return []
  }
}

export const getAllCancelledScheduledEvents = async (access_token?: string, userUri?:string) => {
  try {
    const userurl = userUri ?? "https://api.calendly.com/users/d1c2916a-8dd8-4e3d-a393-15a54077ae72"
    const url = `https://api.calendly.com/scheduled_events?user=${userurl}&status=canceled&count=100`;

    const list:any = await $fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${(access_token) ?? calendlyToken}` },
    });
    if(Array.isArray(list?.collection) && !list?.collection.length){ return []}
    return [...list?.collection]
  } catch (error: any) {
    logger.error(`Get all scheduled events - Error: ${error.message}`)
    return []
  }
}

export const getAllCalendlyScheduledEvents = async (access_token?: string, userUri?:string, status?: string) => {
  try {
    status = status || "active"
    const userurl = userUri ?? "https://api.calendly.com/users/d1c2916a-8dd8-4e3d-a393-15a54077ae72";
    const baseUrl = `https://api.calendly.com/scheduled_events?user=${userurl}&status=${status}&count=100&sort=start_time:desc`;
    let page:any = null
    let hasMore = true;
    let allEvents: any[] = [];

    while (hasMore) {
      const url = `${baseUrl}${(page)? `&page_token=${page}`:""}`;
      const result: any = await $fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token ?? calendlyToken}`,
        },
      });

      const events = result?.collection ?? [];

      if(result?.pagination?.next_page_token){
        page = result?.pagination?.next_page_token;
      }


      if (events.length) {
        allEvents.push(...events);
        // ✅ Stop if we already reached 500
        if (allEvents.length >= 500) {
          allEvents = allEvents.slice(0, 500);
          hasMore = false;
          break;
        }
        // Update page token for next iteration
        page = result?.pagination?.next_page_token ?? null;

        // If there's no next page, stop
        if (!page) {
          hasMore = false;
        }
      } else {
        hasMore = false;
      }
    }

    return allEvents;
  } catch (error: any) {
    logger.error(`Get all calendly scheduled events - Error: ${error.message}`)
    return []
  }
}

export const getAllScheduledEventInvitees = async (access_token?: string | null, apiUrl?:string, eventId?:string) => {
  try {
    const url = (apiUrl) ? `${apiUrl}/invitees`: `https://api.calendly.com/scheduled_events/${eventId}/invitees`
    const list:any = await $fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${(access_token) ?? calendlyToken}` },
    });
    if (Array.isArray(list?.collection) && !list?.collection.length) {
      return [];
    }
    return list?.collection;
  } catch (error: any) {
    logger.error(`Get all invited from scheduled event - Error: ${error.message}`);
    return []
  }
}

export const getScheduledEventInvitee = async (access_token?: string | null, apiUrl?:string, eventId?:string, inviteeId?: string) => {
  try {
    const url = (apiUrl) ?? `https://api.calendly.com/scheduled_events/${eventId}/invitees/${inviteeId}`
    const result:any = await $fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${(access_token) ?? calendlyToken}` },
    });
    if (!result?.resource) {
      return null;
    }
    return result?.resource;
  } catch (error: any) {
    logger.error(`Get all invited from scheduled event - Error: ${error.message}`);
    return null
  }
}

export const normalizePhoneNumber = (countryCode: string, phone: string): string => {
  const cleanedCountryCode = countryCode.replace(/\D/g, ""); // Remove non-digits
  const cleanedPhone = phone.replace(/\D/g, ""); // Remove non-digits

  // If phone already starts with the country code, return as-is
  if (cleanedPhone.startsWith(cleanedCountryCode)) {
    return cleanedPhone;
  }

  return cleanedCountryCode + cleanedPhone;
};

export const getParsedPhoneNumber = (phoneNumber: string) => {
  phoneNumber = phoneNumber.replace(/\s+/g, "")
  const parsedPhone = parsePhoneNumber(phoneNumber);
  const countryCode = parsedPhone?.countryCallingCode || phoneNumber?.substring(0, 2);
  const phone = parsedPhone?.nationalNumber || phoneNumber.slice(2);
  return { countryCode, phone };
};