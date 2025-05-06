import { updateWhatsappCampaignIntractStatusContact } from "~/server/utils/db/campaign";

const zodUpdateWhatsappMessageBody = z.object({
  campaignId: z.string(),
  organizationId: z.string(),
  phone: z.string(),
  countryCode: z.string().optional(),
  interactionStatus: z.enum(["Booked", "Engaged", "Failed", "Follow Up", "Invalid Number", "New Lead", "Not Interested", "No Response"]),
  errorCode: z.any().optional(),
});

export default defineEventHandler(async (event) => {
  const {campaignId, organizationId, phone, interactionStatus} = await isValidBodyHandler(event, zodUpdateWhatsappMessageBody);

  const data = await updateWhatsappCampaignIntractStatusContact(campaignId, organizationId, phone, interactionStatus);

  return data;
});
