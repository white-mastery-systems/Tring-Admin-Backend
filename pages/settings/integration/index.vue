<template>
  <Page title="Integration" :disable-back-button="true" :disable-elevation="true">
    <template #actionButtons>
      <div class="flex gap-2">
        <UiButton v-if="route.query.q === 'channel'" color="primary" @click="channelModalState.open = true">
          Add Channel
        </UiButton>
        <UiButton v-else-if="route.query.q === 'number'" color="primary" @click="numberModalState.open = true">
          Add Number
        </UiButton>
        <UiButton v-else color="primary" @click="integrationModalState.open = true">
          Add Integration
        </UiButton>
      </div>
    </template>
    <UiTabs default-value="client" class="w-full self-start">
      <UiTabsList class="grid w-[40%] grid-cols-3">
        <UiTabsTrigger value="client" @click="navigateToTab('crm')">
          CRM
        </UiTabsTrigger>
        <UiTabsTrigger value="campaign" @click="navigateToTab('channel')">
          Channel
        </UiTabsTrigger>
        <UiTabsTrigger value="number" @click="navigateToTab('number')">
          Number
        </UiTabsTrigger>
      </UiTabsList>
      <UiTabsContent value="client">
        <DataTable :columns="columns" :data="integrationsData" :page-size="8" :is-loading="false" :height="80"
          :heightUnit="'vh'" />
      </UiTabsContent>
      <UiTabsContent value="campaign">
        <DataTable :columns="statusColumns" :data="integrationsData" :page-size="8" :is-loading="false" :height="10"
          :heightUnit="'vh'" />
      </UiTabsContent>
      <UiTabsContent value="number">
          <NumberIntegration />
      </UiTabsContent>
    </UiTabs>
    <ChannelModal v-model="channelModalState" />
    <NumberModal v-model="numberModalState" />
    <CreateEditIntegrationModal v-model="integrationModalState" :id="integrationModalState?.id"
      @success="onSuccess()" />
  </Page>
  <ConfirmationModal v-model:open="deleteIntegrationState.open" title="Confirm Delete"
    description="Are you sure you want to delete ?" @confirm="
      () => {
        if (deleteIntegrationState?.id) {
          deleteIntegration({
            integrationId: deleteIntegrationState.id,
            onSuccess: () => {
              integrationRefresh();
            },
          });
          deleteIntegrationState.open = false;
        }
      }
    " />
</template>
<script lang="ts" setup>
  import { Icon, UiBadge, UiButton } from "#components";
  import { createColumnHelper } from "@tanstack/vue-table";
  import { useRoute, useRouter } from "vue-router";
  import Page from "~/components/Page.vue";
  import CreateEditIntegrationModal from "../../../components/integrations/CreateEditIntegrationModal.vue";
  import ChannelModal from "./ChannelModal.vue";
  import NumberModal from "./NumberModal.vue";
  definePageMeta({
    middleware: "admin-only",
  });

  const router = useRouter();
  const route = useRoute();
  const integrationModalState = ref<{ open: boolean; id?: string | null }>({
    open: false,
  });
  const channelModalState = ref({ open: false });
  const numberModalState = ref({ open: false });
  // const integrations = ref([]);

  let deleteIntegrationState: { open: boolean; id?: string } = reactive({
    open: false,
  });
  // const integrationsData = ref()
  watch(route, (newValue) => {});
  // const q=ref('')
  const filters = computed(() => ({
    q: route.query?.q,
  }));
  const {
    status: integrationLoadingStatus,
    data: integrationsData,
    refresh: integrationRefresh,
  } = await useLazyFetch("/api/org/integrations", {
    server: false,
    default: () => [],
    query: filters,
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

  // const channelModal = () => {
  //   channelModalState.value.open = false
  // }
  onMounted(() => {
    if (!router.currentRoute.value.query.tab) {
      navigateToTab("crm");
    }
  });
  const integrationLoading = computed(
    () => integrationLoadingStatus.value === "pending",
  );
  const actionsComponent = (id: any) =>
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
              integrationModalState.value.open = true;
              integrationModalState.value.id = id;
            },
          },
          h(Icon, { name: "lucide:pen" }),
        ),
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
        ),
      ],
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
  const statusColumns = [
    columnHelper.accessor("name", {
      header: "Integration Name",
    }),
    columnHelper.accessor("crm", {
      header: "Channel",
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

  const navigateToTab = async (tab: any) => {
    router.push({ query: { q: tab } });
  };
</script>
