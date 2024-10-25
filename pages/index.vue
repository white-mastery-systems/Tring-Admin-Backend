<template>
  <Page :disable-elevation="true" title="Dashboard" :disableSelector="true" :disable-back-button="true">
    <template #actionButtons>
      <div class="flex gap-2">
        <span class="field_shadow flex items-center rounded-lg text-[15px]" style="color: rgba(138, 138, 138, 1)">
          <!-- <span class="flex -items-center py-2 pl-2"></span> -->
          <span class="font-bold text-black">
            <UiSelect v-model="selectedValue" class="outline-none">
              <UiSelectTrigger
                class="ui-select-trigger flex items-center gap-2 text-[10px] outline-none sm:w-[80px] sm:text-[10px] md:w-[230px] md:text-[14px] lg:w-[230px] lg:text-[14px] xl:w-[230px] xl:text-[14px]">
                <span class="min-w-[70px] font-thin text-gray-400">
                  Summary
                </span>
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
      <div v-if="analyticsData?.statistics?.length"
        class="xs:grid-cols-2 grid grid-cols-2 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <template v-for="statistics in analyticsData?.statistics?.filter(
            (stat: any) =>
              stat?.apiName !== 'images' && stat?.apiName !== 'brochures',
          )">
          <StatusCountCard v-if="statistics" :icon="ChatSession" :title="statistics.name?.replace('_', ' ')"
            :count="statistics.value" :loading="loading" />
        </template>
      </div>
      <div v-if="loading && !analyticsData?.statistics?.length"
        class="xs:grid-cols-2 grid grid-cols-2 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <template v-for="n in 8" :key="n">
          <StatusCountCard :icon="ChatSession" :title="'Loading...'" :count="0" :loading="loading" />
        </template>
      </div>
      <div class="mt-2 flex cursor-pointer gap-2 overflow-x-scroll">
        <template v-if="analyticsData" v-for="componentValue in analyticsData?.statistics?.filter(
            (stat: any) =>
              stat?.apiName !== 'images' && stat?.apiName !== 'brochures',
          )" :key="componentValue?.apiName">
          <button @click="() => handleEditGraphValues(componentValue)" :class="[
              `shadow-lg flex h-[40px] w-auto items-center gap-2 rounded-md border-[1px] border-gray-200 px-2 text-center text-sm`,
            ]">
            <PlusIcon v-if="!chartValues.includes(componentValue?.apiName)" />
            <MinusIcon v-else />
            <span class="min-w-[100px] capitalize" :style="`color:${componentValue?.color}`">{{
              componentValue?.name?.replace("_", " ") }}</span>
          </button>
        </template>
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

  useHead({
    title: "Dashboard",
  });

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
  const loading = ref(true);

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
  const handleEditGraphValues: any = async (option: any) => {
    let localValue = chartValues.value;
    if (localValue.includes(option.apiName)) {
      const index = localValue.indexOf(option.apiName);
      if ((option.apiName !== "sessions") && (option.apiName !== "leads")) localValue.splice(index, 1);
    } else {
      localValue.push(option.apiName);
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
      state.labels = newValue.graph[0]?.map((item: any) => item.date);
    }

    state.graphData = newValue.graph?.map((graphItem: any) =>
      graphItem?.map((item: any) => item.count),
    );
  });
  let chartData = computed(() => ({
    labels: state.labels,
    datasets: chartValues.value?.map((item: any, index: number) => {
      return {
        label: analyticsData?.value?.statistics?.find(
          ({ apiName }: { apiName: string }) => apiName === item,
        )?.name,
        tension: 0.4,
        pointRadius: 0,
        borderColor: analyticsData?.value?.statistics?.find(
          ({ apiName }: { apiName: string }) => apiName === item,
        )?.color,
        backgroundColor: analyticsData?.value?.statistics?.find(
          ({ apiName }: { apiName: string }) => apiName === item,
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

      y: {
        type: "linear",
        display: true,
        position: "left",
        grid: {
          display: false,
        },
        beginAtZero: true,
        ticks: {
          beginAtZero: true,
          userCallback: function (label, index, labels) {
            // when the floored value is the same as the value we have a whole number
            if (Math.floor(label) === label) {
              return label;
            }
          },
        },
        options: {
          elements: {
            point: {
              radius: 0,
            },
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
        options: {
          elements: {
            point: {
              radius: 0,
            },
          },
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
      y9: {
        type: "linear",
        display: false,
      },
      y10: {
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
    filter.graphValues = chartValues?.join(",");

    filter.period = period;
    if (period != "custom") {
      delete filter.from;
      delete filter.to;
    }
    loading.value = true;

    try {
      if (period === "custom") return;
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
    try {
      analyticsData.value = await getAnalyticsData(filter);
    } catch (e) {
      authHandlers.logout();
    }
    if (analyticsData.value) loading.value = false;
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
