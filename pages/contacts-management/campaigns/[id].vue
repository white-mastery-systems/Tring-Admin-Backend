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
    <div class="flex items-center gap-2 mb-2">
      <DateRangeFilter v-model:period="filters.period" v-model:from="filters.from" v-model:to="filters.to"
        @change="onDateChange" />
    </div>
    <DataTable @pagination="Pagination" @row-click="(row: any) => {
      navigateTo(`/analytics/call-logs/${row.original.id}?campaign=campaign`);
      }" @limit=" ($event)=> {
      (filters.page = '1'), (filters.limit = $event);
      }
      " :totalPageCount="totalPageCount" :page="page" :totalCount="totalCount" :columns="columns"
      :data="getSingleCampaignList" :is-loading="isDataLoading" :page-size="20" :height="20" height-unit="vh" />
    <CreateEditCampaignModal v-model="campaignModalState" @confirm="() => {
      campaignModalState.open = false;
      getSingleCampaign()
    }
      " />
  </Page>
</template>
<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { createColumnHelper } from "@tanstack/vue-table";
import { Icon, UiBadge, UiButton } from "#components";
import { useState } from "#app";

const filters = useState("campaignsFilters", () => ({
  q: "",
  page: "1",
  limit: "10",
  period: "",
  from: undefined,
  to: undefined,
}));
const route = useRoute();
let page = ref(0);
let totalPageCount = ref(0);
let totalCount = ref(0);
const campaignModalState = ref({ open: false, id: null });

const {
  status,
  data: getSingleCampaignList,
  refresh: getSingleCampaign,
} = await useLazyFetch(`/api/org/campaign/${route.params.id}/scheduledCalls`, {
  server: false,
  default: () => [],
  query: filters,
  transform: (campaign: any) => {
    page.value = campaign.page;
    totalPageCount.value = campaign.totalPageCount;
    totalCount.value = campaign.totalCount;
    return campaign.data;
  },
});


const isDataLoading = computed(() => status.value === "pending");
const Pagination = async ($evnt: any) => {
  filters.value.page = $evnt;
};

const viewLead = async (callSid: any) => {
  await navigateTo({
    name: "analytics-call-logs-id",
    params: { id: callSid },
  });
};
const columnHelper = createColumnHelper<(typeof getSingleCampaignList.value)[0]>();

const actionsComponent = (id: any) => 
  h(
    "div",
    {
      class: "flex items-center gap-2",
    }, 
    [
      h(
        UiButton,
        {
          color: "primary",
          class: "ml-2",
          /**
           * Opens the integration modal when the edit button is clicked.
           * @param {Event} _event - The event object from the button click.
           */
          onClick: (e:any) => {
            e.stopPropagation();
            campaignModalState.value.open = true;
            // campaignModalState.value.id = id;
          },
        },
        h(Icon, { name: "lucide:pen" }),
      ),
      h(
        UiButton,
        {
          onClick: () => viewLead(id),
          class: "bg-[#ffbc42] hover:bg-[#ffbc42] font-bold",
        },
        [h(Icon, { name: "ph:eye-light", class: "h-4 w-4 mr-2" }), "View"],
      ),
    ]
  )
const columns = [
  columnHelper.accessor("contact.name", {
    header: "contact details",
  }),
  columnHelper.accessor("bucket", {
    header: "bucket name",
  }),
  columnHelper.accessor("callStatus", {
    header: "dial status",
  }),
  columnHelper.accessor("callSid", {
    header: "call sid",
  }),
  columnHelper.accessor("callSid", {
    header: "Action",
    cell: ({ row }) => {
      return actionsComponent(row.original.id);
    },
  }),
];
const onDateChange = (value: any) => {
  if (value != "custom") {
    delete filters.value.from;
    delete filters.value.to;
  }
  filters.value.page = "1";
};
</script>