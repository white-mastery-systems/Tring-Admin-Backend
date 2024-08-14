<template>
  <div class="analytics_leads-main-container">
    <div class="header-align">
      <div class="flex gap-2">
        <div class="flex items-center gap-2">
          <button @click="router.back()">
            <img src="assets\icons\right_arrow.svg" width="20"></img>
          </button>
          <span class="font-bold text-lg">{{ leadData?.botUser?.name  }}</span>
        </div>
        <span class="font-bold text-lg text-[16px]"></span>
      </div>
    </div>
  </div>
  <!-- <template> -->
  <div class="flex justify-around gap-8 mx-8">
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
        <UiTabsContent value="Client Info">
          <div class="client_info_align gap-2">
            <span v-for="[key, value] in details[0]" class="font-medium">{{ key }}: <span class="font-bold">{{ value }}</span></span>
          </div>
        </UiTabsContent>
        <UiTabsContent value="Campaign info">
          <div class="client_info_align gap-2">
            <span v-for="[key, value] in details[1]" class="font-medium">{{ key }}: <span class="font-bold">{{ value }}</span></span>
          </div>
        </UiTabsContent>
    </UiTabs>
    <!-- </div> -->
    <!-- {{ getLeadTranscriptList[0].messages.map((item: any) ) }} -->
    <div class="chatinfo-align rounded-lg">
      <div class="flex items-center font-medium justify-between chat-header-align">
        <div class="flex items-center gap-2">
          <!-- <div class="rounded-full profile-align"></div> -->
          <span class=text-[14px]>
            {{ leadData?.bot?.name }}
          </span>
        </div>
          <!-- <div>
            <img src="assets/icons/chat_menu.svg" width="30" height="30" />
          </div> -->
      </div>
      <div class="all-message-align">
        <div class="chat-container-align" v-for="(messageList, messageIndex) in leadData?.messages.slice(1)"
          :key="messageIndex">
          <!-- {{ messageList }} -->
          <div class="message-left-align" v-if="messageList.role === 'user'">
            <span class="text-[14px]" style="color: #8A8A8A">
              {{ leadData?.botUser?.name }}
            </span>
            <div class="flex justify-center items-end current-user rounded-l-xl rounded-br-xl">
              <div>{{ messageList.content }}</div>
              <div class="text-[12px] opacity-60">{{ formatDate(new Date(messageList.createdAt),"hh:mm a") }}</div>
            </div>
          </div>
          <div class="message-right-align" v-if="messageList.role === 'assistant'">
            <span class="text-[14px]" style="color: #8A8A8A">{{ leadData?.bot.metadata.prompt.NAME }}</span>
            <div class="flex flex-col gap-2 ai-reply-align rounded-r-xl rounded-bl-xl">
              <MdText :content="JSON.parse(messageList.content).response"/>
              <div class="flex flex-col">
                <div class="flex items-center gap-2">
                  <div class="flex items-center" v-for="(btn, btnIndex) in JSON.parse(messageList.content).canned"
                    :key="btnIndex">
                    <p class="rounded-xl pricing-align-btn">{{ btn.title }}
                    </p>
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
  </div>

</template>
<script setup lang="ts">
import MdText from '~/components/MdText.vue';

  definePageMeta({
    middleware: "admin-only",
  });

  const router = useRouter();
  const route = useRoute();
  const paramId: any = route
  const leadData = await getLeadTranscript(paramId.params.id)

  const details = computed(() => {
    if(!leadData) return [undefined, undefined]
    const { params,...rest} =  leadData.metadata as Record<string, any>
    return [Object.entries(rest), Object.entries(params)]
  })

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

[data-active="true"] {
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
  width: 50%;
  height: 75vh;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 24px 0px rgba(0, 0, 0, 0.05) !important;
  overflow-y: hidden;
}

.chat-header-align {
  width: 100%;
  height: 70px;
  background: #424bd1;
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
  background: #424bd1;
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
  color: #424bd1;
  width: auto;
  /* color: white; */
  padding: 3% 10px;
  border: 1px solid #424bd1;
}
.all-message-align {
  height: 65vh;
  overflow-y: scroll;
}
/* .custom-underline {
  position: relative;
  display: inline-block;
  text-decoration: none;
} */
</style>