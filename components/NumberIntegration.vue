<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { createColumnHelper } from "@tanstack/vue-table";
import { useCount } from '@/composables/useRefresh';
import { Icon, UiBadge, UiButton } from "#components";
definePageMeta({
  middleware: "admin-only",
});

  const router = useRouter();
  const route = useRoute();
  const filters = reactive<{
    q: string;
    page: string;
    limit: string;
  }>({
    q: "",
    page: "1",
    limit: "10",
  });
  let page = ref(0);
  let totalPageCount = ref(0);
  let totalCount = ref(0);
  const {
    data: integrationsData,
    status,
    refresh: integrationRefresh,
  } = await useLazyFetch("/api/org/integrations/number-integration", {
    server: false,
    default: () => [],
    query: filters,
    transform: (number: any) => {
      page.value = number.page;
      totalPageCount.value = number.totalPageCount;
      totalCount.value = number.totalCount;
      return number.data;
    },
  });
  const numberModalState: any = defineModel<{ open: boolean, id: any }>({
  default: {
    open: false,
    id: null,
  },
});
const emit = defineEmits<{ (e: "action", id: any, modelControl: string): void }>();
// const message = inject('message')
  // provide('message', 'testing')
  watch(route, (newValue) => {});
  // const q=ref('')
  

const actionsComponent = (id: any) => h(
  "div",
  {
    class: "flex items-center gap-2",
  }, [
    h(UiButton, {
      color: "primary",
      onClick: () => {
        // numberModalState.value.id = id
        emit("action", id, 'edit')
        console.log(numberModalState.value.open, "numberModalState")
      },
      class: "bg-[#f44336] hover:bg-[#f44336] font-bold",
    },
    h(Icon, { name: "lucide:pen" }),
  ), 
    h(
      UiButton,
      {
        variant: "destructive",
        onClick: () => {
          emit("action", id, 'delete')
          // deleteCampaigntate.value.open = true
          // deleteCampaigntate.value.id = id
        }, // Add delete functionality
      },
      h(Icon, { name: "lucide:trash-2" })
    )
  ]
)
// const { status, data: integrationsData, refresh } = await useLazyAsyncData('refresh', () => $fetch('/api/org/integrations/number-integration'));
  const columnHelper = createColumnHelper<any>();
  const NumberColumns = [
    columnHelper.accessor("provider", {
      header: "Provider",
    }),
    columnHelper.accessor("exoPhone", {
      header: "Number",
    }),
    columnHelper.accessor("id", {
    header: "Action",
    cell: ({ row }) => {
      return actionsComponent(row.original.id)
    }
  }),
];
  const Pagination = async ($evnt) => {
    filters.page = $evnt;
  };
</script>

<template>
  <DataTable
    @pagination="Pagination"
    @limit="
      ($event) => {
        (filters.page = '1'), (filters.limit = $event);
      }
    "
    :totalPageCount="totalPageCount"
    :page="page"
    :totalCount="totalCount"
    :columns="NumberColumns"
    :data="integrationsData"
    :page-size="8"
    :is-loading="false"
    :height="13"
    :heightUnit="'vh'"
  />
</template>
