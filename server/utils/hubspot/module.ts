import { getBotIntegrationByOrgId } from "../db/bot";

export const findHubspotEventNames = (event: any) => {
  if(!Array.isArray(event)){
      event = [event]
  }
  const subscriptionTypes = event.map((e: any) => e.subscriptionType);
  const eventNames = subscriptionTypes.map((type: string) => {
      switch (type) {
        case "deal.creation":
          return "Deal Created";
        case "object.creation":
          return "Meeting Created";
        case "contact.creation":
          return "Contact Created";
        default:
          return "Lead Created";
      }
  })
  return [...eventNames];
}

export const sendMeetingLink = async (link:any, organizationId:any)=>{
  try {
    const botIntegrationData = await getBotIntegrationByOrgId(organizationId);
    const metadata = botIntegrationData?.metadata || null;
    const integrationData = botIntegrationData?.integration || null;
    if(metadata && integrationData){

    }
  } catch (error:any) {
    console.log(error.message);
  }
}