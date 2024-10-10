<template>
  <DataTable
    @pagination="Pagination"
    @limit="
      ($event) => {
        (page = '1'), (limit = $event);
      }
    "
    :totalPageCount="totalPageCount"
    :page="page"
    :totalCount="totalCount"
    :columns="columns"
    :data="integrationsData"
    :page-size="8"
    :is-loading="false"
    :height="17"
    :heightUnit="'vh'"
  />
</template>
<script setup lang="ts">
  import { Icon, UiBadge, UiButton } from "#components";
  import { createColumnHelper } from "@tanstack/vue-table";

  let page = ref<string>("1");

  let totalPageCount = ref(0);
  let totalCount = ref(0);
  const limit = ref("10");
  const route = useRoute();
  const filters = computed(() => ({
    q: route.query?.q ?? "crm",
    page: page.value,
    limit: limit.value,
  }));
  const integrationModalState = defineModel<any>("integrationModalState");
  const deleteIntegrationState = defineModel<any>("deleteIntegrationState");

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
  const Pagination = async ($evnt: any) => {
    page.value = $evnt;
    integrationRefresh();
  };
</script>
