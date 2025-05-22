import { logger } from "~/server/logger";
import { sendWhatsappCampaignWithTemplate} from "../whatsapp/module"
import { getTemplateDetailsByName } from "../../template";

export const whatsappReSendCampaignV2 = async (
  campaignId: string,
  templateName: any,
  contactList: any,
  metadata: any,
) => {
  try {
    return await sendWhatsappCampaignWithTemplate({ templateName, campaignId, metadata, contactList })
  } catch (error: any) {
    logger.error(`Whatsapp Resend Campaign Event error: ${JSON.stringify(error.message)}`);
    return { status: false };
  }
};