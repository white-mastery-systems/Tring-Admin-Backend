<template>
  <div class="bot-manage-main-container">
    <div class="header-align">
      <div class="flex items-center">
        <!-- <span> -->
        <!-- <img src="assets\icons\right_arrow.svg" width="20"></img> -->
        <!-- </span> -->
        <span class="align-left text-[20px] font-bold">OverView</span>
      </div>
      <div class="flex items-center justify-end gap-6" style="width: 350px">
        <!-- <span class="calender-align">
          <img src="assets\icons\calendar_month.svg" width="20">
        </span> -->
        <span
          class="right-dropdown-align text-[]"
          style="color: rgba(138, 138, 138, 1)"
          >Filter:
          <span class="text-[14px] font-bold text-black">
            <UiSelect v-model="selectedValue">
              <UiSelectTrigger class="ui-select-trigger w-[110px]">
                <UiSelectValue placeholder="Select a fruit" />
              </UiSelectTrigger>
              <UiSelectContent>
                <UiSelectGroup class="select_list_align">
                  <!-- <UiSelectLabel>Today</UiSelectLabel> -->
                  <UiSelectItem
                    v-for="(list, index) in menuList"
                    :key="index"
                    class="content_align"
                    :value="list.content"
                  >
                    {{ list.content }}
                  </UiSelectItem>
                </UiSelectGroup>
              </UiSelectContent>
            </UiSelect>
          </span></span
        >
        <span>
          <img src="assets\icons\export_btn.svg" width="110" />
        </span>
      </div>
    </div>

    <div>
      <div>
        <div class="dashboard-main-paage">
          <div class="card-align">
            <div>
              <img src="assets\icons\chat_bots.svg" width="34" height="34" />
            </div>
            <div>
              <div class="content-align font-semibold">Chat bots</div>
              <div class="text-lg font-bold">1</div>
            </div>
          </div>
          <div class="card-align">
            <div>
              <img src="assets\icons\call_bots.svg" width="34" height="34" />
            </div>
            <div>
              <div class="content-align font-semibold">Call bots</div>
              <div class="text-lg font-bold">1</div>
            </div>
          </div>
          <div class="card-align">
            <div>
              <img src="assets\icons\chat_leads.svg" width="34" height="34" />
            </div>
            <div>
              <div class="content-align font-semibold">Chat Leads</div>
              <div class="text-lg font-bold">140</div>
            </div>
          </div>
          <div class="card-align">
            <div>
              <img src="assets\icons\leads_call.svg" width="34" height="34" />
            </div>
            <div>
              <div class="content-align font-semibold">Call leads</div>
              <div class="text-lg font-bold">250</div>
            </div>
          </div>
        </div>
        <div class="graph-align mt-10 gap-6">
          <div
            class="relative h-[380px] w-[750px] place-content-center rounded-md bg-white shadow"
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
                (tick, i) => {
                  return typeof tick === 'number'
                    ? `${new Intl.NumberFormat('us').format(tick).toString()}`
                    : '';
                }
              "
              class="h-[250px]"
            />
          </div>

          <div
            class="relative h-[380px] w-[450px] place-content-center rounded-md bg-white shadow"
          >
            <UiLabel class="absolute top-4 pl-6 pt-4 text-lg font-bold"
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
          </div>
        </div>
        <div class="dashboard-main-paage">
          <div class="card-align">
            <div>
              <img
                src="assets\icons\chat_sessions.svg"
                width="34"
                height="34"
              />
            </div>
            <div>
              <div class="content-align font-semibold">Chat Sessions</div>
              <div class="text-lg font-bold">612</div>
            </div>
          </div>
          <div class="card-align">
            <div>
              <img src="assets\icons\total_calls.svg" width="34" height="34" />
            </div>
            <div>
              <div class="content-align font-semibold">Total Calls</div>
              <div class="text-lg font-bold">4,689</div>
            </div>
          </div>
          <div class="card-align">
            <div>
              <img
                src="assets\icons\call_duration.svg"
                width="34"
                height="34"
              />
            </div>
            <div>
              <div class="content-align font-semibold">Call Duration</div>
              <div class="text-lg font-bold">742 mins</div>
            </div>
          </div>
          <div class="card-align">
            <div>
              <img
                src="assets\icons\unique_sessions.svg"
                width="34"
                height="34"
              />
            </div>
            <div>
              <div class="content-align font-semibold">Unique Sessions</div>
              <div class="text-lg font-bold">413</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { VisBulletLegend } from "@unovis/vue";

  definePageMeta({
    middleware: "admin-only",
  });

  const selectedValue = ref("Today");

  const dataList = ref([
    {
      _id: 1,
      userName: "user1sdf",
      bot: "Yourstore Bot-1",
      createAt: "12.02.2024",
      status: true,
      Processing: false,
    },
    {
      userName: "user2",
      _id: 2,
      bot: "Yourstore Bot-2 testing bot sdfdsf saf sdf",
      createAt: "15.02.2024",
      status: false,
      Processing: true,
    },
    {
      userName: "user3",
      _id: 3,
      bot: "Yourstore Bot-2 testing bot sdfdsf saf sdf",
      createAt: "15.02.2024",
      status: false,
      Processing: false,
    },
    {
      userName: "user4",
      _id: 4,
      bot: "Yourstore Bot-2 testing bot sdfdsf saf sdf",
      createAt: "15.02.2024",
      status: true,
      Processing: false,
    },
    {
      userName: "user5",
      _id: 5,
      bot: "Yourstore Bot-2 testing bot sdfdsf saf sdf",
      createAt: "15.02.2024",
      status: false,
      Processing: false,
    },
  ]);
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
  .bot-manage-main-container {
    padding: 0px 25px;
  }

  .header-align {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 20px;
    /* border-bottom: 0.5px solid rgba(181, 181, 181, 1); */
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
  .dashboard-main-container {
    padding: 15px;
    /* width: 100%; */
  }

  /* .header-align {
  display: flex;
  align-items: center;
  justify-content: space-between;
} */

  .right-dropdown-align {
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 1);
    padding: 0px 10px;
    width: 150px !important;
    box-shadow: 0px 2px 24px 0px rgba(0, 0, 0, 0.05) !important;
    border-radius: 10px;
  }

  .dashboard-main-paage {
    /* margin-top: 15px; */
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
    /* filter: blur(10px); */
    height: 59vh;
  }
</style>
