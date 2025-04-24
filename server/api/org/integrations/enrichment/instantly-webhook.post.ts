import { logger } from "~/server/logger";
import { getIntegrationDetails } from "~/server/utils/db/integrations";
import { sendWhatsappMessage } from "~/server/utils/whatsapp/module";
import countriesData from "~/assets/country-codes.json";
import { fetchEnrichByPhoneOrCreate, updateWhatsappEnrichmentById } from "~/server/utils/db/whatsapp-enrichment";

const db = useDrizzle();

const zodInsertWhatsappEntrichment = z.object({
  // organizationId: z.string(),
  // userId: z.string(),
  // integrationId: z.string(), (After POC we can use this for find bot integration)
  company: z.string().optional(),
  name: z.string().optional(),
  email: z.string().optional(),
  phone: z.string(),
  countryCode: z.string().optional(),
  country: z.string().optional(),
});

export default defineEventHandler(async (event) => {
  try {
    // const body = await isValidBodyHandler(event, zodInsertWhatsappEntrichment);
    const body = await readBody(event);
    // const { name, email, phone, countryCode, country } = body;
    logger.info(`Instantly webhook-body: ${JSON.stringify(body)}`);
  
    return { status: true, message: "success" };
  } catch(error:any) {
    logger.error(JSON.stringify({ error: JSON.stringify(error), msg: error.message }));
    return {status:false, message: error.message};
  }
});
