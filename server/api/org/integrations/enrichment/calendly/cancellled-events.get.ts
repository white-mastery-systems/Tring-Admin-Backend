import { getAllScheduledEventInvitees, getAllCalendlyScheduledEvents, getParsedPhoneNumber } from "~/server/utils/calently/module";
import { getEnrichByEmailOrPhone, updateWhatsappEnrichStatusById } from "~/server/utils/db/whatsapp-enrichment";

export default defineEventHandler(async (event) => {
  try {
    const scheduledEvents = await getAllCalendlyScheduledEvents(undefined, undefined, "canceled");
    if (!scheduledEvents.length) return [];

    const scheduledEventInvitess = await Promise.all(scheduledEvents.map(async(schEvents:any)=>{
      const inviteeList = await getAllScheduledEventInvitees(null, schEvents?.uri);
      if (!inviteeList.length) return [];

      const enrichedInvitees = await Promise.all(inviteeList.map(async(invitee:any)=>{
        const inviteeId = invitee?.uri.split("/invitees/")[1];
        const inviteeDetails = invitee;
        if (inviteeDetails && inviteeDetails?.email) {
          const userDetails = await getEnrichByEmailOrPhone(inviteeDetails?.email);
          if (userDetails && !["meeting_cancelled", "meeting_rescheduled"].includes(userDetails.status)) {
            const userPhone = `${userDetails.botUser.countryCode}${userDetails.botUser.mobile}`.replace("+", "")
            const metadata = userDetails.integration.metadata; const message = `Your meeting slot is confirmed \n\nClick meeting link below: \nLink: ${schEvents?.location?.join_url}`;
            await Promise.all([
              // @ts-ignore
              sendWhatsappMessage(metadata?.access_token, metadata?.pid, userPhone, message),
              updateWhatsappEnrichStatusById(userDetails.id, "meeting_cancelled", {...(userDetails.metadata || {}), inviteeId})
            ])
            return userDetails;
          }
          return null
        }
        return null
      }))
      return enrichedInvitees
    }))
    return scheduledEventInvitess.flat().filter(Boolean);
  } catch (error:any) {
    return []
  }
});