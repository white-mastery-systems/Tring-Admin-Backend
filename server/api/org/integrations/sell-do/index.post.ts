// import {
//   generateTemplateComponents,
//   sendWhatsappTemplate,
// } from "../whatsapp/campaign.post";

import { logger } from "~/server/logger";

export default defineEventHandler(async (event) => {
  const query: any = getQuery(event);
  const body = await readBody(event);
  logger.info(`${JSON.stringify(body)}`);

  const metaToken =
    "EAAwYX9ZCRR1gBO2ioA7fTdz5SUSdLZAcDdHyQZCIi7dAiKkI2OVqYEgpbbY1JUTPF6FsbbvYbV4hFwZBMtehzff98JFdf2V5YFZBALLSEo0BHFYk54tii9cefhX28ZBi3XjIOaDMrpsrDW3xQcQbRv5BYCP5nZBRGXJoUSAcgPd79X0jSPtArfvSdVspKBbesISKQZDZD";
  const phoneId = "112867458396790";
  const templateName = "client_follow_up_sis";

  // const userPhone= "919841513901"
  // const userPhone= "918848083317"
  const userPhone = body?.mobile;
  const organization = body?.organization ?? "South India Shelters";
  const salesmanager = body?.salesmanager ?? "Reena";

  // const components: any[] = generateTemplateComponents([
  //   body?.fullName,
  //   organization,
  //   body?.projectName,
  //   userPhone,
  //   salesmanager,
  //   organization,
  // ]);

  // const result = await sendWhatsappTemplate(
  //   metaToken,
  //   phoneId,
  //   userPhone,
  //   templateName,
  //   components,
  // );
  return true;
  // return true
});
