<template>
  <!-- :bread-crumbs="[
  { label: `${botDetails.name}`, to: `/bots/${botDetails.id}` },
  { label: 'CRM Configuration', to: `/bots/${botDetails.id}/crm-config` },
  ]" -->
  <Page title="CRM Configuration" :disableSelector="true">
    <!-- v-if="integrations.length === 0" -->
    <template #actionButtons>
      <UiButton
        @click="
          () => {
            crmConfigModalState.open = true;
            crmConfigModalState.id = null;
          }
        "
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
    <CreateEditCrmConfigModal
      v-model="crmConfigModalState"
      :id="crmConfigModalState?.id"
      @success="handleSuccess"
    />
    <ConfirmationModal
      v-model:open="deleteIntegrationState.open"
      title="Confirm Removal"
      description="Are you sure you want to remove this integration ?"
      @confirm="
        () => {
          if (deleteIntegrationState?.id) {
            deleteBotIntegration({
              botIntegrationId: deleteIntegrationState.id,
              botId: route.params.id,
              onSuccess: () => {
                integrationRefresh();
                toast.success('Integration removed successfully');
              },
            });
            deleteIntegrationState.open = false;
          }
        }
      "
    />
  </Page>
</template>
<script setup lang="ts">
  import { Icon, UiButton } from "#components";
  import { createColumnHelper } from "@tanstack/vue-table";
  const router = useRouter();
  const columnHelper = createColumnHelper<any>();
  // const route = useRoute("bot-management-voice-bot-id-crm-config");
  // const paramId: any = route;
  // const botDetails = ref(await getBotDetails(paramId.params.id));

  let deleteIntegrationState: { open: boolean; id?: string } = reactive({
    open: false,
  });
  const actionsComponent = (id: string) => [
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
            onClick: () => {
              crmConfigModalState.value.open = true;
              // crmConfigModalState.value.id = id;
            },
          },
          h(Icon, { name: "lucide:pen" }),
        ),
        h(
          UiButton,
          {
            variant: "destructive",
            onClick: () => {
              // deleteIntegrationState.id = id;
              deleteIntegrationState.open = true;
            },
          },
          h(Icon, { name: "lucide:trash-2" }),
        ),
      ],
    ),
  ];
  const columns = [
    columnHelper.accessor("integration", {
      header: "Integration Name",
    }),

    columnHelper.accessor("projectId", {
      header: "Connected To",
    }),
    columnHelper.accessor("actions", {
      header: "actions",
      cell: ({ row }) => {
        return actionsComponent(row.original.id);
      },
    }),
  ];
  // const {
  //   status,
  //   data: integrationsData,
  //   refresh: integrationRefresh,
  // } = await useLazyFetch(`/api/chat-bot/${route.params.id}/integrations`, {
  //   server: false,
  //   default: () => [],
  // });
  // watch(integrationsData, (newIntegrations: any) => {
  //   newIntegrations?.map((item: any) => {
  //
  //   });
  //   integrations.value = newIntegrations?.map((item: any) => ({
  //     integration: item.integration?.name,
  //     projectId:
  //       item.integration?.crm === "zoho-bigin"
  //         ? `${item?.metadata?.pipelineObj?.Pipeline.name}`
  //         : item.integration?.crm === "zoho-crm"
  //           ? `${item?.metadata?.layoutObj?.name}`
  //           : (item.metadata?.projectId ?? "N/A"),
  //     id: item.id,
  //   }));
  // });
  // const handleSuccess = () => {
  //   crmConfigModalState.value.open = false;
  //   integrationRefresh();
  // };
  const integrations: any = ref([]);
  const crmConfigModalState = ref<{ open: boolean; id?: string | null }>({
    open: false,
    id: null,
  });
</script>
