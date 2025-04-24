import { getAllScheduledEventInvitees, getAllCalendlyScheduledEvents } from "~/server/utils/calently/module";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const scheduledEvents = await getAllCalendlyScheduledEvents(undefined, undefined, "active");
    if (!scheduledEvents.length) return { id: 0, message: "Not Booked" };

    const scheduledEventInvitess = await Promise.all(scheduledEvents.map(async(schEvents:any)=>{
      const inviteeList = await getAllScheduledEventInvitees(null, schEvents?.uri);
      if (!inviteeList.length) return [];

      const enrichedInvitees = await Promise.all(inviteeList.map(async(invitee:any)=>{
        const inviteeDetails = invitee;
        return (inviteeDetails?.email) ?? null;
      }))
      return enrichedInvitees;
    }))
    const emailIds = scheduledEventInvitess.flat().filter(Boolean);
    if(emailIds.includes(body.email)){
      return {id:1, message: "Booked" }
    }
    return { id: 0, message: "Not Booked"}
    // return emailIds
  } catch (error:any) {
    return { id: 0, message: "Not Booked"}
  }
});