<template>
  <div
    class="h-[calc(100%-70px)] overflow-y-scroll bg-[#f8f6f6]"
    ref="chatScreenRef"
  >
    <div
      class="w-full p-5"
      v-for="(messageList, messageIndex) in messages"
      :key="messageIndex"
    >
      <div
        v-if="
          messageList.role === 'comment' &&
          messageList.content !== 'User Details Submitted'
        "
        class="relative"
      >
        <div
          class="absolute left-1/2 top-1/2 h-[0.5px] w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-500/50"
        ></div>
        <p
          class="relative mx-auto w-fit rounded-sm border bg-gray-100 px-2 py-1 text-xs font-thin"
        >
          {{ messageList.content }}
        </p>
      </div>
      <div
        class="flex w-full flex-col items-end"
        v-if="
          messageList.role === 'comment' &&
          messageList.content === 'User Details Submitted' &&
          messageList?.metadata
        "
      >
        <div class="flex max-w-[80%] flex-col items-end justify-center">
          <span class="text-[14px]" style="color: #8a8a8a">{{
            leadData?.botUser?.name
          }}</span>
          <div class="mt-2.5 flex gap-5 flex-col items-end justify-center rounded-l-xl rounded-br-xl bg-[#ffffff] p-2.5 text-black">
            <div class="pt-2 pb-2">
            <div class="pb-2" v-if="messageList?.metadata?.name">
              <TextField
                label="Name"
                :disabled="true"
                :disableCharacters="true"
                :placeholder="messageList.metadata.name"
              />
            </div>
            <div class="pt-2 pb-2" v-if="messageList?.metadata?.email">
              <TextField
                label="Email"
                :disabled="true"
                :disableCharacters="true"
                :placeholder="messageList.metadata.email"
              />
            </div>
            <div class="pt-2 pb-2" v-if="messageList?.metadata?.mobile">
              <TextField
                label="Mobile"
                :disabled="true"
                :placeholder="messageList.metadata.mobile"
              />
            </div>
            </div>
          </div>
          <div class="text-[12px] opacity-60">
            {{ formatDate(new Date(messageList.createdAt), "hh:mm a") }}
          </div>
        </div>
      </div>
      <!-- User Message -->
      <div
        class="flex w-full flex-col items-end"
        v-if="messageList.role === 'user'"
      >
        <div class="flex max-w-[80%] flex-col items-end justify-center">
          <span class="text-[14px]" style="color: #8a8a8a">{{
            leadData?.botUser?.name
          }}</span>
          <div
            class="mt-2.5 flex flex-col items-end justify-center rounded-l-xl rounded-br-xl bg-[#ffffff] p-2.5 text-black"
          >
            <div>
              {{ messageList.content }}
            </div>
          </div>
          <div class="text-[12px] opacity-60">
            {{ formatDate(new Date(messageList.createdAt), "hh:mm a") }}
          </div>
        </div>
      </div>
      <!-- Assistant Message -->
      <div class="w-[90%]" v-if="messageList.role === 'assistant'">
        <span class="text-[14px]" style="color: #8a8a8a">{{
          leadData?.bot.metadata.prompt.NAME
        }}</span>
        <!-- ai-reply-align -->
        <div
          class="field_shadow mt-2.5 flex min-h-[80px] flex-col gap-2 rounded-r-xl rounded-bl-xl bg-[#ffffff] p-5"
        >
          <MdText :content="JSON.parse(messageList.content).response" />
          <div class="flex flex-col">
            <div class="flex flex-wrap items-center gap-2">
              <div
                class="flex items-center"
                v-for="(btn, btnIndex) in JSON.parse(messageList.content)
                  .canned"
                :key="btnIndex"
              >
                <p
                  class="w-auto rounded-xl p-2"
                  :style="{
                    // background: `hsl(347 66 39/ 0.15)`,
                    background: `hsl(${leadData?.bot.metadata.ui?.color?.replaceAll('%', ' ')}/0.15)`,
                    color: `hsl(${leadData?.bot.metadata.ui?.color?.replaceAll(' ', ',')})`,
                  }"
                >
                  {{ btn.title }}
                </p>
              </div>
            </div>
            <div class="self-end text-[12px] text-[#00000066]">
              {{ formatDate(new Date(messageList.createdAt), "hh:mma") }}
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
  }>();
  const messages=ref([])

  watch(
    () => props.leadData,
    (newValue) => {
      console.log({newValue})
     const messageIndex= props.leadData.messages?.findIndex((message)=>message?.content==="User Details Submitted")
     let leadMessage=props.leadData?.messages[messageIndex]
    //  leadMessage.role='assistant'
     let localMessagesStore=props.leadData?.messages
     localMessagesStore?.splice(messageIndex,1)
     localMessagesStore.splice(messageIndex-1,0,leadMessage)
     localMessagesStore.slice(1)
     messages.value=localMessagesStore
      console.log({va:messages.value})
      
    },
  );
</script>
