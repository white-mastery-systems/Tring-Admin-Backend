import { logger } from "~/server/logger";
import { updateBotUser } from "~/server/utils/db/bot-user";
import { getAdminByOrgId } from "~/server/utils/db/user";
import { getOwners } from "~/server/utils/hubspot/contact";
import { createSlackMessage } from "~/server/utils/slack/modules";
import { createWhatsAppMessage } from "~/server/utils/whatsapp/module";
import {
  generateContactInZohoBigin,
  updateNotesInZohoBigin,
} from "~/server/utils/zoho/modules";

import { newGenerateLeadInZohoCRM, newUpdateNotesInZohoCRM } from "../../../utils/v2/integrations/crm/zoho/zoho-crm"
import { newGenerateContactInZohoBigin, newGenerateLeadInZohoBigin, newUpdateNotesInZohoBigin } from "~/server/utils/v2/integrations/crm/zoho/zoho-bigin";
import { listActiveBotIntegration } from "~/server/utils/db/bot";
import { pushChatLeadsToClay } from "~/server/utils/clay/webhook";

const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  // const userId = event.context.user?.id as string;
  const generateLeadsValidation = z.object({
    botUser: z.any(),
    note: z.any(),
    chatId: z.string().uuid(),
    botSource: z.string().optional(),
    botSubSource: z.string().optional(),
    event: z.string().optional(),
  });
  const generateLeadsValidationParams = z.object({
    id: z.string(),
  });
  const body = await isValidBodyHandler(event, generateLeadsValidation);
  const { id: botId } = await isValidRouteParamHandler(
    event,
    generateLeadsValidationParams,
  );

  const botDetails: any = await getBotDetails(botId);

  // demo
  if(botId === "dc32db7b-71e6-4248-8337-2c81cba74095" && !body?.note) {
    try {
      await pushChatLeadsToClay({
        body: {
          name: body?.botUser?.name,
          email: body?.botUser?.email,
          phone: body?.botUser?.mobile,
          countryCode: body?.botUser?.countryCode
        }
      })
    } catch (error: any) {
      logger.error(`Insert Chat-leads In Clay Error: ${JSON.stringify(error.message)}`)
    }
  }

  const adminUser: any = await getAdminByOrgId(botDetails?.organizationId);
  let botIntegratsions: any = await listActiveBotIntegration(botId);

  botIntegratsions?.map(async (botIntegration: any) => {
    if (botIntegration?.integration?.crm === "zoho-bigin") {
      if (!body.botUser?.metaData?.zohoBiginLeadId) {
        const name = body?.botUser?.name?.split(" ");
        let firstName = body?.botUser?.name;
        let lastName = null;
        if (name?.length > 1) {
          firstName = name[0];
          lastName = name[1];
        }

        const generatedContact: any = await newGenerateContactInZohoBigin({
          body: {
            First_Name: firstName,
            Last_Name: lastName ?? firstName,
            Email: body?.botUser?.email,
            Mobile: body?.botUser?.mobile,
            Title: body?.botUser?.name,
          },
          integrationData: botIntegration?.integration,
        });
        const pipelineObj = botIntegration?.metadata?.pipelineObj;

        const generatedLead: any = await newGenerateLeadInZohoBigin({
          // token: botIntegration?.integration?.metadata?.access_token,
          // refreshToken: botIntegration?.integration?.metadata?.refresh_token,
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

        logger.info(`generateZohoBiginLead, ${JSON.stringify(generatedLead)}`);
        await updateBotUser(body?.botUser?.id, {
          zohoBiginLeadId: generatedLead?.data[0]?.details?.id,
        });
      } else {
        await newUpdateNotesInZohoBigin({
          zohoBiginLeadId: body.botUser?.metaData?.zohoBiginLeadId,
          body: body?.note,
          integrationData: botIntegration?.integration,
          // token: botIntegration?.integration?.metadata?.access_token,
          // refreshToken: botIntegration?.integration?.metadata?.refresh_token,
          
        });
      }
    } else if (botIntegration?.integration?.crm === "zoho-crm") {
      if(!body?.botUser?.metaData?.zohoCrmLeadId) {
        let firstName = body?.botUser?.name;
        let lastName = "";
        if (firstName?.includes(" ")) {
          firstName = body?.botUser?.name?.split(" ")[0];
          lastName = body?.botUser?.name?.split(" ")[1];
        }
  
        const layoutObj = botIntegration?.metadata?.layoutObj;
        const generatedCrmLead: any = await newGenerateLeadInZohoCRM({
          // token: botIntegration?.integration?.metadata?.access_token,
          // refreshToken: botIntegration?.integration?.metadata?.refresh_token,
          body: {
            Layout: {
              id: layoutObj?.id,
            },
            Lead_Source: "Online - Chatbot",
            Company: "___",
            Last_Name: lastName !== "" ? lastName : body?.botUser?.name,
            First_Name: firstName,
            Email: body?.botUser?.email,
            Mobile: `${body?.botUser?.countryCode} ${body?.botUser?.mobile}`,
            Notes: `${config.public.adminBaseUrl}/analytics/leads/${body?.chatId}`
          },
          integrationData: botIntegration?.integration,
        });
        
        await updateBotUser(body?.botUser?.id, {
            zohoCrmLeadId: generatedCrmLead?.data[0]?.details?.id,
          });
      } else {
        await newUpdateNotesInZohoCRM({
          zohoCrmLeadId: body.botUser?.metaData?.zohoCrmLeadId,
          integrationData: botIntegration?.integration,
          // token: botIntegration?.integration?.metadata?.access_token,
          // refreshToken: botIntegration?.integration?.metadata?.refresh_token,
          body: body?.note,
        });
      }
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
        body.botSource,
        body.botSubSource,
      );
    } else if (botIntegration?.integration?.crm === "slack") {
      if (botIntegration?.metadata?.channelId) {
        const payload = {
          intent: "Lead",
          name: body?.botUser?.name,
          email: body?.botUser?.email,
          phone: `${body?.botUser?.countryCode} ${body?.botUser?.mobile}`,
          botName: `${botDetails?.name}`,
          chatLink: `${config.public.adminBaseUrl}/analytics/leads/${body.chatId}`,
          whatsappLink: `https://wa.me/${body?.botUser?.countryCode}${body?.botUser?.mobile}`,
        };
        if (body?.note){
          const keywords = ["Appointment", "Call Scheduled", "Site Visit"];
          payload.intent = keywords.find((keyword) => body?.note.includes(keyword)) || "Lead";
        }
        const data = await createSlackMessage(
          botIntegration?.integration?.metadata,
          botIntegration?.metadata?.channelId,
          payload,
          botIntegration?.integration?.id,
          body?.note,
        );
      }
    } else if (botIntegration?.integration?.crm === "whatsapp") {
      logger.info(`Whatsapp Lead Generation: ${botDetails?.name} - ${body?.note ?? "Invalid note"}`);
      if (botIntegration?.integration?.metadata) {
        if (!body?.botUser?.name) {
          body.botUser.name = "Not Provided"
        } else if(body?.botUser?.name && !validateName(body?.botUser?.name)){
          body.botUser.name =`${body?.botUser?.name} (From Whatsapp Profile)`
        }
        if (!body?.botUser?.email) {
          body.botUser.email = "Not Provided";
        }
        const whatsappPayload = {
          intent: "Lead",
          name: `*${body?.botUser?.name}*`,
          email: body?.botUser?.email,
          phone: `${body?.botUser?.countryCode} ${body?.botUser?.mobile}`,
          botName: `${botDetails?.name}`,
          conversationHistory: `${config.public.adminBaseUrl}/analytics/leads/${body?.chatId}`,
          whatsappLink: `https://wa.me/${body?.botUser?.countryCode}${body?.botUser?.mobile}`,
        };
        // TODO: Add country code to the phone number
        // `${body?.botUser?.countryCode.split("+")[1]}` +
        //   botIntegration?.integration?.metadata?.phoneNumber,
        if (body?.note){
          const keywords = ["Appointment", "Call Scheduled", "Site Visit", "Campaign Lead Interacted"];
          whatsappPayload.intent = keywords.find((keyword) => body?.note.includes(keyword)) || "Lead";
        }
        const phoneNumber = `${botIntegration?.integration?.metadata?.countryCode?.replace("+", "") || ""}${botIntegration?.integration?.metadata?.phoneNumber || ""}`.trim();
        if (phoneNumber) {
          const data = await createWhatsAppMessage(
            whatsappPayload,
            `${botIntegration?.integration?.metadata?.countryCode.split("+")[1]}` +
              botIntegration?.integration?.metadata?.phoneNumber,
            body?.note,
          );
          if(data){
            await $fetch("/api/org/whatsappLeadsPrice", {
              method: "POST",
              body: {
                organizationId: botDetails?.organizationId,
                countryCode: botIntegration?.integration?.metadata?.countryCode,
              },
            });
          }
        }
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
    } else if (botIntegration?.integration?.crm === "zoho-cliq") {
      if (botIntegration?.metadata?.channelId) {
        const payload = {
          intent: "Lead",
          name: body?.botUser?.name,
          email: body?.botUser?.email,
          phone: `${body?.botUser?.countryCode} ${body?.botUser?.mobile}`,
          botName: botDetails?.name,
          chatLink: `${config.public.adminBaseUrl}/analytics/leads/${body.chatId}`,
          whatsappLink: `https://wa.me/${body?.botUser?.countryCode}${body?.botUser?.mobile}`,
        };
        const textContent = `${body?.note ?? "Lead Received"} \nA new ${payload.intent ?? "Lead"} inquiry was received for your business through Tring AI. \n👤 ${payload.name} | 📞 ${payload.phone}\n📩Email: ${payload.email}\n🆔 Bot Name: ${payload.botName}\n🔗 Conversation History: ${payload.chatLink}\n🔗 Contact user on whatsapp : ${payload.whatsappLink}\n\nThis message is intended for business use to help you follow up with the lead.`;
        await generateLeadsInZohoCliq(
          botIntegration?.integration?.metadata,
          botIntegration?.metadata?.channelId,
          textContent,
          botIntegration?.integration?.id,
          body?.note,
        );
      }
    }
  });
  if (adminUser?.id) {
    const connections = global.userConnections?.get(adminUser?.id) || [];

    connections.forEach((connection) => {
      connection({ event: "leads", data: body });
    });
  }

  const emailRecipients: any =
    botDetails?.emailRecipients && botDetails?.emailRecipients.length
      ? [...botDetails?.emailRecipients, adminUser?.email]
      : [adminUser?.email];
  if(!body?.note) {
      sendEmail(
    emailRecipients,
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
    <p>
  Chat Link: 
  <a href="${config.public.adminBaseUrl}/analytics/leads/${body.chatId}">
    ${config.public.adminBaseUrl}/analytics/leads/${body.chatId}
  </a>
</p>
<p>
  WhatsApp Link: 
  <a href="https://wa.me/${body?.botUser?.countryCode}${body?.botUser?.mobile}">
    https://wa.me/${body?.botUser?.countryCode}${body?.botUser?.mobile}
  </a>
</p>

  </div>
  
  <p>You can follow up with the lead at your earliest convenience to ensure timely engagement.</p>
  
  <p>Best regards,<br/>Tring AI</p>
</div>`,
  );
  }
  return adminUser;
});

const validateName = (name: any) => {
  // Create a regular expression for special characters
  const specialCharRegex = /[0-9!@#$%^&*(),.?":{}|<>]/;
  // Check if the string contains special characters and is shorter than 3
  if (specialCharRegex.test(name) || name.length < 3) {
    return false; // Invalid
  }
  return true; // Valid
};
