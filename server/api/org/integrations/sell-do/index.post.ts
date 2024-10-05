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
    "EAAwYX9ZCRR1gBOwWFT3FNunZA1iUHXU2XFxKLaBQpVMU9AlGsxuEGmDo5EzkoxRe3JWJfgPegPabBZAMeZB39Fd9plt0r8OIXQ0Yx7vAlV1moZBDwL0EKF2dymLtCUtr7fBIK6WyKemDKbr8if32lhKLeIxbtH2yFS6NvRI4DSpGmrlSbJ8b4QmZAodBZBWOZCuda2ZCL2oKGk3o5Aj8jAhL0yTYAUEDbWmZBWIQBlWWCkRKwOeqp0kdlazl3fN6Oe";
  // const metaToken =
  //   "EAAwYX9ZCRR1gBO2ioA7fTdz5SUSdLZAcDdHyQZCIi7dAiKkI2OVqYEgpbbY1JUTPF6FsbbvYbV4hFwZBMtehzff98JFdf2V5YFZBALLSEo0BHFYk54tii9cefhX28ZBi3XjIOaDMrpsrDW3xQcQbRv5BYCP5nZBRGXJoUSAcgPd79X0jSPtArfvSdVspKBbesISKQZDZD";
  const phoneId = "112867458396790";
  const templateName = "client_follow_up_sis";

  // const userPhone= "919841513901"
  // const userPhone= "918848083317"
  const userPhone = body?.mobile;
  const organization = body?.organization ?? "South India Shelters";
  const salesmanager = body?.salesmanager ?? "Reena";
  // console.log({metT})
  let waBody = {
    messaging_product: "whatsapp",
    // to: "919884074715",
    to: "918848073317",

    type: "template",
    template: {
      name: "tring_followup_template",
      language: {
        code: "en",
      },
      components: [
        {
          type: "header",
          parameters: [
            {
              type: "image",
              image: {
                link: "https://app.tringlabs.ai/uploads/1e66997c-7b9c-4711-8079-eb54a286d745.jpg",
                // link: "https://plus.unsplash.com/premium_photo-1674761372287-554e42777b9f?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              },
            },
          ],
        },
        {
          type: "body",
          parameters: [
            {
              type: "text",
              text: body?.lead?.first_name + " " + body?.lead?.last_name,
            },
            {
              type: "text",
              text: "South India Shelters",
            },
            {
              type: "text",
              text: body?.payload?.interested_properties_name[0],
            },
            {
              type: "text",
              text: "+918848083317",
            },
            {
              type: "text",
              text: "Reena",
            },
            {
              type: "text",
              text: "South India Shelters",
            },
          ],
        },
      ],
    },
  };

  // body?.payload?.stage === "unqualified";
  //TODO remove consoles
  // if (body?.event === "outgoing_call_not_answered") {
  //   try {
  //     const data = await $fetch(
  //       "https://graph.facebook.com/v20.0/448392115020601/messages",
  //       {
  //         method: "POST",
  //         body: waBody,
  //         headers: {
  //           authorization: `Bearer ${metaToken}`,
  //         },
  //       },
  //     );
  //     console.log({ data });
  //     return data;
  //   } catch (err: any) {
  //     console.log(err.message);
  //     logger.info(`error ${JSON.stringify(err)} ${err.message}`);
  //   }
  // }

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
