<template>
  <Page
    title="CRM Configuration"
    :subtitle="`(${botDetails.name})`"
    :disableSelector="true"
  >
    <template #actionButtons>
      <UiButton
        @click="crmConfigModalState.open = true"
        variant="outline"
        color="primary"
      >
        Link CRM
      </UiButton>
    </template>
    <DataTable
      :columns="columns"
      :data="integrations"
      :page-size="8"
      :is-loading="false"
    />
    <ConfigurationModal v-model="crmConfigModalState" />
  </Page>
</template>
<script setup lang="ts">
  import { createColumnHelper } from "@tanstack/vue-table";
  import ConfigurationModal from "./CreateEditCrmConfigModal.vue";
  const router = useRouter();
  const columnHelper = createColumnHelper<any>();
  const route = useRoute("bots-id-crm-config");
  const paramId: any = route;
  const botDetails = ref(await getBotDetails(paramId.params.id));

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
  const crmConfigModalState = ref({ open: false });
</script>
