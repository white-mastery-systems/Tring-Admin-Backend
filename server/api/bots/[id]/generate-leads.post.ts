import { generateLeadInZohoBigin } from "~/server/utils/zoho/modules";

export default defineEventHandler(async (event) => {
  const generateLeadsValidation = z.object({
    botUser: z.any(),
    note: z.any(),
  });
  const generateLeadsValidationParams = z.object({
    id: z.string(),
  });
  const body = await isValidBodyHandler(event, generateLeadsValidation);
  const { id: botId } = await isValidRouteParamHandler(
    event,
    generateLeadsValidationParams,
  );
  console.log({ body, botId });

  let botIntegratsions: any = await listBotIntegrations(botId);
  botIntegratsions?.map(async (botIntegration: any) => {
    if (botIntegration?.integration?.crm === "zoho-bigin") {
      const pipelineObj = botIntegration?.metadata?.pipelineObj;
      await generateLeadInZohoBigin({
        token: botIntegration?.integration?.metadata?.access_token,
        body: {
          Deal_Name: body?.botUser?.name,
          Sub_Pipeline: pipelineObj?.Sub_Pipeline,
          Stage: pipelineObj?.Stage,
          Pipeline: pipelineObj?.Pipeline,
          Contact_Name: {
            id: "2034020000000489033",
          },
        },
      });
    }
  });
  return botIntegratsions;
});
//TODO change url redirections zoho add prod urls as well
//TODO change nuxt.config.ts in databot since john changed it
