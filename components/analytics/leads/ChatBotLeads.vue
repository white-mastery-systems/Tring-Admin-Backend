<template>
  <div class="flex items-center justify-between gap-2 overflow-x-scroll pb-4">
    <div class="flex items-center gap-2">
      <UiInput v-model="filters.q" @input="filters.page = '1'"
        class="max-w-[130px] focus-visible:ring-0 focus-visible:ring-offset-0 sm:max-w-[130px] md:max-w-[200px] lg:max-w-[200px] xl:max-w-[200px]"
        placeholder=" Search Leads..." />
      <BotFilter @input="onBotChange" />
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
      <DataTable @pagination="Pagination" @limit="($event) => {
          (filters.page = '1'), (filters.limit = $event);
        }
        " :totalPageCount="totalPageCount" :page="page" :totalCount="totalCount" :data="leads"
        :is-loading="isDataLoading" :columns="columns" :page-size="8" :height="17" height-unit="vh" @row-click="(row: any) => {
            navigateTo(`/analytics/leads/${row.original.chatId}`);
          }
          " />
    </UiTabsContent>
    <UiTabsContent value="whatsapp">
      <DataTable :data="leads" @pagination="Pagination" @limit="($event) => {
  (props.filters.page = '1'), (props.filters.limit = $event);
        }
        " :is-loading="isDataLoading" :columns="columns" :totalPageCount="totalPageCount" :page="page"
        :totalCount="totalCount" :page-size="8" :height="17" height-unit="vh" @row-click="(row: any) => {
            navigateTo(`leads/${row.original.chatId}`);
          }
          " />
    </UiTabsContent>
    <UiTabsContent value="website">
      <DataTable :data="leads" @pagination="Pagination" @limit="($event) => {
  (props.filters.page = '1'), (props.filters.limit = $event);
        }
        " :is-loading="isDataLoading" :columns="columns" :totalPageCount="totalPageCount" :page="page"
        :totalCount="totalCount" :page-size="8" :height="17" height-unit="vh" @row-click="(row: any) => {
            navigateTo(`leads/${row.original.chatId}`);
          }
          " />
    </UiTabsContent>
  </UiTabs>
</template>
<script setup lang="ts">
import { Icon, UiBadge, UiButton } from "#components";
import { createColumnHelper } from "@tanstack/vue-table";
import { format } from "date-fns";
import { useRoute, useRouter } from "vue-router";


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

const props = withDefaults(
  defineProps<{
    filters?: {
      botId: string;
      q?: string;
      from?: string;
      to?: string;
      period: string;
      status: string;
      channel: string;
      action: string;
      page: string;
      limit: string;
      country: string;
      type: string;
    };
  }>(),
  {
    filters: {
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
      type: "chat",
    },
  }
);


watchEffect(() => {
  if (props.filters.botId === "all") props.filters.botId = "";
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
  query: props.filters,
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
      email: lead.botUser?.email ?? "--",
      location: `${lead.chat.metadata?.city ?? "--"} - ${lead.chat.metadata?.state ?? "--"} `,
      botUser: lead.botUser?.visitedCount,
      channel: lead.chat.channel,
      mobile: lead.botUser,
      name: lead.bot?.name,
      countryName: lead.chat.metadata?.country,
      createdAt: lead.createdAt,
      chatId: lead.chatId,
      status: lead.status,
    }))
      ;
  },
});

const exportFilters = computed(() => {
  const { page, limit, ...restFilters } = props.filters; // Destructure to exclude 'page' and 'limit'
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
watch(exportReadyRows, () => { });
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
  props.filters.page = $evnt;
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
    props.filters.from = value.from;
    props.filters.to = value.to;
  } else {
    delete props.filters.from;
    delete props.filters.to;
    props.filters.period = value;
  }
  props.filters.page = "1";
};
const onActionChange = (value: any) => {
  if (value) {
    props.filters.action = value;
  }
};
const onBotChange = (value: any) => {
  if (value) {
    props.filters.botId = value
    props.filters.page = '1'
    // props.filters.status = value;
    // props.filters.page = "1";
  }
};
const onStatusChange = (value: any) => {
  if (value) {
    props.filters.status = value;
    props.filters.page = "1";
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
            : Number(row.original.botUser) > 1
              ? { class: "bg-[#424bd1] text-[#ffffff] hover:bg-[#424bd1]" }
              : { class: "bg-green-200 text-green-500 hover:bg-green-300" }),
        },
        row.original.status === "junk"
          ? "Junk"
          : (row.original.botUser > 1)
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
    // cell: ({ row }) => `${row.original.createdAt}`,
  }),
  columnHelper.accessor("chatId", {
    header: "Action",
    cell: ({ row }) =>
      h(
        UiButton,
        {
          onClick: () => viewLead(row.original.id),
          class: "bg-[#ffbc42] hover:bg-[#ffbc42] font-bold",
        },
        [h(Icon, { name: "ph:eye-light", class: "h-4 w-4 mr-2" }), "View"],
      ),
  }),
];

// const handleRowClick = (row: any) => {
//   console.log(row, "row -- row");
//   const url = `/analytics/chats/${row.original.id}`
//   const newTab = window.open(url, '_blank')

//   if (newTab) {
//     newTab.focus()
//   } else {
//     toast.error('The new tab could not be opened. Please check your browser settings.');
//   }
// }
const selectedChannel = (value: any) => {
  if (value) {
    props.filters.channel = value;
  }
  props.filters.page = "1";
};

const onChannel = ($event) => {
  if ($event) {
    props.filters.channel = $event;
  }
};

const onCountryChange = ($event) => {
  if ($event) {
    props.filters.country = $event;
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
          Number(lead?.botUser?.visitedCount) > 1 ? "Revisited" : (lead.status === "junk") ? "Junk" : "New",
        botName: lead.bot.name ?? "---",
        country: lead.chat?.metadata?.country ?? "---",
        createdAt: format(lead.botUser.createdAt, "MMMM d, yyyy"),
        // ClientId: lead.botUser.id,
      };
      return mergedObject;
    });
    exportDataHandler.value.status = true;
    exportReadyRows.value = exportReadObject;
  } catch (err) { }
};
</script>