<template>
  <Page
    :disable-elevation="true"
    title="Dashboard"
    :disableSelector="true"
    :disable-back-button="true"
  >
    <template #actionButtons>
      <div class="flex gap-2">
        <span
          class="field_shadow flex items-center rounded-lg text-[15px]"
          style="color: rgba(138, 138, 138, 1)"
        >
          <!-- <span class="flex -items-center py-2 pl-2"></span> -->
          <span class="font-bold text-black">
            <UiSelect v-model="selectedValue" class="outline-none">
              <UiSelectTrigger
                class="ui-select-trigger flex w-[70px] items-center gap-2 text-[10px] outline-none sm:w-[80px] sm:text-[10px] md:w-[200px] md:text-[14px] lg:w-[200px] lg:text-[14px] xl:w-[200px] xl:text-[14px]"
              >
                <span class="font-thin text-gray-400"> Summary </span>
                <UiSelectValue />
              </UiSelectTrigger>
              <UiSelectContent>
                <UiSelectGroup>
                  <UiSelectItem
                    v-for="(list, index) in dateFilters"
                    :key="index"
                    class="content_align pr-2"
                    :value="list.value"
                  >
                    {{ list.content }}
                  </UiSelectItem>
                  <UiSelectItem value="custom">Custom</UiSelectItem>
                </UiSelectGroup>
              </UiSelectContent>
            </UiSelect>
          </span>
        </span>
        <DateRangeFilter
          v-model="selectedValue"
          :selectDateField="false"
          @change="onDateChange"
        />
      </div>
    </template>
    <div>
      <div
        class="xs:grid-cols-2 grid grid-cols-2 gap-6 md:grid-cols-2 lg:grid-cols-4"
      >
        <StatusCountCard
          :icon="ChatSession"
          title="Chat sessions"
          :count="analyticsData?.chats"
          :loading="loading"
        />
        <StatusCountCard
          :icon="SingleUser"
          title="Unique visitors"
          :count="analyticsData?.users"
          :loading="loading"
        />

        <StatusCountCard
          :icon="ChatSession"
          title="Interacted Chats"
          :count="analyticsData?.interactedChats ?? 0"
          :loading="loading"
        />

        <StatusCountCard
          :icon="Leads"
          title="Chat Leads"
          :count="analyticsData?.leads"
          :loading="loading"
        />

        <StatusCountCard
          :icon="ChatSession"
          title="Calls Scheduled"
          :count="analyticsData?.callScheduledTimeline ?? 0"
          :loading="loading"
        />
        <StatusCountCard
          :icon="ChatSession"
          title="Site Visits"
          :count="analyticsData?.siteVisitTimeline ?? 0"
          :loading="loading"
        />
        <StatusCountCard
          :icon="ChatSession"
          title="Virtual Tours"
          :count="analyticsData?.virtualTourTimeline ?? 0"
          :loading="loading"
        />
        <StatusCountCard
          :icon="ChatSession"
          title="Location Visited"
          :count="analyticsData?.locationTimeline ?? 0"
          :loading="loading"
        />
      </div>
      <div class="mt-2 flex justify-end">
        <div class="max-w-[200px]">
          <MutliSelect
            v-model:value="chartValues"
            :options="graphOptions"
            :maxCount="2"
          />
        </div>
      </div>
      <Line
        v-if="!loading"
        class="shadow-md relative mt-4 w-full place-content-center rounded-md bg-white"
        :data="chartData"
        :options="chartOptions"
      />
      <div v-else class="mt-4 flex flex-col space-y-3">
        <UiSkeleton class="h-screen-minus-14 w-[100%] rounded-xl" />
      </div>
      <!-- <Bar id="my-chart-id" :options="chartOptions" :data="chartData" /> -->
    </div>
  </Page>
</template>
<script setup lang="ts">
  import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    Title,
    Tooltip,
  } from "chart.js";
  import { Line } from "vue-chartjs";
  import ChatSession from "~/components/icons/ChatSession.vue";
  import Leads from "~/components/icons/Leads.vue";
  import SingleUser from "~/components/icons/SingleUser.vue";

  ChartJS.register(
    Title,
    Tooltip,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    CategoryScale,
  );

  const selectedValue: any = ref("last-30-days");
  const analyticsData = ref();
  const loading = ref(false);
  const graphOptions = ref([
    {
      label: "Leads",
      value: "leads",
    },
    {
      label: "Sessions",
      value: "sessions",
    },
    {
      label: "Unique Visitors",
      value: "unique_visiters",
    },
    {
      label: "Interacted Chats",
      value: "interacted_chats",
    },
    {
      label: "Schedule Calls",
      value: "schedule_calls",
    },
    {
      label: "Site visits",
      value: "site_visits",
    },
    {
      label: "Locations",
      value: "locations",
    },
    {
      label: "Virtual Tours",
      value: "virtual_tours",
    },
  ]);
  const dateFilters = reactive([
    {
      content: "Today",
      value: "today",
    },
    {
      content: "Yesterday",
      value: "yesterday",
    },
    {
      content: "Last 7 days",
      value: "last-7-days",
    },
    {
      content: "Last 30 days",
      value: "last-30-days",
    },
    {
      content: "Current month",
      value: "current-month",
    },
    {
      content: "Last month",
      value: "last-month",
    },
    {
      content: "Current year",
      value: "current-year",
    },
    {
      content: "Last year",
      value: "last-year",
    },
    {
      content: "Current financial year",
      value: "current-financial-year",
    },
    {
      content: "Last financial year",
      value: "last-financial-year",
    },
    {
      content: "All time",
      value: "all-time",
    },
  ]);
  const chartValues = ref(["leads", "sessions"]);
  watch(chartValues, (newChartvalues) => {});

  const state = reactive<{ graphData: any[]; labels: any[] }>({
    graphData: [],
    labels: [],
  });

  watch(analyticsData, (newValue, oldValue) => {
    if (newValue?.graph?.length > 0) {
      state.labels = newValue.graph[0]?.map((item) => item.date);
    }

    state.graphData = newValue.graph?.map((graphItem) =>
      graphItem?.map((item) => item.count),
    );
  });
  let chartData = computed(() => ({
    labels: state.labels,
    datasets: chartValues.value?.map((item: any, index: number) => {
      console.log({ index });
      return {
        label: graphOptions.value?.find(
          ({ value }: { value: string }) => value === item,
        )?.label,
        tension: 0.4,
        pointRadius: 0,
        borderColor: graphIndexValues.value[index]?.borderColor,
        backgroundColor: graphIndexValues.value[index]?.backgroundColor,
        data: state.graphData[index],
        yAxisID: graphIndexValues.value[index]?.yAxisID,
      };
    }),
  }));
  const graphIndexValues = ref([
    {
      borderColor: "#424bd1",
      backgroundColor: "#424bd1",
      yAxisID: "y",
    },
    {
      borderColor: "#ffbc42",
      backgroundColor: "#ffbc42",
      yAxisID: "y1",
    },
    {
      borderColor: "#dc6570",
      backgroundColor: "#dc6570",
      yAxisID: "y1",
    },

    {
      borderColor: "#ffbc42",
      backgroundColor: "#ffbc42",
      yAxisID: "y1",
    },
    {
      borderColor: "#ffbc42",
      backgroundColor: "#ffbc42",
      yAxisID: "y1",
    },
  ]);

  const chartOptions = ref({
    responsive: true,
    interaction: {
      mode: "index",
      intersect: false,
    },
    stacked: false,

    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        type: "linear",
        display: true,
        position: "left",
        grid: {
          display: false,
        },
        ticks: {
          beginAtZero: true,
          userCallback: function (label, index, labels) {
            // when the floored value is the same as the value we have a whole number
            if (Math.floor(label) === label) {
              return label;
            }
          },
        },
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        grid: {
          display: false,
        },
        beginAtZero: true,
        userCallback: function (label, index, labels) {
          // when the floored value is the same as the value we have a whole number
          if (Math.floor(label) === label) {
            return label;
          }
        },
      },
    },
    elements: {
      line: {
        tension: 0.4,
      },
    },
    plugins: {
      customCanvasBackgroundColor: {
        color: "lightGreen",
      },
    },

    backgroundColor: "red",
  });

  definePageMeta({
    middleware: "user",
  });
  const filter = reactive<{
    from?: string;
    to?: string;
    period: string;
    graphValues?: string;
  }>({
    from: undefined,
    to: undefined,
    period: "last-30-days",
    graphValues: "leads,sessions",
  });
  // const getButtonName = ref("Get Started");

  watch([selectedValue, chartValues], async ([period, chartValues]) => {
    filter.graphValues = chartValues?.join(",");

    filter.period = period;
    if (period != "custom") {
      delete filter.from;
      delete filter.to;
    }
    // const data = await getAnalyticsData(filter);
    loading.value = true;

    try {
      const data = await getAnalyticsData(filter);
      analyticsData.value = data;
    } catch (error) {
      console.error("Failed to fetch analytics data:", error);
    } finally {
      loading.value = false;
    }
    // analyticsData.value = data;
  });

  onMounted(async () => {
    analyticsData.value = await getAnalyticsData(filter);

    // analyticsData.value.bots = 0;
  });

  const getStarted = () => {
    if (analyticsData.value.bots === 0) {
      navigateTo("/bots");
    }
  };

  const onDateChange = async (value: any) => {
    if (value.from && value.to) {
      filter.from = value.from;
      filter.to = value.to;

      const data = await getAnalyticsData(filter);
      analyticsData.value = data;
    }
  };
</script>
<style scoped>
  .focus\:ring-offset-2:focus {
    --tw-ring-offset-width: none;
  }
</style>
