<template>
  <div class="bot-manage-main-container">
    <div class="header-align">
      <div class="flex items-center gap-2">
        <button @click="router.back()">
          <img src="assets\icons\right_arrow.svg" width="20"></img>
        </button>
        <span class="font-bold text-[20px]">Document Management</span>
      </div>
      <span class="right-dropdown-align text-[15px]" style="color: rgba(138, 138, 138, 1)">Summary: <span
          class="font-bold text-black">Recent</span></span>
    </div>
    <div class="document-align gap-4">
      <span>
        <!-- @click="uploadfile" -->
        <FileUpload accept="application/pdf" v-model="selectedFile" />
        <!-- <img src="assets\icons\upload _document.svg" width="100" /> -->
      </span>
      <div class="flex items-center gap-2">
        <div class="submit-btn-align">
          <button class="font-bold text-[14px]" type="submit" @click="fileUpload">
            Upload Document
          </button>
        </div>
        <!-- <span class="upload-document-align font-bold"> Upload Document </span> -->
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
      <!-- {{ getDocumentList }} -->
      <div class="content-scroll-align">
        <!-- @click="async () => {
        await navigateTo('botpdfdocument')
        }" -->
        <div class="bot-list-align text-[15px]" v-for="(list, index) in getDocumentList" :key="index">
          <!-- {{ list }} -->
          <div class="list_align">
            <span class="font-medium bot_name_align">{{ list.name }}</span>
            <span class="font-medium create_at-align"
              :style="{ 'padding-inline-end': (list.status === 'ready') ? '132px' : (list.status === 'processing') ? '133px' : '133px' }">{{
              list.createdAt }}</span>
            <div v-if="list.status === 'ready'" class="acive_class font-medium">
              <div class="rounded-full active-circle-align"></div>
              <span>Success</span>
            </div>
            <div v-else-if="list.status === 'processing'" class="process_class font-medium">
              <div class="rounded-full process-circle-align"></div>
              <span>Processing</span>
            </div>
            <div v-else class="deacive_class font-medium">
              <div class="rounded-full deactive-circle-align"></div>
              <span>Failed</span>
            </div>
            <span>
              <UiPopover ref="myPopover">
                <UiPopoverTrigger>
                  <img src="assets\icons\more_horiz.svg" width="30" />
                </UiPopoverTrigger>
                <UiPopoverContent align="end" class="w-40 ">
                  <div @click="handleAction(list, 'deploy')" class="menu-align">
                    <PopoverClose aria-label="Close">
                      Deploy
                    </PopoverClose>
                  </div>
                  <div @click="handleAction(list, 'download')" class="menu-align">
                    <PopoverClose aria-label="Close">
                      Download
                    </PopoverClose>
                  </div>
                  <div @click="handleAction(list, 'delete')" class="menu-align">
                    Delete
                  </div>
                  <!-- TODO: Add your content here @Sathish1-M -->
                </UiPopoverContent>
              </UiPopover>
              <!-- <img src="assets\icons\more_horiz.svg" width="30"> -->
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
const router = useRouter();


const route = useRoute()
const paramId: any = route
const selectedFile = ref()
const myPopover:any = ref(null)
// const botDetails: any = await getBotDetails(paramId.params.id)
const getDocumentList: any = ref()

onMounted(async() => {
  getDocumentList.value = await listDocumentsByBotId(paramId.params.id)
})
const fileUpload = async () => {
  selectedFile.value[0].name
  console.log(selectedFile.value[0], "selectedFile")
  const payload:any = {
    botId: paramId.params.id,
    document: { name: selectedFile.value[0].name, files: selectedFile.value[0] }
  }
  await createDocument(payload.botId, payload.document)
  getDocumentList.value = await listDocumentsByBotId(paramId.params.id)
}
const handleAction = (list: any, action: any) => {
  if (myPopover.value) {
    myPopover.value = false
  }

  switch (action) {
    case 'deploy':
      singleDocumentDeploy(list)
      break;
    case 'download':
      singleDocumentDownload(list)
      break;
    case 'delete':
      singleDocumentDelete(list)
      break;
  }
};
const singleDocumentDeploy = async (list: any) => {
     deployDocument(paramId.params.id, list.id)
  getDocumentList.value = await listDocumentsByBotId(paramId.params.id)
  // if (myPopover.value) {
  //   myPopover.value.close()
  // }
}
const singleDocumentDelete = async (list: any) => {
  console.log('inside')
    deleteDocument(paramId.params.id, list.id)
  getDocumentList.valua = await listDocumentsByBotId(paramId.params.id)
  // if (myPopover.value) {
  //   myPopover.value.close()
  // }
}
const singleDocumentDownload = async (list: any) => {
  viewDocument(paramId.params.id, list.id)
  // if (myPopover.value) {
  //   myPopover.value.close()
  // }
}
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
.submit-btn-align button {
  width: 200px;
  height: 40px;
  border-radius: 10px;
  padding: 0 20px;
  background: #424bd1;
  color: #ffffff;
  margin-top: 20px;
  /* margin-right: 170px; */
}
.menu-align {
  cursor: pointer;
  padding: 5px;
  font-weight: 500;
}
</style>