<template>
  <Page title="Settings" :disable-back-button="true">
    <DataTable :columns="columns" :data="integrations" :page-size="8" :is-loading="false" />
  </Page>
  <ConfirmationModal v-model:open="OpenDeleteConfirmDialog" title="Confirm Delete"
    description="Are you sure you want to delete ?" @confirm="() => {
      OpenDeleteConfirmDialog = false;
    }
      " />
</template>
<script lang="ts" setup>
import { createColumnHelper } from "@tanstack/vue-table";
import Page from "~/components/Page.vue";
import Button from "~/components/ui/button/Button.vue";
import ConnectModal from "./ConnectModal.vue";
let OpenDeleteConfirmDialog = ref(false);

const statusComponent = (status: boolean, name: string) =>
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
    : h("div", { class: "" }, [h(ConnectModal, { integrationName: name })]);

const columnHelper = createColumnHelper<any>();
const columns = [
  columnHelper.accessor("name", {
    header: "Integration Name",
  }),

  columnHelper.accessor("actions", {
    header: "Actions",
    cell: ({ row }) => {
      return statusComponent(row.original.status, row.original.name);
    },
  }),
];

const integrations = [
  { name: "Zoho CRM", status: false },
  { name: "Zoho Bigin", status: false },
  { name: "Sell Do", status: true },
];
</script>
