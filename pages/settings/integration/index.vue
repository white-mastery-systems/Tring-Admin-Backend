<template>
  <Page title="Integration" :disable-back-button="true" :disable-elevation="false">
    <template #actionButtons>
      <div class="flex gap-2">
        <!-- <UiButton v-if="route.query.q === 'channel'" color="primary" @click="() => {
            channelModalState.open = true
            channelModalState.id = null
          }">
          Add Channel
        </UiButton> -->
        <UiButton v-if="route.query.q === 'number'" color="primary" @click="() => {
          numberModalState.open = true
          numberModalState.id = null
          }">
          Exophone
        </UiButton>
        <UiButton v-else color="primary" @click="
            () => {
              integrationModalState.open = true;
              integrationModalState.id = null;
            }
          ">
          Add Integration
        </UiButton>
      </div>
    </template>
    <UiTabs default-value="crm" class="w-full self-start">
      <UiTabsList class="grid w-[100%] sm:w-[100%] nd:w-[50%] xl:w-[30%] lg:w-[30%] grid-cols-2">
        <UiTabsTrigger value="crm" @click="navigateToTab('crm')">
          CRM
        </UiTabsTrigger>
        <!-- <UiTabsTrigger value="campaign" @click="navigateToTab('channel')">
          Channel
        </UiTabsTrigger> -->
        <UiTabsTrigger value="number" @click="navigateToTab('number')">
          Exophone
        </UiTabsTrigger>
      </UiTabsList>
      <UiTabsContent value="crm">
        <DataTable @pagination="Pagination" @limit="
          ($event) => {
            (page = '1'), (limit = $event);
          }
        " :totalPageCount="totalPageCount" :page="page" :totalCount="totalCount" :columns="columns"
          :data="integrationsData" :page-size="8" :is-loading="false" :height="17" :heightUnit="'vh'" />
      </UiTabsContent>
      <!-- <UiTabsContent value="campaign">
        <DataTable @pagination="Pagination" @limit="
          ($event) => {
            (page = '1'), (limit = $event);
          }
        " :totalPageCount="totalPageCount" :page="page" :totalCount="totalCount" :columns="statusColumns"
          :data="integrationsData" :page-size="8" :is-loading="false" :height="13" :heightUnit="'vh'" />
      </UiTabsContent> -->
      <UiTabsContent value="number">
        <NumberIntegration @action="handleAction" />
      </UiTabsContent>
    </UiTabs>
    <ChannelModal v-model="channelModalState" @success="onSuccessChannel()" />
    <NumberModal v-model="numberModalState" @success="onSuccessNumberIntegration()" />
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
  <ConfirmationModal v-model:open="deleteExoPhoneState.open" title="Confirm Delete"
    description="Are you sure you want to delete ?" @confirm="
      () => {
      if (numberModalState.id) {
        deleteSingleExoPhone({
            id: numberModalState.id,
            onSuccess: () => {
              refresh();
            },
          });
        deleteExoPhoneState.open = false;
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

  useHead({
    title: 'Settings | Integrations',
  })

  const router = useRouter();
  const route = useRoute();
 const { refresh } = useCount();

  const integrationModalState = ref<{ open: boolean; id?: string | null }>({
    open: false,
  });
  const channelModalState = ref({ open: false, id: null });
  const numberModalState = ref({ open: false, id: null });
  // const integrations = ref([]);

  let deleteIntegrationState = ref({
    open: false,
    id: null,
  });
  let deleteExoPhoneState = ref({
    open: false,
    id: null,
  });
  // const integrationsData = ref()
  watch(route, (newValue) => {});
  // const q=ref('')
  let page = ref('1');
  let totalPageCount = ref(0);
  let totalCount = ref(0);
  const limit = ref('10')
  const filters = computed(() => ({
    q: route.query?.q,
    page: page.value,
    limit: limit.value,
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
      page.value = integrations.page;
      totalPageCount.value = integrations.totalPageCount;
      totalCount.value = integrations.totalCount;
      return integrations.data?.map((integration) => ({
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
  const onSuccessNumberIntegration = () => {
    numberModalState.value.open = false;
  };

  const onSuccessChannel = () => {
    channelModalState.value.open = false;
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
              deleteIntegrationState.value.id = id;
              deleteIntegrationState.value.open = true;
            },
          },
          h(Icon, { name: "lucide:trash-2" }),
        ),
      ],
    );
    const channelActionsComponent = (id: any) =>
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
              channelModalState.value.open = true;
              channelModalState.value.id = id;
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
              deleteIntegrationState.value.id = id;
              deleteIntegrationState.value.open = true;
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
        return channelActionsComponent(row.original?.id);
      },
    }),
  ];

  const navigateToTab = async (tab: any) => {
    page.value = '1'
    limit.value = '10'
    router.push({ query: { q: tab } });
  };

const handleAction = (id: any, modelControl: string) => {
  if (modelControl === 'edit') numberModalState.value.open = true;
  else deleteExoPhoneState.value.open = true
  numberModalState.value.id = id;
};

    const Pagination = async ($evnt) => {
    page.value = $evnt;
    integrationRefresh();
  };
</script>