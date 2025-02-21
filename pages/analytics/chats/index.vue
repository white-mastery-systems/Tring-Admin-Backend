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
        <BotFilter v-model="filters.botId" />
        <LivePreviewFilter v-model="filters.botUserName" />
        <DateRangeFilter v-model:period="filters.period" v-model:from="filters.from" v-model:to="filters.to"
          @change="onDateChange" />
        <ChannelFilter v-model="filters.channel" />
        <CountryFilter v-model="filters.country" />
        <UiButton @click="handleClearFilters"
          class="ml-2 bg-[#424bd1] hover:bg-[#424bd1] hover:brightness-90 text-[#ffffff]">Clear Filters</UiButton>
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
const router = useRouter();
const route = useRoute();
// const searchBotDebounce = refDebounced(searchBot, 500);

const filters = useState("chatsFilters", () => ({
  botId: "",
  q: undefined,
  from: undefined,
  to: undefined,
  botUserName: "all",
  period: "all-time",
  page: "1",
  limit: "10",
  channel: "all",
  country: "all",
}));
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
watch(() => filters, (newValue) => {
  if (newValue.value.period != "custom") {
    delete filters.value.from;
    delete filters.value.to;
  }
}, { deep: true, immediate: true });
const exportFilters = computed(() => {
  const { page, limit, ...restFilters } = filters.value; // Destructure to exclude 'page' and 'limit'
  return restFilters;
});
const exportReadyRows = ref<any>([]);
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
      filters.value.page = '1';
    }
  }
};
// const onActionChange = (value: any) => {
//   filters.value.botUserName = value;
//   filters.value.page = "1";
// };
const Pagination = async ($evnt: any) => {
  filters.value.page = $evnt;
  getAllChats();
};
const onDateChange = (value: any) => {
  if (value != "custom") {
    delete filters.value.from;
    delete filters.value.to;
  }
  filters.value.page = "1";
};
// const onDateChange = (value: any) => {
//   if (value.from && value.to) {
//     filters.value.from = value.from;
//     filters.value.to = value.to;
//   } else {
//     delete filters.value.from;
//     delete filters.value.to;
//     filters.value.period = value;
//   }
//   filters.value.page = "1";
// };

// const onBotChange = (value: any) => {
//   if (value) {
//     filters.value.botId = value
//     filters.value.page = '1'
//   }
// };
// const onChannelChange = ($event) => {
//   if ($event) {
//     filters.value.channel = $event;
//   }
// };
// const onCountryChange = ($event) => {
//   if ($event) {
//     filters.value.country = $event;
//   }
// };
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
const handleClearFilters = () => {
  Object.assign(filters.value, {
    botId: "",
    q: undefined,
    from: undefined,
    to: undefined,
    botUserName: "all",
    period: "all-time",
    page: "1",
    limit: "10",
    channel: "all",
    country: "all",
  });
}
</script>
