<template>
  <div>
    <div class="flex items-center gap-2 pb-2">
      <UiInput v-model="searchBucket" class="max-w-[200px] focus-visible:ring-0 focus-visible:ring-offset-0"
        placeholder="Search bucket..." />
    </div>
    <DataTable :data="contactsList" :is-loading="isDataLoading" :columns="columns" :page-size="20" :height="13"
      height-unit="vh" />


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
</template>
<script setup lang="ts">
import { UiButton } from "#components";
import { createColumnHelper } from "@tanstack/vue-table";

definePageMeta({
  middleware: "admin-only",
});

const searchBucket = ref("");
let deleteBucketState: { open: boolean; id?: string } = reactive({
  open: false,
});

const filters = reactive<{
  botId: string;
  q?: string;
  from?: string;
  to?: string;
  period: string;
  status: string;
  channel: any;
  action: string;
}>({
  botId: "",
  q: undefined,
  from: undefined,
  to: undefined,
  period: "",
  status: "",
  channel: "all",
  action: "",
});

watchEffect(() => {
  if (filters.botId === "all") filters.botId = "";
});
const { status, data: contactsList, refresh: integrationRefresh, } = await useLazyFetch("/api/org/contact-list", {
  server: false,
  default: () => [],
});
const isDataLoading = computed(() => status.value === "pending");


const columnHelper = createColumnHelper<(typeof contactsList.value)[0]>();

const actionsComponent = (id: any) => h(
  "div",
  {
    class: "flex items-center gap-2",
  }, [
  h(
    UiButton,
    {
      onClick: (e: any) => {
         e.stopPropagation();
        deleteBucketState.id = id;
        deleteBucketState.open = true;
      }, // Add delete functionality
      class: "bg-[#f44336] hover:bg-[#f44336] font-bold", // Different color for delete
    },
    [h({ name: "ph:trash-light", class: "h-4 w-4 mr-2" }), "Delete"]
  ),
])

const columns = [
  columnHelper.accessor("name", {
    header: "Bucket Name",
    cell: ({ row }) => {
      return h(
        'div',
        {
          class: 'cursor-pointer',
          onClick: () => {
            navigateTo(`/contacts/${row.original.id}`); // Navigate on row click
          },
        },
        row.original.name
      );
    },
  }),
  columnHelper.accessor("id", {
    header: "Action",
    cell: ({ row }) => {
      return actionsComponent(row.original.id)
    }
  }),
];
</script>
