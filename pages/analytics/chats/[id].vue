<template>
  <div v-if="isPageLoading" class="grid h-[90vh] place-items-center text-[#424BD1]">
    <Icon name="svg-spinners:90-ring-with-bg" class="h-20 w-20" />
  </div>
  <Page v-else :title="leadData?.botUser?.name ?? 'No Name'" :bread-crumbs="[]" leadPage="leads"
    :disable-back-button="!user" :disable-elevation="true">
    <div class="items-top gap-[25px flex items-center justify-center px-3">
      <div class="items-top xs:grid-cols-2 flex grid w-full grid-cols-1 gap-[25px] lg:grid-cols-2">
        <div class="justify-aro und flex w-full gap-8 sm:w-full md:w-[70%] lg:w-[90%] xl:w-[90%]">
          <UiTabs default-value="Chat" class="w-full self-start">
            <UiTabsList class="grid w-[90%] grid-cols-2">
              <UiTabsTrigger value="Chat"> Chat Log </UiTabsTrigger>
              <UiTabsTrigger value="Timeline"> Timeline</UiTabsTrigger>
            </UiTabsList>
            <UiTooltipProvider>
              <UiTabsContent value="Chat" class="overflow-scroll h-[83vh]">
                <div class="flex grid grid-cols-2 flex-col items-center gap-2 pl-4 capitalize">
                  <div v-for="(entry, index) in details" :key="index" class="max-w-full font-medium">
                    <div v-if="Array.isArray(entry) && entry.length === 2">
                      <UiTooltip>
                        <UiTooltipTrigger as-child>
                          <div class="max-w-[100%] truncate cursor-pointer">
                            <div class="text-gray-500">{{ entry[0] }}</div>
                            <div class="w-[90%]">
                              <a v-if="entry[0] === 'Mobile'" :href="`tel:${entry[1]}`" class="truncate text-[#424bd1]">
                                {{ entry[1] }}
                              </a>
                              <a v-else-if="entry[0] === 'Email'" :href="`mailto:${entry[1]}`"
                                class="block truncate lowercase text-[#424bd1]">
                                {{ entry[1] }}
                              </a>
                              <div v-else-if="entry[0] === 'parentUrl'" class="cursor-pointer text-indigo-600">
                                <NuxtLink :to="entry[1]" target="_blank">Website</NuxtLink>
                              </div>
                              <div v-else class="truncate">
                                {{ entry[1] }}
                              </div>
                            </div>
                          </div>
                        </UiTooltipTrigger>
                        <UiTooltipContent class="max-w-[300px] overflow-hidden text-wrap break-words">
                          <p>{{ entry[1] }}</p>
                        </UiTooltipContent>
                      </UiTooltip>
                    </div>
                    <div v-else>Invalid entry</div>
                  </div>
                </div>
                <div v-if="formattedScheduels.length || formattedChats.length"
                  class="overflow-scroll h-[40vh] gap-2 scrollable-container field_shadow mt-5 rounded-lg">
                  <div v-if="formattedScheduels.length" class="flex justify-center font-medium mt-4">interacted Forms
                  </div>
                  <div v-if="formattedScheduels.length" class="gap-2 rounded-lg">
                    <div v-for="(dynamicForm, keys) in formattedScheduels" :key="keys" class="p-4">
                      <div class="p-5 rounded-lg gap-4 field_shadow">
                        <TextField label="Date" :placeholder="`${dynamicForm.content} - ${dynamicForm.date}`"
                          :required="false" :disabled="true" class="mb-2" />
                        <TextField label="Time" :validation="false" :required="false"
                          :placeholder="`${dynamicForm.time}`" :disabled="true" />
                      </div>
                    </div>
                  </div>
                  <div v-if="formattedChats.length" class="flex justify-center font-medium mt-2">Dynamic Forms</div>
                  <div v-if="formattedChats.length" class="p-5">
                    <div v-for="(value, key) in formattedChats" :key="key">
                      <div class="text-[#424bd1] font-medium pb-2">
                        {{ `Form ${key + 1}` }}
                      </div>
                      <div class="flex grid grid-cols-2 gap-2 font-regular">
                        <div v-for="(dynamicForm, keys) in value.metadata" :key="keys">
                          <div class="w-full pb-3">
                            <TextField :label="formatLabel(keys)" :disabled="true" :disableCharacters="true"
                              :placeholder="dynamicForm" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </UiTabsContent>
            </UiTooltipProvider>
            <UiTabsContent value="Timeline">
              <div class="flex h-screen-minus-12 flex-col justify-start gap-6 overflow-y-scroll pb-[1rem  pt-[1rem]">
                <TimeLine v-for="(step, index) in timeLineData" :key="index" :index="index" @timeLine="
                  ($event) => {
                    BotId = $event;
                    setTimeout(() => {
                      BotId = null;
                    });
                  }
                " :data="step" :totalSteps="timeLineData.length" :height="200" />
              </div>
            </UiTabsContent>
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
              <WhatsappIcon v-if="leadData?.channel === 'whatsapp'" class="align-middle"></WhatsappIcon>

              <span class="text-[14px] capitalize">{{
                leadData?.bot?.name
              }}</span>
            </div>
          </div>
          <ChatPreview v-if="computed(() => chats?.length && !!leadData)" :leadDataValue="leadData" :chatValue="chats"
            :scrollChatBox="BotId" @chatId="BotId = null" />
        </div>
      </div>
    </div>
  </Page>
</template>
<script setup lang="ts">
import { useBreadcrumbStore } from "~/store/breadcrumbs";

const breadcrumbStore = useBreadcrumbStore();

const { user, refreshUser }: { user: any; refreshUser: any } =
  await useUser();
const chatScreenRef = ref(null);
const BotId = ref(null);
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

const chats = await $fetch(`/api/org/chat/${route.params.id}/messages`, {
  method: "GET",
  server: false,
});

const { data: timeLineData } = await useLazyFetch(
  `/api/timeline/chat/${route.params.id}`,
  {
    transform: (data: any) => {
      const allChat = chats.map((chat) => chat.chatId);
      return data.map((item: any, index: number) => {
        const chatIndex = allChat.findIndex((chat) => chat === item.chatId);
        return { ...item, chatIndex: chatIndex + 1 };
      });
    },
  },
);

const { status, data: leadData } = await useLazyFetch(
  () => `/api/org/chat/${route.params.id}`,
  {
    server: false,
  },
);
breadcrumbStore.setBreadcrumbs([
  {
    label: "Chat", // Dynamic name
    to: `/analytics/leads`,
  },
  {
    label: (leadData.value?.botUser?.name) ?? 'No Name',
    to: `/analytics/leads/${route.params?.id}`,
  },
])

watchEffect(() => {
  if (leadData.value) {
    breadcrumbStore.setBreadcrumbs([
      {
        label: "chats", // Dynamic name
        to: `/analytics/chats`,
      },
      {
        label: leadData.value?.botUser?.name ?? 'No Name',
        to: `/analytics/chats/${route.params?.id}`,
      },
    ]);
    const userName = leadData.value?.botUser?.name ?? "Unknown User";
    useHead({
      title: `Chats | ${userName}`,
    });
  }
});

const formatLabel = (key: any) => {
  // Convert camelCase or PascalCase to words with spaces
  return key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/([A-Z])/g, ' $1').trim();
}


const isPageLoading = computed(() => status.value === "pending");

const details = computed(() => {
  if (!leadData.value) return [undefined, undefined];
  const { params, ...rest } =
    leadData.value?.metadata ?? ({ params: null } as Record<string, any>);
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
      [
        "Mobile",
        leadData?.value?.botUser?.countryCode +
        leadData?.value?.botUser?.mobile,
      ],
      ["Bot Name", name],
    );
  }
  let paramsData = null;
  if (params) {
    paramsData = Object.entries(params);
  }
  if (paramsData) {
    return [...metaData, ...paramsData, ...botUserDetails];
  } else return [...metaData, ...botUserDetails];
});

const formattedChats = computed(() => {
  return chats.map((chat: any) => {
    // Filter messages that have role 'comment' and content 'Booking Details Submitted'
    const filteredMessages = chat.messages.filter((message: any) =>
      message.role === 'comment' && message.content === 'Booking Details Submitted' && message.metadata
    );

    // For each message, format the metadata and createdAt date
    const formattedMessages = filteredMessages.map((message: any) => {
      return {
        id: message.id,
        createdAt: formatDate(new Date(message.createdAt), "hh:mm a"),
        metadata: message.metadata
      };
    });

    return formattedMessages;
  }).flat();  // Flatten the array if there are multiple messages per chat
});

const formattedScheduels = computed(() => {
  return chats.map((chat: any) => {
    // Filter messages based on the role and specific content
    const filteredMessages = chat.messages.filter((message: any) =>
      message.role === 'comment' &&
      (message.content.includes('Rescheduled Site') ||
        message.content.includes('Site Visit Scheduled') ||
        message.content.includes('Rescheduled Call') || message.content.includes('Call Scheduled'))
    );

    // Map filtered messages to extract content, date, and time
    const formattedMessages = filteredMessages.map((message: any) => {
      // Extract content before the date
      const contentMatch = message.content.match(/^(.*?) on /);
      const dateMatch = message.content.match(/on ([A-Za-z]+ \d{1,2}, \d{4})/);
      const timeMatch = message.content.match(/- ([\d:]+ [APM]+)/);

      return {
        content: contentMatch ? contentMatch[1].trim() : null, // Extracted content
        date: dateMatch ? dateMatch[1] : null, // Extracted date
        time: timeMatch ? timeMatch[1] : null, // Extracted time
      };
    });

    return formattedMessages;
  }).flat(); // Flatten the array if there are multiple messages per chat
});
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