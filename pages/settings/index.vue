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
    v-model:open="OpenDeleteConfirmDialog"
    title="Confirm Delete"
    description="Are you sure you want to delete ?"
    @confirm="
      () => {
        OpenDeleteConfirmDialog = false;
      }
    "
  />
</template>
<script lang="ts" setup>
  import { createColumnHelper } from "@tanstack/vue-table";
  import Page from "~/components/Page.vue";
  import Button from "~/components/ui/button/Button.vue";
  import ConnectModal from "./ConnectModal.vue";

  definePageMeta({
    middleware: "admin-only",
  });

  const integrations = ref([
    { label: "Zoho CRM", name: "zoho-crm", status: false },
    { label: "Zoho Bigin", name: "zoho-bigin", status: false },
    { label: "Sell Do", name: "sell-do", status: false },
  ]);

  let OpenDeleteConfirmDialog = ref(false);
  const { status: integrationLoadingStatus, data: integrationsData } =
    await useLazyFetch("/api/org/integrations", {
      server: false,
      default: () => [],
      // bots.map((bot) => ({
      //   id: bot.id,
      //   name: bot.name,
      //   status: bot.documentId ? true : false,
      //   createdAt: formatDateStringToDate(bot.createdAt),
      // })),
    });
  watch(
    integrationsData,
    (newData) => {
      newData?.map((newIntegration) => {
        console.log({ newIntegration });
        integrations.value = integrations.value?.map((integration) => {
          if (integration?.name === newIntegration?.name) {
            return { ...integration, status: true };
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

  const statusComponent = (status: boolean, label: string, name: string) =>
    status
      ? h(
          Button,
          {
            class: "text-red-500 bg-red-200",
            variant: "destructive",
            onClick: () => {
              OpenDeleteConfirmDialog.value = true;
            },
          },
          "Disconnect",
        )
      : h("div", { class: "" }, [h(ConnectModal, { label, name })]);

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
        );
      },
    }),
  ];
</script>
