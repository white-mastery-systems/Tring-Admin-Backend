<template>
  <Page :disable-elevation="true" title="Dashboard" :disableSelector="true" :disable-back-button="true">
    <template #actionButtons>
      <div class="flex gap-2">
        <span class="field_shadow flex items-center rounded-lg text-[15px]" style="color: rgba(138, 138, 138, 1)">
          <!-- <span class="flex -items-center py-2 pl-2"></span> -->
          <span class="font-bold text-black">
            <UiSelect v-model="selectedValue" class="outline-none">
              <UiSelectTrigger
                class="ui-select-trigger flex items-center gap-2 text-[10px] outline-none sm:w-[80px] sm:text-[10px] md:w-[200px] md:text-[14px] lg:w-[200px] lg:text-[14px] xl:w-[200px] xl:text-[14px]">
                <span class="font-thin text-gray-400 min-w-[70px]"> Summary </span>
                <UiSelectValue />
              </UiSelectTrigger>
              <UiSelectContent>
                <UiSelectGroup>
                  <UiSelectItem v-for="(list, index) in dateFilters" :key="index" class="content_align pr-2"
                    :value="list.value">
                    <div class="text-left">
                      {{ list.content }}
                    </div>
                  </UiSelectItem>
                  <UiSelectItem value="custom">Custom</UiSelectItem>
                </UiSelectGroup>
              </UiSelectContent>
            </UiSelect>
          </span>
        </span>
        <DateRangeFilter v-model="selectedValue" :selectDateField="false" @change="onDateChange" />
      </div>
    </template>
    <div>
      <div class="xs:grid-cols-2 grid grid-cols-2 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatusCountCard :icon="ChatSession" title="Chat sessions" :count="analyticsData?.chats" :loading="loading" />
        <StatusCountCard :icon="SingleUser" title="Unique visitors" :count="analyticsData?.users" :loading="loading" />

        <StatusCountCard :icon="ChatSession" title="Interacted Chats" :count="analyticsData?.interactedChats ?? 0"
          :loading="loading" />

        <StatusCountCard :icon="Leads" title="Chat Leads" :count="analyticsData?.leads" :loading="loading" />

        <StatusCountCard :icon="ChatSession" title="Calls Scheduled" :count="analyticsData?.callScheduledTimeline ?? 0"
          :loading="loading" />
        <StatusCountCard :icon="ChatSession" title="Site Visits" :count="analyticsData?.siteVisitTimeline ?? 0"
          :loading="loading" />
        <StatusCountCard :icon="ChatSession" title="Virtual Tours" :count="analyticsData?.virtualTourTimeline ?? 0"
          :loading="loading" />
        <StatusCountCard :icon="ChatSession" title="Location Visited" :count="analyticsData?.locationTimeline ?? 0"
          :loading="loading" />
      </div>
      <div class="mt-2 flex cursor-pointer gap-2 overflow-x-scroll">
        <template v-for="graphOption in graphOptions" :key="graphOption.value">
          <button
            @click="() => handleEditGraphValues(graphOption)"
            :class="[
              `shadow-lg flex h-[40px] w-auto items-center gap-2 rounded-md border-[1px] border-gray-200 px-2 text-center text-sm`,
            ]"
          >
            <PlusIcon v-if="!chartValues.includes(graphOption.value)" />
            <MinusIcon v-else />
            <span class="min-w-[100px]" :style="`color:${graphOption.color}`">{{
              graphOption.label
            }}</span>
          </button>
        </template>
        <!-- <div class="max-w-[200px]">
          <MutliSelect
            v-model:value="chartValues"
            :options="graphOptions"
            :maxCount="2"
          />
        </div> -->
      </div>
      <Line v-if="!loading" class="shadow-md relative mt-4 w-full place-content-center rounded-md bg-white"
        :data="chartData" :options="chartOptions" />
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
  import { MinusIcon, PlusIcon } from "lucide-vue-next";
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
    //define diffrent color for each of this item
    {
      label: "Leads",
      value: "leads",
      color: "#4f46e5",
    },
    {
      label: "Sessions",
      value: "sessions",
      color: "#facc15",
    },
    {
      label: "Unique Visitors",
      value: "unique_visiters",
      color: "#a855f7",
    },
    {
      label: "Interacted",
      value: "interacted_chats",
      color: "#dc2626",
    },
    {
      label: "Schedule Calls",
      value: "schedule_calls",
      color: "#16a34a",
    },
    {
      label: "Site visits",
      value: "site_visits",
      color: "#2563eb",
    },
    {
      label: "Locations",
      value: "locations",
      color: "#1e293b",
    },
    {
      label: "Virtual Tours",
      value: "virtual_tours",
      color: "#e11d48",
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
  const handleEditGraphValues = async (option: any) => {
    let localValue = chartValues.value;
    if (localValue.includes(option.value)) {
      const index = localValue.indexOf(option.value);
      localValue.splice(index, 1);
    } else {
      localValue.push(option.value);
    }
    chartValues.value = localValue;
    filter.graphValues = chartValues?.value?.join(",");

    filter.period = selectedValue;
    if (selectedValue != "custom") {
      delete filter.from;
      delete filter.to;
    }
    const data = await getAnalyticsData(filter);
    analyticsData.value = data;
  };
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
      return {
        label: graphOptions.value?.find(
          ({ value }: { value: string }) => value === item,
        )?.label,
        tension: 0.4,
        pointRadius: 0,
        borderColor: graphOptions?.value?.find(({ value }) => value === item)
          ?.color,
        backgroundColor: graphOptions?.value?.find(
          ({ value }) => value === item,
        )?.color,
        data: state.graphData[index],
        yAxisID: `y${index + 1}`,
      };
    }),
  }));

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
      // y: {
      //   grid: {
      //     display: false,
      //   },
      // },
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
      y2: {
        type: "linear",
        display: false,
      },
      y3: {
        type: "linear",
        display: false,
      },
      y4: {
        type: "linear",
        display: false,
      },
      y5: {
        type: "linear",
        display: false,
      },
      y6: {
        type: "linear",
        display: false,
      },
      y7: {
        type: "linear",
        display: false,
      },
      y8: {
        type: "linear",
        display: false,
      },
      // yAxes: [
      //   {
      //     gridLines: {
      //       drawBorder: false,
      //     },
      //   },
      // ],
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
    // options: {
    //   scales: {
    //     yAxes: [
    //       {
    //         gridLines: {
    //           drawBorder: false,
    //         },
    //       },
    //     ],
    //   },
    // },
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
    console.log({ chartValues });
    filter.graphValues = chartValues?.join(",");

    filter.period = period;
    if (period != "custom") {
      delete filter.from;
      delete filter.to;
    }
    loading.value = true;

    try {
      if (period === "custom") return
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
