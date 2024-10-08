<template>
  <div class="bot-manage-main-container">
    <Page title="Call Bot Leads" :disable-back-button="true">
      <!-- isDataLoading -->
      <!-- @pagination="Pagination"  -->
      <DataTable @limit="($event) => {
        (filters.page = '1'), (filters.limit = $event);
      }
        " :totalPageCount="totalPageCount" :page="page" :totalCount="totalCount" :data="leads" :columns="columns"
        :page-size="8" :height="15" height-unit="vh" @row-click="(row: any) => {
        navigateTo(`/call-bot-leads-id/${row.original.chatId}`);
        }
          " />
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
  // const ListLeads = ref()
  const leads:any = ref([
    {
      name: "lead name test",
      bot_name: "bot name test",
      createdAt: "18.08.2024",
      id: 1,
    }, 
  ]);
  // const { status, data: leads } = await useLazyFetch("/api/org/leads", {
  //   server: false,
  //   query: {
  //     q: searchBotDebounced,
  //   },
  //   default: () => [],
  // });

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
      name: "call-bot-leads-id",
      params: { id: 1 },
    });
  };

  const columnHelper = createColumnHelper<typeof leads.value>();
  const columns = [
    columnHelper.accessor("name", {
      header: "Lead Name",
    }),
    columnHelper.accessor("bot_name", {
      header: "Bot Name",
    }),
    columnHelper.accessor("createdAt", {
      header: "Date Created",
      cell: ({ row }) =>
        // row.original.createdAt,
        row.original.createdAt,
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
</script>
