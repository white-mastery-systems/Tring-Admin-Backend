<template>
  <Page title="Campaigns" :disable-back-button="true">
    <template #actionButtons>
      <div class="flex gap-2">
        <UiButton color="primary" @click="() => {
            campaignModalState.open = true;
            campaignModalState.id = null;
          }
          ">
          Add Campaign
        </UiButton>
        </div>
    </template>
    <div>
      <div class="flex items-center gap-2 pb-2">
        <UiInput v-model="filters.q" @input="filters.page = '1'"
          class="max-w-[200px] focus-visible:ring-0 focus-visible:ring-offset-0" placeholder="Search campaign..." />
      </div>
      <DataTable @pagination="Pagination" @limit="($event) => {
        (filters.page = '1'), (filters.limit = $event);
      }
      " :totalPageCount="totalPageCount" :page="page" :totalCount="totalCount" :columns="columns"
        :data="campaignDataList" :is-loading="isDataLoading" :page-size="20" :height="16" height-unit="vh" />
      <CampaignModal v-model="campaignModalState" @confirm="() => {
        campaignModalState.open = false;
        getAllCampaign()
      }
      " />
      <ConfirmationModal v-model:open="deleteCampaigntate.open" title="Confirm Delete"
        description="Are you sure you want to delete ?" @confirm="() => {
          if (deleteCampaigntate?.id) {
            deleteSingleNumber({
              id: deleteCampaigntate.id,
              onSuccess: () => {
                 getAllCampaign()

                // getAllCampaign(
                // refresh();
              },
            });
            deleteCampaigntate.open = false;
          }
        }
        " />
    </div>
  </Page>
</template>
<script setup lang="ts">
import { Icon, UiBadge, UiButton } from "#components";
import { createColumnHelper } from "@tanstack/vue-table";
import { useRouter, useRoute } from "vue-router";
import { campaignData } from "@/composables/useRefresh";

const rowList = reactive([
  "name",
  "email",
  "visitedCount",
  "mobile",
  "createdAt",
]);

definePageMeta({
  middleware: "admin-only",
});

const router = useRouter();
const route = useRoute();
const searchCampaign = ref("");

const filters = reactive<{
  q: string;
  page: string;
  limit: string;
  active: string;
}>({
  q: "",
  active: "",
  page: "1",
  limit: "10",
});

let page = ref(0);
let totalPageCount = ref(0);
let totalCount = ref(0);
const {
  status,
  data: campaignDataList,
  refresh: getAllCampaign,
} = await useLazyFetch("/api/org/campaign", {
  server: false,
  default: () => [],
  query: filters,
  headers: {
    "time-zone": Intl.DateTimeFormat().resolvedOptions().timeZone,
  },
  transform: (campaign: any) => {
    page.value = campaign.page;
    totalPageCount.value = campaign.totalPageCount;
    totalCount.value = campaign.totalCount;
    return campaign.data;
  },
});

const deleteCampaigntate = ref({ open: false, id: null });
const campaignModalState = ref({ open: false, id: null });
// const campaignModalState = defineModel<{ open: boolean; id: any }>({
//   default: {
//     open: false,
//     id: null,
//   },
// });
// watchEffect(() => {
//   if (filters.botId === "all") filters.botId = "";
// });
// const { status, data: campaignsList,refresh: integrationRefresh, } = await useLazyFetch("/api/org/campaign", {
//   server: false,
//   default: () => [],
// });
const isDataLoading = computed(() => status.value === "pending");

const columnHelper = createColumnHelper<(typeof campaignDataList.value)[0]>();

const actionsComponent = (id: any) =>
  h(
    "div",
    {
      class: "flex items-center gap-2",
    },
    [
      // h(
      //   UiButton,
      //   {
      //     onClick: () => {

      //     },
      //     class: "bg-[#ffbc42] hover:bg-[#ffbc42] font-bold",
      //   },
      //   [h(Icon, { name: "ph:eye-light", class: "h-4 w-4 mr-2" }), "View"],
      // ),
      h(
        UiButton,
        {
          color: "primary",
          onClick: () => {
            campaignModalState.value.open = true;
            campaignModalState.value.id = id;
          }, // Add delete functionality
          class: "bg-[#f44336] hover:bg-[#f44336] font-bold", // Different color for delete
        },
        h(Icon, { name: "lucide:pen" }),
      ),
      h(
        UiButton,
        {
          variant: "destructive",
          onClick: () => {
            deleteCampaigntate.value.open = true;
            deleteCampaigntate.value.id = id;
          }, // Add delete functionality
        },
        h(Icon, { name: "lucide:trash-2" }),
      ),
    ],
  );

const columns = [
  columnHelper.accessor("campaignDate", {
    header: "Scheduled at",
    cell: ({ row }) =>
      formatDate(new Date(row.original.campaignDate), "dd MMM yyyy HH:MM "),
  }),
  // columnHelper.accessor("campaignTime", {
  //   header: "Campaign Name",
  //   cell: ({ row }) =>
  //     formatDate(new Date(row.original.campaignTime), "dd MMM yyyy HH:MM "),
  // }),

  columnHelper.accessor("phoneNumber", {
    header: "Number",
  }),
  columnHelper.accessor("createdAt", {
    header: "Created At",
    cell: ({ row }) =>
      formatDate(new Date(row.original.createdAt), "dd MMM yyyy HH:MM "),
  }),
  columnHelper.accessor("id", {
    header: "Action",
    cell: ({ row }) => {
      return actionsComponent(row.original.id);
    },
  }),
];
const Pagination = async ($evnt) => {
  filters.page = $evnt;
  getAllCampaign();
};
</script>
