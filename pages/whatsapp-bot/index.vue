<template>
  <Page title="Integration" :disable-back-button="true">
    <template #actionButtons>
      <div class="flex gap-2">
        <UiButton color="primary" @click="() => {
            channelModalState.open = true;
            channelModalState.id = null;
          }
          ">
          Add Channel
        </UiButton>
      </div>
    </template>
    <div>
      <DataTable @pagination="Pagination" @limit="($event) => {
          (page = '1'), (limit = $event);
        }
        " :totalPageCount="totalPageCount" :page="page" :totalCount="totalCount" :columns="statusColumns"
        :data="integrationsData" :page-size="8" :is-loading="false" :height="15" :heightUnit="'vh'" />
      <ChannelModal v-model="channelModalState" @success="onSuccessChannel()" />
      <ConfirmationModal v-model:open="deleteCampaigntate.open" title="Confirm Delete"
        description="Are you sure you want to delete ?" @confirm="() => {
          if (deleteCampaigntate?.id) {
            deleteSingleNumber({
              id: deleteCampaigntate.id,
              onSuccess: () => {
                integrationRefresh()

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

definePageMeta({
  middleware: "admin-only",
});

// const filters = reactive<{
//   q: string;
//   page: string;
//   limit: string;
//   active: string;
// }>({
//   q: "",
//   active: "",
//   page: "1",
//   limit: "10",
// });

let page = ref(0);
let totalPageCount = ref(0);
let totalCount = ref(0);
const limit = ref('10')

const filters = computed(() => ({
  q: 'channel',
  page: page.value,
  limit: limit.value,
}));
// const {
//   status,
//   data: campaignDataList,
//   refresh: getAllCampaign,
// } = await useLazyFetch("/api/org/campaign", {
//   server: false,
//   default: () => [],
//   query: filters,
//   headers: {
//     "time-zone": Intl.DateTimeFormat().resolvedOptions().timeZone,
//   },
//   transform: (campaign: any) => {
//     page.value = campaign.page;
//     totalPageCount.value = campaign.totalPageCount;
//     totalCount.value = campaign.totalCount;
//     return campaign.data;
//   },
// });

const {
  status: integrationLoadingStatus,
  data: integrationsData,
  refresh: integrationRefresh,
} = await useLazyFetch("/api/org/integrations", {
  server: false,
  default: () => [],
  query: filters,
  transform: (integrations) => {
    page.value = integrations.page;
    totalPageCount.value = integrations.totalPageCount;
    totalCount.value = integrations.totalCount;
    return integrations.data?.map((integration) => ({
      ...integration,
      status: integration?.metadata?.status ?? "Verified",
    }));
  },
});

const deleteCampaigntate = ref({ open: false, id: null });
const channelModalState = ref({ open: false, id: null });
// const channelModalState = defineModel<{ open: boolean; id: any }>({
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
const isDataLoading = computed(() => integrationLoadingStatus.value === "pending");

const columnHelper = createColumnHelper<any>();

const statusComponent = (status: string) => {
  return h(
    UiBadge,
    {
      ...(status === "pending"
        ? { variant: "destructive" }
        : { class: "bg-green-200 text-green-500 hover:bg-green-300" }),
    },
    status,
  );
};
const channelActionsComponent = (id: any) =>
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
          onClick: () => {
            channelModalState.value.open = true;
            channelModalState.value.id = id;
          },
        },
        h(Icon, { name: "lucide:pen" }),
      ),
      h(
        UiButton,
        {
          class: "",
          variant: "destructive",
          onClick: () => {
            deleteCampaigntate.value.id = id;
            deleteCampaigntate.value.open = true;
          },
        },
        h(Icon, { name: "lucide:trash-2" }),
      ),
    ],
  );

const statusColumns = [
  columnHelper.accessor("name", {
    header: "Integration Name",
  }),
  columnHelper.accessor("crm", {
    header: "Channel",
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: ({ row }) => {
      return statusComponent(row.original?.status);
    },
  }),
  columnHelper.accessor("actions", {
    header: "Actions",
    cell: ({ row }) => {
      return channelActionsComponent(row.original?.id);
    },
  }),
];
const Pagination = async ($evnt) => {
  filters.page = $evnt;
  integrationRefresh();
};


const onSuccessChannel = () => {
  channelModalState.value.open = false;
  integrationRefresh();
};
</script>
