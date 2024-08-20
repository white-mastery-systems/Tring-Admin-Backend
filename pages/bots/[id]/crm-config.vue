<template>
  <Page
    title="CRM Configuration"
    :disableSelector="true"
    :actionButtons="[h(ConfigurationModal)]"
  >
    <template #actionButtons>
      <UiButton
        @click="openConfigModal.open = true"
        variant="outline"
        color="primary"
      >
        Link Integration
      </UiButton>

      <ConfigurationModal v-model="openConfigModal.open" />
    </template>
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

    columnHelper.accessor("projectId", {
      header: "project",
    }),
    // columnHelper.accessor("actions", {
    //   header: "actions",
    // }),
  ];
  const route = useRoute("bots-id-crm-config");
  const { status, data: integrationsData } = await useLazyFetch(
    `/api/bots/${route.params.id}/integrations`,
    {
      server: false,
      default: () => [],
    },
  );
  watch(integrationsData, (newIntegrations: any) => {
    integrations.value = newIntegrations?.map((item: any) => ({
      integration: item.integration,
      projectId: item.metadata?.projectId,
    }));
  });
  const integrations: any = ref([]);
  const openConfigModal = ref({ open: false });
</script>
