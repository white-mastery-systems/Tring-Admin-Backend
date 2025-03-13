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
import { useRoute, useRouter } from "vue-router";
import { useSingleCampaign } from "~/composables/useSingleCampaign";
import { useBreadcrumbStore } from "~/store/breadcrumbs"; // Import the store

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
const getCampaignsDetails = ref([]);
const breadcrumbStore = useBreadcrumbStore();
// const failedCampaigns = ref(false); // ✅ Declare first
const {
  status,
  campaignDataList,
  refresh,
  page,
  totalPageCount,
  totalCount,
  failedCampaigns,
} = useSingleCampaign(id, filters);

// const {
//   status,
//   data: getSingleCampaignList,
//   refresh: getSingleCampaign,
// } = await useLazyFetch(`/api/org/campaign/${id}/whatsappContacts`, {
//   server: false,
//   query: filters,
//   default: () => ({ data: [], failedCampaigns: false }), // Ensure structure matches API response
//   transform: (campaignResponse: any) => {
//     // Extracting data and failedCampaigns correctly
//     const { data, failedCampaigns } = campaignResponse;
//     return { data, failedCampaigns }; // Ensure both are returned
//   },
// });

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
      refresh();
    }
    // return orgData; // Return the response if needed
  } catch (error) {
    toast.error(error.statusMessage);
  }
  isLoading.value = false;
};
</script>
