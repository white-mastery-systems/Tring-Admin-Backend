import { logger } from "~/server/logger";
import { createTemplate } from "~/server/utils/db/templates";

const zodInsertTemplates = z.object({
  name: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export default defineEventHandler(async (event) => {
  const conf = useRuntimeConfig();
  const organizationId = (await isOrganizationAdminHandler(event)) as string;

  const body = await isValidBodyHandler(event, zodInsertTemplates);
  try {
    const metadata: any = { ...body.metadata };

    let components: any[] = [];
    if (metadata.body) {
      components.push({
        type: "BODY",
        text: metadata?.body,
        ...(metadata?.templateVariables?.length > 0 && {
          example: {
            body_text: [metadata?.templateVariables],
          },
        }),
      });
    }
    if (metadata?.header === "text") {
      components.push({
        type: "HEADER",
        format: metadata?.header,
        [metadata?.header]: metadata?.headerText,
        ...(metadata?.headerTextTemplateVariables?.length > 0 && {
          example: {
            header_text: metadata?.headerTextTemplateVariables,
          },
        }),
      });
    } else if (metadata?.headerFile) {
      components.push({
        type: "header",
        format: metadata?.header,
        example: {
          header_handle: `${conf.llmCallbackUrl}${metadata?.headerFile?.url}`,
        },
      });
    }
    if (metadata?.footer) {
      components.push({ type: "FOOTER", text: metadata?.footer });
    }
    console.log({ components });
    logger.info(
      JSON.stringify({
        name: body.name,
        language: "en_US",
        category: "MARKETING",
        components,
      }),
    );
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
      whatsappTemplateId: resp?.id,
      verificationStatus: resp?.status?.toLowerCase(),
      organizationId,
    });
    console.log({ resp });
    return data;
  } catch (err) {
    console.log({
      err: JSON.stringify(err),
      errdd: err.data,
      msg: err.message,
    });
    return createError({
      status: 400,
      err: err?.data,
    });
  }
});
