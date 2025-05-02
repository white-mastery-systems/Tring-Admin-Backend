import { getAllScheduledEventInvitees, getAllCalendlyScheduledEvents } from "~/server/utils/calendly/module";
import { getEnrichByCompanyUrl } from "~/server/utils/db/whatsapp-enrichment";

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
      return { id:1, message: "Booked" }
    }

    const companyUrl = extractCompanyUrl(body)
    if(companyUrl){
      const enrich = await getEnrichByCompanyUrl(companyUrl);
      if(enrich){
        updateWhatsappEnrichStatusById(enrich.id, "meeting_booked", enrich.metadata);
        return { id:1, message: "Booked"}
      }
    }
    return { id: 0, message: "Not Booked"}
    // return emailIds
  } catch (error:any) {
    return { id: 0, message: "Not Booked"}
  }
});

const extractCompanyUrl = (body: any): string | null => {
  return body?.url ?? body?.companyUrl ?? body?.company ?? null;
};