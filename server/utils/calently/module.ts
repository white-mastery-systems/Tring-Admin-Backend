import { logger } from "~/server/logger";

// POC only: Using access_token as optional for now. Make it required and remove null type after POC is complete.90-[ ]
const calendlyToken = "eyJraWQiOiIxY2UxZTEzNjE3ZGNmNzY2YjNjZWJjY2Y4ZGM1YmFmYThhNjVlNjg0MDIzZjdjMzJiZTgzNDliMjM4MDEzNWI0IiwidHlwIjoiUEFUIiwiYWxnIjoiRVMyNTYifQ.eyJpc3MiOiJodHRwczovL2F1dGguY2FsZW5kbHkuY29tIiwiaWF0IjoxNzQ0OTUwMzY3LCJqdGkiOiI1ZDlhMGIxMC0zNmI0LTQ5YzUtYjE1NC1jZjVjMjE5NTRjNjIiLCJ1c2VyX3V1aWQiOiJkMWMyOTE2YS04ZGQ4LTRlM2QtYTM5My0xNWE1NDA3N2FlNzIifQ.GBnz00xkUT1rD3WAIo8iQQgGgc3KoJdijMuK245PNR46MmiFNjJK8oQWKiXg0FlEpBUTuHSPBIxAiSGesZImoA"
export const getAllSheduledEvents = async (access_token?: string, userUri?:string) => {
  try {
    const userurl = userUri ?? "https://api.calendly.com/users/d1c2916a-8dd8-4e3d-a393-15a54077ae72"
    const url = `https://api.calendly.com/scheduled_events?user=${userurl}`;

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

export const getAllScheduledEventInvitees = async (access_token?: string | null, apiUrl?:string, eventId?:string) => {
  try {
    const url = (apiUrl) ?? `https://api.calendly.com/scheduled_events/${eventId}/invitees`

    const list:any = await $fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${(access_token) ?? calendlyToken}` },
    });
    if (Array.isArray(list?.collection) && !list?.collection.length) {
      return [];
    }
    return [...list?.collection];
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
    if (result?.resource) {
      return null;
    }
    return result?.resource;
  } catch (error: any) {
    logger.error(`Get all invited from scheduled event - Error: ${error.message}`);
    return null
  }
}