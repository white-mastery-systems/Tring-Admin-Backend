<template>
  <div class="bot-manage-main-container">
    <Page title="Call Logs" :disable-back-button="true">
      <!-- isDataLoading -->
      <!-- @pagination="Pagination"  -->
      <div class="flex items-center gap-2 overflow-x-scroll pb-2">
        <UiInput v-model="filters.q" @input="filters.page = '1'"
          class="max-w-[130px] focus-visible:ring-0 focus-visible:ring-offset-0 sm:max-w-[130px] md:max-w-[200px] lg:max-w-[200px] xl:max-w-[200px]"
          placeholder="Search Bot Name..." />
        <DateRangeFilter @change="onDateChange" />
      </div>
      <DataTable @row-click="(row: any) => {
          navigateTo(`/analytics/call-logs/${row.original.id}`);
        }
          " @limit="($event) => {
        (filters.page = '1'), (filters.limit = $event);
      }
        " @pagination="Pagination" :totalPageCount="totalPageCount" :page="page" :totalCount="totalCount"
        :data="callLogData" :columns="columns" :is-loading="isDataLoading" :page-size="8" :height="15"
        height-unit="vh" />
      <!-- <DataTable :data="leads" :is-loading="false" :columns="columns" :page-size="8" :height="80" height-unit="vh" /> -->
    </Page>
  </div>
</template>
<script setup lang="ts">
  import { Icon, UiButton } from "#components";
  import { createColumnHelper } from "@tanstack/vue-table";

  definePageMeta({
    middleware: "admin-only",
  });

let page = ref(0);
let totalPageCount = ref(0);
let totalCount = ref(0);

const filters = reactive<{
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
  q: undefined,
  from: undefined,
  to: undefined,
  period: "",
  status: "",
  channel: "all",
  action: "",
  page: "1",
  limit: "10",
  country: 'all',
});
const {
  status,
  data: callLogData,
  refresh: getAllBotCallLogs,
} = await useLazyFetch("/api/call-logs", {
  server: false,
  default: () => [],
  query: filters,
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
  // const analyticsData = ref();

  // onMounted(async () => {
  //   analyticsData.value = await getAnalyticsData();
  // });

  // const rep = await defineEventHandler()

  // onMounted(async() => {
  //   ListLeads.value = await listLeads()
  //   console.log(ListLeads.value, "ListLeads.value")
  // })

  const viewBot = async () => {
    await navigateTo({
      name: "analytics-call-logs",
      params: { id: 1 },
    });
  };

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
      cell: (info) => {
      const rawDate = info.getValue();
      const formattedDate = rawDate.slice(0, 16);
      return formattedDate;
     },
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
            onClick: () => viewBot(),
            class: "bg-[#ffbc42] hover:bg-[#ffbc42] font-bold",
          },
          [h(Icon, { name: "ph:eye-light", class: "h-4 w-4 mr-2" }), "View"],
        ),
    }),
  ];

const Pagination = async ($evnt: any) => {
  filters.page = $evnt;
  getAllBotCallLogs();
};
</script>
