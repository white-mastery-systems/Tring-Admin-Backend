<template>
  <div class="bot-manage-main-container">
    <div class="header-align">
      <div class="flex items-center gap-2">
        <span>
          <img src="assets\icons\right_arrow.svg" width="20"></img>
        </span>
        <span class="font-bold text-[20px]">Document Management</span>
      </div>
      <span class="right-dropdown-align text-[15px]" style="color: rgba(138, 138, 138, 1)">Summary: <span
          class="font-bold text-black">Recent</span></span>
    </div>
    <div class="document-align gap-4">
      <span>
        <img src="assets\icons\upload _document.svg" width="100" />
      </span>
      <div class="flex items-center gap-2">
        <span class="upload-document-align font-bold"> Upload Document </span>
        <span class="only-content-align"> (Only Pdf) </span>
      </div>
    </div>
    <div class="bot-main-align">
      <div class="list-header-align">
        <div class="header-content-align">
          <span class="font-semibold content-align">File Name</span>
          <span class="font-semibold content-align">Uploaded Date</span>
          <span class="font-semibold content-align">Status</span>
          <span class="font-semibold content-align">Actions</span>
        </div>
      </div>
      <div class="content-scroll-align">
        <div class="bot-list-align text-[13px]" v-for="(list, index) in dataList" :key="index" @click="async () => {
          await navigateTo('botpdfdocument')
        }">
          <div class="list_align">
            <span class="font-medium bot_name_align">{{ list.bot }}</span>
            <span class="font-medium create_at-align"
              :style="{ 'padding-inline-end': list.status ? '132px' : (list.Processing) ? '133px' : '133px' }">{{
              list.createAt }}</span>
            <div v-if="list.status" class="acive_class font-medium">
              <div class="rounded-full active-circle-align"></div>
              <span>Success</span>
            </div>
            <div v-else-if="list.Processing" class="process_class font-medium">
              <div class="rounded-full process-circle-align"></div>
              <span>Processing</span>
            </div>
            <div v-else class="deacive_class font-medium">
              <div class="rounded-full deactive-circle-align"></div>
              <span>Failed</span>
            </div>
            <span>
              <img src="assets\icons\more_horiz.svg" width="30">
            </span>
          </div>
          <!-- <div>
            <img src="assets\icons\left_arrow.svg" width="30">
          </div> -->
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
    bot: 'Yourstore Bot-1',
    createAt: '12.02.2024',
    status: true,
    Processing: false,
  }, {
    _id: 1,
    bot: 'Yourstore Bot-2 testing bot sdfdsf saf sdf',
    createAt: '15.02.2024',
    status: false,
    Processing: true,
  }, {
    _id: 1,
    bot: 'Yourstore Bot-2 testing bot sdfdsf saf sdf',
    createAt: '15.02.2024',
    status: false,
    Processing: false,
  }, {
    _id: 1,
    bot: 'Yourstore Bot-2 testing bot sdfdsf saf sdf',
    createAt: '15.02.2024',
    status: true,
    Processing: false,
  }, {
    _id: 1,
    bot: 'Yourstore Bot-2 testing bot sdfdsf saf sdf',
    createAt: '15.02.2024',
    status: false,
    Processing: false,
  },
]) 
</script>

<style scoped>
.bot-manage-main-container {
  padding: 0 25px;
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
  box-shadow: 0px 2px 24px 0px rgba(0, 0, 0, 0.05) !important;
  /* overflow-y: scroll; */
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
  align-items: center;
  justify-content: space-between;
  width: 96%;
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
  background: rgba(255, 255, 255, 1);
  padding: 20px 0px;
  width: 100% !important;
  /* height: calc(100vh - 260px); */
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
  padding-inline-end: 88px;
}

.deacive_class {
  display: flex;
  align-items: center;
  gap: 5px;
  color: rgba(255, 0, 0, 1);
  padding-right: 104px;
}
.process_class {
  display: flex;
  align-items: center;
  color: rgba(238, 186, 1, 1);
  gap: 5px;
  padding-inline-end: 70px;
}

.process-circle-align {
  display: flex;
  align-items: center;
  background: rgba(238, 186, 1, 1);
  width: 5px;
  height: 5px;
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
  width: 100%;
}

.bot_name_align {
  width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
  padding-inline-start: 30px;
}

/* .create_at-align {
  padding-inline-end: 130px;
} */

.document-align {
  display: flex;
  align-items: center;
  margin-top: 40px;
}

.upload-document-align {
  color: rgba(66, 75, 209, 1);
  font-size: 15px;
  text-decoration: underline;
  text-underline-offset: 2px
}

.only-content-align {
  color: rgba(138, 138, 138, 1);
  font-size: 11px;
}
.content-scroll-align {
  height: calc(100vh - 350px);
  overflow-y: scroll;
}
</style>