<template>
  <Page title="testing" :disable-back-button="false">
    <div class="mx-8 flex justify-around gap-8">
      <UiTabs default-value="Client Info" class="w-[25%] self-start">
        <UiTabsList class="bg-[#ffffff] text-[#424bd1] grid w-[23%] items-end grid-cols-2" default-value="Client Info">
          <UiTabsTrigger value="Client Info"
            class="tab-align flex justify-start w-auto text-[15px] p-0 text-[#8a8a8a] font-black relative inline-flex no-underline text-left">
            Info
          </UiTabsTrigger>
        </UiTabsList>
        <UiTabsContent value="Client Info" v-if="true">
          <div v-for="(key, index) in clientInfoList" class="flex flex-col items-start my-2">
            <span class="font-medium uppercase">{{ key.content }}: <span class="ml-2 font-bold">
                {{ key.value }}
              </span>
            </span>
          </div>
          <div class="py-2">
            <audio controls>
              <source type="audio/ogg">
              <source type="audio/mpeg">
              Your browser does not support the audio element.
            </audio>
          </div>

        </UiTabsContent>
      </UiTabs>
      <div class="chatinfo-align w-[50%] h-[75vh] bg-[#ffffff] overflow-y-hidden rounded-lg shadow">
        <div
          class="flex items-center justify-between font-medium w-full h-[70px] bg-[#424bd1] text-[#ffffff] px-[20px]">
          <div class="flex items-center gap-2">
            <span class="text-[14px]">
              test
              <!-- {{ leadData?.bot?.name }} -->
            </span>
          </div>
          <!-- <div>
          <img src="assets/icons/chat_menu.svg" width="30" height="30" />
        </div> -->
        </div>
        <div class="h-[65vh] overflow-y-scroll">
          <div class="w-full p-[20px]">
            <!-- {{ messageList }} -->
            <!-- v-if="messageList.role === 'user'" -->
            <div class="flex flex-col items-end w-[100%]">
              <span class="text-[14px]" style="color: #8a8a8a">
                <!-- {{ leadData?.botUser?.name }} -->
                tester name
              </span>
              <div
                class="bg-[#766ddb] text-[#ffffff] min-w-[20%] max-w-[80%] min-h-[80px] p-[10px] gap-2.5 mt[10px] flex flex-col items-end justify-center rounded-l-xl rounded-br-xl">
                <!-- <div>{{ messageList.content }}</div> -->
                How do you handle customer interactions?
                <div class="text-[12px] opacity-60">
                  06:00 PM
                  <!-- {{ formatDate(new Date(messageList.createdAt), "hh:mm a") }} -->
                </div>
              </div>
            </div>
            <!-- v-if="messageList.role === 'assistant'" -->
            <div class="w-[90%]">
              <span class="text-[14px]" style="color: #8a8a8a">
                <!-- {{
            leadData?.bot.metadata.prompt.NAME
            }} -->
                bot name
              </span>
              <!-- ai-reply-align -->
              <div
                class="flex flex-col mt-[10px] min-h-[80px] bg-[#ffffff] p-[20px] gap-2 rounded-r-xl rounded-bl-xl shadow">
                <MdText
                  :content="'I use client-specific entities for customer interactions and can perform actions like booking appointments or checking balances to ensure efficient communication'" />
                <div class="flex flex-col">
                  <div class="flex items-center gap-2">
                    <!-- v-for="(btn, btnIndex) in JSON.parse(messageList.content)
                .canned" :key="btnIndex" -->
                    <div class="flex items-center" v-if="false">
                      <p class="text-[#424bd1] w-auto rounded-xl py-[10px] border-1 border-[#424bd1]	">
                        <!-- {{ btn.title }} -->
                      </p>
                    </div>
                    <!-- <Uibutton class="rounded-xl pricing-align-btn">
                  {{ JSON.parse(messageList.content).canned[0].title }}
                </Uibutton> -->
                  </div>
                  <div class="self-end text-[12px] text-[#00000066]">
                    06:00 PM
                    <!-- {{ formatDate(new Date(messageList.createdAt), "hh:mm a") }} -->
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Page>
</template>

<script setup lang="ts">
import MdText from "~/components/MdText.vue";

definePageMeta({
  middleware: "admin-only",
});

// const router = useRouter();
// const route = useRoute();
// const paramId: any = route;
// const leadData = await getLeadTranscript(paramId.params.id);
const clientInfoList = ref([
  {
    content: 'customer Name',
    value: 'Raj',
  }, {
    content: 'Call From',
    value: '+1234567890',
  }, {
    content: 'Call To',
    value: '+1234567890',
  }, {
    content: 'Customer Location',
    value: 'Chennai, Tamilnadu,',
  }, {
    content: 'Call SID',
    value: 'IN1243243',
  },
])
// const details = computed(() => {
//   if (!leadData) return [undefined, undefined];
//   const { params, ...rest } = leadData.metadata as Record<string, any>;
//   return [Object.entries(rest), Object.entries(params)];
// });

// const isDeleteConfirmationOpen = ref(false);
// const handleDelete = async () => {
//   isDeleteConfirmationOpen.value = false;

//   await $fetch(`/api/org/lead/${leadData.value?.lead?.id}`, {
//     method: "DELETE",
//   });
//   return navigateTo({ name: "leads" });
// };
</script>
<style scoped>
.tab-align:active {
  color: rgba(66, 75, 209, 1);
  font-weight: 800;
  text-decoration: underline;
  text-underline-offset: 8px;
}

[data-active="true"] {
  color: rgba(66, 75, 209, 1);
  font-weight: 800;
  text-decoration: underline;
  text-underline-offset: 8px;
}

.tab-align::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -3px;
  width: 100%;
  height: 0.5px;
  background-color: rgba(138, 138, 138, 0.5);
  text-decoration: none;
}
</style>
