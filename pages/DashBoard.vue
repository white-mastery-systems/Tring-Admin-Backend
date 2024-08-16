<template>
  <div class="dashboard-main-container">
    <div class="header-align">
      <span class="text-[20px] font-bold">Dashboard</span>
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
      <div class="dashboard-main-paage">
        <div class="card-align">
          <div>
            <img
              src="assets\icons\contact_count_icon.svg"
              width="34"
              height="34"
            />
          </div>
          <div>
            <div class="content-align font-semibold">Chat Bots</div>
            <div class="text-lg font-bold">{{ analyticsData?.bots }}</div>
          </div>
        </div>
        <div class="card-align">
          <div>
            <img
              src="assets\icons\contact_count_icon.svg"
              width="34"
              height="34"
            />
          </div>
          <div>
            <div class="content-align font-semibold">Chat Sessions</div>
            <div class="text-lg font-bold">{{ analyticsData?.chats }}</div>
          </div>
        </div>
        <div class="card-align">
          <div>
            <img
              src="assets\icons\contact_count_icon.svg"
              width="34"
              height="34"
            />
          </div>
          <div>
            <div class="content-align font-semibold">Chat Leads</div>
            <div class="text-lg font-bold">{{ analyticsData?.leads }}</div>
          </div>
        </div>
        <div class="card-align">
          <div>
            <img
              src="assets\icons\contact_count_icon.svg"
              width="34"
              height="34"
            />
          </div>
          <div>
            <div class="content-align font-semibold">Unique Sessions</div>
            <div class="text-lg font-bold">{{ analyticsData?.users }}</div>
          </div>
        </div>
      </div>
      <div class="relative">
        <div :class="'graph-align my-8 gap-6'">
          <div
            v-if="analyticsData?.bots > 0"
            class="chat-bot-align relative place-content-center rounded-md bg-white shadow"
          >
            <UiLabel class="absolute top-6 pb-1 pl-6 text-lg font-bold"
              >Chat Bot</UiLabel
            >
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
          <!-- <div
            class="voice-bot-align relative place-content-center rounded-md bg-white shadow"
          >
            <UiLabel class="absolute top-6 pl-6 text-lg font-bold"
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
        <UiButton
          v-if="analyticsData?.bots === 0"
          class="absolute right-1/2 top-1/2 z-10 h-16 w-56 -translate-y-1/2 translate-x-1/2 bg-[#474df9] text-lg text-white hover:bg-[#474df9] hover:brightness-90"
          @click="getStarted"
          >Get Started</UiButton
        >
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { VisBulletLegend } from "@unovis/vue";

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
      navigateTo("/BotManagement");
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
  .dashboard-main-container {
    padding: 0px 25px;
    /* width: 100%; */
    height: calc(100vh - 30px);
    /* overflow-y: scroll; */
  }

  .header-align {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 20px;
  }

  .right-dropdown-align {
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 1);
    padding: 0px 10px;
    width: 200px !important;
    box-shadow: 0px 2px 24px 0px rgba(0, 0, 0, 0.05) !important;
    border-radius: 10px;
  }

  .dashboard-main-paage {
    /* margin-top: 30px; */
    display: flex;
    align-items: center;
    gap: 30px;
  }

  .card-align {
    display: flex;
    align-items: center;
    padding: 10px 10px 10px 25px;
    width: 25%;
    height: 100px;
    gap: 15px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 2px 24px 0px rgba(0, 0, 0, 0.05) !important;
    border-radius: 10px;
  }

  .content-align {
    margin-bottom: 5px;
    color: rgba(138, 138, 138, 1);
  }

  .graph-align {
    display: flex;
    height: 59vh;
  }
  .calender-align {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 40px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 2px 24px 0px rgba(0, 0, 0, 0.05) !important;
    border-radius: 10px;
  }
  .chat-bot-align {
    width: 100%;
  }
  .voice-bot-align {
    width: 40%;
  }
  /* .select_list_align {
  font-weight: 500;
  color: rgba(138, 138, 138, 1);
}
.content_align:focus {
  font-weight: 700;
  color: rgba(255, 188, 66, 1);
  background: rgba(255, 248, 235, 1);
} */
</style>
