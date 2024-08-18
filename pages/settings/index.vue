<template>
  <Page title="Settings">
    <DataTable
      :columns="columns"
      :data="integrations"
      :page-size="8"
      :is-loading="false"
    />
  </Page>
</template>
<script lang="ts" setup>
  import { createColumnHelper } from "@tanstack/vue-table";
  import Page from "~/components/Page.vue";
  import Button from "~/components/ui/button/Button.vue";
  import ConnectModal from "./ConnectModal.vue";
  const statusComponent = (status: boolean, name: string) =>
    status
      ? h(
          Button,
          { class: "text-red-500 bg-red-200", variant: "destructive" },
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
    { name: "Sell Do", status: false },
  ];
</script>
