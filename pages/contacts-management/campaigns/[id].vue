<template>
  <Page title="Campaigns Details" :disable-back-button="false">
    <template #actionButtons v-if="failedCampaigns">
      <UiButton color="primary" @click="RetryFailedDeliveries()" :loading="isLoading">
        Retry Failed Deliveries
      </UiButton>
    </template>
    <div v-if="getCampaignsDetails.contactMethod === 'whatsapp'">
      <AddEditChatBotCampaigns />
    </div>
    <div v-else>
      <AddEditVoiceBotCampaigns />
    </div>
  </Page>
</template>
<script setup lang="ts">
import { useState } from "#app";
import { UiButton } from "#components";
import { useRoute } from "vue-router";
import { useSingleCampaign } from "~/composables/useSingleCampaign";
import { useBreadcrumbStore } from "~/store/breadcrumbs"; // Import the store

const route = useRoute();
const filters = useState("campaignsFilters", () => ({
  q: "",
  page: "1",
  limit: "10",
  period: "",
  from: undefined,
  to: undefined,
}));
const isLoading = ref(false);
const { id } = route.params;
const getCampaignsDetails = ref([]);
const breadcrumbStore = useBreadcrumbStore();
const {
  status,
  campaignDataList,
  refresh,
  page,
  totalPageCount,
  totalCount,
  failedCampaigns,
} = useSingleCampaign(id, filters);

// Now, you can use `getSingleCampaignList.failedCampaigns` in your component
onMounted(async() => {
  refresh();
  getCampaignsDetails.value = await getSingleCampaingsDetails(id)
  breadcrumbStore.setBreadcrumbs([
    {
      label: 'Campaigns',
      to: `/contacts-management/campaigns`,
    },
    {
      label: getCampaignsDetails.value.campaignName ?? 'No Name',
      to: `/contacts-management/campaigns/${id}`,
    },
  ]);
});
const RetryFailedDeliveries = async () => {
  isLoading.value = true;
  try {
    const orgData = await $fetch(`/api/org/campaign/${id}/resend`, {
      method: "POST",
      body: {
        ...getCampaignsDetails,
      },
    });
    toast.success(orgData.message);
    if (orgData.status) {
      refresh();
    }
    // return orgData; // Return the response if needed
  } catch (error) {
    toast.error(error.statusMessage);
  }
  isLoading.value = false;
};
</script>
