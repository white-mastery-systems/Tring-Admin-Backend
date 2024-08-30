<template>
  <Page :disable-elevation="true" title="Dashboard" :disableSelector="true" :disable-back-button="true">
    <template #actionButtons>
      <span class="flex items-center field_shadow rounded-lg text-[15px]" style="color: rgba(138, 138, 138, 1)">
        <!-- <span class="flex -items-center py-2 pl-2"></span> -->
        <span class="font-bold text-black">
          <UiSelect v-model="selectedValue" class="outline-none">
            <UiSelectTrigger
              class="ui-select-trigger flex w-[70px] sm:w-[80px] md:w-[200px] lg:w-[200px] xl:w-[200px] items-center gap-2 outline-none text-[10px] sm:text-[10px] md:text-[14px] lg:text-[14px] xl:text-[14px]">
              <span class="font-thin text-gray-400"> Summary </span>
              <UiSelectValue />
            </UiSelectTrigger>
            <UiSelectContent>
              <UiSelectGroup>
                <UiSelectItem v-for="(list, index) in menuList" :key="index" class="content_align pr-2"
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
        <div class="field_shadow flex items-center gap-6 rounded-[10px] bg-white px-2 py-3">
          <div class="rounded-md bg-[#ffbc42] p-2">
            <ChatSession />
          </div>
          <div>
            <div
              class="mb-1 text-[10px] sm:text-[10px] md:text-[16px] lg:text-[16px] xl:text-[16px] font-semibold text-gray-500">
              Interacted Chats
            </div>
            <div class="text-xl sm:text-xl md:text-3xl lg:text-3xl xl:text-3xl font-extrabold text-black">
              {{ analyticsData?.interactedChats[0]?.count ?? 0 }}
            </div>
          </div>
        </div>

        <div class="field_shadow flex items-center gap-6 rounded-[10px] bg-white px-2 py-3">
          <div class="rounded-md bg-[#ffbc42] p-2">
            <ChatSession />
          </div>
          <div>
            <div
              class="mb-1 text-[10px] sm:text-[10px] md:text-[16px] lg:text-[16px] xl:text-[16px] font-semibold text-gray-500">
              Chat sessions
            </div>
            <div class="text-xl sm:text-xl md:text-3xl lg:text-3xl xl:text-3xl font-extrabold text-black">
              {{ analyticsData?.chats }}
            </div>
          </div>
        </div>

        <div class="field_shadow flex items-center gap-6 rounded-[10px] bg-white px-2 py-3">
          <div class="rounded-md bg-[#ffbc42] p-2">
            <Leads />
          </div>
          <div>
            <div
              class="mb-1 text-[10px] sm:text-[10px] md:text-[16px] lg:text-[16px] xl:text-[16px] font-semibold text-gray-500">
              Chat Leads
            </div>
            <div class="text-xl sm:text-xl md:text-3xl lg:text-3xl xl:text-3xl font-extrabold text-black">
              {{ analyticsData?.leads }}
            </div>
          </div>
        </div>

        <div class="field_shadow flex items-center gap-6 rounded-[10px] bg-white px-2 py-3">
          <div class="rounded-md bg-[#ffbc42] p-2">
            <SingleUser />
          </div>
          <div>
            <div
              class="mb-1 text-[10px] sm:text-[10px] md:text-[16px] lg:text-[16px] xl:text-[16px] font-semibold text-gray-500">
              Unique visitors
            </div>
            <div class="text-xl sm:text-xl md:text-3xl lg:text-3xl xl:text-3xl font-extrabold text-black">
              {{ analyticsData?.users }}
            </div>
          </div>
        </div>

        <div class="field_shadow flex items-center gap-6 rounded-[10px] bg-white px-2 py-3">
          <div class="rounded-md bg-[#ffbc42] p-2">
            <ChatSession />
          </div>
          <div>
            <div
              class="mb-1 text-[10px] sm:text-[10px] md:text-[16px] lg:text-[16px] xl:text-[16px] font-semibold text-gray-500">
              Call Scheduled
            </div>
            <div class="text-xl sm:text-xl md:text-3xl lg:text-3xl xl:text-3xl font-extrabold text-black">
              {{ analyticsData?.callScheduledTimeline[0]?.count ?? 0 }}
            </div>
          </div>
        </div>
        <div class="field_shadow flex items-center gap-6 rounded-[10px] bg-white px-2 py-3">
          <div class="rounded-md bg-[#ffbc42] p-2">
            <ChatSession />
          </div>
          <div>
            <div
              class="mb-1 text-[10px] sm:text-[10px] md:text-[16px] lg:text-[16px] xl:text-[16px] font-semibold text-gray-500">
              Site Visits
            </div>
            <div class="text-xl sm:text-xl md:text-3xl lg:text-3xl xl:text-3xl font-extrabold text-black">
              {{ analyticsData?.siteVisitTimeline[0]?.count ?? 0 }}
            </div>
          </div>
        </div>
        <div class="field_shadow flex items-center gap-6 rounded-[10px] bg-white px-2 py-3">
          <div class="rounded-md bg-[#ffbc42] p-2">
            <ChatSession />
          </div>
          <div>
            <div
              class="mb-1 text-[10px] sm:text-[10px] md:text-[16px] lg:text-[16px] xl:text-[16px] font-semibold text-gray-500">
              Virtual Tours
            </div>
            <div class="text-xl sm:text-xl md:text-3xl lg:text-3xl xl:text-3xl font-extrabold text-black">
              {{ analyticsData?.virtualTourTimeline[0]?.count ?? 0 }}
            </div>
          </div>
        </div>
        <div class="field_shadow flex items-center gap-6 rounded-[10px] bg-white px-2 py-3">
          <div class="rounded-md bg-[#ffbc42] p-2">
            <ChatSession />
          </div>
          <div>
            <div
              class="mb-1 text-[10px] sm:text-[10px] md:text-[16px] lg:text-[16px] xl:text-[16px] font-semibold text-gray-500">
              Location Visited
            </div>
            <div class="text-xl sm:text-xl md:text-3xl lg:text-3xl xl:text-3xl font-extrabold text-black">
              {{ analyticsData?.locationTimeline[0]?.count ?? 0 }}
            </div>
          </div>
        </div>
      </div>

      <div class="relative">
        <div class="field_shadow my-8 flex h-[59vh] gap-6 rounded-[10px] pb-[20px]">
          <div v-if="analyticsData?.bots > 0" class="relative w-full place-content-center rounded-md bg-white">
            <UiLineChart :data="lineGraphData" index="month" :categories="['Leads Created', 'Sessions Created']"
              :colors="['#424bd1', '#ffbc42']" :show-grid-line="true" :show-tooltip="true" :margin="{ right: 20 }"
              :y-formatter="
                (tick: any) => {
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
        <!-- <UiButton
          v-if="analyticsData?.bots === 0"
          class="absolute right-1/2 top-1/2 z-10 h-16 w-56 -translate-y-1/2 translate-x-1/2 bg-[#474df9] text-lg text-white hover:bg-[#474df9] hover:brightness-90"
          @click="getStarted"
          >Get Started</UiButton
        > -->
      </div>
    </div>
  </Page>
</template>
<script setup lang="ts">
  import Leads from "~/components/icons/Leads.vue";

  definePageMeta({
    middleware: "user",
  });

  const selectedValue = ref("this-month");

  // const getButtonName = ref("Get Started");

  const analyticsData = ref();
  const menuList = ref([
    {
      content: "Today",
      value: "today",
    },
    {
      content: "This Week",
      value: "this-week",
    },
    {
      content: "This Month",
      value: "this-month",
    },
    {
      content: "Last 6 months",
      value: "6-months",
    },
    {
      content: "This Year",
      value: "this-year",
    },
  ]);

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
</script>
<style scoped>
  .focus\:ring-offset-2:focus {
    --tw-ring-offset-width: none;
  }
</style>
