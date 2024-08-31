<template>
  <Page title="Settings" :disable-back-button="true" :disable-elevation="true">
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
      :height="10"
      :heightUnit="'vh'"
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
  import { Icon, UiBadge, UiButton } from "#components";
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
    transform: (integrations) => {
      return integrations?.map((integration) => ({
        ...integration,
        status: integration?.metadata?.status ?? "Verified",
      }));
    },
  });
  const onSuccess = () => {
    integrationModalState.value.open = false;
    toast.success("Integration added successfully");
    integrationRefresh();
  };
  const integrationLoading = computed(
    () => integrationLoadingStatus.value === "pending",
  );
  const actionsComponent = (id: any) =>
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
</script>
