<template>
  <DataTable @pagination="Pagination" @limit="changeLimit" :totalPageCount="props.totalPageCount"
    :page="parseInt(props.filters.page)" :totalCount="props.totalCount" :columns="columns" :data="integrateResponse"
    :page-size="8" :is-loading="false" :height="17" :heightUnit="'vh'" />
</template>
<script setup lang="ts">
  import { Icon, UiBadge, UiButton } from "#components";
  import { createColumnHelper } from "@tanstack/vue-table";
const props: any = withDefaults(defineProps<{
  integrateResponse: Array<any>; // Define the type according to your data structure
  totalPageCount: number;
  totalCount: number;
  filters: {
    page: any;
    limit: string;
  };
}>(), {
  totalPageCount: 0,
  totalCount: 0,
  filters: {
    page: '1',
    limit: '10',
  },
});
const emit = defineEmits<{
  (e: "action", id: any, integrationModalState: string): void;
  (e: 'pagenation', page: number): void;
  (e: 'limitChange', limit: string): void; // Emit limit change event
}>();

  const integrationModalState = defineModel<any>("integrationModalState");
  const deleteIntegrationState = defineModel<any>("deleteIntegrationState");

  // const {
  //   status: integrationLoadingStatus,
  //   data: integrationsData,
  //   refresh: integrationRefresh,
  // } = await useLazyFetch("/api/org/integrations", {
  //   server: false,
  //   default: () => [],
  //   query: filters,
  //   transform: (integrations: any) => {
  //     page.value = integrations.page;
  //     totalPageCount.value = integrations.totalPageCount;
  //     totalCount.value = integrations.totalCount;
  //     return integrations.data?.map((integration: any) => ({
  //       ...integration,
  //       status: integration?.metadata?.status ?? "Verified",
  //     }));
  //   },
  // });

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
              integrationModalState.value.open = true;
              integrationModalState.value.id = id;
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
              deleteIntegrationState.value.id = id;
              deleteIntegrationState.value.open = true;
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
  emit('pagenation', $event)
};
const changeLimit = ($event: any) => {
  emit('limitChange', $event); // Emit limit change event
};
</script>
