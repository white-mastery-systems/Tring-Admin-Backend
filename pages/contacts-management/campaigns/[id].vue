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
      <DateRangeFilter @change="onDateChange" />
    </div>
    <DataTable @pagination="Pagination" @row-click="(row: any) => {
        navigateTo(`/analytics/call-logs/${row.original.id}`);
      }" @limit=" ($event)=> {
      (filters.page = '1'), (filters.limit = $event);
      }
      " :totalPageCount="totalPageCount" :page="page" :totalCount="totalCount" :columns="columns"
      :data="getSingleCampaignList" :is-loading="isDataLoading" :page-size="20" :height="20" height-unit="vh" />
  </Page>
</template>
<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { createColumnHelper } from "@tanstack/vue-table";
import { Icon, UiBadge, UiButton } from "#components";
const filters = reactive < {
  q: string;
  page: string;
  limit: string;
  period: string;
  from?: string;
  to?: string;
} > ({
  q: "",
  page: "1",
  limit: "10",
  period: "",
  from: undefined,
  to: undefined,
});
const route = useRoute();
let page = ref(0);
let totalPageCount = ref(0);
let totalCount = ref(0);

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
  filters.page = $evnt;
};

const viewLead = async (callSid: any) => {
  await navigateTo({
    name: "analytics-call-logs-id",
    params: { id: callSid },
  });
};
const columnHelper = createColumnHelper<(typeof getSingleCampaignList.value)[0]>();
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
    cell: ({ row }) =>
      h(
        UiButton,
        {
          onClick: () => viewLead(row.original.callSid),
          class: "bg-[#ffbc42] hover:bg-[#ffbc42] font-bold",
        },
        [h(Icon, { name: "ph:eye-light", class: "h-4 w-4 mr-2" }), "View"],
      ),
  }),
];

const onDateChange = (value: any) => {
  if (value.from && value.to) {
    filters.from = value.from;
    filters.to = value.to;
  } else {
    delete filters.from;
    delete filters.to;
    filters.period = value;
  }
  filters.page = "1";
};
</script>