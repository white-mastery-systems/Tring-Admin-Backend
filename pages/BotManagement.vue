<template>
  <div class="bot-manage-main-container">
    <div class="header-align">
      <span class="font-bold text-[20px]">Bot Management</span>
      <span class="right-dropdown-align text-[15px]" style="color: rgba(138, 138, 138, 1)">Summary: <span
          class="font-bold text-black">
          <!-- <template> -->
          <UiSelect v-model="selectedValue" class="outline-none">
            <UiSelectTrigger class="w-[110px] ui-select-trigger outline-none">
              <UiSelectValue />
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
          <!-- </template> -->
        </span></span>
    </div>
    <div class="bot-main-align">
      <div class="list-header-align">
        <div class="header-content-align">
          <span class="font-semibold content-align">Bot Name</span>
          <span class="font-semibold content-align">Date Created</span>
          <span class="font-semibold content-align">Status</span>
        </div>
      </div>
      <div class="overflow_align">
        <div class="list_align">
          <div class="bot-list-align text-[13px]" v-for="(list, index) in dataList" :key="index"
            @mouseover="listHover(index); previousIndex = index" @mouseout="listHoverOut(index); previousIndex = index"
            @click="async () => {
              await navigateTo('botmanagementdetails')
            }">
            <span class="font-medium bot_name_align">{{ list.bot }}</span>
            <span class="font-medium createAt_align text-black"
              :style="{ 'padding-inline-end': list.status ? '110px' : '123px' }">{{ list.createAt
              }}</span>
            <div v-if="!list.status" class="acive_class font-medium">
              <div class="rounded-full active-circle-align"></div>
              <span>Active</span>
            </div>
            <div v-else class="pl-2 deacive_class font-medium">
              <div class="rounded-full deactive-circle-align"></div>
              <span>Inactive</span>
            </div>
            <!-- v-if="!list.arrowChange" -->
            <div class="pr-4">
              <img src="assets\icons\left_arrow.svg" width="30">
            </div>
            <!-- <div v-else>
              <img src="assets\icons\yellow_left_arrow.svg" width="30">
            </div> -->
          </div>
          <!-- <div>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { index } from 'drizzle-orm/mysql-core';
import { ref } from 'vue'

const selectedValue = ref('Today')
const dataList = ref([
  {
    _id: 1,
    bot: 'Yourstore Bot-1',
    createAt: '12.02.2024',
    status: true,
    arrowChange: false,
  }, {
    _id: 2,
    bot: 'Yourstore Bot-2 testing bot',
    createAt: '15.02.2024',
    status: false,
    arrowChange: false,
  }, {
    _id: 3,
    bot: 'Yourstore Bot-2 testing bot',
    createAt: '15.02.2024',
    status: false,
    arrowChange: false,
  }, {
    _id: 4,
    bot: 'Yourstore Bot-2 testing bot',
    createAt: '15.02.2024',
    status: false,
    arrowChange: false,
  }, {
    _id: 5,
    bot: 'Yourstore Bot-2 testing bot',
    createAt: '15.02.2024',
    status: false,
    arrowChange: false,
  }, {
    _id: 6,
    bot: 'Yourstore Bot-2 testing bot',
    createAt: '15.02.2024',
    status: false,
    arrowChange: false,
  }, {
    _id: 7,
    bot: 'Yourstore Bot-2 testing bot',
    createAt: '15.02.2024',
    status: false,
    arrowChange: false,
  }, {
    _id: 8,
    bot: 'Yourstore Bot-2 testing bot',
    createAt: '15.02.2024',
    status: false,
    arrowChange: false,
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
const previousIndex = ref(0)


const listHover = (index: any) => {
  if (dataList.value[previousIndex.value].arrowChange) dataList.value[index].arrowChange = false
  dataList.value[index].arrowChange = true
} 
const listHoverOut = (index: any) => {
  if (dataList.value[previousIndex.value].arrowChange) dataList.value[index].arrowChange = false
  dataList.value[index].arrowChange = false
}
</script>

<style scoped>
.bot-manage-main-container {
  padding: 15px;
}
.right-dropdown-align {
  display: flex;
  align-items: center;
}
.header-align {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: segoe UI Regular;
}

.bot-main-align {
  padding: 20px;
  margin-top: 30px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 24px 0px rgba(0, 0, 0, 0.05);
  height: calc(100vh - 130px);
  /* overflow-y: scroll; */
}
.ui-select-trigger {
  font-weight: 500;
  /* color: rgba(138, 138, 138, 1); */
}
.focus\:ring-offset-2:focus {
  --tw-ring-offset-width: none;
}
.content-align {
  /* width: 100px !important; */
  margin-bottom: 5px;
  color: rgba(138, 138, 138, 1);
}

.list-header-align {
  padding: 10px 30px;
  display: flex;
  /* justify-content: space-between; */
  width: 100%;
  /* gap: 100px; */
  border-bottom: 0.5px solid rgba(181, 181, 181, 1);
}
.list_align {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  /* width: 100%; */
  /* background: rgba(255, 255, 255, 1); */
  /* padding: 30px 30px; */
  /* box-shadow: 0px 2px 24px 0px rgba(0, 0, 0, 0.05) !important; */
  border-radius: 10px;
  /* gap: 100px; */
  /* margin: 10px 0; */
}
.overflow_align {
  height: 70vh;
  overflow-y: scroll;
  width: 100%;
}
.bot-list-align {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 255, 255, 1);
  padding: 20px 0px;
  width: 100% !important;
  box-shadow: 0px 2px 24px 0px rgba(0, 0, 0, 0.05) !important;
  border-radius: 10px;
  margin: 20px 0 0 0;
  font-size: 15px;
}
.acive_class {
  display: flex;
  align-items: center;
  color: rgba(26, 187, 0, 1);
  gap: 5px;
  padding-inline-end: 213px;
}
.deacive_class {
  display: flex;
  align-items: center;
  gap: 5px;
  color: rgba(255, 0, 0, 1);
  padding-inline-end: 201px;
}
.active-circle-align {
  display: flex;
  align-items: center;
  background-color: rgba(26, 187, 0, 1);
  width: 5px;
  height: 5px;
}
.deactive-circle-align {
  display: flex;
  align-items: center;
  background-color: rgba(255, 0, 0, 1);
  width: 5px;
  height: 5px;
}
.header-content-align {
  display: flex;
  justify-content: space-between;
  width: 65%;
}
.bot_name_align {
  width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
  padding-inline-start: 30px;
}
.bot-list-align:hover {
  color: rgba(255, 188, 66, 1);
  background: rgba(255, 248, 235, 1) !important;
}
/* .createAt_align {
  padding-inline-end: 114px;
} */
</style>