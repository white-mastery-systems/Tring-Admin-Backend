<template>
  <Page title="Chats" :disable-back-button="true">
    <template #actionButtons>
      <div class="flex gap-4">
        <div class="flex gap-2">
          <ExportButton v-model="exportDataHandler" :rows="exportReadyRows" :columns="exportReadyColumns"
            @export="exportData" :exportCompleted="fetchExportData" buttonContent="Export Data" />
        </div>
      </div>
    </template>
    <div class="flex items-center gap-2 overflow-x-scroll pb-2">
      <div class="flex items-center gap-2">
        <UiInput v-model="filters.q" @input="filters.page = '1'"
          class="max-w-[130px] focus-visible:ring-0 focus-visible:ring-offset-0 sm:max-w-[130px] md:max-w-[200px] lg:max-w-[200px] xl:max-w-[200px]"
          placeholder="Search User..." />
        <BotFilter @input="onBotChange" />
        <!-- <BotUserFilter @changeAction="onActionChange" /> -->
        <LivePreviewFilter @changeAction="onActionChange" />
        <DateRangeFilter @change="onDateChange" />
        <ChannelFilter @changeAction="onChannelChange" />

        <CountryFilter @changeCountry="onCountryChange"></CountryFilter>
      </div>
    </div>
    <DataTable @row-click="handleRowClick" @pagination="Pagination" @limit="($event) => {
        (filters.page = '1'), (filters.limit = $event);
      }
      " :totalPageCount="totalPageCount" :page="page" :totalCount="totalCount" :columns="columns" :data="chats"
      :page-size="20" :is-loading="isDataLoading" :height="13" height-unit="vh" />
  </Page>
</template>
<script setup lang="ts">
import { createColumnHelper } from "@tanstack/vue-table";
import { format } from "date-fns";
import { Icon, UiButton } from "#components";
import { useState } from "#app";
import { useRoute, useRouter } from "vue-router";

definePageMeta({
  middleware: "user",
});
useHead({
  title: "Analytics | Chats",
});
const currentPage = useState("counter", () => '1');
const router = useRouter();
const route = useRoute();
// const searchBotDebounce = refDebounced(searchBot, 500);

const activeStatus = ref("");

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
  page: currentPage.value,
  limit: "10",
  channel: "all",
  country: "all",
});
const exportDataHandler = ref({ status: false, type: "csv" });

let page = ref(0);
let totalPageCount = ref(0);
let totalCount = ref(0);
const fetchExportData = ref(false);
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
      updatedAt: `${chat?.updatedAt}`,
      metadata: chat?.metadata,
      mode: chat?.mode,
      channel: chat?.channel,
      botUser: chat.bot?.name,
    }));
  },
});

const exportFilters = computed(() => {
  const { page, limit, ...restFilters } = filters; // Destructure to exclude 'page' and 'limit'
  return restFilters;
});
const exportReadyRows = ref<any>([]);
watch(
  () => filters.page,
  (newPage) => {
    currentPage.value = newPage; // Save page number globally
  }
);
const exportReadyColumns = computed(() => {
  return [
    "Name",
    "Email",
    "Country Code",
    "Mobile",
    // "Visited status",
    "Bot name",
    "Country",
    "Updated At",
    "Channel",
    "Mode",
  ];
});

const isDataLoading = computed(() => {
  return status.value === "pending";
});

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
      return h(
        "span",
        {
          class: `${props.row.original.mode === "preview" ? "text-red-500" : "text-green-500"}`,
        },
        props.row.original.mode,
      );
    },
  }),
  columnHelper.accessor("channel", {
    header: "Channel",
  }),
  columnHelper.accessor("botUser", {
    header: "Bot Name",
  }),
  columnHelper.accessor("metadata.country", {
    header: "Country",
    cell: (info) => info.getValue() || "-",
  }),
  columnHelper.accessor("updatedAt", {
    header: "Updated At",
  }),
  columnHelper.accessor("id", {
    header: "Action",
    cell: ({ row }) =>
      h(
        UiButton,
        {
          onClick: () => handleRowClick(row),
          class: "bg-[#ffbc42] hover:bg-[#ffbc42] font-bold",
        },
        [h(Icon, { name: "ph:eye-light", class: "h-4 w-4 mr-2" }), "View"],
      ),
  }),
];

onMounted(() => {
  resetPageForChats()
});

const resetPageForChats = () => {
  const historyState = router.options.history.state || {};
  const backPath = historyState.back || "";

  if (!historyState.forward) {
    if (!backPath?.startsWith("/analytics/chats/")) {
      currentPage.value = '1'; // Reset page number when revisiting
      filters.page = '1';
    }
  }
};
const onActionChange = (value: any) => {
  filters.botUserName = value;
  filters.page = "1";
};
const Pagination = async ($evnt: any) => {
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

const onBotChange = (value: any) => {
  if (value) {
    filters.botId = value
    filters.page = '1'
  }
};
const onChannelChange = ($event) => {
  if ($event) {
    filters.channel = $event;
  }
};
const onCountryChange = ($event) => {
  if ($event) {
    filters.country = $event;
  }
};
const handleRowClick = async (row: any) => {
  await navigateTo({
    name: "analytics-chats-id",
    params: { id: row.original.id },
  });
}
const exportData = async () => {
  try {
    const exportChats = await $fetch("/api/chats", {
      query: exportFilters.value,
      method: "GET",
      headers: {
        "time-zone": Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
    });
    let formatExportChats: any;
    if (Array.isArray(exportChats)) {
      formatExportChats = toRaw(exportChats); // Convert to plain array
    } else if (exportChats && typeof exportChats === "object") {
      formatExportChats = toRaw(exportChats.data) || []; // Convert to plain object or array
    }
    const exportReadObject = formatExportChats.map((chat: any) => {
      const mergedObject = {
        name: chat?.botUser?.name ?? "---",
        email: chat?.botUser?.email ?? "---",
        countryCode: chat?.botUser?.countryCode ?? "+91",
        mobile: chat?.botUser?.mobile ?? "---",
        botName: chat?.bot?.name ?? "---",
        country: chat?.metadata?.country ?? "---",
        updatedAt: format(chat?.updatedAt, "MMMM d, yyyy"),
        channel: chat?.channel,
        mode: chat?.mode,
      };
      return mergedObject;
    });
    exportDataHandler.value.status = true;
    exportReadyRows.value = exportReadObject;
  } catch (err) { }
};
</script>
