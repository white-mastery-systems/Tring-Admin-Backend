import { getAdminByOrgId } from "~/server/utils/db/user";
import {
  generateContactInZohoBigin,
  generateLeadInZohoBigin,
  generateLeadInZohoCRM,
} from "~/server/utils/zoho/modules";
export default defineEventHandler(async (event) => {
  const userId = event.context.user?.id as string;
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

  const botDetails: any = await getBotDetails(botId);

  const adminUser: any = await getAdminByOrgId(botDetails?.organizationId);
  let botIntegratsions: any = await listBotIntegrations(botId);
  botIntegratsions?.map(async (botIntegration: any) => {
    if (botIntegration?.integration?.crm === "zoho-bigin") {
      const name = body?.botUser?.name?.split(" ");
      let firstName = body?.botUser?.name;
      let lastName = null;
      if (name?.length > 1) {
        firstName = name[0];
        lastName = name[1];
      }
      const generatedContact = await generateContactInZohoBigin({
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
      console.log(JSON.stringify(generatedContact), "ZOHO CONTACT GENERATED");
      const generatedLead = await generateLeadInZohoBigin({
        token: botIntegration?.integration?.metadata?.access_token,
        refreshToken: botIntegration?.integration?.metadata?.refresh_token,
        body: {
          Deal_Name: body?.botUser?.name,
          Sub_Pipeline: pipelineObj?.Sub_Pipeline,
          Stage: pipelineObj?.Stage,
          Pipeline: pipelineObj?.Pipeline,
          Contact_Name: {
            id: generatedContact?.data[0]?.details?.id,
          },
        },
        integrationData: botIntegration?.integration,
      });
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
          Phone: body?.botUser?.phone,
        },
        integrationData: botIntegration?.integration,
      });
    } else if (botIntegration?.integration?.crm === "sell-do") {
      const { campaignId, projectId } = botIntegration?.metadata;
      const apiKey = botIntegration.integration.metadata.apiKey;
      await createLeadInSellDo(
        body.note,
        body.botUser,
        {},
        apiKey,
        projectId,
        campaignId,
      );
    }
  });
  if (adminUser?.id) {
    const connections = global.userConnections?.get(adminUser?.id) || [];

    connections.forEach((connection) => {
      connection({ event: "leads", data: body });
    });
  }

  return adminUser;
});
