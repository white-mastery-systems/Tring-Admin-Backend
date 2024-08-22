<template>
  <div class="py-0 px-[25px] ">
    <div class="flex items-center justify-between pb-[20px]">
      <span class="text-[23px] font-bold">Dashboard</span>
      <div class="flex items-center gap-3">
        <!-- <span class="calender-align">
          <img src="assets\icons\calendar_month.svg" width="20">
        </span> -->
        <!-- <span class="right-dropdown-align text-[15px]" style="color: rgba(138, 138, 138, 1)">Summary:
          <span class="font-bold text-black">
            <UiSelect v-model="selectedValue" class="outline-none">
              <UiSelectTrigger class="ui-select-trigger w-[110px] outline-none">
                <UiSelectValue />
              </UiSelectTrigger>
              <UiSelectContent>
                <UiSelectGroup class="select_list_align">
                  <UiSelectItem v-for="(list, index) in menuList" :key="index" class="content_align"
                    :value="list.content">
                    {{ list.content }}
                  </UiSelectItem>
                </UiSelectGroup>
              </UiSelectContent>
            </UiSelect>
          </span>
        </span> -->
      </div>
    </div>
    <div>
      <div class="grid gap-6
         grid-cols-1
         md:grid-cols-2
         xs:grid-cols-2
         lg:grid-cols-4
         ">
        <div class="field_shadow flex items-center min-h-[120px] gap-6 bg-white rounded-[10px] p-4">
          <div class="rounded-md bg-[#ffbc42] p-2">
            <BotIcon />
          </div>
          <div>
            <div class="text-gray-500 font-semibold text-[16px] mb-1">Chat Bots</div>
            <div class="font-extrabold text-3xl text-black">{{ analyticsData?.bots }}</div>
          </div>
        </div>

        <div class="field_shadow flex items-center min-h-[120px] gap-6 bg-white rounded-[10px] p-4">
          <div class="rounded-md bg-[#ffbc42] p-2">
            <ChatSession />
          </div>
          <div>
            <div class="text-gray-500 font-semibold text-[16px] mb-1">Chat Sessions</div>
            <div class="font-extrabold  text-3xl text-black">{{ analyticsData?.chats }}</div>
          </div>
        </div>

        <div class="field_shadow flex items-center min-h-[120px] gap-6 bg-white rounded-[10px] p-4">
          <div class="rounded-md bg-[#ffbc42] p-2">
            <Leads />
          </div>
          <div>
            <div class="text-gray-500 font-semibold text-[16px] mb-1">Chat Leads</div>
            <div class="font-extrabold text-3xl text-black">{{ analyticsData?.leads }}</div>
          </div>
        </div>

        <div class="field_shadow flex items-center min-h-[120px] gap-6 bg-white rounded-[10px] p-4">
          <div class="rounded-md bg-[#ffbc42] p-2">
            <SingleUser />
          </div>
          <div>
            <div class="text-gray-500 font-semibold text-[16px] mb-1">Unique Sessions</div>
            <div class="font-extrabold text-3xl text-black">{{ analyticsData?.users }}</div>
          </div>
        </div>
      </div>

      <div class="relative">
        <div class="field_shadow flex h-[59vh] pb-[20px] rounded-[10px]  my-8 gap-6">
          <div v-if="analyticsData?.bots > 0" class="w-full relative place-content-center rounded-md bg-white">
            <UiLineChart :data="lineGraphData" index="month" :categories="['Leads Created', 'Sessions Created']"
              :colors="['#424bd1', '#ffbc42']" :show-grid-line="true" :show-tooltip="true" :margin="{ right: 20 }"
              :y-formatter="(tick: any) => {
                  return typeof tick === 'number'
                    ? `${new Intl.NumberFormat('us').format(tick).toString()}`
                    : '';
                }
                " class="h-[380px] w-full" />
          </div>
          <!-- <div
            class="voice-bot-align relative place-content-center rounded-md bg-white shadow"
          >
            <UiLabel class="absolute top-6 pl-6 text-lg font-extrabold"
              >Voice Bot</UiLabel
            >
            <VisBulletLegend
              :items="chartDataItems"
              class="absolute right-6 top-10 flex flex-col pt-3"
            />
            <UiDonutChart
              index="name"
              :category="'total'"
              :data="chartsData"
              :colors="['#ffbc42', '#424bd1']"
              :arc-width="50"
            >
            </UiDonutChart>
          </div> -->
        </div>
        <!-- <UiLabel class="absolute right-1/3 top-1/3 z-10  -translate-x-3/4 -translate-y-1/3 text-lg">Getting Started by Creating Bots</UiLabel> -->
        <UiButton v-if="analyticsData?.bots === 0"
          class="absolute right-1/2 top-1/2 z-10 h-16 w-56 -translate-y-1/2 translate-x-1/2 bg-[#474df9] text-lg text-white hover:bg-[#474df9] hover:brightness-90"
          @click="getStarted">Get Started</UiButton>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import Leads from "~/components/icons/Leads.vue";

definePageMeta({
  middleware: "user",
});

const selectedValue = ref("Today");

const getButtonName = ref("Get Started");

const analyticsData = ref();

onMounted(async () => {
  analyticsData.value = await getAnalyticsData();

  // analyticsData.value.bots = 0;
});

const getStarted = () => {
  if (analyticsData.value.bots === 0) {
    navigateTo("/bots");
  }
};

interface MonthAbbreviations {
  [key: string]: string;
}

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Define a mapping of month abbreviations to full names for comparison
const monthAbbreviations: MonthAbbreviations = {
  Jan: "January",
  Feb: "February",
  Mar: "March",
  Apr: "April",
  May: "May",
  Jun: "June",
  Jul: "July",
  Aug: "August",
  Sep: "September",
  Oct: "October",
  Nov: "November",
  Dec: "December",
};

// Initialize an empty array for the final data
// console.log(
const leadsData = computed(() => analyticsData.value?.graph.leads);
const leadGraphData = computed(() =>
  months.map((month) => {
    // Find the corresponding API data for the current month and year
    const apiEntry = leadsData.value?.find((entry: any) => {
      const [apiMonthAbbr, apiYear] = entry.month.split(" ");
      console.log(apiMonthAbbr, apiYear, "API");
      const apiMonthFull =
        monthAbbreviations[apiMonthAbbr as keyof MonthAbbreviations];
      return month === apiMonthFull && apiYear === "2024"; // Adjust year if necessary
    });

    // Extract the year from the first entry of the API data, or use a default value
    const year =
      leadsData.value?.length > 0
        ? leadsData.value[0].month.split(" ")[1]
        : "2024";

    console.log(year, apiEntry);

    return {
      month: `${month} ${year}`,
      "Leads Created": apiEntry ? parseInt(apiEntry.count, 10) : 0,
    };
  }),
);

const sessionsData = computed(() => analyticsData.value?.graph.sessions);
const sessionGraphData = computed(() =>
  months.map((month) => {
    // Find the corresponding API data for the current month and year
    const apiEntry = sessionsData.value?.find((entry: any) => {
      const [apiMonthAbbr, apiYear] = entry.month.split(" ");
      console.log(apiMonthAbbr, apiYear, "API");
      const apiMonthFull =
        monthAbbreviations[apiMonthAbbr as keyof MonthAbbreviations];
      return month === apiMonthFull && apiYear === "2024"; // Adjust year if necessary
    });

    // Extract the year from the first entry of the API data, or use a default value
    const year =
      leadsData.value?.length > 0
        ? leadsData.value[0].month.split(" ")[1]
        : "2024";

    console.log(year, apiEntry);

    return {
      month: `${month} ${year}`,
      "Sessions Created": apiEntry ? parseInt(apiEntry.count, 10) : 0,
    };
  }),
);
const lineGraphData = computed(() =>
  sessionGraphData.value.map((s) => {
    const lead = leadGraphData.value.find((l) => l.month === s.month);
    return {
      month: s.month,
      "Leads Created": lead ? lead["Leads Created"] : 0,
      "Sessions Created": s["Sessions Created"],
    };
  }),
);
// );
</script>
<style scoped>
.focus\:ring-offset-2:focus {
  --tw-ring-offset-width: none;
}
</style>
