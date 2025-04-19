import { getAllSheduledEvents, getAllScheduledEventInvitees, getScheduledEventInvitee } from "~/server/utils/calently/module"
import { getEnrichByEmail } from "~/server/utils/db/whatsapp-enrichment";

export default defineEventHandler(async (event) => {
  try {
    const scheduledEvents = await getAllSheduledEvents();
    if (scheduledEvents.length) {
      const scheduledEventInvitess = await Promise.all(scheduledEvents.map(async(events:any)=>{
        const inviteeList = await getAllScheduledEventInvitees(null, events?.uri);
        if(inviteeList.length){
          await Promise.all(inviteeList.map(async(invitee:any)=>{
            const inviteeDetails = await getScheduledEventInvitee(null, invitee?.uri);
            if (inviteeDetails && inviteeDetails?.email) {
              const userDetails = await getEnrichByEmail(inviteeDetails?.email);
              if (userDetails) {
                return userDetails;
              }
              else return null
            }
            else return null
          }))
        }
        return null
      }))
    }
    return [];
  } catch (error:any) {
    return []
  }
});