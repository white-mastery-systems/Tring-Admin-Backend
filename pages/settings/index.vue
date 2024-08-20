<template>
  <Page title="Settings" :disable-back-button="true" :disable-elevation="true">
    <UiTabs default-value="integration" class="w-[400px]">
      <UiTabsList class="">
        <UiTabsTrigger value="integration"> Integrations </UiTabsTrigger>
      </UiTabsList>
      <UiTabsContent value="integration"> </UiTabsContent>
    </UiTabs>
    <template #actionButtons>
      <UiButton color="primary" @click="integrationModalState.open = true">
        Add Integration
      </UiButton>
    </template>
    <DataTable
      :columns="columns"
      :data="integrationsData"
      :page-size="8"
      :is-loading="false"
    />
    <CreateEditIntegrationModal
      v-model="integrationModalState"
      @success="onSuccess()"
    />
  </Page>
  <ConfirmationModal
    v-model:open="deleteIntegrationState.open"
    title="Confirm Delete"
    description="Are you sure you want to delete ?"
    @confirm="
      () => {
        if (deleteIntegrationState?.id) {
          deleteIntegration({
            integrationId: deleteIntegrationState.id,
            onSuccess: () => {
              integrationRefresh();

              // refreshNuxtData
            },
          });
          deleteIntegrationState.open = false;
        }
      }
    "
  />
</template>
<script lang="ts" setup>
  import { Icon, UiButton } from "#components";
  import { createColumnHelper } from "@tanstack/vue-table";
  import Page from "~/components/Page.vue";
  import CreateEditIntegrationModal from "./CreateEditIntegrationModal.vue";
  definePageMeta({
    middleware: "admin-only",
  });

  const integrationModalState = ref({ open: false });
  // const integrations = ref([]);

  let deleteIntegrationState: { open: boolean; id?: string } = reactive({
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
  const onSuccess = () => {
    integrationModalState.value.open = false;
    toast.success("Integration added successfully");
    integrationRefresh();
  };
  const integrationLoading = computed(
    () => integrationLoadingStatus.value === "pending",
  );
  const statusComponent = (id: any) =>
    h(
      UiButton,
      {
        class: "",
        variant: "destructive",
        onClick: () => {
          deleteIntegrationState.id = id;
          deleteIntegrationState.open = true;
        },
      },
      h(Icon, { name: "lucide:trash-2" }),
    );

  const columnHelper = createColumnHelper<any>();
  const columns = [
    columnHelper.accessor("name", {
      header: "Integration Name",
    }),
    columnHelper.accessor("crm", {
      header: "CRM",
    }),

    columnHelper.accessor("actions", {
      header: "Actions",
      cell: ({ row }) => {
        return statusComponent(row.original?.id);
      },
    }),
  ];
</script>
