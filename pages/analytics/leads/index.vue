<template>
  <Page title="Leads" :disable-back-button="true">
    <template #actionButtons>
      <div class="flex gap-4">
        <div class="flex gap-2">
          <ExportButton v-model="exportDataHandler" buttonContent="Export Data" :rows="exportReadyRows"
        :columns="exportReadyColumns" @export="exportData" />
        </div>
      </div>
    </template>
    <div class="flex items-center justify-between gap-2 overflow-x-scroll pb-4">
      <div class="flex items-center gap-2">
        <UiInput v-model="filters.q" @input="filters.page = '1'"
          class="max-w-[130px] focus-visible:ring-0 focus-visible:ring-offset-0 sm:max-w-[130px] md:max-w-[200px] lg:max-w-[200px] xl:max-w-[200px]"
          placeholder=" Search Leads..." />
        <BotFilter v-model="filters.botId" @input="filters.page = '1'" />
        <StatusFilter @change="onStatusChange" />

        <!-- <ActionFilter @changeAction="onActionChange" /> -->
        <DateRangeFilter @change="onDateChange" />
        <!-- <ChannelFilter @changeAction="onChannel" /> -->
        <CountryFilter @changeCountry="onCountryChange"></CountryFilter>
      </div>
      <!-- <UiButton @click="exportToCSV" color="primary"> Export As CSV </UiButton> -->
    </div>
    <UiTabs default-value="all" class="w-full self-start">
      <UiTabsList class="grid w-full sm:w-full md:w-[30%] lg:w-[30%] xl:w-[30%] grid-cols-3">
        <UiTabsTrigger value="all" @click="selectedChannel('all')">
          All
        </UiTabsTrigger>
        <UiTabsTrigger value="website" @click="selectedChannel('website')">
          Website
        </UiTabsTrigger>
        <UiTabsTrigger value="whatsapp" @click="selectedChannel('whatsapp')">
          Whatsapp
        </UiTabsTrigger>
      </UiTabsList>
      <UiTabsContent value="all">
        <DataTable @pagination="Pagination" @limit="
            ($event) => {
              (filters.page = '1'), (filters.limit = $event);
            }
          " :totalPageCount="totalPageCount" :page="page" :totalCount="totalCount" :data="leads"
          :is-loading="isDataLoading" :columns="columns" :page-size="8" :height="17" height-unit="vh" @row-click="
            (row: any) => {
              navigateTo(`/analytics/leads/${row.original.chatId}`);
            }
          " />
      </UiTabsContent>
      <UiTabsContent value="whatsapp">
        <DataTable :data="leads" @pagination="Pagination" @limit="
            ($event) => {
              (filters.page = '1'), (filters.limit = $event);
            }
          " :is-loading="isDataLoading" :columns="columns" :totalPageCount="totalPageCount" :page="page"
          :totalCount="totalCount" :page-size="8" :height="17" height-unit="vh" @row-click="
            (row: any) => {
              navigateTo(`leads/${row.original.chatId}`);
            }
          " />
      </UiTabsContent>
      <UiTabsContent value="website">
        <DataTable :data="leads" @pagination="Pagination" @limit="
            ($event) => {
              (filters.page = '1'), (filters.limit = $event);
            }
          " :is-loading="isDataLoading" :columns="columns" :totalPageCount="totalPageCount" :page="page"
          :totalCount="totalCount" :page-size="8" :height="17" height-unit="vh" @row-click="
            (row: any) => {
              navigateTo(`leads/${row.original.chatId}`);
            }
          " />
      </UiTabsContent>
    </UiTabs>
  </Page>
</template>
<script setup lang="ts">
  import { Icon, UiBadge, UiButton } from "#components";
  import { createColumnHelper } from "@tanstack/vue-table";
  import { format } from "date-fns";
  import { useRoute, useRouter } from "vue-router";

  const rowList = reactive([
    "name",
    "email",
    "visitedCount",
    "mobile",
    "botName",
    "country",
    "createdAt",
    "ClientId",
  ]);

  definePageMeta({
    middleware: "user",
  });

  useHead({
    title: "Analytics | Leads",
  });

  const exportDataHandler = ref({ status: false, type: "csv" });
  const router = useRouter();
  const route = useRoute();
  const fetchExportData = ref(false);

  const filters = reactive<{
    botId: string;
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
    botId: "",
    q: undefined,
    from: undefined,
    to: undefined,
    period: "",
    status: "",
    channel: "all",
    action: "",
    page: "1",
    limit: "10",
    country: "all",
  });

  watchEffect(() => {
    if (filters.botId === "all") filters.botId = "";
  });

  let page = ref(0);
  let totalPageCount = ref(0);
  let totalCount = ref(0);

  let {
    status,
    data: leads,
    refresh: getAllLeads,
  } = await useLazyFetch("/api/org/leads", {
    server: false,
    query: filters,
    headers: {
      "time-zone": Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    default: () => [],
    transform: (leads: any) => {
      page.value = leads.page;
      totalPageCount.value = leads.totalPageCount;
      totalCount.value = leads.totalCount;
      return leads.data.map((lead: any) => ({
        leadName: lead.botUser?.name,
        email: lead.botUser?.email,
        location: `${lead.chat.metadata?.city ?? "--"} - ${lead.chat.metadata?.state ?? "--"} `,
        botUser: lead.botUser?.visitedCount,
        channel: lead.chat.channel,
        mobile: lead.botUser,
        name: lead.bot?.name,
        countryName: lead.chat.metadata?.country,
        createdAt: lead.chat.createdAt,
        chatId: lead.chatId,
        status: lead.status,
      }))
      ;
    },
  });

  const exportFilters = computed(() => {
    const { page, limit, ...restFilters } = filters; // Destructure to exclude 'page' and 'limit'
    return restFilters;
  });
  const exportReadyRows = ref<any>([]);
  // const exportReadyRows = computed(async () => {
  //   let exportLeads = await $fetch("/api/org/leads", {
  //     server: false,
  //     query: exportFilters,
  //     headers: {
  //       "time-zone": Intl.DateTimeFormat().resolvedOptions().timeZone,
  //     },
  //     immediate: fetchExportData.value,
  //     default: () => [],
  //   });

  //   return (exportLeads ?? []).map((lead: any) => {
  //     const mergedObject = {
  //       name: lead.botUser.name ?? "---",
  //       email: lead.botUser.email ?? "---",
  //       mobile: lead?.botUser?.mobile ?? "---",
  //       countryCode: lead?.botUser?.countryCode ?? "+91",
  //       visitedStatus:
  //         Number(lead?.botUser?.visitedCount) > 1 ? "Revisited" : "New",
  //       botName: lead.bot.name ?? "---",
  //       country: lead.chat?.metadata?.country ?? "---",
  //       createdAt: format(lead.botUser.createdAt, "MMMM d, yyyy"),
  //       // ClientId: lead.botUser.id,
  //     };
  //     return mergedObject;
  //   });
  //   return [];
  // });
  watch(exportReadyRows, () => {});
  const exportReadyColumns = computed(() => {
    return [
      "Name",
      "Email",
      "Mobile",
      "Country code",
      "Visited status",
      "Bot name",
      "Country",
      "Created at",
    ];
  });
  const Pagination = async ($evnt) => {
    filters.page = $evnt;
    getAllLeads();
  };

  const isDataLoading = computed(() => status.value === "pending");

  const viewLead = async (chatId: any) => {
    await navigateTo({
      name: "analytics-leads-id",
      params: { id: chatId },
    });
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
  const onActionChange = (value: any) => {
    if (value) {
      filters.action = value;
    }
  };
  const onStatusChange = (value: any) => {
    if (value) {
      filters.status = value;
      filters.page = "1";
    }
  };

  const columnHelper = createColumnHelper<(typeof leads.value)[0]>();
  const columns = [
    columnHelper.accessor("leadName", {
      header: "Lead Name",
    }),
    columnHelper.accessor("email", {
      header: "Lead Email",
    }),
    columnHelper.accessor("location", {
      header: "Location",
    }),
    columnHelper.accessor("botUser", {
      header: "Visiting Status",
      cell: ({ row }) =>
        h(
          UiBadge,
          {
            ...(row.original.status === "junk"
              ? { class: "bg-red-200 text-red-500 hover:bg-300" }
              : Number(row.original.visitedCount) > 1
                ? { class: "bg-[#424bd1] text-[#ffffff] hover:bg-[#424bd1]" }
                : { class: "bg-green-200 text-green-500 hover:bg-green-300" }),
          },
          row.original.status === "junk"
            ? "Junk"
            : Number(row.original.botUser.visitedCount) > 1
              ? "Revisited"
              : "New",
        ),
    }),

    columnHelper.accessor("channel", {
      header: "Channel",
      cell: ({ row }) =>
        row.original?.channel.charAt(0).toUpperCase() +
        row.original?.channel.slice(1),
    }),
    columnHelper.accessor("mobile", {
      header: "Lead Phone",
      cell: ({ row }) =>
        row.original?.mobile?.countryCode + row.original?.mobile?.mobile,
    }),
    columnHelper.accessor("name", {
      header: "Bot Name",
    }),
    columnHelper.accessor("countryName", {
      header: "Country",
      cell: (info) => info.getValue() || "-",
    }),
    columnHelper.accessor("createdAt", {
      header: "Date Created",
      cell: ({ row }) => `${row.original.createdAt}`,
    }),
    columnHelper.accessor("chatId", {
      header: "Action",
      cell: ({ row }) =>
        h(
          UiButton,
          {
            onClick: () => viewLead(row.original.chatId),
            class: "bg-[#ffbc42] hover:bg-[#ffbc42] font-bold",
          },
          [h(Icon, { name: "ph:eye-light", class: "h-4 w-4 mr-2" }), "View"],
        ),
    }),
  ];
  const selectedChannel = (value: any) => {
    if (value) {
      filters.channel = value;
    }
    filters.page = "1";
  };

  const onChannel = ($event) => {
    if ($event) {
      filters.channel = $event;
    }
  };

  const onCountryChange = ($event) => {
    if ($event) {
      filters.country = $event;
    }
  };
  const exportData = async () => {
    try {
      const exportLeads = await $fetch("/api/org/leads", {
        query: exportFilters.value,
        method: "GET",
        headers: {
          "time-zone": Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      });

      const exportReadObject = (exportLeads ?? []).map((lead: any) => {
        const mergedObject = {
          name: lead.botUser.name ?? "---",
          email: lead.botUser.email ?? "---",
          mobile: lead?.botUser?.mobile ?? "---",
          countryCode: lead?.botUser?.countryCode ?? "+91",
          visitedStatus:
            Number(lead?.botUser?.visitedCount) > 1 ? "Revisited" : "New",
          botName: lead.bot.name ?? "---",
          country: lead.chat?.metadata?.country ?? "---",
          createdAt: format(lead.botUser.createdAt, "MMMM d, yyyy"),
          // ClientId: lead.botUser.id,
        };
        return mergedObject;
      });
      exportDataHandler.value.status = true;
      exportReadyRows.value = exportReadObject;
    } catch (err) {}
  };
</script>
