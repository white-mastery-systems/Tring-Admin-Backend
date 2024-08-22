export const createLeadInSellDo = async (
  notes: string,
  user: Record<string, any>,
  analytics: Record<string, any>,
  apiKey: string,
  projectId: string,
  campaignId: string,
) => {
  while (true) {
    try {
      const response: any = await $fetch(
        `https://app.sell.do/api/leads/create/`,
        {
          method: "POST",
          body: {
            api_key: apiKey,
            sell_do: {
              form: {
                lead: {
                  name: user.name,
                  email: user.email,
                  phone: user.mobile,
                  campaign_id: campaignId,
                  source: "Tring Chatbot",
                  sub_source: "Tring Chatbot",
                  project_id: projectId,
                },
                note: {
                  content: notes,
                },
              },
              campaign: { srd: projectId },
              analytics,
            },
          },
        },
      );

      if (response.sell_do_lead_id.length > 0) return response.sell_do_lead_id;

      console.log("Lead creation failed, retrying in 5 seconds...");
      await sleep(5000);
    } catch (e) {
      console.error(e);
      await sleep(5000);
      continue;
    }
  }
};
