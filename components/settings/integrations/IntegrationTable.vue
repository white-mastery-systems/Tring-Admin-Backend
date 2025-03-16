<template>
  <DataTable @pagination="Pagination" @limit="($event) => {
    (page = '1'), (filters.limit = $event);
  }
    " :totalPageCount="totalPageCount" :page="page" :totalCount="totalCount" :columns="columns"
    :data="integrationsData" :page-size="8" :is-loading="false" :height="18" :heightUnit="'vh'" />
  <CreateEditIntegrationModal :title="findTitleForIntegrationModal" :numberModalState="integrationModal" @success="() => {
    integrationModal.open = false
    integrationRefresh()
  }" />
  <ConfirmationModal v-model:open="deleteIntegrationState.open" title="Confirm Delete"
    description="Are you sure you want to delete ?" @confirm="() => {
      if (deleteIntegrationState?.id) {
        deleteIntegration({
          integrationId: deleteIntegrationState.id,
          onSuccess: () => {
            integrationRefresh();
          },
        });
        deleteIntegrationState.open = false;
      }
    }
      " />
</template>
<script setup lang="ts">
import { Icon, UiBadge, UiButton } from "#components";
import { createColumnHelper } from "@tanstack/vue-table";

// const filters = reactive<{
//   q: string;
//   page: string;
//   limit: string;
//   active: string;
// }>
let page: any = ref(1);
let totalPageCount = ref(0);
let totalCount = ref(0);
let limit = ref('10');
const route = useRoute();

const filters = computed(() => ({
  q: route.query?.q ?? "crm",
  page: page.value,
  limit: limit.value,
}));
// const props: any = withDefaults(defineProps<{
//   integrateResponse: Array<any>; // Define the type according to your data structure
//   totalPageCount: number;
//   totalCount: number;
//   filters: {
//     page: any;
//     limit: string;
//   };
// }>(), {
//   totalPageCount: 0,
//   totalCount: 0,
//   filters: {
//     page: '1',
//     limit: '10',
//   },
// });
const props = defineProps<{ integrationModalState?: boolean, findTitleForIntegrationModal: any }>();
const emit = defineEmits<{
  (e: "action", id: any, integrationModalState: string): void;
  (e: 'stateControl', payload: any): void;
}>();

const integrationModal = reactive({ open: false, id: null });
let deleteIntegrationState = reactive({
  open: false,
  id: null,
});
watch(() => props.integrationModalState,
  (newValue: any) => {
    integrationModal.open = newValue
    integrationModal.id = null
  }
)
watch(() => integrationModal.open,
  (newValue) => {
    if (!newValue) {
      emit("stateControl", integrationModal.open);
    }
  })

// const deleteIntegrationState = defineModel<any>("deleteIntegrationState");

const {
  status: integrationLoadingStatus,
  data: integrationsData,
  refresh: integrationRefresh,
} = await useLazyFetch("/api/org/integrations", {
  server: false,
  default: () => [],
  query: filters,
  transform: (integrations: any) => {
    page.value = integrations.page;
    totalPageCount.value = integrations.totalPageCount;
    totalCount.value = integrations.totalCount;
    return integrations.data?.map((integration: any) => ({
      ...integration,
      status: integration?.metadata?.status ?? "Verified",
    }));
  },
});

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
          onClick: () => {
            integrationModal.open = true;
            integrationModal.id = id;
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
            deleteIntegrationState.id = id;
            deleteIntegrationState.open = true;
          },
        },
        h(Icon, { name: "lucide:trash-2" }),
      ),
    ],
  );

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
const columnHelper = createColumnHelper<any>();
const columns = [
  columnHelper.accessor("name", {
    header: "Integration Name",
  }),
  columnHelper.accessor("crm", {
    header: "CRM",
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
      return actionsComponent(row.original?.id);
    },
  }),
];
const Pagination = async ($event: any) => {
  page.value = $event;
  // emit('pagenation', $event)
}
// const changeLimit = ($event: any) => {
//   emit('limitChange', $event); // Emit limit change event
// };
</script>
