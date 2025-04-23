import { getAllScheduledEventInvitees, getAllCalendlyScheduledEvents, getParsedPhoneNumber } from "~/server/utils/calently/module";
import { getEnrichByEmailOrPhone, updateWhatsappEnrichStatusById } from "~/server/utils/db/whatsapp-enrichment";

export default defineEventHandler(async (event) => {
  try {
    const scheduledEvents = await getAllCalendlyScheduledEvents(undefined, undefined, "active");
    if (!scheduledEvents.length) return [];

    const scheduledEventInvitess = await Promise.all(scheduledEvents.map(async(schEvents:any)=>{
      const inviteeList = await getAllScheduledEventInvitees(null, schEvents?.uri);
      if (!inviteeList.length) return [];

      const enrichedInvitees = await Promise.all(inviteeList.map(async(invitee:any)=>{
        const inviteeId = invitee?.uri.split("/invitees/")[1];
        const inviteeDetails = invitee;
        if (inviteeDetails && inviteeDetails?.email && inviteeDetails?.questions_and_answers[0]?.answer) {
          const {phone} = getParsedPhoneNumber(inviteeDetails?.questions_and_answers[0]?.answer);
          const userDetails = await getEnrichByEmailOrPhone(inviteeDetails?.email, phone);
          if (userDetails && !["meeting_booked", "completed"].includes(userDetails.status)) {
            const enrichStatus = (userDetails.status === "meeting_cancelled")? "meeting_rescheduled": "meeting_booked"
            const userPhone = `${userDetails.botUser.countryCode}${userDetails.botUser.mobile}`.replace("+", "")
            const metadata = userDetails.integration.metadata; 
            const message = `Hi ${userDetails.name} 👋\n\nWe noticed you scheduled a meeting with us but couldn’t make it. No worries at all!\n\nIf you have any questions or would like to reschedule, just reply here — we’re happy to help. 😊\n\nHere’s the meeting link in case you’d still like to connect:\n${schEvents?.location?.join_url}`;
            await Promise.all([
              // @ts-ignore
              sendWhatsappMessage(metadata?.access_token, metadata?.pid, userPhone, message),
              updateWhatsappEnrichStatusById(userDetails.id, enrichStatus, {...(userDetails.metadata || {}), inviteeId})
            ])
            return userDetails;
          } else {
            const startTimeUTC = new Date(schEvents?.start_time); // 6:30 PM IST
            const now = new Date(); // current time in IST system time
            const isPassed = now > startTimeUTC;
  
            if (userDetails && ["meeting_booked", "meeting_rescheduled"].includes(userDetails.status) && isPassed) {
              await updateWhatsappEnrichStatusById(userDetails.id, "completed", {...(userDetails.metadata || {}), inviteeId, bookedMessage: true });
              return userDetails;
            }
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