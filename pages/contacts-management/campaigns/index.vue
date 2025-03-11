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
      <!-- <div class="flex items-center gap-2 pb-2">
        <UiInput v-model="filters.q" @input="filters.page = '1'"
          class="max-w-[200px] focus-visible:ring-0 focus-visible:ring-offset-0" placeholder="Search campaign..." />
      </div> -->
      <!-- @row-click="(row: any) => {
      navigateTo(`/contacts-management/campaigns/${row.original.id}`);
      }" -->
      <DataTable @pagination="Pagination" @row-click="(row: any) => {
        navigateTo(`/contacts-management/campaigns/${row.original.id}`);
      }" @limit="($event) => {
        (filters.page = '1'), (filters.limit = $event);
      }" :totalPageCount="totalPageCount" :page="page" :totalCount="totalCount" :columns="columns"
        :data="campaignDataList" :is-loading="isDataLoading" :page-size="20" :height="20" height-unit="vh" />
      <CreateEditCampaignModal v-model="campaignModalState" @confirm="() => {
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
import { useState } from "#app";
import { useBreadcrumbStore } from "~/store/breadcrumbs"; // Import the store

const rowList = reactive([
  "name",
  "email",
  "visitedCount",
  "mobile",
  "createdAt",
]);

definePageMeta({
  middleware: "user",
});

useHead({
  title: 'Contacts Management | Campaigns',
})

const router = useRouter();
const currentPage = useState("counter", () => '1');
const breadcrumbStore = useBreadcrumbStore();

const filters = reactive<{
  q: string;
  page: string;
  limit: string;
  active: string;
}>({
  q: "",
  active: "",
  page: currentPage.value,
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

    return campaign.data.map((item: any) => ({
      ...item, // Spread each object inside the array
      totalCount: `${item.interactionCount} / ${item.totalCount}`, // Ensure double backslash
    }));
  }

});

const deleteCampaigntate = ref({ open: false, id: null });
const campaignModalState = ref({ open: false, id: null });

breadcrumbStore.setBreadcrumbs([
  {
    label: "Campaigns", // Dynamic name
    to: `/contacts-management/campaigns`,
  }
]);
const isDataLoading = computed(() => status.value === "pending");

const columnHelper = createColumnHelper<(typeof campaignDataList.value)[0]>();

watch(
  () => filters.page,
  (newPage) => {
    currentPage.value = newPage; // Save page number globally
  }
);

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
      // h(
      //   UiButton,
      //   {
      //     color: "primary",
      //     onClick: (event: MouseEvent) => {
      //       event.stopPropagation(); 
      //       campaignModalState.value.open = true;
      //       campaignModalState.value.id = id;
      //     }, // Add delete functionality
      //     class: "bg-[#f44336] hover:bg-[#f44336] font-bold", // Different color for delete
      //   },
      //   h(Icon, { name: "lucide:pen" }),
      // ),
      h(
        UiButton,
        {
          variant: "destructive",
          onClick: (event: MouseEvent) => {
            event.stopPropagation();
            deleteCampaigntate.value.open = true;
            deleteCampaigntate.value.id = id;
          }, // Add delete functionality
        },
        h(Icon, { name: "lucide:trash-2" }),
      ),
      h(
        UiButton,
        {
          onClick: () => viewLead(id),
          class: "bg-[#ffbc42] hover:bg-[#ffbc42] font-bold",
        },
        [h(Icon, { name: "ph:eye-light", class: "h-4 w-4 mr-2" }), "View"],
      ),
    ],
  );
const viewLead = async (chatId: any) => {
  await navigateTo({
    name: "contacts-management-campaigns-id",
    params: { id: chatId },
  });
};

const columns = [
  columnHelper.accessor("campaignName", {
    header: "Campaign Name",
  }),
  // columnHelper.accessor("campaignTime", {
  //   header: "Campaign Name",
  //   cell: ({ row }) =>
  //     formatDate(new Date(row.original.campaignTime), "dd MMM yyyy HH:MM "),
  // }),

  columnHelper.accessor("contactMethod", {
    header: "Contact Method",
    cell: (info) => info.getValue() || "--",
  }),
  columnHelper.accessor("createdAt", {
    header: "Created At",
  }),
  columnHelper.accessor("totalCount", {
    header: "Interaction / Total",
  }),
  columnHelper.accessor("id", {
    header: "Action",
    cell: ({ row }) => {
      return actionsComponent(row.original.id);
    },
  }),
];
onMounted(() => {
  resetPageForCampaigns()
});

const resetPageForCampaigns = () => {
  const historyState = router.options.history.state || {};
  const backPath = historyState.back || "";

  if (!historyState.forward) {
    if (!backPath?.startsWith("/contacts-management/campaigns/")) {
      currentPage.value = '1'; // Reset page number when revisiting
      filters.page = '1';
    }
  }
};
const Pagination = async ($evnt: any) => {
  filters.page = $evnt;
  getAllCampaign();
};
</script>
