<template>
  <div>
    <div class="flex items-center gap-2 mb-2">
      <UiInput v-model="props.filters.q" @input="props.filters.page = '1'"
        class="max-w-[130px] focus-visible:ring-0 focus-visible:ring-offset-0 sm:max-w-[130px] md:max-w-[200px] lg:max-w-[200px] xl:max-w-[200px]"
        placeholder=" Search Leads..." />
      <BotFilter v-model="filters.botId" />
      <DateRangeFilter v-model:period="filters.period" v-model:from="filters.from" v-model:to="filters.to" />
      <UiButton @click="emitClearFilters"
        class="ml-2 bg-[#424bd1] hover:bg-[#424bd1] hover:brightness-90 text-[#ffffff]">Clear Filters</UiButton>
    </div>
    <DataTable @pagination="Pagination" @limit="($event) => {
      (props.filters.page = '1'), (props.filters.limit = $event);
    }
    " :totalPageCount="totalPageCount" :page="page" :totalCount="totalCount" :data="leads"
      :is-loading="isDataLoading" :columns="columns" :page-size="8" :height="36" height-unit="vh" />
  </div>
</template>
<script setup lang="ts">
import { Icon, UiBadge, UiButton } from "#components";
import { createColumnHelper } from "@tanstack/vue-table";
import { format } from "date-fns";
import { useRoute, useRouter } from "vue-router";

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


const {
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
const onBotChange = (value: any) => {
  if (value) {
    props.filters.botId = value
    props.filters.page = '1'
  }
};
const emitClearFilters = () => {
  Object.assign(props.filters, {
    botId: "",
    q: undefined,
    from: undefined,
    to: undefined,
    period: "all-time",
    status: "",
    channel: "all",
    action: "",
    page: "1",
    limit: "10",
    country: "all",
    type: "chat",
  });
  emit('clear-filters')
};

</script>