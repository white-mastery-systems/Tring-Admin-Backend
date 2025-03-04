export const useSingleCampaign = (id: string, filters: Record<string, any>) => {
  const page = ref(1);
  const totalPageCount = ref(1);
  const totalCount = ref(0);
  const failedCampaigns = ref(false);
  const {
    status,
    data: campaignDataList,
    refresh,
  } = useLazyFetch(`/api/org/campaign/${id}/whatsappContacts`, {
    server: false,
    default: () => [],
    query: filters,
    transform: (campaign: any) => {
      // Ensure campaign object is valid
      if (!campaign || !campaign.data) {
        return [];
      }
      // Update pagination values
      page.value = campaign.page ?? 1;
      totalPageCount.value = campaign.totalPageCount ?? 1;
      totalCount.value = campaign.totalCount ?? 0;
      failedCampaigns.value = campaign.failedCampaigns ?? false;

      // Transform each row to format message status with new lines
      return campaign.data.map((row: any) => {
        const sentAt = row?.sentAt ?? "NA"; // Default to "N/A" if missing
        const deliveredAt = row?.deliveredAt ?? "NA";
        const readAt = row?.readAt ?? "NA";

        return {
          ...row, // Preserve existing data
          name: `${row?.firstName} ${row?.lastName}`,
          phone: `${row?.countryCode} ${row?.phone}`,
          formattedMessageStatus: `Sent - ${sentAt}\nDelivered - ${deliveredAt}\nRead - ${readAt}`, // New lines using \n
        };
      });
    },
  });

  return {
    status,
    campaignDataList,
    refresh,
    page,
    totalPageCount,
    totalCount,
    failedCampaigns,
  };
};
