<template>
  <Page title="Segments" :disable-back-button="true">
    <template #actionButtons>
      <div class="flex gap-4">
        <div class="flex gap-2">
          <UiButton color="primary" @click="() => {
              addBucketNameModalState.open = true;
              addBucketNameModalState.id = null;
            }
            ">
            Add Bucket
          </UiButton>
        </div>
      </div>
    </template>
    <div>
      <div class="flex items-center gap-2 mb-3 mt-1">
        <UiInput v-model="filters.q" @input="filters.page = '1'"
          class="min-w-[130px] max-w-[130px] focus-visible:ring-0 focus-visible:ring-offset-0"
          placeholder="Search bucket..." />
      </div>
      <DataTable @row-click="(row: any) => {
       navigateTo(`/contacts-management/buckets/${row.original.id}`);
      }
        " @pagination="Pagination" @limit="($event) => {
            (filters.page = '1'), (filters.limit = $event);
          }
          " :totalPageCount="totalPageCount" :page="page" :totalCount="totalCount" :data="contactsList"
        :is-loading="isDataLoading" :columns="columns" :page-size="20" :height="18" height-unit="vh" />
      <ConfirmationModal v-model:open="deleteBucketState.open" title="Confirm Delete"
        description="Are you sure you want to delete ?" @confirm="() => {
            if (deleteBucketState?.id) {
              deleteBucket({
                integrationId: deleteBucketState.id,
                onSuccess: () => {
                  integrationRefresh();
                },
              });
              deleteBucketState.open = false;
            }
          }
          " />
    </div>
    <CreateEditBucketModal v-model="addBucketNameModalState" @confirm="() => {
        addBucketNameModalState.open = false;
        integrationRefresh()
        
      }
      " />
  </Page>
</template>
<script setup lang="ts">
import { Icon, UiButton } from "#components";
import { createColumnHelper } from "@tanstack/vue-table";
import { useRouter } from "vue-router";
import { useState } from "#app";
import { useBreadcrumbStore } from "~/store/breadcrumbs"; // Import the store

definePageMeta({
  middleware: "user",
});
useHead({
  title: "Contacts Management | Contacts",
});
const breadcrumbStore = useBreadcrumbStore();

const deleteBucketState = ref({ open: false, id: null });
const currentPage = useState("counter", () => '1');

const filters = reactive<{
  q: string;
  page: string;
  limit: string;
}>({
  q: "",
  page: currentPage.value,
  limit: "10",
});
const addBucketNameModalState = ref({ open: false, id: null });

const page = ref(0);
const totalPageCount = ref(0);
const totalCount = ref(0);
const {
  status,
  data: contactsList,
  refresh: integrationRefresh,
} = await useLazyFetch("/api/org/contact-list", {
  server: false,
  default: () => [],
  query: filters,
  transform: (buckets: any) => {
    page.value = buckets.page;
    totalPageCount.value = buckets.totalPageCount;
    totalCount.value = buckets.totalCount;
    return buckets.data;
  },
});
const router = useRouter();

breadcrumbStore.setBreadcrumbs([
  {
    label: "Segments", // Dynamic name
    to: `/contacts-management/buckets`,
  }
]);

const isDataLoading = computed(() => status.value === "pending");

watch(
  () => filters.page,
  (newPage) => {
    currentPage.value = newPage; // Save page number globally
  }
);

const columnHelper = createColumnHelper<(typeof contactsList.value)[0]>();

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
          onClick: (e: Event) => {
            e.stopPropagation();
            addBucketNameModalState.value.open = true;
            addBucketNameModalState.value.id = id;
          },
          color: "primary",
        },
        h(Icon, { name: "lucide:pen" }),
      ),
      h(
        UiButton,
        {
          onClick: (e: any) => {
            e.stopPropagation();
            deleteBucketState.value.id = id;
            deleteBucketState.value.open = true;
          }, // Add delete functionality
          class: "bg-[#f44336] hover:bg-[#f44336] font-bold", // Different color for delete
        },
        h(Icon, { name: "lucide:trash-2" }),
      ),
    ],
  );

const columns = [
  columnHelper.accessor("name", {
    header: "Bucket Name",
  }),
  columnHelper.accessor("type", {
    header: "Bot Type",
  }),
  columnHelper.accessor("noOfAudience", {
    header: "No. of Audiences",
  }),
  columnHelper.accessor("id", {
    header: "Action",
    cell: ({ row }) => {
      return actionsComponent(row.original.id);
    },
  }),
];
onMounted(() => {
  resetPageOnRevisit()
});

const Pagination = async ($evnt) => {
  filters.page = $evnt;
  integrationRefresh();
};
const resetPageOnRevisit = () => {
  const historyState = router.options.history.state || {};
  const backPath = historyState.back || "";

  if (!historyState.forward) {
    if (!backPath?.startsWith("/contacts-management/buckets/")) {
      currentPage.value = '1'; // Reset page number when revisiting
      filters.page = '1';
    }
  }
};
</script>

