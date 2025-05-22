import { logger } from "~/server/logger";
import { errorResponse } from "~/server/response/error.response";
import { createTemplate } from "~/server/utils/db/templates";
import { createWhatsappMessageTemplate, deStructureVariables, positioningText, replaceNamedVariables } from "~/server/utils/template";

const db = useDrizzle();

const zodInsertTemplates = z.object({
  templateName: z.string(),
  language: z.string().optional(),
  metadata: z.object({
    variableType: z.string().optional(),
    variables: z.array(z.object({
      placed: z.string(),
      name: z.string().optional(),
      position: z.string().optional(),
      example: z.string().optional(),
    })).optional(),
    templateVariables: z.array(z.object({
      placed: z.string(),
      name: z.string().optional(),
      position: z.string().optional(),
      example: z.string().optional(),
    })).optional(),
    headerType: z.enum(["text", "document", "image", "video", "none"]).optional(),
    headerText: z.string().optional(),
    bodyText: z.string(),
    footerText: z.string().optional(),
    mediaSession: z.any().optional(),
    buttons: z.array(z.object({
      type: z.enum(["URL", "PHONE_NUMBER", "COPY_CODE"]),
      url: z.string().optional(),
      phone_number: z.string().optional(),
      buttonText: z.string().optional(),
      example: z.string().optional(),
    })).optional()
  }),
  integrationId: z.string({ required_error: "integrationId is required" }),
  category: z.string().optional(),
});
export default defineEventHandler(async (event) => {
  try {
    const organizationId = (await isOrganizationAdminHandler(event)) as string;
    const {templateName, language, metadata, integrationId, category:TempalteCategory} = await isValidBodyHandler(event, zodInsertTemplates);
    metadata.headerType = metadata?.headerType ?? "none";
    metadata.variableType = metadata?.variableType ?? "NAMED";
    const category = (TempalteCategory) ?? "MARKETING";
    const components: any[] = [];
 
    const { bodyVariables, headerVariables, buttonVariables, headerText, bodyText, footerText } = deStructureVariables(metadata, metadata.variableType);
    if (["document", "image", "video"].includes(metadata?.headerType) && metadata?.mediaSession) {
      components.push({
        type: "HEADER",
        format: `${metadata?.headerType}`.toUpperCase(),
        example: {
          header_handle: [metadata?.mediaSession?.h || metadata?.mediaSession],
        },
      });
    } else if (headerText && headerText !== "none" && metadata?.headerType === "text") {
      components.push({
        type: "HEADER",
        format: "TEXT",
        text: headerText,
        ...(headerVariables.length && {
          example: {
            header_text: [...headerVariables.map((item: any) => item.example)],
          },
        }),
      });
    }
    
    if (bodyText){
      components.push({
        type: "BODY",
        text: bodyText,
        ...(bodyVariables.length && {
          example: {
            body_text: [bodyVariables.map((item: any) => item.example)],
          },
        }),
      });
    }

    if (footerText) {
      components.push({ type: "FOOTER", text: footerText });
    }

    if (metadata?.buttons && metadata?.buttons?.length) {
      const buttonComponents = metadata?.buttons?.map((item: any) => {
        let buttonIndex = 0;
        if (item.buttonText) {
          if (item.type !== "COPY_CODE") item.text = `${item.buttonText}`;
          delete item.buttonText;
        }
        if (item.type === "URL") {
          if(buttonVariables.length){
            item.url = positioningText(item.url, 1);
            item.example = `${item.url}`.replace("{{1}}",`${buttonVariables[buttonIndex].example}`);
          } else {
            const {text:url, variables:buttonVariable} = replaceNamedVariables(item.url, "button")
            item.url = url;
            if(buttonVariable.length){
              item.example = `${item.url}`.replace("{{1}}",`${buttonVariable[0].example}`);
            } 
          }
        }
        if (item.type === "PHONE_NUMBER" && buttonVariables.length) {
          item.phone_number = `${buttonVariables[buttonIndex].example}`;
          delete item.example;
        }
        buttonIndex++;
        return item;
      });
      components.push({ type: "BUTTONS", buttons: buttonComponents });
    }

    const integrationDetails: any = await db.query.integrationSchema.findFirst({
      where: and(eq(integrationSchema.id, integrationId)),
    });

    const resp: any = await createWhatsappMessageTemplate(integrationDetails?.metadata?.wabaId, integrationDetails?.metadata?.access_token, templateName, language || "en", components, category);
    logger.info(`Whatsapp Template creation : ${JSON.stringify({ res: resp })}`);

    const data = await createTemplate({
      name:templateName,
      metadata,
      integrationId,
      whatsappTemplateId: resp?.id,
      verificationStatus: resp?.status?.toLowerCase(),
      organizationId,
    });
    
    return {status:true, ...data};
  } catch(error:any) {
    logger.error(JSON.stringify({ error: JSON.stringify(error), msg: error.message }));
    return errorResponse(event, 404, error.message || "Error Occured in whatsapp template creation");
  }
});
