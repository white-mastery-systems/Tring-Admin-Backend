<template>
  <Page
    title="CRM Configuration"
    :disableSelector="true"
    :actionButtons="[h(ConfigurationModal)]"
  >
    <div class="mb-2 flex w-full justify-end">
      <ConfigurationModal />
    </div>
    <DataTable
      :columns="columns"
      :data="integrations"
      :page-size="8"
      :is-loading="false"
    />
  </Page>
</template>
<script setup lang="ts">
  import { createColumnHelper } from "@tanstack/vue-table";
  import ConfigurationModal from "./ConfigIntegrationModal.vue";
  const router = useRouter();
  const columnHelper = createColumnHelper<any>();

  const columns = [
    columnHelper.accessor("integration", {
      header: "Integration Name",
    }),

    columnHelper.accessor("project", {
      header: "project",
    }),
    columnHelper.accessor("actions", {
      header: "actions",
    }),
  ];
  const route = useRoute("bots-id-crm-config");
  const { status, data: integrationsData } = await useLazyFetch(
    `/api/${route.params.id}/integrations`,
    {
      server: false,
      default: () => [],
    },
  );

  const integrations: any = [];
</script>
