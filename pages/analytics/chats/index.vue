<template>
  <Page title="Chats" :disable-back-button="true">
    <div class="flex items-center gap-2 overflow-x-scroll pb-2">
      <div class="flex items-center gap-2">
        <UiInput v-model="filters.q" @input="filters.page = '1'"
          class="max-w-[130px] focus-visible:ring-0 focus-visible:ring-offset-0 sm:max-w-[130px] md:max-w-[200px] lg:max-w-[200px] xl:max-w-[200px]"
          placeholder="Search User..." />
        <BotFilter v-model="filters.botId" @input="filters.page = '1'" />
        <!-- <BotUserFilter @changeAction="onActionChange" /> -->
        <LivePreviewFilter @changeAction="onActionChange" />
        <DateRangeFilter @change="onDateChange" />
        <ChannelFilter @changeAction="onChannelChange" />

        <CountryFilter @changeCountry="onCountryChange"></CountryFilter>
        <ExportButton :rows="exportReadyRows" :columns="exportReadyColumns" />
      </div>
    </div>
    <DataTable @row-click="(row: any) => {
      return navigateTo(`/analytics/chats/${row.original.id}`);
      //TODO change this
    }
      " @pagination="Pagination" @limit="($event) => {
        (filters.page = '1'), (filters.limit = $event);
      }
        " :totalPageCount="totalPageCount" :page="page" :totalCount="totalCount" :columns="columns" :data="chats"
      :page-size="20" :is-loading="isDataLoading" :height="16" height-unit="vh" />
  </Page>
</template>
<script setup lang="ts">
import { createColumnHelper } from "@tanstack/vue-table";
import { format } from "date-fns";
definePageMeta({
  middleware: "admin-only",
});
useHead({
  title: 'Analytics | Chats',
})
const formSchema = toTypedSchema(
  z.object({
    newBotName: z.string().min(2, "Bot Name is requird."),
  }),
);
const searchBot = ref("");
// const searchBotDebounce = refDebounced(searchBot, 500);

const activeStatus = ref("");

watch(activeStatus, async (newStatus, previousStatus) => { });

const filters = reactive<{
  botId: string;
  q?: string;
  from?: string;
  to?: string;
  botUserName: string;
  period: string;
  page: string;
  limit: string;
  channel: any;
  country: string;
}>({
  botId: "",
  q: undefined,
  from: undefined,
  to: undefined,
  botUserName: "all",
  period: "all-time",
  page: "1",
  limit: "10",
  channel: "all",
  country: 'all',
});

let page = ref(0);
let totalPageCount = ref(0);
let totalCount = ref(0);
const {
  status,
  data: chats,
  refresh: getAllChats,
} = await useLazyFetch("/api/chats?page=2&limit=8", {
  server: false,
  query: filters,
  default: () => [],
  headers: {
    "time-zone": Intl.DateTimeFormat().resolvedOptions().timeZone,
  },
  transform: (chats: any) => {
    page.value = chats.page;
    totalPageCount.value = chats.totalPageCount;
    totalCount.value = chats.totalCount;
    return chats?.data?.map((chat: any) => ({
      userName: chat.botUser?.name || "No name",
      email: chat?.botUser?.email,
      mobile: chat?.botUser?.mobile,
      countryCode: chat?.botUser?.countryCode,
      id: chat.id,
      location: `${chat.metadata?.city ?? "--"} - ${chat.metadata?.state ?? "--"} `,
      createdAt: `${chat?.createdAt}`,
      metadata: chat?.metadata,
      mode: chat?.mode,
      channel: chat?.channel,
    }));
  },
});

const exportFilters = computed(() => {
  const { page, limit, ...restFilters } = filters; // Destructure to exclude 'page' and 'limit'
  return restFilters;
});

const {
  data: exportChats,
} = await useLazyFetch("/api/chats", {
  server: false,
  query: exportFilters,
  default: () => [],
  headers: {
    "time-zone": Intl.DateTimeFormat().resolvedOptions().timeZone,
  },
});


const exportReadyRows = computed(() => {
  let formatExportChats: any;

  if (Array.isArray(exportChats.value)) {
    formatExportChats = toRaw(exportChats.value); // Convert to plain array
  } else if (exportChats.value && typeof exportChats.value === 'object') {
    formatExportChats = toRaw(exportChats.value.data) || []; // Convert to plain object or array
  }

  try {
    return formatExportChats
      .map((chat: any) => {

        console.log({ chat })
        const mergedObject = {
          name: chat?.botUser?.name ?? '---',
          email: chat?.botUser?.email ?? '---',
          countryCode: chat?.botUser?.countryCode ?? "+91",
          mobile: chat?.botUser?.mobile ?? "---",
          botName: chat?.bot?.name ?? "---",
          country: chat?.metadata?.country ?? "---",
          createdAt: format(chat?.createdAt, "MMMM d, yyyy"),
          channel: chat?.channel,
          mode: chat?.mode
        };
        return mergedObject
      })
  } catch (err) {
    console.log({ err })
  }

})
const exportReadyColumns = computed(() => {
  return [
    "Name",
    "Email",
    "Country code",
    "Mobile",
    // "Visited status",
    "Bot name",
    "Country",
    "Created at",
    "Channel"
  ]
})

const isDataLoading = computed(() => {
  console.log(status.value, "VALUE STATUS")
  return status.value === "pending"
});

const statusComponent = (status: boolean) =>
  status
    ? h("span", { class: "text-green-500" }, "Active")
    : h("span", { class: "text-red-500" }, "Inactive");

const columnHelper = createColumnHelper<(typeof chats.value)[0]>();
const columns = [
  columnHelper.accessor("userName", {
    header: "User Name",
  }),
  columnHelper.accessor("location", {
    header: "Location",
  }),
  columnHelper.accessor("mode", {
    header: "Mode",
    cell: (props) => {
      return h("span", { class: `${props.row.original.mode === 'preview' ? 'text-red-500' : 'text-green-500'}` }, props.row.original.mode)
    }
  }),
  columnHelper.accessor("channel", {
    header: "Channel",
  }),
  columnHelper.accessor("createdAt", {
    header: "Date Created",
  }),
];
const onActionChange = (value: any) => {
  filters.botUserName = value;
  filters.page = "1";
};
const Pagination = async ($evnt) => {
  filters.page = $evnt;
  getAllChats();
};
const onDateChange = (value: any) => {
  if (value.from && value.to) {
    filters.from = value.from;
    filters.to = value.to;
  } else {
    delete filters.from;
    delete filters.to;
    filters.period = value;
  }
  filters.page = "1";
};

const onChannelChange = ($event) => {
  if ($event) {

    filters.channel = $event;
  }
}
const onCountryChange = ($event) => {
  if ($event) {
    filters.country = $event;
  }
}
</script>
