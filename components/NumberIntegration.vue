	<script setup lang="ts">
  import { useRoute, useRouter } from "vue-router";
  import { createColumnHelper } from "@tanstack/vue-table";
  import { useCount } from '@/composables/useRefresh';
  import { Icon, UiBadge, UiButton } from "#components";
  import NumberModal from "~/pages/integration/NumberModal.vue";
  definePageMeta({
    middleware: "admin-only",
  });

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
  const page = ref(0);
  const totalPageCount = ref(0);
  const totalCount = ref(0);
  const router = useRouter();
  const route = useRoute();
  const props = defineProps<{ integrationModalState?: boolean }>();
  const numberModalState = reactive({ open: false, id: null })
  let deleteExoPhoneState = reactive({
    open: false,
    id: null,
  });
  const emit = defineEmits<{
    (e: "action", id: any, modelControl: string): void;
    (e: 'pagenation', page: number): void;
    (e: 'limitChange', limit: string): void; // Emit limit change event
    (e: 'stateControl', payload: any): void;
  }>();


  const {
    data: integrationsData,
    status,
    refresh: integrationRefresh,
  } = await useLazyFetch("/api/org/integrations/number-integration", {
    server: false,
    default: () => [],
    query: filters,
    transform: (integrations: any) => {
      page.value = integrations.page;
      totalPageCount.value = integrations.totalPageCount;
      totalCount.value = integrations.totalCount;
      return integrations.data;
    },
  });
  watch(route, (newValue) => { });
  watch(() => props.integrationModalState, (newValue: any) => {
    numberModalState.open = newValue
    numberModalState.id = null
  })
  watch(() => numberModalState.open,
    (newValue) => {
      if (!newValue) {
        emit("stateControl", numberModalState.open);
      }
    })

  const actionsComponent = (id: any) => h(
    "div",
    {
      class: "flex items-center gap-2",
    }, [
    h(UiButton, {
      color: "primary",
      onClick: () => {
        numberModalState.open = true
        numberModalState.id = id
        emit("action", id, 'edit')
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
          deleteExoPhoneState.open = true
          deleteExoPhoneState.id = id
        }, // Add delete functionality
      },
      h(Icon, { name: "lucide:trash-2" })
    )
  ]
  )
  const columnHelper = createColumnHelper<any>();
  const NumberColumns = [
    columnHelper.accessor("provider", {
      header: "Provider",
    }),
    columnHelper.accessor("ivrIntegrationName", {
      header: "Provider Account",
    }),
    columnHelper.accessor("id", {
      header: "Action",
      cell: ({ row }) => {
        return actionsComponent(row.original.id)
      }
    }),
  ];
  const Pagination = async ($event: any) => {
    filters.page = $event;
    // emit('pagenation', $event)
  };
  const onSuccess = () => {
    numberModalState.open = false
    integrationRefresh()
  }
</script>

	<template>
    <DataTable @pagination="Pagination" @limit="($event) => {
      (filters.page = '1'), (filters.limit = $event);
    }
    " :totalPageCount="totalPageCount" :page="page" :totalCount="totalCount" :columns="NumberColumns"
      :data="integrationsData" :page-size="8" :is-loading="false" :height="20" :heightUnit="'vh'" />
    <NumberModal :numberModalState="numberModalState" @success="onSuccess()" />
    <ConfirmationModal v-model:open="deleteExoPhoneState.open" title="Confirm Delete"
      description="Are you certain you want to delete the Exophone integration? Please note that doing so will also remove all bots associated with this number?"
      @confirm="() => {
        if (numberModalState) {
          deleteSingleExoPhone({
            id: deleteExoPhoneState.id,
            onSuccess: () => {
              integrationRefresh();
            },
          });
          deleteExoPhoneState.open = false;
        }
      }
      " />
  </template>
