/*[ { eventId: 3764650983,
    subscriptionId: 3443675,
    portalId: 242485166,
    appId: 4035002,
    occurredAt: 1744372157861,
    subscriptionType: 'deal.creation',
    attemptNumber: 3,
    objectId: 64261714667,
    changeFlag: 'CREATED',
    changeSource: 'INTEGRATION',
    sourceId: '4035002' },
  { eventId: 3540261506,
    subscriptionId: 3443687,
    portalId: 242485166,
    appId: 4035002,
    occurredAt: 1744372157861,
    subscriptionType: 'object.creation',
    attemptNumber: 3,
    objectId: 64261714667,
    objectTypeId: '0-3',
    changeFlag: 'CREATED',
    changeSource: 'INTEGRATION',
    sourceId: '4035002' } ]*/

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