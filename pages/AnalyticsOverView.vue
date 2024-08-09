<template>
  <div class="bot-manage-main-container">
    <div class="header-align">
      <div class="flex items-center">
        <!-- <span> -->
          <!-- <img src="assets\icons\right_arrow.svg" width="20"></img> -->
        <!-- </span> -->
        <span class="font-bold text-[20px] align-left">OverView</span>
      </div>
      <div class="flex items-center justify-end" style="width: 350px;">
        <!-- <span class="calender-align">
          <img src="assets\icons\calendar_month.svg" width="20">
        </span> -->
        <span class="right-dropdown-align text-[]" style="color: rgba(138, 138, 138, 1)">Filter: <span
            class="font-bold text-black text-[14px]">
            <UiSelect v-model="selectedValue">
              <UiSelectTrigger class="w-[110px] ui-select-trigger">
                <UiSelectValue placeholder="Select a fruit" />
              </UiSelectTrigger>
              <UiSelectContent>
                <UiSelectGroup class="select_list_align">
                  <!-- <UiSelectLabel>Today</UiSelectLabel> -->
                  <UiSelectItem v-for="(list, index) in menuList" :key="index" class="content_align"
                    :value="list.content">
                    {{ list.content }}
                  </UiSelectItem>
                </UiSelectGroup>
              </UiSelectContent>
            </UiSelect>
          </span></span>
        <span>
          <img src="assets\icons\export_btn.svg" width="110">
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
              <div class="font-semibold content-align">Chat bots</div>
              <div class="font-bold text-lg">1</div>
            </div>
          </div>
          <div class="card-align">
            <div>
              <img src="assets\icons\call_bots.svg" width="34" height="34" />
            </div>
            <div>
              <div class="font-semibold content-align">Call bots</div>
              <div class="font-bold text-lg">1</div>
            </div>
          </div>
          <div class="card-align">
            <div>
              <img src="assets\icons\chat_leads.svg" width="34" height="34" />
            </div>
            <div>
              <div class="font-semibold content-align">Chat Leads</div>
              <div class="font-bold text-lg">140</div>
            </div>
          </div>
          <div class="card-align">
            <div>
              <img src="assets\icons\leads_call.svg" width="34" height="34" />
            </div>
            <div>
              <div class="font-semibold content-align">Call leads</div>
              <div class="font-bold text-lg">250</div>
            </div>
          </div>
        </div>
        <div class="graph-align">
          <span>
            <img src="assets\icons\Graph_left.svg" width="500">
          </span>
          <span>
            <img src="assets\icons\graph_right.svg" width="400">
          </span>
        </div>
        <div class="dashboard-main-paage">
          <div class="card-align">
            <div>
              <img src="assets\icons\chat_sessions.svg" width="34" height="34" />
            </div>
            <div>
              <div class="font-semibold content-align">Chat Sessions</div>
              <div class="font-bold text-lg">612</div>
            </div>
          </div>
          <div class="card-align">
            <div>
              <img src="assets\icons\total_calls.svg" width="34" height="34" />
            </div>
            <div>
              <div class="font-semibold content-align">Total Calls</div>
              <div class="font-bold text-lg">4,689</div>
            </div>
          </div>
          <div class="card-align">
            <div>
              <img src="assets\icons\call_duration.svg" width="34" height="34" />
            </div>
            <div>
              <div class="font-semibold content-align">Call Duration</div>
              <div class="font-bold text-lg">742 mins</div>
            </div>
          </div>
          <div class="card-align">
            <div>
              <img src="assets\icons\unique_sessions.svg" width="34" height="34" />
            </div>
            <div>
              <div class="font-semibold content-align">Unique Sessions</div>
              <div class="font-bold text-lg">413</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const selectedValue = ref('Today')

const dataList = ref([
  {
    _id: 1,
    userName: 'user1sdf',
    bot: 'Yourstore Bot-1',
    createAt: '12.02.2024',
    status: true,
    Processing: false,
  }, {
    userName: 'user2',
    _id: 2,
    bot: 'Yourstore Bot-2 testing bot sdfdsf saf sdf',
    createAt: '15.02.2024',
    status: false,
    Processing: true,
  }, {
    userName: 'user3',
    _id: 3,
    bot: 'Yourstore Bot-2 testing bot sdfdsf saf sdf',
    createAt: '15.02.2024',
    status: false,
    Processing: false,
  }, {
    userName: 'user4',
    _id: 4,
    bot: 'Yourstore Bot-2 testing bot sdfdsf saf sdf',
    createAt: '15.02.2024',
    status: true,
    Processing: false,
  }, {
    userName: 'user5',
    _id: 5,
    bot: 'Yourstore Bot-2 testing bot sdfdsf saf sdf',
    createAt: '15.02.2024',
    status: false,
    Processing: false,
  },
])
const menuList = ref([
  {
    content: 'Today',
    value: 'Today',
  }, {
    content: 'Weekly',
    value: 'Weekly',
  }, {
    content: 'Monthly',
    value: 'Monthly',
  }, {
    content: 'Quarterly',
    value: 'Quarterly',
  }, {
    content: 'Halfyearly',
    value: 'Halfyearly',
  }, {
    content: 'Yearly',
    value: 'Yearly',
  },
])
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
  filter: blur(10px);
  height: 59vh;
}
</style>