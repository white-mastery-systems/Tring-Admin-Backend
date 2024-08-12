<template>
  <div class="analytics_leads-main-container">
    <div class="header-align">
      <div class="flex gap-2">
        <div class="flex items-center gap-2">
          <button @click="router.back()">
            <img src="assets\icons\right_arrow.svg" width="20"></img>
          </button>
          <span class="font-bold text-lg">Yourstore Bot-1</span>
        </div>
        <span class="font-bold text-lg text-[16px]"></span>
      </div>
      <div class="flex items-center space-x-4">
        <span>
          <img src="assets\icons\export_btn.svg" width="120">
        </span>
      </div>
    </div>
  </div>
  <!-- <template> -->
  <div class="flex justify-between">
    <!-- <div> -->
    <!-- <div>{{ getLeadTranscriptList[0].metadata }}</div> -->
    <UiTabs default-value="Client Info" class="w-[250px]">
      <UiTabsList class="grid w-full grid-cols-2 group-tap-align" default-value="Client Info">
        <UiTabsTrigger value="Client Info" class="tab-align text-[15px]">
          Client Info
        </UiTabsTrigger>
        <UiTabsTrigger value="Campaign info" class="tab-align text-[15px]">
          Campaign info
        </UiTabsTrigger>
      </UiTabsList>
      <div v-for="(infoList, index) in getLeadTranscriptList" :key="index">
        <UiTabsContent value="Client Info">
          <div class="client_info_align gap-2">
            <span class="font-medium">Os: <span class="font-bold">{{ infoList.metadata.os }}</span></span>
            <span class="font-medium">Browser: <span class="font-bold">{{ infoList.metadata.browser }}</span></span>
            <span class="font-medium">IP Address: <span class="font-bold">{{ infoList.metadata.ipAddress
                }}</span></span>
            <!-- <span class="font-medium">Continent Code: <span class="font-bold">{{ }}</span></span>
            <span class="font-medium">Continent Name: <span class="font-bold">{{ }}</span></span>
            <span class="font-medium">Country Code: <span class="font-bold">{{ }}</span></span> -->
            <span class="font-medium">Country Name: <span class="font-bold">{{ infoList.metadata.country
                }}</span></span>
            <span class="font-medium">State Prov: <span class="font-bold">{{ infoList.metadata.state }}</span></span>
            <span class="font-medium">City: <span class="font-bold">{{ infoList.metadata.city }}</span></span>
          </div>
        </UiTabsContent>
        <UiTabsContent value="Campaign info">
          {{ (Object.entries(infoList.metadata.params).length) ? infoList.metadata.params : '' }}
        </UiTabsContent>
      </div>
    </UiTabs>
    <!-- </div> -->
    <!-- {{ getLeadTranscriptList[0].messages.map((item: any) ) }} -->
    <div class="chatinfo-align rounded-lg">
      <div class="flex items-center font-medium justify-between chat-header-align">
        <div class="flex items-center gap-2">
          <div class="rounded-full profile-align"></div>
          <span>
            Name
          </span>
        </div>
        <div>
          <img src="assets/icons/chat_menu.svg" width="30" height="30" />
        </div>
      </div>
      <div class="chat-container-align" v-for="(messageList, messageIndex) in getLeadTranscriptList[0].messages"
        :key="messageIndex">
        <!-- {{ messageList }} -->
        <div class="message-left-align" v-if="messageList.role === 'user'">
          <div class="text-[14px]" style="color: #8A8A8A">
            you
          </div>
          <div class="flex justify-center items-end current-user rounded-l-xl rounded-br-xl">
            <div>{{ messageList.content }}</div>
            <div class="text-[12px] opacity-60">{{ formatDate(new Date(messageList.createdAt),"hh:mm a") }}</div>
          </div>
        </div>
        <div class="message-right-align" v-if="messageList.role === 'assistant'">
          <div>
            <div class="flex items-center justify-center rounded-full ai-profile-align">
              V
            </div>
          </div>
          <div class="flex flex-col gap-2 ai-reply-align rounded-r-xl rounded-bl-xl">
            <div>
              <!-- {{ JSON.parse(messageList.content) }} -->
              {{ JSON.parse(messageList.content).response }}
            </div>
            <div class="flex flex-col gap-4">
              <!-- <div class="font-black">
                {{ JSON.parse(messageList.content).canned }}
                {{ JSON.parse(messageList.content).intents }}
              </div> -->
              <div class="flex items-center gap-2">
                <div class="flex items-center" v-for="(btn, btnIndex) in JSON.parse(messageList.content).canned"
                  :key="btnIndex">
                  <Uibutton class="rounded-xl pricing-align-btn">{{ btn.title }}
                  </Uibutton>
                </div>
                <!-- <Uibutton class="rounded-xl pricing-align-btn">{{ JSON.parse(messageList.content).canned[0].title }}
                </Uibutton> -->
              </div>
              <div class="self-end text-[12px] text-[#00000066]">
                {{ formatDate(new Date(messageList.createdAt), "hh:mm a") }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>
<script setup lang="ts">
import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'

  definePageMeta({
    middleware: "admin-only",
  });

  const router = useRouter();
  const route = useRoute();
  const paramId: any = route
  const getLeadTranscriptList: any = await getLeadTranscript(paramId.params.id)

// const responseText = computed(() => {
//   if (getLeadTranscriptList && getLeadTranscriptList[0].messages) {
//     console.log('message', getLeadTranscriptList[0])
//     // const jsonContent = getLeadTranscriptList[0].messages.map((item: any) => JSON.parse(item.messages))
//     // return jsonContent
//   }
//   // return '';
// });
// onMounted(async () => {

// })
</script>
<style scoped>
.analytics_leads-main-container {
  padding: 15px;
}

.header-align {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 20px;
  /* border-bottom: 0.5px solid rgba(181, 181, 181, 1); */
}

.client_info_align {
  display: flex;
  flex-direction: column;
  align-items: start;
}

.tab-align {
  padding: 0;
  color: rgba(138, 138, 138, 1);
  font-weight: 800;
  position: relative;
  display: inline-block;
  text-decoration: none;
  text-align: left;
}

.group-tap-align {
  background-color: white;
  color: rgba(66, 75, 209, 1);
}

.tab-align:active {
  color: rgba(66, 75, 209, 1);
  font-weight: 800;
  text-decoration: underline;
  text-underline-offset: 8px
}

.tab-align:focus {
  color: rgba(66, 75, 209, 1);
  font-weight: 800;
  text-decoration: underline;
  text-underline-offset: 8px
}

.tab-align::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -3px;
  /* Adjust based on your text-underline-offset */
  width: 100%;
  height: 0.5px;
  /* Adjust thickness of the underline */
  background-color: rgba(138, 138, 138, 0.5);
  /* Use the current text color */
  text-decoration: none;
  /* Ensure no additional decoration */
}

.chatinfo-align {
  width: 70%;
  height: 75vh;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 24px 0px rgba(0, 0, 0, 0.05) !important;
  overflow-y: scroll;
}

.chat-header-align {
  width: 100%;
  height: 70px;
  background: #EC848B;
  color: white;
  padding: 0 20px;
}

.profile-align {
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 24px 0px rgba(0, 0, 0, 0.05) !important;
}

.message-left-align {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: end;
  /* justify-content: end; */
}

.chat-container-align {
  width: 100%;
  padding: 20px;
}

.current-user {
  flex-direction: column;
  background: #766DDB;
  min-width: 20%;
  max-width: 80%;
  min-height: 80px;
  padding: 10px;
  gap: 10px;
  color: white;
  margin-top: 10px;
}

.message-right-align {
  width: 90%;
  /* background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 24px 0px rgba(0, 0, 0, 0.05) !important; */
}

.ai-profile-align {
  background: #EC848B;
  color: white;
  width: 50px;
  height: 50px;
}

.ai-reply-align {
  margin-top: 10px;
  min-height: 80px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 24px 0px rgba(0, 0, 0, 0.05) !important;
  padding: 20px;
}
.web-align-btn {
  background: #EC848B;
  color: white;
  padding: 10px;
}
.pricing-align-btn {
  color: #EC848B;
  width: auto;
  /* color: white; */
  padding: 10px;
  border: 1px solid #EC848B;
}
/* .custom-underline {
  position: relative;
  display: inline-block;
  text-decoration: none;
} */
</style>