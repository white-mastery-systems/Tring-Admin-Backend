<template>
  <Page :disable-elevation="true" title="Dashboard" :disableSelector="true" :disable-back-button="true">
    <template #actionButtons>
      <span class="field_shadow flex items-center rounded-lg text-[15px]" style="color: rgba(138, 138, 138, 1)">
        <!-- <span class="flex -items-center py-2 pl-2"></span> -->
        <span class="font-bold text-black">
          <UiSelect v-model="selectedValue" class="outline-none">
            <UiSelectTrigger
              class="ui-select-trigger flex w-[70px] items-center gap-2 text-[10px] outline-none sm:w-[80px] sm:text-[10px] md:w-[200px] md:text-[14px] lg:w-[200px] lg:text-[14px] xl:w-[200px] xl:text-[14px]">
              <span class="font-thin text-gray-400"> Summary </span>
              <UiSelectValue />
            </UiSelectTrigger>
            <UiSelectContent>
              <UiSelectGroup>
                <UiSelectItem v-for="(list, index) in dateFilters" :key="index" class="content_align pr-2"
                  :value="list.value">
                  {{ list.content }}
                </UiSelectItem>
              </UiSelectGroup>
            </UiSelectContent>
          </UiSelect>
        </span>
      </span>
    </template>
    <div>
      <div class="xs:grid-cols-2 grid grid-cols-2 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div v-if="false" class="field_shadow flex items-center gap-6 rounded-[10px] bg-white px-2 py-3">
          <div class="rounded-md bg-[#ffbc42] p-2">
            <BotIcon />
          </div>
          <div>
            <div class="mb-1 text-[16px] font-semibold text-gray-500">
              Chat Bots
            </div>
            <div class="text-3xl font-extrabold text-black">
              {{ analyticsData?.bots }}
            </div>
          </div>
        </div>
        <StatusCountCard :icon="ChatSession" title="Interacted Chats"
          :count="analyticsData?.interactedChats[0]?.count" />

        <StatusCountCard :icon="ChatSession" title="Chat sessions" :count="analyticsData?.chats" />

        <StatusCountCard :icon="Leads" title="Chat Leads" :count="analyticsData?.leads" />

        <StatusCountCard :icon="SingleUser" title="Unique visitors" :count="analyticsData?.users" />

        <StatusCountCard :icon="ChatSession" title="Calls Scheduled"
          :count="analyticsData?.callScheduledTimeline[0]?.count" />
        <StatusCountCard :icon="ChatSession" title="Site Visits" :count="analyticsData?.siteVisitTimeline[0]?.count" />
        <StatusCountCard :icon="ChatSession" title="Virtual Tours"
          :count="analyticsData?.virtualTourTimeline[0]?.count" />
        <StatusCountCard :icon="ChatSession" title="Location Visited"
          :count="analyticsData?.locationTimeline[0]?.count" />
      </div>

      <!-- <div class="relative">
        <div
          class="field_shadow my-8 flex h-[59vh] gap-6 rounded-[10px] pb-[20px]"
        >
          <div class="relative w-full place-content-center rounded-md bg-white">
            <UiLineChart
              :data="lineGraphData"
              index="month"
              :categories="['Leads Created', 'Sessions Created']"
              :colors="['#424bd1', '#ffbc42']"
              :show-grid-line="true"
              :show-tooltip="true"
              :margin="{ right: 20 }"
              :y-formatter="
                (tick: any) => {
                  return typeof tick === 'number'
                    ? `${new Intl.NumberFormat('us').format(tick).toString()}`
                    : '';
                }
              "
              class="h-[380px] w-full"
            />
          </div>
        </div>
      </div> -->
      <Line class="shadow-md relative mt-4 w-full place-content-center rounded-md bg-white" :data="chartData"
        :options="chartOptions" />
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

const selectedValue = ref("last-30-days");
  const analyticsData = ref();
const dateFilters = reactive([
  {
    content: "Today",
    value: "today",
  }, {
    content: "Yesterday",
    value: "yesterday",
  }, {
    content: "Last 7 days",
    value: "last-7-days",
  }, {
    content: "Last 30 days",
    value: "last-30-days",
  }, {
    content: "Current month",
    value: "current-month",
  }, {
    content: "Last month",
    value: "last-month",
  }, {
    content: "Current year",
    value: "current-year",
  }, {
    content: "Last year",
    value: "last-year",
  }, {
    content: "Current financial year",
    value: "current-financial-year",
  }, {
    content: "Last financial year",
    value: "last-financial-year",
  }, {
    content: "All time",
    value: "all-time",
  },
]);
  const labels = ref([
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
  ]);
  const leadsGraphData = ref([]);
  const sessionsGraphData = ref([]);
  watch(analyticsData, (newValue, oldValue) => {
    leadsGraphData.value = newValue.graph.leads?.map((item: any) => item.count);
    sessionsGraphData.value = newValue.graph.sessions?.map(
      (item: any) => item.count,
    );
    labels.value = newValue.graph.leads?.map((item: any) => item.date);
  });
  const chartData = computed(() => ({
    labels: labels.value,
    datasets: [
      {
        label: "Sessions",
        borderColor: "#424bd1",
        backgroundColor: "#424bd1",
        data: sessionsGraphData.value,
        yAxisID: "y",
        tension: 0.4,
        pointRadius: 0,
      },
      {
        label: "Leads",
        borderColor: "#ffbc42",
        backgroundColor: "#ffbc42",
        data: leadsGraphData.value,
        yAxisID: "y1",
        tension: 0.4,
        pointRadius: 0,
      },
    ],
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
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        grid: {
          display: false,
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

  // const getButtonName = ref("Get Started");

  watch(selectedValue, async (period) => {
    const data = await getAnalyticsData(period);
    console.log({ data });
    analyticsData.value = data;
  });

  onMounted(async () => {
    analyticsData.value = await getAnalyticsData();

    // analyticsData.value.bots = 0;
  });

  const getStarted = () => {
    if (analyticsData.value.bots === 0) {
      navigateTo("/bots");
    }
  };

  // interface MonthAbbreviations {
  //   [key: string]: string;
  // }

  // const months = [
  //   "January",
  //   "February",
  //   "March",
  //   "April",
  //   "May",
  //   "June",
  //   "July",
  //   "August",
  //   "September",
  //   "October",
  //   "November",
  //   "December",
  // ];

  // // Define a mapping of month abbreviations to full names for comparison
  // const monthAbbreviations: MonthAbbreviations = {
  //   Jan: "January",
  //   Feb: "February",
  //   Mar: "March",
  //   Apr: "April",
  //   May: "May",
  //   Jun: "June",
  //   Jul: "July",
  //   Aug: "August",
  //   Sep: "September",
  //   Oct: "October",
  //   Nov: "November",
  //   Dec: "December",
  // };

  // Initialize an empty array for the final data
  // console.log(
  // const leadsData = computed(() => analyticsData.value?.graph.leads);
  // const leadGraphData = computed(() =>
  //   months.map((month) => {
  //     // Find the corresponding API data for the current month and year
  //     const apiEntry = leadsData.value?.find((entry: any) => {
  //       const [apiMonthAbbr, apiYear] = entry.month.split(" ");
  //       console.log(apiMonthAbbr, apiYear, "API");
  //       const apiMonthFull =
  //         monthAbbreviations[apiMonthAbbr as keyof MonthAbbreviations];
  //       return month === apiMonthFull && apiYear === "2024"; // Adjust year if necessary
  //     });

  //     // Extract the year from the first entry of the API data, or use a default value
  //     const year =
  //       leadsData.value?.length > 0
  //         ? leadsData.value[0].month.split(" ")[1]
  //         : "2024";

  //     console.log(year, apiEntry);

  //     return {
  //       month: `${month} ${year}`,
  //       "Leads Created": apiEntry ? parseInt(apiEntry.count, 10) : 0,
  //     };
  //   }),
  // );

  // const sessionsData = computed(() => analyticsData.value?.graph.sessions);
  // const sessionGraphData = computed(() =>
  //   months.map((month) => {
  //     // Find the corresponding API data for the current month and year
  //     const apiEntry = sessionsData.value?.find((entry: any) => {
  //       const [apiMonthAbbr, apiYear] = entry.month.split(" ");
  //       console.log(apiMonthAbbr, apiYear, "API");
  //       const apiMonthFull =
  //         monthAbbreviations[apiMonthAbbr as keyof MonthAbbreviations];
  //       return month === apiMonthFull && apiYear === "2024"; // Adjust year if necessary
  //     });

  //     // Extract the year from the first entry of the API data, or use a default value
  //     const year =
  //       leadsData.value?.length > 0
  //         ? leadsData.value[0].month.split(" ")[1]
  //         : "2024";

  //     console.log(year, apiEntry);

  //     return {
  //       month: `${month} ${year}`,
  //       "Sessions Created": apiEntry ? parseInt(apiEntry.count, 10) : 0,
  //     };
  //   }),
  // );
  // const lineGraphData = computed(() =>
  //   sessionGraphData.value.map((s) => {
  //     const lead = leadGraphData.value.find((l) => l.month === s.month);
  //     return {
  //       month: s.month,
  //       "Leads Created": lead ? lead["Leads Created"] : 0,
  //       "Sessions Created": s["Sessions Created"],
  //     };
  //   }),
  // );
</script>
<style scoped>
  .focus\:ring-offset-2:focus {
    --tw-ring-offset-width: none;
  }
</style>
