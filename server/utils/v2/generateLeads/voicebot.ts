import { logger } from "~/server/logger";
import countryCodeList from "~/assets/country-codes.json";

const config = useRuntimeConfig()

export const generateVoicebotLeads = async ({ botUser, callLogId, notes, voicebotDetail }: {
  botUser: any,
  callLogId: string,
  notes?: string,
  voicebotDetail: any
}) => {
  try{
    const organizationId = voicebotDetail?.organizationId
    const adminDetail = await getAdminByOrgId(organizationId)
    const voiceBotIntegrationList: any = await listVoiceBotIntegrations(organizationId, voicebotDetail?.id)
 
    let firstName = botUser?.name;
    let lastName = "";
    if (firstName?.includes(" ")) {
      firstName = botUser?.name?.split(" ")[0];
      lastName = botUser?.name?.split(" ")[1];
    }

    const countryDetail = countryCodeList.find((country) => country.dial_code === botUser?.countryCode)
    
    for(let voiceBot of voiceBotIntegrationList) {
      if (voiceBot?.integration.crm === "zoho-bigin") {
        const pipelineObj = voiceBot?.metadata?.pipelineObj;
        
        const generatedContact: any = await newGenerateContactInZohoBigin({
          body: {
            First_Name: firstName,
            Last_Name: lastName ?? firstName,
            Mobile: `${botUser?.countryCode} ${botUser?.mobile}`,
            Title: botUser?.name,
          },
          integrationData: voiceBot?.integration,
         });
      
        const generatedLead: any = await newGenerateLeadInZohoBigin({
          body: {
            Deal_Name: botUser?.name,
            Sub_Pipeline: pipelineObj?.Sub_Pipeline ?? pipelineObj?.Pipeline,
            Stage: pipelineObj?.Stage,
            Pipeline: pipelineObj?.Pipeline,
            Contact_Name: {
              id: generatedContact?.data[0]?.details?.id,
            },
          },
          integrationData: voiceBot?.integration,
        });
        await newUpdateNotesInZohoBigin({
          zohoBiginLeadId: generatedLead?.data[0]?.details?.id,
          body: `${config.newFrontendUrl}/dashboard/customer-logs/calls/${callLogId}`,
          integrationData: voiceBot?.integration,
        });
        logger.info(`Voice bot - generate ZohoBigin lead, ${JSON.stringify(generatedLead)}`);
      } else if (voiceBot?.integration.crm === "zoho-crm") {
        const layoutObj = voiceBot?.metadata?.layoutObj;
        const generatedCrmLead: any = await newGenerateLeadInZohoCRM({
          body: {
            Layout: {
              id: layoutObj?.id,
            },
            Lead_Source: "Online - Voicebot",
            Company: "___",
            Last_Name: lastName !== "" ? lastName : botUser?.name,
            First_Name: firstName,
            Mobile: `${botUser?.countryCode} ${botUser?.mobile}`,
            Notes: `${config.newFrontendUrl}/dashboard/customer-logs/calls/${callLogId}`
          },
          integrationData: voiceBot?.integration,
        });
        logger.info(`Voice bot - generate ZohoCrm lead, ${JSON.stringify(generatedCrmLead)}`);
      } else if (voiceBot?.integration.crm === "sell-do") {
        const { campaignId, projectId } = voiceBot?.integration?.metadata;
        const apiKey = voiceBot?.integration.metadata.apiKey;
        const data = await createLeadInSellDo(
          notes,
          botUser,
          {},
          apiKey,
          projectId,
          campaignId,
          "Tring Voicebot",
          "Tring Voicebot"
        );
        logger.info(`Voice bot - generate Sell-do lead, ${JSON.stringify(data)}`);
      } else if (voiceBot?.integration.crm === "hubspot") {
        const data = await createContactInHubspot({
          token: voiceBot?.integration?.metadata?.access_token,
          refreshToken: voiceBot?.integration?.metadata?.refresh_token,
          body: {
            botUser
          },
          firstName,
          lastName,
          botIntegration: voiceBot?.integration
        })
        logger.info(`Voice bot - generate Hubspot lead, ${JSON.stringify(data)}`);
      } else if (voiceBot?.integration.crm === "reserve-go") {

      } else if (voiceBot?.integration.crm === "slack") {
        const payload = {
          intent: "Lead",
          name: botUser?.name,
          phone: `${botUser?.countryCode} ${botUser?.mobile}`,
          botName: voicebotDetail?.name,
          callHistory: `${config.newFrontendUrl}/dashboard/customer-logs/calls/${callLogId}`,
          whatsappLink: `https://wa.me/${botUser?.countryCode}${botUser?.mobile}`,
        };
        
        const data = await createSlackMessage(
          voiceBot?.integration?.metadata,
          voiceBot?.metadata?.channelId,
          payload,
          voiceBot?.integration?.id,
          "",
          "voice"
        )
        logger.info(`Voice bot - generate slack lead, ${JSON.stringify(data)}`);
      } else if (voiceBot?.integration.crm === "zoho-cliq") {
          const payload = {
          intent: "Lead",
          name: botUser?.name,
          phone: `${botUser?.countryCode} ${botUser?.mobile}`,
          botName: voicebotDetail?.name,
          callHistory: `${config.newFrontendUrl}/dashboard/customer-logs/calls/${callLogId}`,
          whatsappLink: `https://wa.me/${botUser?.countryCode}${botUser?.mobile}`,
        };
        const textContent = `Lead Received \nA new ${payload.intent ?? "Lead"} inquiry was received for your business through Tring AI. \n👤 ${payload.name} | 📞 ${payload.phone}\n🆔 Bot Name: ${payload.botName}\n🔗 Conversation History: ${payload.callHistory}\n🔗 Contact user on whatsapp : ${payload.whatsappLink}\n\nThis message is intended for business use to help you follow up with the lead.`;
        const data = await generateLeadsInZohoCliq(
          voiceBot?.integration?.metadata,
          voiceBot?.metadata?.channelId,
          textContent,
          voiceBot?.integration?.id
        );
        logger.info(`Voice bot - generate zoho_cliq lead, ${JSON.stringify(data)}`);
      } else if (voiceBot?.integration.crm === "whatsapp") {
        const whatsappPayload = {
          intent: "Lead",
          name: `*${botUser?.name}*`,
          email: "N/A",
          country: countryDetail?.name || "N/A",
          phone: `${botUser?.countryCode} ${botUser?.mobile}`,
          botName: `${voicebotDetail?.name}`,
          conversationHistory: `${config.newFrontendUrl}/dashboard/customer-logs/calls/${callLogId}`,
          whatsappLink: `https://wa.me/${botUser?.countryCode}${botUser?.mobile}`,
        };
       
        const data = await createWhatsAppMessage(
          whatsappPayload,
          `${voiceBot?.integration?.metadata?.countryCode.split("+")[1]}` +
            voiceBot?.integration?.metadata?.phoneNumber,
          "Lead Details",
        );
        if(data){
          await $fetch("/api/org/whatsappLeadsPrice", {
            method: "POST",
            body: {
              organizationId: voicebotDetail?.organizationId,
              countryCode: voiceBot?.integration?.metadata?.countryCode,
            },
          });
        }
        logger.info(`Voice bot - generate whatsapp lead, ${JSON.stringify(data)}`);
      }
    }

    const emailRecipients: any = voicebotDetail?.emailRecipients && voicebotDetail?.emailRecipients.length
      ? [...voicebotDetail?.emailRecipients, adminDetail?.email]
      : [adminDetail?.email];
      
    sendEmail(
      emailRecipients,
      "Head's Up, New Lead Notification from Your Voicebot",
      `<div>
          <p>Dear ${adminDetail?.username},</p>
          
          <p>We are excited to let you know that a new lead has been generated through your voicebot!</p>
          
          <div>
            <p><strong>Lead Details:</strong></p>
            <p>Name: ${botUser?.name}</p>
            <p>Phone Number: ${botUser?.countryCode} ${botUser?.mobile}</p>
            <p>Bot's Name: ${voicebotDetail?.name}</p>
            <p>
          Conversation History: 
          <a href="${config.newFrontendUrl}/dashboard/customer-logs/calls/${callLogId}">
            ${config.newFrontendUrl}/dashboard/customer-logs/calls/${callLogId}
          </a>
          </p>
          <p>
            Contact user on whatsapp: 
            <a href="https://wa.me/${botUser?.countryCode}${botUser?.mobile}">
              https://wa.me/${botUser?.countryCode}${botUser?.mobile}
            </a>
          </p>
          </div>
          
          <p>You can follow up with the lead at your earliest convenience to ensure timely engagement.</p>
          
          <p>Best regards,<br/>Tring AI</p>
      </div>`,
    );
    return true
    
  } catch (error: any) {
    logger.error(`Voicebot - generateVoicebotLead Error: ${JSON.stringify(error.message)}`)
    return error
  }
}