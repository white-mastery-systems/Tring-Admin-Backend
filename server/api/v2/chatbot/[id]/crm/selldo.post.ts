export const createLeadInSellDo = async (
  notes: string,
  user: Record<string, any>,
  analytics: Record<string, any>,
) => {
  const crmDetails = {
    apiKey: "5c9507a0d2483722e200876b8d55a365",
    campaignId: "",
    projectId: "",
  };

  while (true) {
    try {
      const response: any = await $fetch(
        `https://app.sell.do/api/leads/create/`,
        {
          method: "POST",
          body: {
            api_key: crmDetails.apiKey,
            sell_do: {
              form: {
                lead: {
                  name: user.name,
                  email: user.email,
                  phone: user.mobile,
                  campaign_id: crmDetails.campaignId,
                  source: "Tring Chatbot",
                  sub_source: "Tring Chatbot",
                  project_id: crmDetails.projectId,
                },
                note: {
                  content: notes,
                },
              },
              campaign: { srd: crmDetails.projectId },
              analytics,
            },
          },
        },
      );

      if (response.sell_do_lead_id.length > 0) return response.sell_do_lead_id;

      await sleep(5000);
    } catch (e) {
      console.error(e);
      await sleep(5000);
      continue;
    }
  }
};
