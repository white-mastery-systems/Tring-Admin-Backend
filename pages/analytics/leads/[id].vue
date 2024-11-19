<template>
  <div v-if="isPageLoading" class="grid h-[90vh] place-items-center text-[#424BD1]">
    <Icon name="svg-spinners:90-ring-with-bg" class="h-20 w-20" />
  </div>
  <!-- :bread-crumbs="[
      {
    label: `${leadData?.botUser?.name}`,
    to: `/analytics/leads`,
      },
      {
        label: 'Leads',
        to: `/analytics/leads`,
      },
    ]" -->
  <Page v-else :title="leadData?.botUser?.name ?? ''" leadPage="leads" :disable-back-button="false"
    :disable-elevation="true">
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
                          <a v-if="key === 'Mobile'" href="tel:{{ value }}" class="truncate text-[#424bd1]">
                            {{ value }}
                          </a>
                          <a v-else-if="key === 'Email'" href="mailto:{{ value }}"
                            class="block truncate lowercase text-[#424bd1]">
                            {{ value }}
                          </a>
                          <div v-else class="truncate">
                            {{ value }}
                          </div>
                        </div>
                      </div>
                    </UiTooltipTrigger>
                    <UiTooltipContent class="w-80">
                      <p>{{ value }}</p> <!-- Show the full value or any additional info -->
                    </UiTooltipContent>
                  </UiTooltip>
                </div>
              </div>
              <div class="flex gap-2 mt-3">
                <div v-for="[key, value] in details[0]" :key="key" class="flex gap-2">
                  <a v-if="key === 'Mobile'" :href="`https://wa.me/${value}`" target="_blank" rel="noopener noreferrer">
                    <UiButton color="primary">Whatsapp</UiButton>
                  </a>
                  <!-- <a v-if="key === 'Mobile'">
                    <UiButton color="primary">Call</UiButton>
                  </a> -->
                  <a v-if="key === 'Email'"
                    :href="`https://mail.google.com/mail/?view=cm&fs=1&to=${value}&su=Your%20Subject&body=Your%20message%20here`"
                    target="_blank" rel="noopener noreferrer">
                    <UiButton color="primary">Email</UiButton>
                  </a>
                </div>
              </div>
              <div v-if="formattedChats.length" class="flex justify-center font-medium mt-4">Dynamic Forms</div>
              <div class="overflow-scroll h-[40vh] gap-2 scrollable-container">
                <div v-for="(value, key) in formattedChats" :key="key">
                  <!-- {{ value.metadata }} -->
                  <div class="text-[#424bd1] font-medium py-4">
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
                    <UiTooltipContent class="w-80">
                      <p>{{ value }}</p> <!-- Show the full value or any additional info -->
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
  onMounted(() => {
    fetchData();
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
      const  allChat = chats.map((chat: any)=>chat.chatId)
      return data.map((item: any, index: number) => {
          const chatIndex =  allChat.findIndex((chat: any)=>chat === item.chatId)
          return { ...item, chatIndex:chatIndex+1 };
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
const formatLabel = (key: any) => {
  // Convert camelCase or PascalCase to words with spaces
  return key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/([A-Z])/g, ' $1').trim();
}

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