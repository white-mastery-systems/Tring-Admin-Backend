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
  companyUrl: z.string().optional(),
  url: z.string().optional(),
  name: z.string().optional(),
  email: z.string().optional(),
  phone: z.string(),
  countryCode: z.string().optional(),
  country: z.string().optional(),
});

export default defineEventHandler(async (event) => {
  try {
    const body = await isValidBodyHandler(event, zodInsertWhatsappEntrichment);
    // const { name, email, phone, countryCode, country } = body;
    logger.info(`new whatsapp enrichment-body: ${JSON.stringify(body)}`);
    /* Get all details by integratin id
      const organizationId = "1adaf544-84bd-4e20-a365-3aaf86f4d851";
      const integrationId = "f6ecba82-ebe2-4554-8dd5-be25ec90ecfb";
      const integrationData = await getIntegrationDetails(integrationId);
      
      if (!integrationData) {
        return {status:false, error: "Integration not found"};
      }
      const [botDetails, botuser] = await Promise.all([
        db.execute(sql`SELECT * from ${chatBotSchema} WHERE channels->>'whatsapp'=${integrationId} FETCH FIRST 1 ROW ONLY`),
        fetchUserByPhoneOrCreate(userPhone, integrationData.org_id, "whatsapp", body?.name, body?.email)
      ]);
      const bot:any = botDetails?.rows[0];
    */
       
    /* Get all details by bot id */
    const botId = "3858e7d4-3151-4608-85fc-17b1e323fff6";
    const bot = await getBotDetails(botId);
    if (!bot || !bot.channels?.whatsapp) {
      return {status:0, message: "Bot details not found"};
    }

    const { countryCode, phoneLength } = getNormalizedPhoneDetails(body);

    const userPhone = normalizedPhoneNumber(`${countryCode}`, body.phone, phoneLength);
    const [integrationData, botuser] = await Promise.all([
      getIntegrationDetails(bot.channels?.whatsapp),
      fetchUserByPhoneOrCreate(userPhone, bot.organizationId, "whatsapp", body?.name, body?.email)
    ])

    const integrationDetail = integrationData || (await getOrgWhatsappIntegration(bot.organizationId)).at(0)

    if(!integrationDetail){
      return { status: 0, message: "Whatsapp integration data not found", data: null}
    }

    if(body.company){
      // @ts-ignore
      botuser.company = body.company;
    }
    if(body.url || body.companyUrl){
      // @ts-ignore
      botuser.companyUrl = (body.url) ?? body.companyUrl;
    }
 
    const [chat, enrichData] = await Promise.all([
      fetchWhatsappChatOrCreate(botuser.id, bot.id, integrationDetail?.org_id),
      fetchEnrichByPhoneOrCreate(botuser, integrationDetail?.id),
    ]);

    const { access_token, pid } = integrationDetail?.metadata;
    const message = `${body?.name ? `Hi *${body.name},* Welcome to YourStore.io!\n` : `*Welcome to YourStore.io!*\n`}\nWe’re excited to have you onboard. We’ll use this chat to send you exclusive updates, offers, and the latest trends from our store.\n\nReady to explore? Visit\n [https://yourstore.io/] or If you have any questions, feel free to message me here!.`;
    const data:any = await sendWhatsappMessage(`${access_token}`, `${pid}`, userPhone, message)

    if(data?.messages[0]?.id){
      await Promise.all([
        createChatMessage({
          chatId: chat.id,
          content: message,
          role: "assistant",
          metadata: { messageId: data?.messages[0]?.id, userPhone, leadStatus: false, msgType:"Whatsapp Enrich"},
        }),
        updateWhatsappEnrichmentById(enrichData.id, {...enrichData, metadata:{...(enrichData?.metadata || {}), messageId: data?.messages[0]?.id}})
      ]);
    }
    return { status: 1, message: "success", data: enrichData };
  } catch(error:any) {
    logger.error(JSON.stringify({ error: JSON.stringify(error), msg: error.message }));
    return { status: 0, message: error.message, data: null };
  }
});

const normalizedPhoneNumber = (countryCode: string, phone: string, phoneLength:number): string => {
  const cleanedCountryCode = countryCode.replace(/\D/g, ""); // Remove non-digits
  const cleanedPhone = phone.replace(/\D/g, ""); // Remove non-digits

  // If phone already starts with the country code, return as-is
  if (cleanedPhone.startsWith(cleanedCountryCode) && phoneLength < cleanedPhone.length) {
    return cleanedPhone;
  }

  return cleanedCountryCode + cleanedPhone;
};


const getNormalizedPhoneDetails = (body: any) => {
  let phoneLength = 10;
  let countryCode = body?.countryCode ?? null;

  if (countryCode) {
    countryCode = "+" + countryCode.replace(/\+/g, "").trim();
    const data = countriesData.find((item) => item.dial_code === countryCode);
    phoneLength = Array.isArray(data?.phoneLength) ? data.phoneLength[0] : data?.phoneLength ?? phoneLength;
  } else if (body?.country) {
    const country = body?.country.toLowerCase();
    const data = countriesData.find((item) => item.name.toLowerCase() === country || item.code.toLowerCase() === country || item.flag.toLowerCase() === country);
    countryCode = data?.dial_code || "+91";
    phoneLength = Array.isArray(data?.phoneLength) ? data.phoneLength[0] : data?.phoneLength ?? phoneLength;
  } else {
    countryCode = "+91"
  }
  return { countryCode, phoneLength };
};