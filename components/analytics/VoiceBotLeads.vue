<template>
  <div>
    <div class="flex items-center gap-2 mb-2">
      <DateRangeFilter @change="onDateChange" />
    </div>
    <DataTable @pagination="Pagination" @limit="($event) => {
  (props.filters.page = '1'), (props.filters.limit = $event);
    }
      " :totalPageCount="totalPageCount" :page="page" :totalCount="totalCount" :data="leads"
      :is-loading="isDataLoading" :columns="columns" :page-size="8" :height="17" height-unit="vh" />
  </div>
</template>
<script setup lang="ts">
import { Icon, UiBadge, UiButton } from "#components";
import { createColumnHelper } from "@tanstack/vue-table";
import { format } from "date-fns";
import { useRoute, useRouter } from "vue-router";


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
      type: "voice",
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
    return leads.data
}})

const Pagination = async ($evnt) => {
  props.filters.page = $evnt;
  getAllLeads();
}

const isDataLoading = computed(() => status.value === "pending");

const columnHelper = createColumnHelper < (typeof leads.value)[0] > ();
const columns = [
  columnHelper.accessor("name", {
    header: "Name",
  }),
  columnHelper.accessor("bot.name", {
    header: "Bot Name",
  }),
  columnHelper.accessor("notes", {  
    header: "Notes",
  }),
  columnHelper.accessor("location", {
    header: "Location",
  }),

  columnHelper.accessor("phone", {
    header: "Phone",
  }),
  columnHelper.accessor("createdAt", {
    header: "Date",
  }),
];

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
</script>