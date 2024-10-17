import { logger } from "~/server/logger";
import { createTemplate } from "~/server/utils/db/templates";

const zodInsertTemplates = z.object({
  name: z.string().optional(),
  metadata: z.record(z.any()).optional(),
  integrationId: z.string({ required_error: "integrationId is required" }),
});

export default defineEventHandler(async (event) => {
  const db = useDrizzle();
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
    const integrationDetails: any = await db.query.integrationSchema.findFirst({
      where: and(eq(integrationSchema.id, body.integrationId)),
    });
    console.log(integrationDetails, "INTEID");
    const resp: any = await $fetch(
      `https://graph.facebook.com/v21.0/${integrationDetails?.metadata?.wabaId}/message_templates`,
      {
        method: "POST",
        headers: {
          authorization: `Bearer ${integrationDetails?.metadata?.access_token}`,
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
