<template>
  <div :class="cn(
    'h-[calc(100%-70px)]',
    'overflow-y-scroll',
    leadData?.channel === 'website' ? 'bg-[#f8f6f6]' : 'bg-[#e5ddd5]',

  )
    " :style="leadData?.channel === 'whatsapp' && 'background-image :url(../../whatsapp.png)'" ref="chatScreenRef">
    <div class="w-full p-5" v-for="(chatList, chatListIndex) in messages" :key="chatListIndex">
      <div style="display: flex; justify-content: center" class="p-2">
        <div class="bg-[#ffffff]" style="width: 150px; text-align: center">
          Chat {{ chatListIndex + 1 }}
        </div>
      </div>
      <div class="overflow-y-scroll pt-[1rem] pr-4"
        v-for="(messageList, messageIndex) in chatList?.messages" :id="messageList.chatId" :key="messageIndex">
        <div style="display: flex; justify-content: center" v-if="
          leadData?.channel === 'whatsapp' &&
          timeStamp(messageIndex, messageList)
        ">
          <div class="bg-[#ffffff]" style="width: 150px; text-align: center">
            {{ formatDate(new Date(messageList?.createdAt), "dd MMMM yyyy") }}
          </div>
        </div>
        <div v-if="
          messageList?.role === 'comment' &&
          messageList.content !== 'User Details Submitted'
        " class="relative">
          <div
            class="absolute left-1/2 top-1/2 h-[0.5px] w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-500/50">
          </div>
          <p class="relative mx-auto w-fit rounded-sm border bg-gray-100 px-2 py-1 text-xs font-thin">
            {{ messageList.content }}
          </p>
        </div>
        <div class="flex w-full flex-col items-end" v-if="
          messageList?.role === 'comment' &&
          messageList?.content === 'User Details Submitted' &&
          messageList?.metadata
        ">
          <div class="flex max-w-[80%] flex-col items-end justify-center">
            <span class="text-[14px]" style="color: #8a8a8a">{{
              leadData?.botUser?.name
            }}</span>
            <div
              class="mt-2.5 flex flex-col items-end justify-center gap-5 rounded-l-xl rounded-br-xl bg-[#ffffff] p-2.5 text-black">
              <div class="pb-2 pt-2">
                <div class="pb-2" v-if="messageList?.metadata?.name">
                  <TextField label="Name" :disabled="true" :disableCharacters="true"
                    :placeholder="messageList.metadata.name" />
                </div>
                <div class="pb-2 pt-2" v-if="messageList?.metadata?.email">
                  <TextField label="Email" :disabled="true" :disableCharacters="true"
                    :placeholder="messageList.metadata.email" />
                </div>
                <div class="pb-2 pt-2" v-if="messageList?.metadata?.mobile">
                  <TextField label="Mobile" :disabled="true" :placeholder="messageList.metadata.mobile" />
                </div>
              </div>
            </div>
            <div class="text-[12px] opacity-60">
              {{ formatDate(new Date(messageList.createdAt), "hh:mm a") }}
            </div>
          </div>
        </div>
        <!-- User Message -->
        <div class="flex w-full flex-col items-end" v-if="messageList?.role === 'user'">
          <div class="flex max-w-[80%] flex-col items-end justify-center">
            <span class="text-[14px]" style="color: #8a8a8a">{{
              leadData?.botUser?.name
            }}</span>
            <div
              class="mt-2.5 flex flex-col items-end justify-center rounded-l-xl rounded-br-xl bg-[#ffffff] p-2.5 text-black">
              <div>
                {{ messageList?.content }}
              </div>
            </div>
            <div class="text-[12px] opacity-60" v-if="messageList?.createdAt">
              {{ formatDate(new Date(messageList?.createdAt), "hh:mm a") }}
            </div>
          </div>
        </div>
        <!-- Assistant Message -->
        <div class="w-[90%]" v-if="messageList?.role === 'assistant'">
          <span class="text-[14px]" style="color: #8a8a8a">{{
            leadData?.bot.metadata.prompt.NAME
          }}</span>
          <!-- ai-reply-align -->
          <div class="field_shadow mt-2.5 flex min-h-[80px] flex-col gap-2 rounded-r-xl rounded-bl-xl bg-[#ffffff] p-5">
            <MdText :content="JSON.parse(messageList.content)?.response" />
            <div class="flex flex-col">
              <div class="flex flex-wrap items-center gap-2">
                <div class="flex items-center" v-for="(btn, btnIndex) in JSON.parse(messageList.content)
                  .canned" :key="btnIndex">
                  <p class="w-auto rounded-xl p-2" :style="{
                    // background: `hsl(347 66 39/ 0.15)`,
                    background: `hsl(${leadData?.bot.metadata.ui?.color?.replaceAll('%', ' ')}/0.15)`,
                    color: `hsl(${leadData?.bot.metadata.ui?.color?.replaceAll(' ', ',')})`,
                  }">
                    {{ btn.title }}
                  </p>
                </div>
              </div>
              <div class="self-end text-[12px] text-[#00000066]" v-if="messageList?.createdAt">
                {{ formatDate(new Date(messageList.createdAt), "hh:mma") }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  leadData: any;
  class: String;
  messages: any;
  chatId: any;
  scrollChatBox: any;
}>();
const messages = ref([]);

const timeStamp = (messageIndex: any, messageList) => {
  return !messageIndex
    ? true
    : messageList[messageIndex]?.createdAt.split(`T`)[0] !==
    messageList[messageIndex]?.createdAt.split(`T`)[0];
};

watch(
  () => props.leadData,
  (newValue) => {
    console.log({ newValue });
    const messageIndex = props.messages?.findIndex(
      (message) => message?.content === "User Details Submitted",
    );
    // let leadMessage = props.messages[messageIndex];
    //  leadMessage.role='assistant'
    let localMessagesStore = props.messages;
    // localMessagesStore?.splice(messageIndex, 1);
    // localMessagesStore.splice(messageIndex - 1, 0, leadMessage);
    // localMessagesStore.slice(1);
    messages.value = localMessagesStore.map((message) => ({
      ...message,
      messages: leadDataReplace(message.messages),
    }));

    // .map((message) => ({
    //   ...message,
    //   date: message?.createdAt?.split(`T`)[0],
    // }));
    console.log({ va: messages.value });
  },
);

const leadDataReplace = (messages) => {

  let message = [];
  const messageIndex = messages?.findIndex(
    (message) => message?.content === "User Details Submitted",
  );
  if (messageIndex < 0) return messages
  let leadMessage = messages[messageIndex];
  if (!leadMessage?.metadata) return messages
  // leadMessage.role = "assistant";
  let localMessagesStore = messages;
  localMessagesStore?.splice(messageIndex, 1);
  localMessagesStore.splice(messageIndex - 1, 0, leadMessage);
  localMessagesStore.slice(1);
  message = localMessagesStore;
  return message;
};


watch(() => props.chatId, (newValue) => {
  scrollToMessage(newValue)
})

watch(() => props.scrollChatBox, (newValue) => {
  console.log(newValue);

  if (newValue) scrollToMessage(newValue)
})

// Function to scroll to a specific message based on chatId
const emit = defineEmits(['chatId'])
const scrollToMessage = (chatId) => {
  const element = document.getElementById(chatId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }
  else {

  }

};
</script>
