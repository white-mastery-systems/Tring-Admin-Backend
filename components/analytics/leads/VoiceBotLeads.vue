<template>
  <div>
    <div class="flex items-center gap-2 w-full overflow-x-scroll my-3 ">
      <UiInput v-model="props.filters.q" @input="props.filters.page = '1'"
        class="min-w-[130px] max-w-[130px] focus-visible:ring-0 focus-visible:ring-offset-0"
        placeholder=" Search Leads..." />
      <BotFilter v-model="props.filters.botId" :botType="'voice'" />
      <DateRangeFilter v-model:period="props.filters.period" v-model:from="props.filters.from" v-model:to="props.filters.to"
        @change="onDateChange" />
      <UiButton color="primary" @click="emitClearFilters" class="ml-2">Clear Filters</UiButton>
    </div>
    <DataTable @pagination="Pagination" @limit="($event) => {
      (props.filters.page = '1'), (props.filters.limit = $event);
    }
    " :totalPageCount="totalPageCount" :page="page" :totalCount="totalCount" :data="leads" :is-loading="isDataLoading"
      :columns="columns" :page-size="8" :height="36" height-unit="vh" />
  </div>
</template>
<script setup lang="ts">
import { UiButton } from "#components";
import { createColumnHelper } from "@tanstack/vue-table";

const props = defineProps({
  filters: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(['clear-filters']);

watchEffect(() => {
  if (props.filters.botId === "all") props.filters.botId = "";
});

const page = ref(0);
const totalPageCount = ref(0);
const totalCount = ref(0);


const computedQuery = computed(() => {
  const { period, from, to, ...rest } = props.filters;
  return {
    ...rest,
    period,
    ...(period === "custom" ? { from, to } : {}), // Include `from` and `to` only if period is "custom"
  };
});

const {
  status,
  data: leads,
  refresh: getAllLeads,
} = await useLazyFetch("/api/org/leads", {
  server: false,
  query: computedQuery,
  headers: {
    "time-zone": Intl.DateTimeFormat().resolvedOptions().timeZone,
  },
  default: () => [],
  transform: (leads: any) => {
    page.value = leads.page;
    totalPageCount.value = leads.totalPageCount;
    totalCount.value = leads.totalCount;
    return leads.data
  }
})

const Pagination = async ($evnt) => {
  props.filters.page = $evnt;
  getAllLeads();
}

const isDataLoading = computed(() => status.value === "pending");

const columnHelper = createColumnHelper<(typeof leads.value)[0]>();
const columns = [
  columnHelper.accessor("name", {
    header: "Name",
  }),
  columnHelper.accessor("location", {
    header: "Location",
    cell: (info) => info.getValue() || "--"
  }),

  columnHelper.accessor("phone", {
    header: "Phone",
  }),
  columnHelper.accessor("createdAt", {
    header: "Created At",
  }),
  columnHelper.accessor("scheduledDate", {
    header: "Scheduled Date",
    cell: (info) => info.getValue() || "--"
  }),
  columnHelper.accessor("notes", {
    header: "Notes",
    cell: (info) => info.getValue() || "--"
  }),
  columnHelper.accessor("bot.name", {
    header: "Bot Name",
    cell: (info) => info.getValue() || "--"
  }),
];

const onDateChange = (value: any) => {
  if (value != "custom") {
    delete props.filters.from;
    delete props.filters.to;
  }
  props.filters.page = "1";
};
const emitClearFilters = () => {
  emit('clear-filters')
};

</script>