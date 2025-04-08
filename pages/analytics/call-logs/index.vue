<template>
  <div class="bot-manage-main-container">
    <Page title="Call Logs" :disable-back-button="true">
      <!-- isDataLoading -->
      <!-- @pagination="Pagination"  -->
      <div class="flex items-center gap-2 overflow-x-scroll mt-2">
        <UiInput v-model="filters.q" @input="filters.page = '1'"
          class="min-w-[130px] max-w-[130px] focus-visible:ring-0 focus-visible:ring-offset-0 truncate"
          placeholder="Search bot name" />
        <DateRangeFilter v-model:period="filters.period" v-model:from="filters.from" v-model:to="filters.to"
          @change="onDateChange" />
        <UiButton color="primary" @click="handleClearFilters" class="ml-2">Clear Filters</UiButton>
      </div>
      <DataTable @row-click="handleRowClick" @limit="($event) => {
        (filters.page = '1'), (filters.limit = $event);
      }
        " @pagination="Pagination" :totalPageCount="totalPageCount" :page="page" :totalCount="totalCount"
        :data="callLogData" :columns="columns" :is-loading="isDataLoading" :page-size="20" :height="16"
        height-unit="vh" />
      <!-- <DataTable :data="leads" :is-loading="false" :columns="columns" :page-size="8" :height="80" height-unit="vh" /> -->
    </Page>
  </div>
</template>
<script setup lang="ts">
import { Icon, UiButton } from "#components";
import { createColumnHelper } from "@tanstack/vue-table";
import { useState } from "#app";
import { useRouter } from "vue-router";
import { useBreadcrumbStore } from "~/store/breadcrumbs"; // Import the store

  definePageMeta({
    middleware: "admin-only",
  });

let page = ref(0);
let totalPageCount = ref(0);
let totalCount = ref(0);
const router = useRouter(); 
const breadcrumbStore = useBreadcrumbStore();
breadcrumbStore.setBreadcrumbs([
  {
    label: "Call", // Dynamic name
    to: `/analytics/leads`,
  }
]);

const filters = useState("callLogsFilters", () => ({
  q: undefined,
  from: undefined,
  to: undefined,
  period: "all-time",
  status: "",
  channel: "all",
  action: "",
  page: "1",
  limit: "10",
  country: 'all',
}));

watch(() => filters, (newValue) => {
  if (newValue.value.period != "custom") {
    delete filters.value.from;
    delete filters.value.to;
  }
}, { deep: true, immediate: true });
const {
  status,
  data: callLogData,
  refresh: getAllBotCallLogs,
} = await useLazyFetch("/api/call-logs", {
  server: false,
  default: () => [],
  query: filters,
  headers: {
    "time-zone": Intl.DateTimeFormat().resolvedOptions().timeZone,
  },
  transform: (callLogData: any) => {
    page.value = callLogData.page;
    totalPageCount.value = callLogData.totalPageCount;
    totalCount.value = callLogData.totalCount;
    return callLogData.data.map((calls: any) => ({
      id: calls.id,
      botName: calls.bot.name,
      callerName: calls.callerName,
      from: calls.from,
      to: calls.exophone,
      CalledDateTime: `${calls.date}`,
      calledDuration: `${Math.round(calls.duration)} Secs`,
    }));
  },
});
const isDataLoading = computed(() => status.value === "pending");

const columnHelper = createColumnHelper<typeof callLogData.value>();
  const columns = [
    columnHelper.accessor("botName", {
      header: "Bot Name",
    }),
    columnHelper.accessor("callerName", {
      header: "Caller Name",
    }),
    columnHelper.accessor("from", {
      header: "Call From",
    }),
    columnHelper.accessor("to", {
      header: "Call To",
    }),
    columnHelper.accessor("CalledDateTime", {
      header: "Called Date & Time",
      cell: (info) =>info.getValue()
    }),
    columnHelper.accessor("calledDuration", {
      header: "Call Duration",
    }),
    columnHelper.accessor("id", {
      header: "Action",
      cell: ({ row }) =>
        h(
          UiButton,
          {
            // row.original.chatId
            onClick: () => handleRowClick(row),   //viewBot(),
            class: "bg-[#ffbc42] hover:bg-[#ffbc42] font-bold",
          },
          [h(Icon, { name: "ph:eye-light", class: "h-4 w-4 mr-2" }), "View"],
        ),
    }),
  ];
onMounted(() => {
  resetPageIfNeeded()
});

const Pagination = async ($evnt: any) => {
  filters.value.page = $evnt;
  getAllBotCallLogs();
};

const onDateChange = (value: any) => {
  if (value != "custom") {
    delete filters.value.from;
    delete filters.value.to;
  }
  filters.value.page = "1";
};
const handleRowClick = async (row: any) => {
  await navigateTo({
    name: "analytics-call-logs-id",
    params: { id: row.original.id },
  });
}
const resetPageIfNeeded = () => {
  const historyState = router.options.history.state || {};
  const backPath = historyState.back || "";

  if (!historyState.forward) {
    if (!backPath?.startsWith("/analytics/call-logs/")) {
      // currentPage.value = '1'; // Reset page number when revisiting
      filters.value.page = '1';
    }
  }
};
const handleClearFilters = () => {
  Object.assign(filters.value, {
    q: undefined,
    from: undefined,
    to: undefined,
    period: "all-time",
    status: "",
    channel: "all",
    action: "",
    page: "1",
    limit: "10",
    country: 'all',
  });
};
</script>
