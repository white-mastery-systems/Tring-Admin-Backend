<template>
  <Page title="CRM Configuration" :bread-crumbs="[
    {
      label: `${botDetails.name}`,
      to: `/bot-management/voice-bot/${botDetails.id}`,
    },
    {
      label: 'CRM Configuration',
      to: `/bot-management/voice-bot/${botDetails.id}/crm-config`,
    },
  ]" :disableSelector="true">
    <!-- v-if="integrations.length === 0" -->
    <template #actionButtons>
      <UiButton @click="() => {
        crmConfigModalState.open = true;
        crmConfigModalState.id = null;
      }
        " variant="outline" color="primary">
        Link CRM
      </UiButton>
    </template>
    <DataTable @pagination="Pagination" @limit="($event) => {
      (filters.page = '1'), (filters.limit = $event);
    }
      " :columns="columns" :data="integrations" :page-size="8" :height="10" :is-loading="false"
      :totalCount="totalCount" :totalPageCount="totalPageCount" :page="page" />
    <CreateEditCrmConfig v-model="crmConfigModalState" :id="crmConfigModalState?.id" @success="handleSuccess" />
    <ConfirmationModal v-model:open="deleteIntegrationState.open" title="Confirm Removal"
      description="Are you sure you want to remove this integration ?" @confirm="() => {
          if (deleteIntegrationState?.id) {
            deleteVoiceBotIntegration({
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
        " />
  </Page>
</template>
<script setup lang="ts">
import { Icon, UiButton } from "#components";
import { createColumnHelper } from "@tanstack/vue-table";
const router = useRouter();
const columnHelper = createColumnHelper<any>();
const route = useRoute("bot-management-chat-bot-id-crm-config");
const paramId: any = route;
const botDetails = ref(await getVoiceBotDetails(paramId.params.id));
const integrations: any = ref([]);
const crmConfigModalState = ref<{ open: boolean; id?: string | null }>({
  open: false,
  id: null,
});

const filters = reactive<{
  botId: string;
  q?: string;
  from?: string;
  to?: string;
  period: string;
  status: string;
  channel: any;
  action: string;
  page: string;
  limit: string;
  country: string;
}>({
  botId: "",
  q: undefined,
  from: undefined,
  to: undefined,
  period: "",
  status: "",
  channel: "all",
  action: "",
  page: "1",
  limit: "10",
  country: "all",
});
let page = ref(0);
let totalPageCount = ref(0);
let totalCount = ref(0);

watchEffect(() => {
  if (botDetails.value) {
    const userName = botDetails.value?.name ?? "Unknown Bot Name";
    useHead({
      title: `Voice Bot | ${userName} - CRM Config`,
    });
  }
});

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
            crmConfigModalState.value.id = id;
          },
        },
        h(Icon, { name: "lucide:pen" }),
      ),
      h(
        UiButton,
        {
          variant: "destructive",
          onClick: () => {
            deleteIntegrationState.id = id;
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
const {
  status,
  data: integrationsData,
  refresh: integrationRefresh,
} = await useLazyFetch(`/api/voicebots/${route.params.id}/integrations`, {
  server: false,
  query: filters,
  default: () => [],
  transform(data) {
    page.value = data.page;
    totalPageCount.value = data.totalPageCount;
    totalCount.value = data.totalCount;
    return data.data;
  },
});
watch(integrationsData, (newIntegrations: any) => {
  newIntegrations?.map((item: any) => { });
  integrations.value = newIntegrations?.map((item: any) => ({
    integration: item.integration?.name,
    projectId:
      item.integration?.crm === "zoho-bigin"
        ? `${item?.metadata?.pipelineObj?.Pipeline.name}`
        : item.integration?.crm === "zoho-crm"
          ? `${item?.metadata?.layoutObj?.name}`
          : item.integration?.crm === "hubspot" ? `${item?.metadata?.stage}` : item.integration?.crm === "reserve-go" ? `${item?.metadata?.restaurantId}` : (item.metadata?.projectId ?? "N/A"),
    id: item.id,
  }));
});
const handleSuccess = () => {
  crmConfigModalState.value.open = false;
  integrationRefresh();
};

const Pagination = async ($evnt: any) => {
  filters.page = $evnt;
  integrationRefresh();
};

</script>
