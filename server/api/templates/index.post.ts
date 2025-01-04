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

    // Add body component if metadata contains a body
    if (metadata.body) {
      const bodyComponent = {
        type: 'BODY',
        text: metadata.body,
        ...(metadata.templateVariables?.length > 0 && {
          example: { body_text: [metadata?.templateVariables] },
        }),
      };
      components.push(bodyComponent);
    }

    // Add header component based on metadata header type, excluding 'none'
    if (metadata?.header && metadata?.header !== "none") {
      if (metadata?.header === "text") {
        const headerComponent = {
          type: 'HEADER',
          format: metadata?.header,
          [metadata.header]: metadata?.headerText,
          ...(metadata?.headerTextTemplateVariables?.length > 0 && {
            example: { header_text: metadata?.headerTextTemplateVariables },
          }),
        };
        components.push(headerComponent);
      } else if (metadata?.headerFile) {
        const headerFileComponent = {
          type: 'HEADER',
          format: metadata?.header,
          example: {
            header_handle: [`${conf.adminBaseUrl}${metadata?.headerFile.url}`]
          },
        };
        components.push(headerFileComponent);
      }
    }

    // Add footer component if metadata contains a footer
    if (metadata.footer) {
      const footerComponent = {
        type: 'FOOTER',
        text: metadata.footer,
      };
      components.push(footerComponent);
    }

    logger.info(JSON.stringify({
      name: body.templateName,
      language: body.languageCode,
      category: "MARKETING",
      components,
    }));

    const integrationDetails: any = await db.query.integrationSchema.findFirst({
      where: and(eq(integrationSchema.id, body.integrationId)),
    });

    const resp: any = await createWhatsappMessageTemplate(
      integrationDetails?.metadata?.wabaId,
      integrationDetails?.metadata?.access_token,
      body.templateName ?? "",
      body.languageCode ?? "en",
      components,
    );
    logger.info(JSON.stringify({ res: resp?.status?.toLowerCase() }));

    const data = await createTemplate({
      ...body,
      whatsappTemplateId: resp?.id,
      verificationStatus: resp?.status?.toLowerCase(),
      organizationId,
    });

    return data;
  } catch (err) {
    logger.error(JSON.stringify({
      err: JSON.stringify(err),
      errdd: err.data,
      msg: err.message,
    }));
    return createError({
      status: 400,
      err: err?.data,
    });
  }
});
