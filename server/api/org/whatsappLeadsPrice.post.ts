import countriesData from "~/assets/country-codes.json";

export default defineEventHandler(async (event) => {
  const body = await isValidBodyHandler(
    event,
    z.object({
      organizationId: z.string(),
      countryCode: z.string().optional()
    }),
  );
  const reduceAmount = countriesData.find((item)=> item.dial_code == body.countryCode)?.leadMessageCost || 0.4
  const orgSubscriptionDetail = await getOrgSubscriptionStatus(body.organizationId,"chat");
  
  let whatsappWalletBalance = orgSubscriptionDetail?.whatsappWallet || 0;
  if (whatsappWalletBalance < reduceAmount) {
    return { status: false };
  } else {
    const whatsappLeadPrice = parseFloat((1 * reduceAmount).toFixed(2));
    whatsappWalletBalance = Math.max(
      0,
      parseFloat((whatsappWalletBalance - whatsappLeadPrice).toFixed(2)),
    );
    await updateOrgWhatsappSessions(body.organizationId, whatsappWalletBalance);
    return { status: true };
  }
});
