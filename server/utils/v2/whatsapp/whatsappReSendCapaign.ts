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
    const accessToken = metadata?.access_token;
    const wabaId = metadata?.wabaId;

    const templateDetailList = await getTemplateDetailsByName(wabaId, accessToken, templateName);
    const templateInformation = templateDetailList?.find((i: any) => i.name === templateName);
    return await sendWhatsappCampaignWithTemplate({ templateInformation, campaignId, metadata, contactList })
  } catch (error: any) {
    logger.error(`Whatsapp Resend Campaign Event error: ${JSON.stringify(error.message)}`);
    return { status: false };
  }
};