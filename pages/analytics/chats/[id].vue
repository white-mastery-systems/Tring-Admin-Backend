<template>
  <div v-if="isPageLoading" class="grid h-[90vh] place-items-center text-[#424BD1]">
    <Icon name="svg-spinners:90-ring-with-bg" class="h-20 w-20" />
  </div>
  <Page v-else
    :title="leadData?.botUser?.name ?? 'No Name'"
    :disable-back-button="false"
    :disable-elevation="true"
  >
    <div class="items-top gap-[25px flex items-center justify-center px-3">
      <div
        class="items-top xs:grid-cols-2 flex grid grid-cols-1 gap-[25px] lg:grid-cols-2 w-full"
      >
        <div
          class="justify-aro und flex w-full gap-8 sm:w-full md:w-[70%] lg:w-[90%] xl:w-[90%]"
        >
          <UiTabs default-value="Chat" class="w-full self-start">
            <UiTabsList class="grid w-full grid-cols-2">
              <UiTabsTrigger value="Chat"> Chat Log </UiTabsTrigger>
              <UiTabsTrigger value="Timeline"> Timeline</UiTabsTrigger>
            </UiTabsList>
            <UiTabsContent value="Chat">
              <div class="flex grid grid-cols-2 flex-col items-center gap-2 pl-4 capitalize">
                <div v-for="(entry, index) in details" :key="index" class="max-w-full font-medium">
                  <div v-if="Array.isArray(entry) && entry.length === 2">
                    <div class="max-w-[100%] truncate">
                      <div class="text-gray-500">{{ entry[0] }}</div>
                      <div class="w-[90%]">
                        <a v-if="entry[0] === 'Mobile'" :href="`tel:${entry[1]}`" class="truncate text-[#424bd1]">
                          {{ entry[1] }}
                        </a>
                        <a v-else-if="entry[0] === 'Email'" :href="`mailto:${entry[1]}`"
                          class="block truncate lowercase text-[#424bd1]">
                          {{ entry[1] }}
                        </a>
                        <div v-else class="truncate">
                          {{ entry[1] }}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-else>Invalid entry</div>
                </div>
              </div>
            </UiTabsContent>
            <UiTabsContent value="Timeline">
              <div
                class="flex h-screen-minus-12 flex-col justify-start gap-6 overflow-y-scroll pb-[1rem] pr-4 pt-[1rem]">
                <TimeLine v-for="(step, index) in timeLineData" :key="index" :index="index" @timeLine="($event) => {
                  BotId = $event
                  setTimeout(() => {
                    BotId = null
                  })
                }" :data="step" :totalSteps="timeLineData.length" :height="160" />
              </div>
            </UiTabsContent>
            <!-- </div> -->
          </UiTabs>
        </div>
        <div
          class="field_shadow h-screen-minus-11 w-full overflow-hidden rounded-lg bg-[#ffffff] sm:w-full md:w-full lg:w-[100%] xl:w-[100%]">
          <div :class="[
            'flex h-[70px] w-full items-center justify-between px-2.5 font-medium text-[#ffffff]',
          ]" :style="leadData?.channel === 'whatsapp'
            ? 'background:#128C7E'
            : `background:hsl(${leadData?.bot.metadata.ui?.color?.replaceAll(' ', ',')})`
            ">
            <div class="flex items-center gap-2">
              <!-- {{ leadData?.channel}} -->
              <WhatsappIcon v-if="leadData?.channel === 'whatsapp'" class="align-middle"></WhatsappIcon>

              <span class="text-[14px] capitalize">{{
                leadData?.bot?.name
              }}</span>
            </div>
          </div>

          <ChatPreview v-if="computed(() => messages?.length && !!leadData)" :leadData="leadData" :messages="messages"
            :scrollChatBox="BotId" @chatId="BotId = null" />
        </div>
      </div>
    </div>
    <!-- <input type="text" value="hii" ref="chatScreenRef" /> -->
  </Page>
</template>
<script setup lang="ts">

const chatScreenRef = ref(null);
const BotId = ref(null);
const scrollChatBox = () => {
  setTimeout(() => {
    if (chatScreenRef.value)
      chatScreenRef.value.scrollTop = chatScreenRef?.value?.scrollHeight;
  }, 1000);
};

scrollChatBox;
onMounted(() => {
  {
    scrollChatBox();
  }
});
definePageMeta({
  middleware: "admin-only",
});

const route = useRoute("analytics-chats-id");

const messages = await $fetch(`/api/org/chat/${route.params.id}/messages`, {
  method: "GET",
  server: false,
});

console.log(messages, "messages");

const { data: timeLineData } = await useLazyFetch(
  `/api/timeline/chat/${route.params.id}`,
);

const { status, data: leadData } = await useLazyFetch(
  () => `/api/org/chat/${route.params.id}`,
  {
    server: false,
  },
);

watchEffect(() => {
  if (leadData.value) {
    const userName = leadData.value?.botUser?.name ?? 'Unknown User';
    useHead({
      title: `Chats | ${userName}`,
    });
  }
});
const isPageLoading = computed(() => status.value === "pending");


const details = computed(() => {
  if (!leadData.value) return [undefined, undefined];
  const { params, ...rest } = leadData.value.metadata as Record<string, any>;
  const { name } = leadData.value.bot;
  let metaData: any = Object.entries(rest || {}).map(([key, value]) => {
    if (key === "os") {
      return ["OS", value];
    } else if (key === "ipAddress") {
      return ["IP Address", value];
    }
    return [key, value];
  });
  const botUserDetails = [];
  if (leadData?.value.botUser) {
    botUserDetails.push(
      ["Name", leadData?.value?.botUser?.name],
      ["Email", leadData?.value?.botUser?.email],
      ["Mobile", leadData?.value?.botUser?.mobile],
      ["Bot Name", name],
    );
  }
  const paramsData = Object.entries(params);
  return [...metaData, ...paramsData, ...botUserDetails];
});
</script>
