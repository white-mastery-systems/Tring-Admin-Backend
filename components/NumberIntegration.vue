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
  let page = ref(0);
  let totalPageCount = ref(0);
  let totalCount = ref(0);
  // const props = withDefaults(defineProps<Props>(), {
  //   title: "",
  //   description: "",
  // });
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

  const router = useRouter();
  const route = useRoute();
  // const filters = reactive
  const props = defineProps<{ integrationModalState?: boolean }>();
  const numberModalState = reactive({ open: false, id: null })
  let deleteExoPhoneState = reactive({
    open: false,
    id: null,
  });
  // const numberModalState: any = defineModel<{ integrationModalState:boolean,findTitleForIntegrationModal: any }>();
  const emit = defineEmits<{
    (e: "action", id: any, modelControl: string): void;
    (e: 'pagenation', page: number): void;
    (e: 'limitChange', limit: string): void; // Emit limit change event
    (e: 'stateControl', payload: any): void;
  }>();


  console.log(props.integrationModalState)




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
  // const message = inject('message')
  // provide('message', 'testing')
  watch(route, (newValue) => { });
  // const q=ref('')
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
