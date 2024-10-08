export default defineEventHandler(async (event) => {
  const generateVoicebotLeadsValidation = z.object({
    botUser: z.any(),
    note: z.any(),
    chatId: z.string().uuid(),
  });
  const generateVoicebotLeadsValidationParams = z.object({
    id: z.string(),
  });
  const body = await isValidBodyHandler(event, generateVoicebotLeadsValidation);
  const { id: voicebotId } = await isValidRouteParamHandler(
    event,
    generateVoicebotLeadsValidationParams,
  );

  const voicebotDetails: any = await getBotDetails(voicebotId);
  const adminUser: any = await getAdminByOrgId(voicebotDetails?.organizationId);

  let voicebotIntegrations = await listVoiceBotIntegrations(
    voicebotDetails?.organizationId,
    voicebotId,
  );

  voicebotIntegrations?.map(async (botIntegration: any) => {
    if (botIntegration?.integration?.crm === "zoho-bigin") {
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

      const generatedLead = await generateLeadInZohoBigin({
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
          Lead_Source: "Tring VoiceBot",
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
      const data = await createLeadInSellDo(
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
