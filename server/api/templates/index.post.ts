import { logger } from "~/server/logger";
import { createTemplate } from "~/server/utils/db/templates";
import { createWhatsappMessageTemplate } from "~/server/utils/template";

const zodInsertTemplates = z.object({
  templateName: z.string().optional(),
  languageCode: z.string().optional(),
  metadata: z.record(z.any()).optional(),
  integrationId: z.string({ required_error: "integrationId is required" }),
});

const db = useDrizzle();
const conf = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  
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
          header_handle: `${conf.adminBaseUrl}${metadata?.headerFile?.url}`,
        },
      });
    }
    if (metadata?.footer) {
      components.push({ type: "FOOTER", text: metadata?.footer });
    }
    logger.info({
        name: body.templateName,
        language: body.languageCode,
        category: "MARKETING",
        components,
      },
    );
    const integrationDetails: any = await db.query.integrationSchema.findFirst({
      where: and(eq(integrationSchema.id, body.integrationId)),
    });
    const resp: any = await createWhatsappMessageTemplate(
      integrationDetails?.metadata?.wabaId,
      integrationDetails?.metadata?.access_token,
      body.templateName ?? '',
      body.languageCode ?? 'en',
      components
    )
    logger.info({ res: resp?.status?.toLowerCase() });
    const data = await createTemplate({
      ...body,
      whatsappTemplateId: resp?.id,
      verificationStatus: resp?.status?.toLowerCase(),
      organizationId,
    });
    return data;
  } catch (error) {
    logger.error({
      error: JSON.stringify(error),
      message: error?.message,
      errorData: error?.data,
      
    });
    return createError({
      status: 400,
      error: error?.data
      message: error?.message,
    });
  }
});
