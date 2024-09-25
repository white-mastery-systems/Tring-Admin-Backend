<template>
  <div v-if="isPageLoading" class="grid h-[90vh] place-items-center text-[#424BD1]">
    <Icon name="svg-spinners:90-ring-with-bg" class="h-20 w-20" />
  </div>
  <Page v-else :title="leadData?.botUser?.name ?? ''" :disable-back-button="false" :disable-elevation="true">
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
        <!-- @confirm="handleLogout" -->
      </div>
    </template>
    <div class="items-top xs:grid-cols-2 flex grid grid-cols-1 gap-[25px] lg:grid-cols-2">
      <!-- mx-8 -->
      <div class="justify-aro und flex w-full gap-8 sm:w-full md:w-[70%] lg:w-[90%] xl:w-[90%]">
        <UiTabs default-value="client" class="w-full self-start">
          <UiTabsList class="grid w-full grid-cols-3">
            <UiTabsTrigger value="client"> Client Info </UiTabsTrigger>
            <UiTabsTrigger value="campaign"> Campaign Info </UiTabsTrigger>
            <UiTabsTrigger value="timeline"> Time Line </UiTabsTrigger>
          </UiTabsList>
          <UiTabsContent value="client">
            <div class="flex grid grid-cols-2 flex-col items-center gap-2 pl-4 capitalize">
              <div v-for="[key, value] in details[0]" class="max-w-full font-medium">
                <div class="max-w-[100%] truncate">
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
              </div>
            </div>
          </UiTabsContent>
          <UiTabsContent value="campaign">
            <div class="flex grid grid-cols-2 flex-col items-center gap-2 pl-4 capitalize">
              <div v-for="[key, value] in details[1]" class="max-w-full font-medium">
                <div class="max-w-[100%] truncate">
                  <div class="text-gray-500">{{ key }}</div>
                  <div class="w-[90%] truncate">
                    {{ value }}
                  </div>
                </div>
              </div>
            </div>
          </UiTabsContent>
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
          ]" :style="  leadData?.channel === 'whatsapp'
                ? 'background:#128C7E':`background:hsl(${leadData?.bot.metadata.ui?.color?.replaceAll(' ', ',')})`">
          <div class="flex items-center gap-2">
            <WhatsappIcon v-if="leadData?.channel === 'whatsapp'" class="align-middle"></WhatsappIcon>
            <span class="text-[14px] capitalize">{{
              leadData?.bot?.name
              }}</span>
          </div>
        </div>
        <ChatPreview :messages="messages" :scrollChatBox="BotId" @chatId="BotId = null" :leadData="leadData" />
      </div>
    </div>
  </Page>
  <ConfirmationModal v-model:open="isDeleteConfirmationOpen" title="Confirm Delete"
    :description="`Are you sure you want to delete this lead - ${leadData?.botUser?.name} ?`" @confirm="handleDelete" />
</template>

<script setup lang="ts">
  import MdText from "~/components/MdText.vue";
  definePageMeta({
    middleware: "admin-only",
  });

  const BotId = ref(null);

  const router = useRouter();
  const route = useRoute("analytics-leads-id");
  const chatScreenRef: any = ref(null);
  const scrollChatBox = () => {
    setTimeout(() => {
      if (chatScreenRef.value)
        chatScreenRef.value.scrollTop = chatScreenRef?.value?.scrollHeight;
    }, 1000);
  };

const { status: responseStatus, data: timeLineData, refresh: usageRefresh } = await useLazyFetch(
    `/api/timeline/chat/${route.params.id}`,
  );

const isPageLoading = computed(() => responseStatus.value === "pending");
  onMounted(() => {
    {
      scrollChatBox();
    }
  });

  const paramId: any = route;
  const changeStatus = ref(false);
  const revertStatus = ref(false);
  const status = ref();
  const leadData:any = ref();
  // const { status, data: leadData } = await useLazyFetch(
  //   () => `/api/org/chat/${route.params.id}`,
  //   {
  //     server: false,
  //   },
  // );
  // const isPageLoading = computed(() => status.value === "pending");
  watchEffect(() => {
  if (leadData.value) {
    const userName = leadData.value?.botUser?.name ?? 'Unknown User';
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
    const { params, ...rest } = leadData.value.metadata as Record<string, any>;
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
      ["Mobile", leadData?.value?.botUser?.mobile],
      ["Bot Name", name],
    ];
    return [metaData, Object.entries(params)];
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
  const messages = await $fetch(`/api/org/chat/${route.params.id}/messages`, {
    method: "GET",
    server: false,
  });

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
