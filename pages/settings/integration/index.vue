<template>
  <Page title="Integration" :disable-back-button="true" :disable-elevation="false">
    <template #actionButtons>
      <div class="flex gap-2">
        <UiButton color="primary" class="text-[10.5px] sm:text-[10.5px] md:text-[14px] lg:text-[14px] xl:text-[14px]"
          @click="
            () => {
              if (route.query.q === 'number') {
                numberModalState = true;
                // numberModalState.id = null;
                return;
              }
              integrationModalState = true;
              // integrationModalState.id = null;
              
            }
          ">
          Add
          {{
          (() => {
          if (route.query.q === "number") {
          return "Exophone";
          } else if (route.query.q === "crm") {
          return "CRM";
          } else if (route.query.q === "communication") {
          return "Communication";
          } else if (route.query.q === "ecommerce") {
          return "E-Commerce";
          } else {
          return "CRM";
          }
          })()
          }}
          Channel
        </UiButton>
      </div>
    </template>
    <UiTabs :default-value="route?.query?.q ?? 'crm'" class="w-full self-start">
      <UiTabsList
        class="grid w-[100%] grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 sm:w-[100%] md:w-[50%] lg:w-[60%] xl:w-[50%] h-[10%]">
        <UiTabsTrigger value="crm" @click="navigateToTab('crm')">

          CRM
        </UiTabsTrigger>
        <UiTabsTrigger value="communication" @click="navigateToTab('communication')">
          Communication
        </UiTabsTrigger>
        <UiTabsTrigger value="ecommerce" @click="navigateToTab('ecommerce')">
          E-Commerce
        </UiTabsTrigger>

        <UiTabsTrigger value="number" @click="navigateToTab('number')">
          Exophone
        </UiTabsTrigger>
      </UiTabsList>
      <UiTabsContent value="crm">
        <IntegrationTable :integrationModalState="integrationModalState"
          :findTitleForIntegrationModal="findTitleForIntegrationModal()"
          @stateControl="integrationModalState = $event" />
        <!-- v-model:deleteIntegrationState="deleteIntegrationState" -->
      </UiTabsContent>
      <UiTabsContent value="communication">
        <IntegrationTable :integrationModalState="integrationModalState"
          :findTitleForIntegrationModal="findTitleForIntegrationModal()" @stateControl="integrationModalState = $event" />
      </UiTabsContent>
      <UiTabsContent value="ecommerce">
        <IntegrationTable :integrationModalState="integrationModalState"
          :findTitleForIntegrationModal="findTitleForIntegrationModal()"
          @stateControl="integrationModalState = $event" />
      </UiTabsContent>
      <UiTabsContent value="number">
        <NumberIntegration :integrationModalState="numberModalState"
          :findTitleForIntegrationModal="findTitleForIntegrationModal()" @stateControl="numberModalState = $event" />
      </UiTabsContent>
    </UiTabs>
    <ChannelModal v-model="channelModalState" @success="() => {
      console.log('on success')
    }" />
    <!-- <Numberodal v-model="numberModalState" @success="onSuccess()" /> -->
    <!-- <CreateEditIntegrationModal :title="findTitleForIntegrationModal()" v-model="integrationModalState"
      :id="integrationModalState?.id" @success="onSuccess()" /> -->
  </Page>
  <!-- <ConfirmationModal v-model:open="deleteIntegrationState.open" title="Confirm Delete"
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
    " /> -->
  <!-- <ConfirmationModal v-model:open="deleteExoPhoneState.open" title="Confirm Delete"
    description="Are you certain you want to delete the Exophone integration? Please note that doing so will also remove all bots associated with this number?"
    @confirm="
      () => {
        // if (numberModalState) {
        //   deleteSingleExoPhone({
        //     // id: numberModalState.id,
        //     onSuccess: () => {
        //       integrationRefresh();
        //       console.log('main --- main')
        //     },
        //   });
        //   deleteExoPhoneState.open = false;
        // }
      }
    " /> -->
</template>
<script lang="ts" setup>
  import { Icon, UiBadge, UiButton } from "#components";
  import { createColumnHelper } from "@tanstack/vue-table";
  import { useRoute, useRouter } from "vue-router";
  import Page from "~/components/Page.vue";
  import IntegrationTable from "~/components/settings/integrations/IntegrationTable.vue";
  import CreateEditIntegrationModal from "../../../components/integrations/CreateEditIntegrationModal.vue";
  import ChannelModal from "./ChannelModal.vue";
  import NumberModal from "./NumberModal.vue";

  definePageMeta({
    middleware: "user",
  });

  useHead({
    title: "Settings | Integrations",
  });

  const router = useRouter();
  const route = useRoute();
  function findTitleForIntegrationModal () {
    if (route.query.q === "number") {
      return "Exophone";
    } else if (route.query.q === "crm") {
      return "CRM";
    } else if (route.query.q === "communication") {
      return "Communication";
    } else if (route.query.q === "ecommerce") {
      return "E-Commerce";
    }
  }
  const integrationModalState = ref(false)
  const channelModalState = ref({ open: false, id: null });
  const numberModalState: any = ref(false);
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
  // const q=ref('')
  let page = ref("1");
  let totalPageCount = ref(0);
  let totalCount = ref(0);
  const limit = ref("10");
  const apiPathControler: any = ref("crm")
  const filters = computed(() => ({
        q: route.query?.q ?? "crm",
        page: page.value,
        limit: limit.value,
      }));
      // watch(route.query, () => {
        //   console.log(route.query?.q, 'route.query?.q -- route.query?.q')
        // })
        // const filters = reactive({
          //   q: "number",
          //   page: page.value,
          //   limit: limit.value,
          // });
// const changepath = computed(() => {
//     if (route.query.q === 'number') {
//       return "/api/org/integrations/number-integration";
//     } else {
//       return "/api/org/integrations"; // Adjust as needed for your actual path
//     }
//   });
          // const { fetchIntegrations, refreshNumberIntegration } = useIntegrations(filters);
// const {
//   data: integrationsData,
//   status,
//   refresh: integrationRefresh,
// } = await useLazyFetch(changepath, {
//   server: false,
//   default: () => [],
//   query: filters,
//   transform: (integrations: any) => {
//     if (changepath.value === "/api/org/integrations/number-integration") {
//       page.value = integrations.page;
//       totalPageCount.value = integrations.totalPageCount;
//       totalCount.value = integrations.totalCount;
//       return integrations.data;
//     } else {
//       page.value = integrations.page;
//       totalPageCount.value = integrations.totalPageCount;
//       totalCount.value = integrations.totalCount;
//       return integrations.data?.map((integration: any) => ({
//         ...integration,
//         status: integration?.metadata?.status ?? "Verified",
//       }));
//     }
//   },
// });
// watch(() => filters.q, (newValue) => {
//   console.log(newValue, "newValue")
//   apiPathControler.value = newValue; // Set apiPathControler to the new value of filters.q
//   console.log(apiPathControler.value, "apiPathControler.value");
// },{ deep: true });
  // const onSuccess = () => {
  //   console.log(route.query.q, "route.query.q --- route.query.q")
  //   if (route.query.q === 'number') {
  //     numberModalState.value = false;
  //     // numberModalState.value.id = null;
  //     integrationRefresh();
  //   } else {
  //     integrationModalState.value.open = false;
  //   }
  //   // toast.success("Integration added successfully");
  //   // refreshNumberIntegration()
  // };
  // const onSuccessNumberIntegration = () => {
  //   numberModalState.value.open = false;
  // };

  // const onSuccessChannel = () => {
  //   channelModalState.value.open = false;
  //   integrationRefresh();
  // };

  // const channelModal = () => {
  //   channelModalState.value.open = false
  // }
  onMounted(() => {
    // if (!router.currentRoute.value.query.tab) {
    //   navigateToTab("crm");
    // }
  });
  // const integrationLoading = computed(
  //   () => integrationLoadingStatus.value === "pending",
  // );
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
              integrationModalState.open = true;
              // integrationModalState.value.id = id;
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

  const navigateToTab = async (tab: any) => {
    page.value = "1";
    limit.value = "10";
    router.push({ query: { q: tab } });
  };

//   const handleAction = (id: any, modelControl: string) => {
//     if (modelControl === "edit") numberModalState.value = true;
//     else deleteExoPhoneState.value.open = true;
//     // numberModalState.value.id = id;
//     integrationRefresh()
//   };

//   const Pagination = async (evnt: any) => {
//     console.log('asdfasf', evnt)
//     page.value = evnt;
//     console.log(page.value,'value --sdvsdv-dsv-dsvd-s')
//     // integrationRefresh();
//   };

// const updateLimit = (newLimit: string) => {
//   console.log("Limit updated:", newLimit);
//   filters.value.limit = newLimit;
//   // integrationRefresh()
//   // fetchData(); // Fetch the data based on new limit
// };
</script>
