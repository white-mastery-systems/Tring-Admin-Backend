import { logger } from "~/server/logger";
import { updateBotUser } from "~/server/utils/db/bot-user";
import { getAdminByOrgId } from "~/server/utils/db/user";
import { getOwners } from "~/server/utils/hubspot/contact";
import { createSlackMessage } from "~/server/utils/slack/modules";
import {
  generateContactInZohoBigin,
  generateLeadInZohoCRM,
  updateNotesInZohoBigin,
} from "~/server/utils/zoho/modules";
export default defineEventHandler(async (event) => {
  // const userId = event.context.user?.id as string;
  const generateLeadsValidation = z.object({
    botUser: z.any(),
    note: z.any(),
    chatId: z.string().uuid(),
  });
  const generateLeadsValidationParams = z.object({
    id: z.string(),
  });
  const body = await isValidBodyHandler(event, generateLeadsValidation);
  const { id: botId } = await isValidRouteParamHandler(
    event,
    generateLeadsValidationParams,
  );
  
  // console.log("bot user", { botUser: body.botUser })

  const botDetails: any = await getBotDetails(botId);

  const adminUser: any = await getAdminByOrgId(botDetails?.organizationId);
  let botIntegratsions: any = await listBotIntegrations(botId);
  botIntegratsions?.map(async (botIntegration: any) => {
    if (botIntegration?.integration?.crm === "zoho-bigin") {
      if(!body.botUser?.metaData?.zohoBiginLeadId) {
         const name = body?.botUser?.name?.split(" ");
         let firstName = body?.botUser?.name;
         let lastName = null;
         if (name?.length > 1) {
           firstName = name[0];
           lastName = name[1];
         }
         JSON.stringify({
           body: {
             First_Name: firstName,
             Last_Name: lastName ?? firstName,
             Email: body?.botUser?.email,
             Mobile: body?.botUser?.mobile,
             Title: body?.botUser?.name,
           },
           integrationData: botIntegration?.integration,
           token: botIntegration?.integration?.metadata?.access_token,
           refreshToken: botIntegration?.integration?.metadata?.refresh_token,
         });
         const generatedContact: any = await generateContactInZohoBigin({
           body: {
             First_Name: firstName,
             Last_Name: lastName ?? firstName,
             Email: body?.botUser?.email,
             Mobile: body?.botUser?.mobile,
             Title: body?.botUser?.name,
           },
           integrationData: botIntegration?.integration,
           token: botIntegration?.integration?.metadata?.access_token,
           refreshToken: botIntegration?.integration?.metadata?.refresh_token,
         });
         const pipelineObj = botIntegration?.metadata?.pipelineObj;
   
         const generatedLead: any = await generateLeadInZohoBigin({
           token: botIntegration?.integration?.metadata?.access_token,
           refreshToken: botIntegration?.integration?.metadata?.refresh_token,
           body: {
             Deal_Name: body?.botUser?.name,
             Sub_Pipeline: pipelineObj?.Sub_Pipeline ?? pipelineObj?.Pipeline,
             Stage: pipelineObj?.Stage,
             Pipeline: pipelineObj?.Pipeline,
             Contact_Name: {
               id: generatedContact?.data[0]?.details?.id,
             },
           },
           integrationData: botIntegration?.integration,
         });
   
         logger.info(`generateZohoBiginLead, ${JSON.stringify(generatedLead)}`)
         await updateBotUser(body?.botUser?.id, {zohoBiginLeadId: generatedLead?.data[0]?.details?.id})
      } else {
          const updateLeadWithNotes = await updateNotesInZohoBigin({
            zohoBiginLeadId: body.botUser?.metaData?.zohoBiginLeadId,
            integrationData: botIntegration?.integration,
            token: botIntegration?.integration?.metadata?.access_token,
            refreshToken: botIntegration?.integration?.metadata?.refresh_token,
            body: body?.note
          })
      }
    } else if (botIntegration?.integration?.crm === "zoho-crm") {
      const name = body?.botUser?.name?.split(" ");
      let firstName = body?.botUser?.name;
      let lastName = null;
      if (name?.length > 1) {
        firstName = name[0];
        lastName = name[1];
      }

      const layoutObj = botIntegration?.metadata?.layoutObj;
      const generatedLead = await generateLeadInZohoCRM({
        token: botIntegration?.integration?.metadata?.access_token,
        refreshToken: botIntegration?.integration?.metadata?.refresh_token,
        body: {
          Layout: {
            id: layoutObj?.id,
          },
          Lead_Source: "Tring ChatBot",
          Company: "___",
          Last_Name: lastName ?? body?.botUser?.name,
          First_Name: firstName,
          Email: body?.botUser?.email,
          Phone: body?.botUser?.mobile,
        },
        integrationData: botIntegration?.integration,
      });
    } else if (botIntegration?.integration?.crm === "sell-do") {
      const { campaignId, projectId } = botIntegration?.metadata;
      const apiKey = botIntegration.integration.metadata.apiKey;
      const data = await createLeadInSellDo(
        body.note,
        body.botUser,
        {},
        apiKey,
        projectId,
        campaignId,
      );
    } else if (botIntegration?.integration?.crm === "slack") {
      if (botIntegration?.metadata?.channelId) {
        // console.log(body?.botUser);
        const payload = {
          name: body?.botUser?.name,
          email: body?.botUser?.email,
          phone: `${body?.botUser?.countryCode}${body?.botUser?.mobile}`,
          botName: `${botDetails?.name}`
        };
        // console.log(
        //   botIntegration?.integration?.metadata?.access_token,
        //   botIntegration?.metadata?.channelId,
        // );
        const data = await createSlackMessage(
          botIntegration?.integration?.metadata,
          botIntegration?.metadata?.channelId,
          payload,
          botIntegration?.integration?.id,
          body?.note
        );
      }
    } else if (botIntegration?.integration?.crm === "hubspot") {
      const name = body?.botUser?.name?.split(" ");
      let firstName = body?.botUser?.name;
      let lastName = null;
      if (name?.length > 1) {
        firstName = name[0];
        lastName = name[1];
      }

      const data =
        (await createContactInHubspot({
          token: botIntegration?.integration?.metadata?.access_token,
          refreshToken: botIntegration?.integration?.metadata?.refresh_token,
          body: body,
          firstName,
          lastName,
          botIntegration,
          
        })) || {};

      // const ownerIds = await getOwners(token);

      // if (ownerIds.length) {
      //   let [{ id: hubspotOwnerId }] = ownerIds[0]?.id;
      //   await createDeals(
      //     token,
      //     hubspotOwnerId,
      //     botIntegration?.integration?.metadata?.amount,
      //     botIntegration?.integration?.metadata?.stage,
      //     firstName,
      //     lastName,
      //   );
      // } else {
      //   logger.error({ level: "error", message: "No owner found" });
      // }

      // console.log(JSON.stringify(data));
      // const properties = await $fetch(
      //   "https://api.hubapi.com/crm/v3/properties/leads",
      //   {
      //     headers: {
      //       Authorization: `Bearer ${botIntegration?.integration?.metadata?.access_token}`,
      //     },
      //   },
      // );
      // const finalPayloadToSubmit: any = {};
      // properties?.results.map((result) => {
      //   if (result.hidden) {
      //     return;
      //   }
      //   if (result.fieldType === "checkbox") {
      //     finalPayloadToSubmit[result.name] = true;
      //   } else if (result.fieldType === "select") {
      //     finalPayloadToSubmit[result.name] = {
      //       value: result.options[0]?.value,
      //     };
      //   }
      // });
    } else if(botIntegration?.integration?.crm === "zoho-cliq") {
      if(botIntegration?.metadata?.channelId) {
        const payload = {
          "First Name": body?.botUser?.name,
          "Email": body?.botUser?.email,
          "Mobile": body?.botUser?.mobile,
          "Bot Name": body?.botUser?.name,
        }
        let textContent = Object.entries(payload)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n');
        await generateLeadsInZohoCliq(botIntegration?.integration?.metadata, botIntegration?.metadata?.channelId, textContent, botIntegration?.integration?.id, body?.note)
        }
    }
  });
  if (adminUser?.id) {
    const connections = global.userConnections?.get(adminUser?.id) || [];

    connections.forEach((connection) => {
      connection({ event: "leads", data: body });
    });
  }
  sendEmail(
    adminUser?.email,
    "Head's Up, New Lead Notification from Your Chatbot",
    `<div>
  <p>Dear ${adminUser?.username},</p>
  
  <p>We are excited to let you know that a new lead has been generated through your chatbot!</p>
  
  <div>
    <p><strong>Lead Details:</strong></p>
    <p>Name: ${body?.botUser?.name}</p>
    <p>Email: ${body?.botUser?.email}</p>
    <p>Phone Number: ${body?.botUser?.countryCode}${body?.botUser?.mobile}</p>
    <p>Bot's Name: ${botDetails?.name}</p>
    ${botDetails?.metadata?.country ? `<p>Location: ${botDetails?.metadata?.country} </p>` : ""} 
  </div>
  
  <p>You can follow up with the lead at your earliest convenience to ensure timely engagement.</p>
  
  <p>Best regards,<br/>Tring AI</p>
</div>`,
  );

  return adminUser;
});
