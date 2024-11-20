<template>
  <Page title="Chat Bot" :disable-back-button="true">
    <template #actionButtons>
      <div class="flex gap-4">
        <UiButton
          class="button-align bg-[#424bd1] text-[14px] font-medium hover:bg-[#424bd1] hover:brightness-95"
          @click="
            () => {
              agentModalState.open = true;
              agentModalState.id = null;
            }
          "
        >
          Add Chat Bot
        </UiButton>
      </div>
    </template>
    <div class="flex items-center gap-2 pb-2">
      <UiInput
        v-model="filters.q"
        @input="filters.page = '1'"
        class="max-w-[200px] focus-visible:ring-0 focus-visible:ring-offset-0"
        placeholder="Search bot..."
      />
      <UiSelect v-model="activeStatus">
        <UiSelectTrigger class="max-w-[200px]">
          <UiSelectValue placeholder="Filter status" />
        </UiSelectTrigger>
        <UiSelectContent>
          <UiSelectItem value="true">Active</UiSelectItem>
          <UiSelectItem value="false">In active</UiSelectItem>
          <UiSelectItem value="all">All</UiSelectItem>
        </UiSelectContent>
      </UiSelect>
      <UiSelect v-model="botTypeFilter">
        <UiSelectTrigger class="max-w-[200px]">
          <UiSelectValue placeholder="Filter Type" />
        </UiSelectTrigger>
        <UiSelectContent>
          <UiSelectItem value="government-sectors"
            >Government Sectors</UiSelectItem
          >
          <UiSelectItem value="finance-banking">Finance & Banking</UiSelectItem>
          <UiSelectItem value="real-estate">Real Estate</UiSelectItem>
          <UiSelectItem value="healthcare">Healthcare</UiSelectItem>
          <UiSelectItem value="ecommerce">E-commerce</UiSelectItem>
          <UiSelectItem value="energy-utilities"
            >Energy & Utilities</UiSelectItem
          >
          <UiSelectItem value="telecommunications"
            >Telecommunications</UiSelectItem
          >
          <UiSelectItem value="travel-hospitality"
            >Travel & Hospitality</UiSelectItem
          >
          <UiSelectItem value="logistics">Logistics</UiSelectItem>
          <UiSelectItem value="education">Education</UiSelectItem>
          <UiSelectItem value="other">Other</UiSelectItem>
        </UiSelectContent>
      </UiSelect>
    </div>

    <DataTable
      @row-click="
        (row: any) => {
          return navigateTo(`/bot-management/chat-bot/${row.original.id}`);
        }
      "
      @pagination="Pagination"
      @limit="
        ($event) => {
          (filters.page = '1'), (filters.limit = $event);
        }
      "
      :totalPageCount="totalPageCount"
      :page="page"
      :totalCount="totalCount"
      :columns="columns"
      :data="bots"
      :page-size="20"
      :is-loading="isDataLoading"
      :height="20"
      height-unit="vh"
    />
  </Page>
  <AddChatBotModal
    v-model="agentModalState"
    @confirm="
      () => {
        agentModalState.open = false;
        getAllChatBot();
      }
    "
  ></AddChatBotModal>
</template>

<script setup lang="ts">
  import { Icon, UiButton } from "#components";
  import { createColumnHelper } from "@tanstack/vue-table";

  definePageMeta({
    middleware: "user",
  });
  useHead({
    title: "Bot Management | Chat Bot",
  });
  // interface LocationContext {
  //   location: any;
  //   updateLocation: () => void;
  // }

  const searchBot = ref("");
  const searchBotDebounce = refDebounced(searchBot, 500);
  const agentModalState = ref({ open: false, id: null });

  const filters = reactive<{
    q: string;
    page: string;
    limit: string;
    active: string;
  }>({
    q: "",
    active: "",
    page: "1",
    limit: "10",
  });
  const activeStatus = ref("");
  const botTypeFilter = ref("");
  watch(activeStatus, async (newStatus, previousStatus) => {
    filters.active = newStatus;
    filters.page = "1";
  });
  watch(botTypeFilter, async (newStatus, previousStatus) => {
    filters.type = newStatus;
    filters.page = "1";
  });
  const selectedValue = ref("Today");

  // const botList = await listApiBots();
  let page = ref(0);
  let totalPageCount = ref(0);
  let totalCount = ref(0);
  const {
    status,
    data: bots,
    refresh: getAllChatBot,
  } = await useLazyFetch("/api/bots", {
    server: false,
    default: () => [],
    query: filters,
    headers: {
      "time-zone": Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    transform: (bots) => {
      page.value = bots.page;
      totalPageCount.value = bots.totalPageCount;
      totalCount.value = bots.totalCount;
      return bots.data.map((bot) => {
        const type = () => {
          switch (bot.type) {
            case "ecommerce":
              return "E-commerce";
            case "real-estate":
              return "Real Estate";
            case "government-sectors":
              return "Government Sectors";
            case "finance-banking":
              return "Finance & Banking";
            case "healthcare":
              return "Healthcare";
            case "energy-utilities":
              return "Energy & Utilities";
            case "telecommunications":
              return "Telecommunications";
            case "travel-hospitality":
              return "Travel & Hospitality";
            case "logistics":
              return "Logistics";
            case "education":
              return "Education & Training";
            default:
              return "Other";
          }
        };

        return {
          id: bot.id,
          name: bot.name,
          status: bot.documentId ? true : false,
          createdAt: `${bot.createdAt}`,
          type: type(),
        };
      });
    },
  });
  const isDataLoading = computed(() => status.value === "pending");

  const botManagementDetails = async (list: any) => {
    return navigateTo({
      name: "bot-management-chat-bot-id",
      params: { id: list.id },
    });
  };

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
            onClick: (e: Event) => {
              e.stopPropagation();
              agentModalState.value.open = true;
              agentModalState.value.id = id;
            },
            color: "primary",
          },
          h(Icon, { name: "lucide:pen" }),
        ),
      ],
    );

  const statusComponent = (status: boolean) =>
    status
      ? h("span", { class: "text-green-500" }, "Active")
      : h("span", { class: "text-red-500" }, "Inactive");

  const columnHelper = createColumnHelper<(typeof bots.value)[0]>();
  const columns = [
    columnHelper.accessor("name", {
      header: "Bot Name",
    }),
    columnHelper.accessor("Bot Type", {
      header: "Bot Type",
      cell: ({ row }) => {
        return row.original.type;
      },
    }),
    columnHelper.accessor("createdAt", {
      header: "Date Created",
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: ({ row }) => {
        return statusComponent(row.original.status);
      },
    }),
    // columnHelper.accessor("id", {
    //   header: "Action",
    //   cell: ({ row }) => {
    //     return actionsComponent(row.original.id);
    //   },
    // }),
  ];
  const Pagination = async ($evnt) => {
    filters.page = $evnt;

    getAllChatBot();
  };

  // const location = ref('North Pole')

  // function updateLocation() {
  //   location.value = 'South Pole'
  //   console.log("inside0-- asda")
  // }

  // provide<LocationContext>('location', {
  //   location,
  //   updateLocation
  // })
  const testing = () => {
    console.log("testing");
  };
</script>
