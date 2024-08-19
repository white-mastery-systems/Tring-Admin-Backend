<template>
  <Page title="Settings" :disable-back-button="true">
    <DataTable
      :columns="columns"
      :data="integrations"
      :page-size="8"
      :is-loading="false"
    />
  </Page>
  <ConfirmationModal
    v-model:open="openConfirmationDialog.open"
    title="Confirm Delete"
    description="Are you sure you want to delete ?"
    @confirm="
      () => {
        if (openConfirmationDialog?.id) {
          deleteIntegration({
            integrationId: openConfirmationDialog.id,
            onSuccess: () => {
              integrationRefresh();
              // refreshNuxtData
            },
          });
          openConfirmationDialog.open = false;
        }
      }
    "
  />
</template>
<script lang="ts" setup>
  import { createColumnHelper } from "@tanstack/vue-table";
  import Page from "~/components/Page.vue";
  import Button from "~/components/ui/button/Button.vue";
  // import { deleteIntegration } from "../../utils/db/integrations";
  import ConnectModal from "./ConnectModal.vue";
  definePageMeta({
    middleware: "admin-only",
  });

  const integrations = ref([
    { label: "Zoho CRM", name: "zoho-crm", status: false },
    { label: "Zoho Bigin", name: "zoho-bigin", status: false },
    { label: "Sell Do", name: "sell-do", status: false },
  ]);

  let openConfirmationDialog: { open: boolean; id?: string } = reactive({
    open: false,
  });
  const {
    status: integrationLoadingStatus,
    data: integrationsData,
    refresh: integrationRefresh,
  } = await useLazyFetch("/api/org/integrations", {
    server: false,
    default: () => [],
  });
  watch(
    integrationsData,
    (newData) => {
      newData?.map((newIntegration) => {
        console.log({ newIntegration });
        integrations.value = integrations.value?.map((integration) => {
          if (integration?.name === newIntegration?.name) {
            return { ...integration, status: true, id: newIntegration.id };
          }
          return integration;
        });
      });
    },
    { deep: true },
  );
  const integrationLoading = computed(
    () => integrationLoadingStatus.value === "pending",
  );

  const statusComponent = (
    status: boolean,
    label: string,
    name: string,
    id: string | undefined,
  ) =>
    status
      ? h(
          Button,
          {
            class: "",
            variant: "destructive",
            onClick: () => {
              openConfirmationDialog.open = true;
              openConfirmationDialog.id = id;
            },
          },
          "Disconnect",
        )
      : h(
          "div",
          {
            class: "",
          },
          [
            h(ConnectModal, {
              label,
              name,
              onSuccess: () => {
                openConfirmationDialog.open = false;

                integrationRefresh();
              },
            }),
          ],
        );

  const columnHelper = createColumnHelper<any>();
  const columns = [
    columnHelper.accessor("label", {
      header: "Integration Name",
    }),

    columnHelper.accessor("actions", {
      header: "Actions",
      cell: ({ row }) => {
        return statusComponent(
          row.original.status,
          row.original.label,
          row.original.name,
          row.original?.id,
        );
      },
    }),
  ];
</script>
