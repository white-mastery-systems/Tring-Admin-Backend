<template>
  <!-- <Page title="Channel Configuration" :bread-crumbs="[
    {
      label: `${botDetails.name}`,
      to: `/bot-management/chat-bot/${botDetails.id}`,
    },
    {
      label: 'Channel Configuration',
      to: `/bot-management/chat-bot/${botDetails.id}/communication-channel-config`,
    },
  ]" :disableSelector="true"> -->
  <!-- v-if="integrations.length === 0" -->
  <div class="pt-5">
    <!-- <template #actionButtons> -->
    <div class="flex items-center justify-between mb-5">
      <div class="text-sm sm:text-sm md:text-base lg:text-lg font-bold"> Channel Configuration </div>
      <UiButton class="flex items-center justify-end text-xs sm:text-xs md:text-sm" color="primary" @click="
        () => {
          communicationChannelModalState.open = true;
          communicationChannelModalState.id = null;
        }
      ">
        Link channel
      </UiButton>
      <!-- Communication -->
      <!-- </template> -->
    </div>
    <DataTable :columns="columns" :data="integrations" :page-size="8" :is-loading="false" :height="20"
      height-unit="vh" />
    <CreateEditCommunicationChannelConfigModal v-model="communicationChannelModalState"
      :id="communicationChannelModalState?.id" @success="handleSuccess" />
    <ConfirmationModal v-model:open="deleteIntegrationState.open" title="Confirm Removal"
      description="Are you sure you want to remove this integration ?" @confirm="
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
      " />
  </div>
  <!-- </Page> -->
</template>
<script setup lang="ts">
import { Icon, UiButton } from "#components";
import { createColumnHelper } from "@tanstack/vue-table";

const props = defineProps<{ botDetails: any; refreshBot: () => void }>();

const router = useRouter();
const columnHelper = createColumnHelper<any>();
const route = useRoute("chat-bot-id-crm-config");
const paramId: any = route;
// const botDetails = ref(await getBotDetails(paramId.params.id));

let deleteIntegrationState: { open: boolean; id?: string } = reactive({
  open: false,
});

watch(
  () => props.botDetails?.name, // Watching only the 'name' property
  (newName) => {
    const userName = newName ?? "Unknown Bot Name";
    useHead({
      title: `Chat Bot | ${userName} - CRM Config`,
    });
  },
  { immediate: true } // Runs immediately on mount
);

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
            communicationChannelModalState.value.open = true;
            communicationChannelModalState.value.id = id;
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
} = await useLazyFetch(`/api/bots/${route.params.id}/integrations`, {
  server: false,
  query: { q: "communication" },
  default: () => [],
});
watch(integrationsData, (newIntegrations: any) => {
  newIntegrations?.map((item: any) => { });
  integrations.value = newIntegrations?.map((item: any) => ({
    integration: item.integration?.name,
    projectId: item.metadata?.channelId ?? "N/A",
    id: item.id,
  }));
});
const handleSuccess = () => {
  communicationChannelModalState.value.open = false;
  integrationRefresh();
};
const integrations: any = ref([]);
const communicationChannelModalState = ref<{
  open: boolean;
  id?: string | null;
}>({
  open: false,
  id: null,
});
</script>
