<template>
  <div v-if="isPageLoading" class="grid h-[90vh] place-items-center text-[#424BD1]">
    <Icon name="svg-spinners:90-ring-with-bg" class="h-20 w-20" />
  </div>
  <Page v-else :title="leadData?.botUser?.name ?? 'No Name'" :bread-crumbs="[
    {
    label: `${leadData?.botUser?.name ?? 'No Name'}`,
      to: `/analytics/leads`,
    },
    {
      label: 'Leads',
      to: `/analytics/leads`,
    },
  ]" leadPage="leads" :disable-back-button="false" :disable-elevation="true">
    <template #actionButtons>
      <div class="flex items-center gap-3">
        <UiButton v-if="leadData?.lead?.status === 'default'" variant="destructive"
          @click="() => (changeStatus = true)">
          Mark as Junk
        </UiButton>

        <UiButton v-else class="bg-[#424cd1] hover:bg-[#424bd1] hover:brightness-90"
          @click="() => (revertStatus = true)">
          Revert
        </UiButton>
        <ConfirmationModal v-model:open="revertStatus" title="Confirm revert status"
          description="Are you sure you want to revert the status ?" @confirm="confirmChangeStatus('default')" />
        <ConfirmationModal v-model:open="changeStatus" title="Confirm Change Status"
          description="Are you sure about the status change ?" @confirm="confirmChangeStatus('junk')" />
      </div>
    </template>
    <div
      class="items-top flex grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-[25px]">
      <div class="flex w-full justify-around gap-8 sm:w-full md:w-[90%] lg:w-[90%] xl:w-[90%]">
        <UiTabs default-value="client" class="w-full self-start">
          <UiTabsList class="grid w-[100%] sm:w-[100%] md:w-[90%] lg:w-[90%] xl:w-[90%] grid-cols-3">
            <UiTabsTrigger value="client"> Client Info </UiTabsTrigger>
            <UiTabsTrigger value="campaign"> Campaign Info </UiTabsTrigger>
            <UiTabsTrigger value="timeline"> Time Line </UiTabsTrigger>
          </UiTabsList>
          <UiTooltipProvider>
            <UiTabsContent value="client">
              <div class="flex grid grid-cols-2 flex-col items-center gap-2 pl-4 capitalize">
                <div v-for="[key, value] in details[0]" :key="key" class="max-w-full font-medium">
                  <UiTooltip>
                    <UiTooltipTrigger as-child>
                      <div class="max-w-[100%] truncate cursor-pointer">
                        <div class="text-gray-500">{{ key }}</div>
                        <div class="w-[90%]">
                          <template v-if="key === 'Mobile'">
                            <!-- <a href="tel:{{ value }}" class="truncate text-[#424bd1]">
                              {{ value }}
                            </a> -->
                            <a :href="getTelLink(value)" class="truncate text-[#424bd1]">
                              {{ value }}
                            </a>
                          </template>
                          <a v-else-if="key === 'Email'"
                            href="mailto:{{ (leadData.channel === 'whatsapp') ? whatsappLead.email : value }}"
                            class="block truncate lowercase text-[#424bd1]">
                            {{ leadData.channel === 'whatsapp' ? whatsappLead.email : value }}
                          </a>
                          <div v-else-if="key === 'Name'" class="truncate">
                            {{ leadData.channel === 'whatsapp' ? whatsappLead.name : value }}
                          </div>
                            <div v-else class="truncate">
                              {{ value }}
                            </div>
                          </div>
                        </div>
                    </UiTooltipTrigger>
                    <UiTooltipContent class="w-auto">
                      <p>{{ value }}</p> <!-- Show the full value or any additional info -->
                    </UiTooltipContent>
                  </UiTooltip>
                </div>
              </div>
              <div class="flex gap-2 mt-3">
                <div v-for="[key, value] in details[0]" :key="key" class="flex gap-2">
                  <a v-if="key === 'Mobile'">
                    <UiButton color="primary" :disabled="true">Call</UiButton>
                  </a>
                  <a v-if="key === 'Mobile'" :href="`https://wa.me/${value}`" target="_blank" rel="noopener noreferrer">
                    <UiButton color="primary">Whatsapp</UiButton>
                  </a>
                  <a v-if="key === 'Email'"
                    :href="`https://mail.google.com/mail/?view=cm&fs=1&to=${value}&su=Your%20Subject&body=Your%20message%20here`"
                    target="_blank" rel="noopener noreferrer">
                    <UiButton color="primary">Email</UiButton>
                  </a>
                </div>
              </div>
              <div v-if="formattedScheduels.length || formattedChats.length"
                class="overflow-scroll h-[40vh] gap-2 scrollable-container field_shadow mt-5 rounded-lg">
                <div v-if="formattedScheduels.length" class="flex justify-center font-medium mt-4">Interacted Forms
                </div>
                <div v-if="formattedScheduels.length" class="gap-2 rounded-lg">
                  <div v-for="(dynamicForm, keys) in formattedScheduels" :key="keys" class="p-4">
                    <div class="p-5 rounded-lg gap-4 field_shadow">
                      <TextField label="Date" :placeholder="`${dynamicForm.content} - ${dynamicForm.date}`"
                        :required="false" :disabled="true" class="mb-2" />
                      <TextField label="Time" :validation="false" :required="false" :placeholder="`${dynamicForm.time}`"
                        :disabled="true" />
                    </div>
                  </div>
                </div>
                <div v-if="formattedChats.length" class="flex justify-center font-medium mt-2">Dynamic Forms</div>
                <div v-if="formattedChats.length" class="p-5">
                  <div v-for="(value, key) in formattedChats" :key="key">
                    <!-- {{ value.metadata }} -->
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



              <!-- {{ chats[0].messages.map((item:any) => item) }} || safddsf -->
            </UiTabsContent>
          </UiTooltipProvider>

          <UiTooltipProvider>
            <UiTabsContent value="campaign">
              <div class="flex grid grid-cols-2 flex-col items-center gap-2 pl-4 capitalize">
                <div v-for="[key, value] in details[1]" class="max-w-full font-medium">
                  <UiTooltip>
                    <UiTooltipTrigger as-child>
                      <div class="max-w-[100%] truncate cursor-pointer">
                        <div class="text-gray-500">{{ key }}</div>
                        <div class="w-[90%] truncate">
                          {{ value }}
                        </div>
                      </div>
                    </UiTooltipTrigger>
                    <UiTooltipContent class="w-full">
                      <p>{{ value }}</p>
                    </UiTooltipContent>
                  </UiTooltip>
                </div>
              </div>
            </UiTabsContent>
          </UiTooltipProvider>
          <UiTabsContent value="timeline">
            <div class="flex h-screen-minus-12 flex-col justify-start gap-6 overflow-y-scroll pb-[1rem] pr-4 pt-[1rem]">
              <TimeLine v-for="(step, index) in timeLineData" :key="index" :index="index" :data="step" @timeLine="
                  ($event) => {
                    BotId = $event;
                    setTimeout(() => {
                      BotId = null;
                    });
                  }
                " :totalSteps="timeLineData.length" :height="190" />
            </div>
          </UiTabsContent>
        </UiTabs>
      </div>
      <div
        class="field_shadow h-screen-minus-11 w-full overflow-hidden rounded-lg bg-[#ffffff] sm:w-full md:w-full lg:w-[100%] xl:w-[100%]">
        <div :class="[
            'flex h-[70px] w-full items-center justify-between px-2.5 font-medium text-[#ffffff]',
          ]" :style="
            leadData?.channel === 'whatsapp'
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
        <ChatPreview :chatValue="chats" :scrollChatBox="BotId" @chatId="BotId = null" :leadDataValue="leadData" />
      </div>
    </div>
  </Page>
  <ConfirmationModal v-model:open="isDeleteConfirmationOpen" title="Confirm Delete"
    :description="`Are you sure you want to delete this lead - ${leadData?.botUser?.name} ?`" @confirm="handleDelete" />
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "admin-only",
});

const BotId = ref(null);

const router = useRouter();
const route = useRoute("analytics-leads-id");

const isPageLoading = computed(() => responseStatus.value === "pending");

const paramId: any = route;
const changeStatus = ref(false);
const revertStatus = ref(false);
const status = ref();
const leadData: any = ref();
// const whatsappLead = ref();
const { data: whatsappLead, execute: fetchName } = useLazyFetch(`/api/getName?id=${route.params.id}`, {
  method: 'GET',
});
// const { status, data: leadData } = await useLazyFetch(
//   () => `/api/org/chat/${route.params.id}`,
//   {
//     server: false,
//   },
// );
// const isPageLoading = computed(() => status.value === "pending");
watchEffect(() => {
  if (leadData.value) {
    const userName = leadData.value?.botUser?.name ?? "Unknown User";
    useHead({
      title: `Leads | ${userName}`,
    });
  }
});
onMounted( async() => {
  await fetchData();
});
const details = computed(() => {
  if (!leadData.value) return [];
  const { params, ...rest } =
    leadData.value?.metadata ?? ({ params: null } as Record<string, any>);
  const { name } = leadData.value.bot;
  let metaData: any = Object.entries(rest).map(([key, value]) => {
    if (key === "os") {
      return ["OS", value];
    } else if (key === "ipAddress") {
      return ["IP Address", value];
    }
    return [key, value];
  });
  metaData = [
    ...metaData,
    ["Name", leadData?.value?.botUser?.name],
    ["Email", leadData?.value?.botUser?.email],
    [
      "Mobile",
      leadData?.value?.botUser?.countryCode +
      leadData?.value?.botUser?.mobile,
    ],
    ["Bot Name", name],
  ];
  if (params) {
    return [metaData, Object.entries(params)];
  } else {
    return [metaData];
  }
});

// const getTelLink = computed(() => {
//   const result = {};
//   Object.entries(props.details[0]).forEach(([key, value]) => {
//     if (key === 'Mobile') {
//       const sanitizedValue = value.replace(/\D/g, '');
//       result[key] =
//         sanitizedValue.startsWith('91') || sanitizedValue.startsWith('+91')
//           ? `tel:+${sanitizedValue}`
//           : `tel:${sanitizedValue}`;
//     } else {
//       result[key] = value;
//     }
//   });
//   return result;
// });

// it will work
// const getTelLink = (value) => {
//   const sanitizedValue = value.replace(/\D/g, '');
//   return sanitizedValue.startsWith('91') || sanitizedValue.startsWith('+91')
//     ? `tel:+${sanitizedValue}`
//     : `tel:${sanitizedValue}`;
// };
const getTelLink = (value: any) => {
  // Remove all non-digit characters
  const sanitizedValue = value.replace(/\D/g, '');

  // Handle international numbers
  if (sanitizedValue.startsWith('00')) {
    // Convert '00' international prefix to '+'
    return `tel:+${sanitizedValue.slice(2)}`;
  } else if (sanitizedValue.startsWith('+')) {
    // Already a proper international number
    return `tel:${sanitizedValue}`;
  } else if (sanitizedValue.length > 10) {
    // Assume it's an international number without a prefix
    return `tel:+${sanitizedValue}`;
  } else {
    // Handle local numbers (default)
    return `tel:${sanitizedValue}`;
  }
};
const isDeleteConfirmationOpen = ref(false);

const handleDelete = async () => {
  isDeleteConfirmationOpen.value = false;
  await $fetch(`/api/org/lead/${leadData.value?.lead?.id}`, {
    method: "DELETE",
  });
  return navigateTo({ name: "leads" });
};

const fetchData = async () => {
  leadData.value = await $fetch(`/api/org/chat/${route.params.id}`, {
    method: "GET",
  });
  chatData.value = leadData?.value?.messages?.slice(-1);
  // // Ensure you're using `ref` to store the reactive data
  // status.value = status.value;
  // leadData.value = leadData.value;
};
const chatData = ref([]);
const chats = await $fetch(`/api/org/chat/${route.params.id}/messages`, {
  method: "GET",
  server: false,
});

const {
  status: responseStatus,
  data: timeLineData,
  refresh: usageRefresh,
} = await useLazyFetch(`/api/timeline/chat/${route.params.id}`, {
  transform: (data: any) => {
    let chatIndex = 1;
    const allChat = chats.map((chat: any) => chat.chatId)
    return data.map((item: any, index: number) => {
      const chatIndex = allChat.findIndex((chat: any) => chat === item.chatId)
      return { ...item, chatIndex: chatIndex + 1 };
    });
  },
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
      const dateMatch = message.content.match(/on\s+([A-Za-z]+ \d{1,2}, \d{4})/); // old /on ([A-Za-z]+ \d{1,2}, \d{4})/
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
// const formattedScheduels = computed(() => {
//   return chats.map((chat: any) => {
//     // Filter messages that have role 'comment' and content 'Booking Details Submitted'
//     const filteredMessages = chat.messages.filter((message: any) =>
//       message.role === 'comment' && (message.content.includes('Rescheduled Site') || message.content.includes('Site Visit Scheduled') || (message.content.includes('Rescheduled Site') || message.content.includes('Rescheduled Call'))
//     ));

//     // For each message, format the metadata and createdAt date
//     const formattedMessages = filteredMessages.map((message: any) => {
//       return {
//         content: message.content,
//       };
//     });

//     return formattedMessages;
//   }).flat();  // Flatten the array if there are multiple messages per chat
// });
const formatLabel = (key: any) => {
  // Convert camelCase or PascalCase to words with spaces
  return key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/([A-Z])/g, ' $1').trim();
}
const dateTimeFormat = (text, format) => {
  console.log(text, "text -- text");
  const dateTimeStr = text?.replace("Site Visit Scheduled on", "")?.trim();
  const [dateStr, timeStr] = dateTimeStr?.split(" - ");

  if (format === "time") return timeStr;
  else {
    return dateStr;
  }
};

  const confirmChangeStatus = async (value: any) => {
    try {
      await useLazyFetch(`/api/org/lead/${leadData.value?.lead?.id}`, {
        method: "PUT",
        body: { status: value },
      });
      fetchData();
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };
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