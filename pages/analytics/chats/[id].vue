<template>
  <Page :title="leadData?.botUser?.name ?? 'No Name'" :disable-back-button="false" :disable-elevation="true">
    <div class="items-top gap-[25px flex items-center justify-center px-3">
      <div class="flex w-full grid-cols-2 justify-around gap-8 sm:w-full md:w-[100%] lg:w-[100%] xl:w-[100%]">
        <UiTabs default-value="Chat" class="w-full self-center">
          <UiTabsList class="mb-4 grid w-full grid-cols-2">
            <UiTabsTrigger value="Chat"> Chat Log </UiTabsTrigger>
            <UiTabsTrigger value="Timeline"> Timeline</UiTabsTrigger>
          </UiTabsList>
          <UiTabsContent value="Chat"
            class="flex grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
            <div
              class="flex grid h-auto grid-cols-2 flex-col items-center gap-3 pb-4 pl-4 capitalize sm:h-auto md:h-[100px] lg:h-[100px] xl:h-[100px]">
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
            <div class="flex w-full flex-col items-center gap-2 pl-0 capitalize sm:pl-0 md:pl-4 lg:pl-4 xl:pl-4">
              <div
                class="field_shadow h-auto w-full overflow-hidden rounded-lg bg-[#ffffff] sm:w-full md:w-full lg:w-[100%] xl:w-[100%]">
                <div :class="[
                    'flex h-[70px] w-full items-center justify-between px-[20px] font-medium text-[#ffffff]',
                  ]" :style="`background:hsl(${leadData?.bot.metadata.ui?.color?.replaceAll(' ', ',')})`">
                  <div class="flex items-center gap-2">
                    <span class="text-[14px] capitalize">{{
                      leadData?.bot?.name
                      }}</span>
                  </div>
                </div>
                <div class="h-screen-minus-13 overflow-y-scroll bg-[#f8f6f6]" ref="chatScreenRef">
                  <div class="w-full p-5" v-for="(
                      messageList, messageIndex
                    ) in leadData?.messages.slice(1)" :key="messageIndex">
                    <div v-if="messageList.role === 'comment'" class="relative">
                      <div
                        class="absolute left-1/2 top-1/2 h-[0.5px] w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-500/50">
                      </div>
                      <p class="relative mx-auto w-fit rounded-sm border bg-gray-100 px-2 py-1 text-xs font-thin">
                        {{ messageList.content }}
                      </p>
                    </div>
                    <!-- User Message -->
                    <div class="flex w-full flex-col items-center" v-if="messageList.role === 'user'">
                      <div class="flex max-w-[80%] flex-col items-end justify-center">
                        <span class="text-[14px]" style="color: #8a8a8a">{{
                          leadData?.botUser?.name
                          }}</span>
                        <div
                          class="mt-2.5 flex flex-col items-end justify-center rounded-l-xl rounded-br-xl bg-[#ffffff] p-2.5 text-[#ffffff] text-black">
                          <div>
                            {{ messageList.content }}
                          </div>
                        </div>
                        <div class="text-[12px] opacity-60">
                          {{
                          formatDate(
                          new Date(messageList.createdAt),
                          "hh:mm a",
                          )
                          }}
                        </div>
                      </div>
                    </div>
                    <!-- Assistant Message -->
                    <div class="w-[90%]" v-if="messageList.role === 'assistant'">
                      <span class="text-[14px]" style="color: #8a8a8a">{{
                        leadData?.bot.metadata.prompt.NAME
                        }}</span>
                      <div
                        class="shadpw-field mt-2.5 flex min-h-[80px] flex-col gap-2 rounded-r-xl rounded-bl-xl bg-[#ffffff] p-2.5">
                        <MdText :content="JSON.parse(messageList.content).response" />
                        <div class="flex flex-col">
                          <div class="flex flex-wrap items-center gap-2">
                            <div class="flex items-center" v-for="(btn, btnIndex) in JSON.parse(
                                messageList.content,
                              ).canned" :key="btnIndex">
                              <p class="w-auto rounded-xl p-2" :style="{
                                  // background: `hsl(347 66 39/ 0.15)`,
                                  background: `hsl(${leadData?.bot.metadata.ui?.color?.replaceAll('%', ' ')}/0.15)`,
                                  color: `hsl(${leadData?.bot.metadata.ui?.color?.replaceAll(' ', ',')})`,
                                }">
                                {{ btn.title }}
                              </p>
                            </div>
                          </div>
                          <div class="self-end text-[12px] text-[#00000066]">
                            {{
                            formatDate(
                            new Date(messageList.createdAt),
                            "hh:mma",
                            )
                            }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </UiTabsContent>
          <UiTabsContent value="Timeline">
            <div class="flex flex-col gap-6 h-screen-minus-15 overflow-y-scroll pb-5 pt-3 pr-4">
              <TimeLine v-for="(step, index) in timeLineData" :key="index" :index="index" :data="step"
                :totalSteps="timeLineData.length" :height="160" />
            </div>
          </UiTabsContent>
          <!-- </div> -->
        </UiTabs>
      </div>
    </div>
    <!-- <input type="text" value="hii" ref="chatScreenRef" /> -->
  </Page>
</template>
<script setup lang="ts">
  const chatScreenRef = ref(null);
  const scrollChatBox = () => {
    setTimeout(() => {
      if (chatScreenRef.value)
        chatScreenRef.value.scrollTop = chatScreenRef?.value?.scrollHeight;
    }, 1000);
  };
  onMounted(() => {
    {
      scrollChatBox();
    }
  });
  definePageMeta({
    middleware: "admin-only",
  });

  const route = useRoute("analytics-chats-id");

  const { data: timeLineData } = await useLazyFetch(
    `/api/timeline/chat/${route.params.id}`,
  );

  const { status, data: leadData } = await useLazyFetch(
    () => `/api/org/chat/${route.params.id}`,
    {
      server: false,
    },
  );

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
