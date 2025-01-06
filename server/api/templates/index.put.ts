import { editTemplateById } from "~/server/utils/template";

const zodUpdateTemplate = z.object({
  metadata: z.record(z.any()).optional(),
  integrationId: z.string({ required_error: "integrationId is required" }),
})

export default defineEventHandler(async (event) => {
  const organizationId = (await isOrganizationAdminHandler(event)) as string;
  
  const query = await isValidQueryHandler(event, z.object({
    templateId: z.string()
  }));
  const body = await isValidBodyHandler(event, zodUpdateTemplate)

  const integration: any = await getIntegrationById(organizationId, body.integrationId);
  
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
        type: "HEADER",
        format: metadata?.header,
        [metadata.header]: metadata?.headerText,
        ...(metadata?.headerTextTemplateVariables?.length > 0 && {
          example: { header_text: metadata?.headerTextTemplateVariables },
        }),
      };
      components.push(headerComponent);
    } else if (metadata?.headerFile) {
      const headerFileComponent = {
        type: "HEADER",
        format: metadata?.header,
        example: {
          header_handle: `${process.env.ADMIN_BASE_URL}${metadata?.headerFile.url}`,
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

  const data = await editTemplateById(
    integration?.metadata?.access_token,
    query.templateId,
    components
    );
  return data;
})