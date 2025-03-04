<template>
  <!-- :bread-crumbs="[
  {
  label: ``,
  to: `/contacts-management/campaigns`,
  },
  {
  label: 'Campaigns',
  to: `/contacts-management/campaigns`,
  },
  ]" -->
  <Page title="Campaigns Details" :disable-back-button="false">
    <template #actionButtons v-if="getSingleCampaignList.failedCampaigns">
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
import { useRoute, useRouter } from "vue-router";
import { createColumnHelper } from "@tanstack/vue-table";
import { Icon, UiBadge, UiButton } from "#components";
import { useState } from "#app";


const route = useRoute();
const router = useRouter();
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
const getCampaignsDetails = await getSingleCampaingsDetails(id)
const failedCampaigns = ref(false); // ✅ Declare first

const {
  status,
  data: getSingleCampaignList,
  refresh: getSingleCampaign,
} = await useLazyFetch(`/api/org/campaign/${id}/whatsappContacts`, {
  server: false,
  query: filters,
  default: () => ({ data: [], failedCampaigns: false }), // Ensure structure matches API response
  transform: (campaignResponse: any) => {
    // Extracting data and failedCampaigns correctly
    const { data, failedCampaigns } = campaignResponse;
    return { data, failedCampaigns }; // Ensure both are returned
  },
});


// Now, you can use `getSingleCampaignList.failedCampaigns` in your component


const isDataLoading = computed(() => status.value === "pending");
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
      getSingleCampaign()
    }
    // return orgData; // Return the response if needed
  } catch (error) {
    toast.error(error.statusMessage);
  }
  isLoading.value = false;
};


</script>