<template>
  <div class="dashboard-main-container">
    <div class="header-align">
      <span class="font-bold text-[20px]">Dashboard</span>
      <span class="right-dropdown-align text-[15px]" style="color: rgba(138, 138, 138, 1)">Summary: <span
          class="font-bold text-black">
          <UiSelect v-model="selectedValue" class="outline-none">
            <UiSelectTrigger class="w-[110px] ui-select-trigger outline-none">
              <UiSelectValue />
            </UiSelectTrigger>
            <UiSelectContent>
              <UiSelectGroup class="select_list_align">
                <!-- <UiSelectLabel>Today</UiSelectLabel> -->
                <UiSelectItem v-for="(list, index) in menuList" :key="index" class="content_align" :value="list.content">
                  {{ list.content }}
                </UiSelectItem>
              </UiSelectGroup>
            </UiSelectContent>
          </UiSelect>
        </span></span>
    </div>
    <div>
      <div class="dashboard-main-paage">
        <div class="card-align">
          <div>
            <img src="assets\icons\contact_count_icon.svg" width="34" height="34" />
          </div>
          <div>
            <div class="font-semibold content-align">Chat bots</div>
            <div class="font-bold text-lg">1</div>
          </div>
        </div>
        <div class="card-align">
          <div>
            <img src="assets\icons\contact_count_icon.svg" width="34" height="34" />
          </div>
          <div>
            <div class="font-semibold content-align">Call bots</div>
            <div class="font-bold text-lg">1</div>
          </div>
        </div>
        <div class="card-align">
          <div>
            <img src="assets\icons\contact_count_icon.svg" width="34" height="34" />
          </div>
          <div>
            <div class="font-semibold content-align">Chat Leads</div>
            <div class="font-bold text-lg">1</div>
          </div>
        </div>
        <div class="card-align">
          <div>
            <img src="assets\icons\contact_count_icon.svg" width="34" height="34" />
          </div>
          <div>
            <div class="font-semibold content-align">Call leads</div>
            <div class="font-bold text-lg">1</div>
          </div>
        </div>
      </div>
      <div class="graph-align">
        <span>
          <img src="assets\icons\Graph_left.svg" width="600">
        </span>
        <span>
          <img src="assets\icons\graph_right.svg" width="400">
        </span>
      </div>
      <div class="dashboard-main-paage">
        <div class="card-align">
          <div>
            <img src="assets\icons\contact_count_icon.svg" width="34" height="34" />
          </div>
          <div>
            <div class="font-semibold content-align">Chat Sessions</div>
            <div class="font-bold text-lg">612</div>
          </div>
        </div>
        <div class="card-align">
          <div>
            <img src="assets\icons\contact_count_icon.svg" width="34" height="34" />
          </div>
          <div>
            <div class="font-semibold content-align">Total Calls</div>
            <div class="font-bold text-lg">4,689</div>
          </div>
        </div>
        <div class="card-align">
          <div>
            <img src="assets\icons\contact_count_icon.svg" width="34" height="34" />
          </div>
          <div>
            <div class="font-semibold content-align">Call Duration</div>
            <div class="font-bold text-lg">742 mins</div>
          </div>
        </div>
        <div class="card-align">
          <div>
            <img src="assets\icons\contact_count_icon.svg" width="34" height="34" />
          </div>
          <div>
            <div class="font-semibold content-align">Unique Sessions</div>
            <div class="font-bold text-lg">413</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  const selectedValue = ref('Today')
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
.dashboard-main-container {
  padding: 0px 15px;
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
  filter: blur(10px);
  height: 59vh;
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