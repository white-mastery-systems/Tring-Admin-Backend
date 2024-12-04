<template>
  <div :class="
      cn(
        'h-[calc(100%-70px)]',
        'overflow-y-scroll scrollable-container',
        leadDataValue?.channel === 'website' ? 'bg-[#f8f6f6]' : (messageListCheck) ? 'bg-[#e5ddd5]' : 'bg-[#f8f6f6]',
      )
    " :style="
      leadDataValue?.channel === 'whatsapp' &&
      'background-image :url(../../whatsapp.png)'
    " ref="chatScreenRef">
    <div class="w-full p-5" v-for="(chatList, chatListIndex) in chatValue" :key="chatListIndex">
      <div style="display: flex; justify-content: center" class="pr-4">
        <div v-if="messageListCheck" class="rounded-md bg-[#ffffff]" style="width: 150px; text-align: center">
          Chat {{ chatListIndex + 1 }}
        </div>
      </div>
      <!-- <div>{{ chatList.meesages }}</div> -->
      <div v-if="messageListCheck" class="overflow-y-scroll pr-4 pt-[1rem]" v-for="(messageList, messageIndex) in leadDataReplace(
          chatList?.messages,
        )" :id="messageList.chatId + `_id${messageIndex}`" :key="messageIndex">
        <div style="display: flex; justify-content: center" v-if="
            leadDataValue?.channel === 'whatsapp' &&
            timeStamp(messageIndex, messageList)
          ">
          <div class="rounded-md bg-[#ffffff]" style="width: 150px; text-align: center">
            {{ formatDate(new Date(messageList?.createdAt), "dd MMMM yyyy") }}
          </div>
        </div>
        <div v-if="
            messageList?.role === 'comment' &&
            (messageList.content !== 'User Details Submitted') && (messageList.content !== 'Booking Details Submitted')
          " class="flex w-full flex-col items-end">
          <!-- class="relative" -->
          <!-- <div
            class="absolute left-1/2 top-1/2 h-[0.5px] w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-500/50">
          </div>
          <p class="relative mx-auto w-fit rounded-sm border bg-gray-100 px-2 py-1 text-xs font-thin">
            {{ messageList.content }}
          </p> -->

          <div class="flex max-w-[80%] flex-col items-end justify-center" v-if="messageList.content.includes('Call Scheduled') || messageList.content.includes('Rescheduled Site') || messageList.content.includes('Site Visit Scheduled') || messageList.content.includes('Rescheduled Call')">
            <span class="text-[14px]" style="color: #8a8a8a">{{
              leadDataValue?.botUser?.name
              }}</span>
            <div
              class="mt-2.5 flex flex-col items-end justify-center gap-5 rounded-l-xl rounded-br-xl bg-[#ffffff] p-2.5 text-black">
              <div class="pb-2 pt-2" >
                <span>
                  {{
                    (messageList.content.includes('Rescheduled Site') || messageList.content.includes('Site Visit Scheduled'))
                    ? (messageList.content.includes('Rescheduled Site') ? 'Rescheduled Site Visit' : 'Site Visit Scheduled')
                  : (messageList.content.includes('Rescheduled Call') ? 'Rescheduled Call' : 'Call Scheduled')
                  }}
                </span>
                <!-- <span> {{messageList.content.indexOf('Call Scheduled On') > -1 ? 'Call Scheduled On': 'Site Visit Scheduled On'}}</span> -->
                <!-- {{dateTimeFormat(messageList.content,'date')}} -->
                <div class="pt-4">
                  <TextField label="Date" :validation="false" :name="dateTimeFormat(messageList.content, 'date')"
                    :required="false" :disabled="true" />
                </div>
                <div class="pt-4">
                  <TextField label="Time" :validation="false" :name="dateTimeFormat(messageList.content, 'time')"
                    :required="false" :disabled="true" />
                </div>
                <!-- <DatePickerField label="Date" :validation="false"  :name="dateTimeFormat(messageList.content,'date')" :required="false" :disabled="true"/> -->
                <!-- <TimePickerField label="Time"  :required="false" :disabled="true" 
                :validation="false":name="dateTimeFormat(messageList.content,'time')"></TimePickerField> -->
                <!-- <div class="pb-2" v-if="messageList?.metadata?.name">
                  <TextField label="Name" :disabled="true" :disableCharacters="true"  
                    :placeholder="messageList?.metadata.name" />
                </div>
                <div class="pb-2 pt-2" v-if="messageList?.metadata?.email">
                  <TextField label="Email" :disabled="true" :disableCharacters="true"
                    :placeholder="messageList.metadata.email" />
                </div>
                <div class="pb-2 pt-2" v-if="messageList?.metadata?.mobile">
                  <TextField label="Mobile" :disabled="true" :placeholder="messageList?.metadata?.mobile" />
                </div> -->
              </div>
            </div>
            <div class="text-[12px] opacity-60">
              {{ formatDate(new Date(messageList.createdAt), "hh:mm a") }}
            </div>
          </div>
        </div>

        <div class="flex w-full flex-col items-end" v-if="
            messageList?.role === 'comment' &&
            messageList?.content === 'User Details Submitted' &&
            messageList?.metadata
          ">
          <div class="flex max-w-[80%] flex-col items-end justify-center">
            <span class="text-[14px]" style="color: #8a8a8a">{{ leadDataValue?.botUser?.name }}</span>
            <div
              class="mt-2.5 flex flex-col items-end justify-center gap-5 rounded-l-xl rounded-br-xl bg-[#ffffff] p-2.5 text-black">
              <div class="pb-2 pt-2">
                <div class="pb-2" v-if="messageList?.metadata?.name">
                  <TextField label="Name" :disabled="true" :disableCharacters="true"
                    :placeholder="messageList?.metadata.name" />
                </div>
                <div class="pb-2 pt-2" v-if="messageList?.metadata?.email">
                  <TextField label="Email" :disabled="true" :disableCharacters="true"
                    :placeholder="messageList.metadata.email" />
                </div>

                <div class="flex-col-2 flex pb-2 pt-2" v-if="messageList?.metadata?.countryCode">
                  <div class="max-w-[120px] px-1">
                    <TextField label="Country Code" :disabled="true"
                      :placeholder="messageList?.metadata?.countryCode" />
                  </div>

                  <div class="max-w-[100%]" v-if="messageList?.metadata?.mobile">
                    <TextField label="Mobile" :disabled="true" :placeholder="messageList?.metadata?.mobile" />
                  </div>
                </div>
              </div>
            </div>
            <div class="text-[12px] opacity-60">
              {{ formatDate(new Date(messageList.createdAt), "hh:mm a") }}
            </div>
          </div>
        </div> 
         <div v-if="
            messageList?.role === 'comment' &&
            messageList.content === 'User Details Submitted'
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
            messageList?.content === 'Booking Details Submitted' &&
            messageList?.metadata
          ">
          <div class="flex max-w-[80%] flex-col items-end justify-center">
            <span class="text-[14px]" style="color: #8a8a8a">{{ leadDataValue?.botUser?.name }}</span>
            <div
              class="mt-2.5 flex flex-col items-end justify-center gap-5 rounded-l-xl rounded-br-xl bg-[#ffffff] p-2.5 text-black">
              <div class="p-2">
                 <div v-for="(value, key) in messageList.metadata" :key="key">
                  <div class="w-full pb-3">
                    <TextField
                      :label="formatLabel(key)"
                      :disabled="true"
                      :disableCharacters="true"
                      :placeholder="value"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="text-[12px] opacity-60">
              {{ formatDate(new Date(messageList.createdAt), "hh:mm a") }}
            </div>
          </div>
        </div> 
          <div v-if="
            messageList?.role === 'comment' &&
        messageList.content === 'Booking Details Submitted'
          " class="relative">
          <div
            class="absolute left-1/2 top-1/2 h-[0.5px] w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-500/50">
          </div>
          <p class="relative mx-auto w-fit rounded-sm border bg-gray-100 px-2 py-1 text-xs font-thin">
            {{ messageList.content }}
          </p>
        </div>
        <!-- User Message -->
        <div class="flex w-full flex-col items-end" v-if="messageList?.role === 'user'">
          <div class="flex max-w-[60%] flex-col items-end justify-center">
            <span :class="
                cn(
                  'text-[14px]',
                  leadDataValue?.channel === 'whatsapp'
                    ? 'rounded-sm border bg-gray-100 px-2 py-1 text-xs font-thin'
                    : 'text-gray-500',
                )
              ">{{ leadDataValue?.botUser?.name }}</span>
            <div
              class="mt-2.5 flex flex-col items-end justify-center rounded-l-xl rounded-br-xl bg-[#ffffff] p-2.5 text-black">
              <div>
                {{ messageList?.content }}
              </div>
            </div>
            <div :class="
                cn(
                  'text-[12px]',
                  leadDataValue?.channel === 'whatsapp'
                    ? 'opacity-1 mt-1 bg-[#ffffff] p-1.5 text-[#000]'
                    : 'opacity-60',
                )
              " v-if="messageList?.createdAt">
              {{ formatDate(new Date(messageList?.createdAt), "hh:mm a") }}
            </div>
          </div>
        </div>
        <!-- Assistant Message -->
        <div class="w-[90%]" v-if="messageList?.role === 'assistant'">
          <span :class="
              cn(
                'text-[14px]',
                leadDataValue?.channel === 'whatsapp'
                  ? 'rounded-sm border bg-gray-100 px-2 py-1 text-xs font-thin'
                  : 'text-gray-500',
              )
            ">{{ leadDataValue?.bot.metadata.prompt.NAME }}</span>
          <!-- ai-reply-align -->
          <div class="field_shadow mt-2.5 flex min-h-[80px] flex-col gap-2 rounded-r-xl rounded-bl-xl bg-[#ffffff] p-5">
            <MdText :content="safeParseJson(messageList.content)?.response" />
            <div class="flex flex-col">
              <div class="flex flex-wrap items-center gap-2">
                <div class="flex items-center" v-for="(btn, btnIndex) in safeParseJson(messageList.content)
                    ?.canned" :key="btnIndex">
                  <p class="w-auto rounded-xl p-2" :style="{
                      // background: `hsl(347 66 39/ 0.15)`,
                      background: `hsl(${leadDataValue?.bot.metadata.ui?.color?.replaceAll('%', ' ')}/0.15)`,
                      color: `hsl(${leadDataValue?.bot.metadata.ui?.color?.replaceAll(' ', ',')})`,
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
      <div v-else>
        <!-- User Message -->
        <div class="overflow-y-scroll pr-4 pt-[1rem]" v-for="(callLogMessageList, messageIndex) in chatList.meesages"
          :key="messageIndex">
          <div class="flex w-full flex-col items-end" v-if="callLogMessageList?.role === 'user'">
            <div class="flex max-w-[80%] flex-col items-end justify-center">
              <span :class="
                   cn(
                     'text-[14px] text-gray-500',
                   )
                 ">{{ callLogMessageList.role }}</span>
              <div
                class="mt-2.5 flex flex-col items-end justify-center rounded-l-xl rounded-br-xl bg-[#ffffff] p-2.5 text-black">
                <div>
                  {{ callLogMessageList?.content }}
                </div>
              </div>
              <div :class="
                   cn(
                     'text-[12px] opacity-60',
                   )
                 " v-if="callLogMessageList?.createdAt">
                {{ formatDate(new Date(callLogMessageList?.createdAt), "hh:mm a") }}
              </div>
            </div>
          </div>
          <!-- Assistant Message -->
          <div class="w-[90%]" v-if="callLogMessageList?.role === 'assistant'">
            <span :class="
                 cn(
                   'text-[14px] text-gray-500',
                 )
               ">{{ callLogMessageList.role }}</span>
            <!-- ai-reply-align -->
            <div
              class="field_shadow mt-2.5 flex min-h-[80px] flex-col gap-2 rounded-r-xl rounded-bl-xl bg-[#ffffff] p-5">
              <MdText :content="callLogMessageList.content" />
              <!-- <div class="flex flex-col">
                 <div class="flex flex-wrap items-center gap-2">
                   <div
                    class="flex items-center"
                   >
                   v-for="(btn, btnIndex) in safeParseJson(messageList.content)
                       ?.canned"
                    :key="btnIndex"
                     <p
                       class="w-auto rounded-xl p-2"
                     >
                       :style="{
                         // background: `hsl(347 66 39/ 0.15)`,
                         background: `hsl(${leadDataValue?.bot.metadata.ui?.color?.replaceAll('%', ' ')}/0.15)`,
                         color: `hsl(${leadDataValue?.bot.metadata.ui?.color?.replaceAll(' ', ',')})`,
                       }"
                       {{ btn.title }}
                     </p>
                   </div>
                 </div>
                 <div
                   class="self-end text-[12px] text-[#00000066]"
                   v-if="callLogMessageList?.createdAt"
                 >
                   {{ formatDate(new Date(callLogMessageList.createdAt), "hh:mma") }}
                 </div>
               </div> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  leadDataValue: any;
  class?: String;
  chatValue: any[];
  scrollChatBox?: any;
  messageListCheck?: boolean
}>(),{
  messageListCheck: true
}) 
  const safeParseJson = (jsonString: string) => {
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      // console.error('Invalid JSON:', error)
      return null; // Return null or a fallback object
    }
  };

  const chats = ref([]);

  // Watch for changes in `messages` prop and update local `chats` ref
  // watch(() => props.messages, (updatedMessages) => {
  //
  //   // chats.value = updatedMessages;
  // }, { deep: true });


const isSiteVisit = computed(() => {
  const content = props.messageList?.content || '';
  return (
    content.includes('Rescheduled Site') ||
    content.includes('Site Visit Scheduled')
  );
});

  const timeStamp = (messageIndex: any, messageList: any) => {
    return !messageIndex
      ? true
      : messageList[messageIndex]?.createdAt?.split(`T`)[0] !==
          messageList[messageIndex]?.createdAt?.split(`T`)[0];
    // return true
  };

  // watch(
  //   () => props.leadData,
  //   (newValue) => {
  //     const messageIndex = props.chats?.findIndex(
  //       (message: { content: string }) => message?.content === "User Details Submitted",
  //     );

  //     let localMessagesStore = props.chats;
  //     messages.value = localMessagesStore.map((message) => ({
  //       ...message,
  //       messages: leadDataReplace(message.messages),
  //     }));
  //   },
  // );

  const leadDataReplace = (messages: any) => {
    let message = [];
    const messageIndex = messages?.findIndex(
      (message: any) => message?.content === "User Details Submitted",
    );
    if (messageIndex < 0 || messageIndex === undefined) return messages;
    let leadMessage = messages[messageIndex];
    if (!leadMessage?.metadata) return messages;
    // leadMessage.role = "assistant";
    let localMessagesStore = [...messages];
    localMessagesStore?.splice(messageIndex, 1);
    localMessagesStore?.splice(messageIndex - 1, 0, leadMessage);
    // localMessagesStore?.slice(1);
    message = localMessagesStore;
    return message;
  };

  // watch(() => props.chatId, (newValue) => {
  //   console.log({ newValue })
  //   scrollToMessage(newValue)
  // })

  watch(
    () => props.scrollChatBox,
    (newValue) => {
      if (newValue !== null) scrollToMessage(newValue);
    },
  );

  onMounted(() => {
    setTimeout(() => {
      scrollToMessage({ chatIndex: props.chatValue.length });
    }, 100);
  });

  // Function to scroll to a specific message based on chatId
  const emit = defineEmits(["chatId"]);
  const scrollToMessage = ({ chatIndex }) => {
    const chats = [...props.chatValue[chatIndex - 1]?.messages];
    const { chatId } = [...chats].pop();
    const element = document.getElementById(chatId + `_id${chats.length - 1}`);

    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
    }
    emit("chatId", null);
  };

  const dateTimeFormat = (text, format) => {
    const dateTimeStr = text?.replace(/(Call Scheduled on|Site Visit Scheduled on|Rescheduled Site Visit on|Rescheduled Call on)/, "")?.trim();
    const [dateStr, timeStr] = dateTimeStr?.split(" - ");

    if (format === "time") return timeStr;
    else {
      return dateStr;
    }
  };

const formatLabel = (key: any) => {
  // Convert camelCase or PascalCase to words with spaces
  return key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/([A-Z])/g, ' $1').trim();
}
</script>
<style scoped>
.scrollable-container::-webkit-scrollbar {
  display: block;
  width: 6px;
}

.scrollable-container::-webkit-scrollbar-thumb {
  background: #9ca3af;
  border-radius: 10px;
}

.scrollable-container::-webkit-scrollbar-track {
  max-height: 8px !important;
  margin-block: 1rem !important;
}
</style>