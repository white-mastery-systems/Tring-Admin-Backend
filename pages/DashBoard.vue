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
        <div
          :class="[
            analyticsData?.bots === 0 || analyticsData?.leads === 0
              ? 'blur-md'
              : '',
            'graph-align my-8 gap-6',
          ]"
        >
          <div
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
        <UiButton
          v-if="analyticsData?.bots === 0 || analyticsData?.leads === 0"
          class="absolute right-1/2 top-1/2 z-10 h-16 w-56 -translate-y-1/2 translate-x-1/2 bg-[#474df9] text-lg text-white hover:bg-[#474df9] hover:brightness-90"
          @click="getStarted"
          >{{
            analyticsData?.bots === 0 && analyticsData?.leads === 0
              ? "Get Started"
              : "Manage Bots"
          }}</UiButton
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
  });

  const getStarted = () => {
    if (analyticsData.value.bots === 0) {
      navigateTo("/BotManagement");
    } else if (analyticsData.value.leads === 0) {
      navigateTo("/AnalyticsLeads");
    }
  };

  const menuList = ref([
    {
      content: "Today",
      value: "Today",
    },
    {
      content: "Weekly",
      value: "Weekly",
    },
    {
      content: "Monthly",
      value: "Monthly",
    },
    {
      content: "Quarterly",
      value: "Quarterly",
    },
    {
      content: "Halfyearly",
      value: "Halfyearly",
    },
    {
      content: "Yearly",
      value: "Yearly",
    },
  ]);

  // interface MonthAbbreviations {
  //   [key: string]: string;
  // }

  // const apiData = analyticsData.value.lead_count;

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
  // const lineGraphData = months.map((month, index) => {
  //   // Find the corresponding API data for the current month and year
  //   const apiEntry = apiData.find((entry: any) => {
  //     const [apiMonthAbbr, apiYear] = entry.month.split(" ");
  //     const apiMonthFull =
  //       monthAbbreviations[apiMonthAbbr as keyof MonthAbbreviations];
  //     return month === apiMonthFull && apiYear === "2024"; // Adjust year if necessary
  //   });

  //   // Extract the year from the first entry of the API data, or use a default value
  //   const year = apiData.length > 0 ? apiData[0].month.split(" ")[1] : "2024";

  //   return {
  //     month: `${month} ${year}`,
  //     "Leads Created": apiEntry ? parseInt(apiEntry.lead_count, 10) : 0,
  //     "Sessions Created": 0, // Adjust this value if you have sessions data
  //   };
  // });

  const lineGraphData = [
    {
      month: "January",
      "Leads Created": 150,
      "Sessions Created": 250,
    },
    {
      month: "February",
      "Leads Created": 180,
      "Sessions Created": 280,
    },
    {
      month: "March",
      "Leads Created": 210,
      "Sessions Created": 320,
    },
    {
      month: "April",
      "Leads Created": 190,
      "Sessions Created": 300,
    },
    {
      month: "May",
      "Leads Created": 220,
      "Sessions Created": 340,
    },
    {
      month: "June",
      "Leads Created": 250,
      "Sessions Created": 380,
    },
    {
      month: "July",
      "Leads Created": 280,
      "Sessions Created": 420,
    },
    {
      month: "August",
      "Leads Created": 260,
      "Sessions Created": 400,
    },
    {
      month: "September",
      "Leads Created": 240,
      "Sessions Created": 360,
    },
    {
      month: "October",
      "Leads Created": 230,
      "Sessions Created": 350,
    },
    {
      month: "November",
      "Leads Created": 200,
      "Sessions Created": 310,
    },
    {
      month: "December",
      "Leads Created": 170,
      "Sessions Created": 270,
    },
  ];

  const chartsData = [
    {
      name: "Total Leads",
      total: 24,
    },
    {
      name: "Total Calls",
      total: 76,
    },
  ];

  const chartDataItems = [
    { name: "Total Leads", color: "#ffbc42" },
    { name: "Total Calls", color: "#424bd1" },
  ];
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
