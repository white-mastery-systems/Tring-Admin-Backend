<template>
  <div class="bot-manage-main-container">
    <div class="header-align">
      <span class="font-bold text-lg"> Bot Management </span>
      <span class="right-dropdown-align" style="color: rgba(138, 138, 138, 1)">Summary: <span
          class="font-bold text-black">Today</span></span>
    </div>
    <div class="bot-main-align">
      <div class="list-header-align">
        <div class="header-content-align">
          <div class="flex items-cetner gap-4">
            <span class="font-bold content-align">Yourstore Bot-4</span>
            <div class="acive_class">
              <div class="rounded-full active-circle-align"></div>
              <span>Active</span>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <span class="text-black font-bold">Date Created: <span class="font-normal">12.09.2013</span></span>
            <span>
              <Button class="button-align font-medium">Deactivate Bot</Button>
            </span>
          </div>
          <!-- <span class="font-semibold content-align">Date Created</span>
          <span class="font-semibold content-align">Status</span> -->
        </div>
      </div>
      <div class="bot-list-align" v-for="(list, index) in dataList" :key="index">
        <div class="list_align">
          <span class="font-medium bot_name_align">{{ list.bot }}</span>
          <!-- <span class="font-medium pr-14">{{ list.createAt }}</span> -->
          <!-- <div v-if="list.status" class="pr-3 acive_class font-medium">
            <div class="rounded-full active-circle-align"></div>
            <span>Active</span>
          </div>
          <div v-else class="pl-2 deacive_class font-medium">
            <div class="rounded-full deactive-circle-align"></div>
            <span>Inactive</span>
          </div> -->
        </div>
        <div>
          <img src="assets\icons\left_arrow.svg" width="30">
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const dataList = ref([
  {
    _id: 1,
    bot: 'UI Customization',
  }, {
    _id: 2,
    bot: 'CRM Integration',
  }, {
    _id: 3,
    bot: 'Bot Configuration',
  }, {
    _id: 4,
    bot: 'Document Management',
  },
]) 
</script>

<style scoped>
.bot-manage-main-container {
  padding: 15px;
}

.header-align {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: segoe UI Regular;
}

.bot-main-align {
  margin-top: 30px;
}

.list_align {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 65%;
  /* background: rgba(255, 255, 255, 1); */
  /* padding: 30px 30px; */
  /* box-shadow: 0px 2px 24px 0px rgba(0, 0, 0, 0.05) !important; */
  border-radius: 10px;
  /* gap: 100px; */
  /* margin: 10px 0; */
}

.bot-list-align {
  display: flex;
  align-items: center;
  justify-content: space-between;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 1);
  padding: 30px 30px;
  width: 100% !important;
  box-shadow: 0px 2px 24px 0px rgba(0, 0, 0, 0.05) !important;
  border-radius: 10px;
  margin: 20px;
}

.acive_class {
  display: flex;
  align-items: center;
  /* width: 50px; */
  color: rgba(26, 187, 0, 1) !important;
  gap: 5px;
}

/* .deacive_class {
  display: flex;
  align-items: center;
  gap: 5px;
  color: rgba(255, 0, 0, 1);
} */

.active-circle-align {
  display: flex;
  align-items: center;
  background-color: rgba(26, 187, 0, 1);
  width: 7px;
  height: 7px;
}
.header-content-align {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}
.list-header-align {
  padding: 10px 0px 10px 20px;
  display: flex;
  align-items: center;
  /* justify-content: space-between; */
  width: 100%;
  /* gap: 100px; */
  border-bottom: 0.5px solid rgba(181, 181, 181, 1);
}
.button-align {
  background-color: red;
  color: white;
  border-radius: 8px;
  padding: 10px 10px;
}
/* .deactive-circle-align {
  display: flex;
  align-items: center;
  background-color: rgba(255, 0, 0, 1);
  width: 5px;
  height: 5px;
} */

/* .bot_name_align {
  width: 11%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
} */
</style>