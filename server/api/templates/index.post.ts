import { logger } from "~/server/logger";
import { createTemplate } from "~/server/utils/db/templates";

const zodInsertTemplates = z.object({
  name: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export default defineEventHandler(async (event) => {
  const organizationId = (await isOrganizationAdminHandler(event)) as string;

  const body = await isValidBodyHandler(event, zodInsertTemplates);
  try {
    const metadata: any = { ...body.metadata };

    logger.info(
      JSON.stringify({
        name: body.name,
        language: "en_US",
        category: "MARKETING",
        components: [
          {
            type: "HEADER",
            format: body?.metadata?.header,
            [body?.metadata?.header]: body?.metadata?.headerText,
            example: {
              header_text: body?.metadata?.headerTextTemplateVariables,
            },
          },
          {
            type: "BODY",
            text: body?.metadata?.body,
            example: {
              body_text: [body?.metadata?.templateVariables],
            },
          },
          {
            type: "FOOTER",
            text: body?.metadata?.footer,
          },
        ],
      }),
    );

    console.log(metadata, "HEADER");
    const components = [
      {
        type: "HEADER",
        format: metadata?.header,
        [metadata?.header]: metadata?.headerText,
        ...(metadata?.header && {
          example: {
            header_text: metadata?.headerTextTemplateVariables,
          },
        }),
      },
      {
        type: "BODY",
        text: metadata?.body,
        example: {
          body_text: [metadata?.templateVariables],
        },
      },
      { type: "FOOTER", text: metadata?.footer },
    ];
    const resp: any = await $fetch(
      "https://graph.facebook.com/v21.0/454567781066093/message_templates",
      {
        method: "POST",
        headers: {
          authorization: `Bearer EAAwYX9ZCRR1gBOwWFT3FNunZA1iUHXU2XFxKLaBQpVMU9AlGsxuEGmDo5EzkoxRe3JWJfgPegPabBZAMeZB39Fd9plt0r8OIXQ0Yx7vAlV1moZBDwL0EKF2dymLtCUtr7fBIK6WyKemDKbr8if32lhKLeIxbtH2yFS6NvRI4DSpGmrlSbJ8b4QmZAodBZBWOZCuda2ZCL2oKGk3o5Aj8jAhL0yTYAUEDbWmZBWIQBlWWCkRKwOeqp0kdlazl3fN6Oe`,
        },
        body: {
          name: body.name,
          language: "en_US",
          category: "MARKETING",
          components,
        },
      },
    );
    console.log({ res: resp?.status?.toLowerCase() });
    const data = await createTemplate({
      ...body,
      verificationStatus: resp?.status?.toLowerCase(),
      organizationId,
    });
    console.log({ resp });
    return data;
  } catch (err) {
    console.log({ err: JSON.stringify(err) });
    return createError({
      status: 400,
      err: err?.data,
    });
  }
});
