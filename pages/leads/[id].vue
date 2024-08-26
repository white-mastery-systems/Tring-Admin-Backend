<template>
  <Page
    :title="leadData?.botUser?.name ?? ''"
    :disable-back-button="false"
    :disable-elevation="true"
  >
    <div
      class="items-top xs:grid-cols-2 flex grid grid-cols-1 gap-[25px] lg:grid-cols-2"
    >
      <!-- mx-8 -->
      <div
        class="flex w-full justify-around gap-8 sm:w-full md:w-[70%] lg:w-[90%] xl:w-[90%]"
      >
        <UiTabs default-value="client" class="w-full self-start">
          <UiTabsList class="grid w-full grid-cols-2">
            <UiTabsTrigger value="client"> Client Info </UiTabsTrigger>
            <UiTabsTrigger value="campaign"> Campaign Info </UiTabsTrigger>
          </UiTabsList>

          <UiTabsContent value="client">
            <div
              class="flex grid grid-cols-2 flex-col items-center gap-2 pl-4 capitalize"
            >
              <div
                v-for="[key, value] in details[0]"
                class="max-w-full font-medium"
              >
                <div class="max-w-[100%] truncate">
                  <div class="text-gray-500">{{ key }}</div>
                  <div>
                    <a v-if="key === 'Mobile'" href="tel:{{ value }}">
                      {{ value }}
                    </a>
                    <a
                      v-else-if="key === 'Email'"
                      href="mailto:{{ value }}"
                      class="lowercase"
                    >
                      {{ value }}
                    </a>
                    <div v-else>
                      {{ value }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </UiTabsContent>
          <UiTabsContent value="campaign">
            <div
              class="flex grid grid-cols-2 flex-col items-center gap-2 pl-4 capitalize"
            >
              <div
                v-for="[key, value] in details[1]"
                class="max-w-full font-medium"
              >
                <div class="max-w-[100%] truncate">
                  <div class="text-gray-500">{{ key }}</div>
                  <div>
                    {{ value }}
                  </div>
                </div>
              </div>
            </div>
          </UiTabsContent>
        </UiTabs>
      </div>
      <div
        class="field_shadow h-[75vh] w-full overflow-hidden rounded-lg bg-[#ffffff] sm:w-full md:w-full lg:w-[100%] xl:w-[100%]"
      >
        <div
          :class="[
            'chat-header-align flex items-center justify-between font-medium',
          ]"
          :style="`background:hsl(${leadData?.bot.metadata.ui?.color?.replaceAll(' ', ',')})`"
        >
          <div class="flex items-center gap-2">
            <span class="text-[14px] capitalize">{{
              leadData?.bot?.name
            }}</span>
          </div>
        </div>
        <div class="all-message-align bg-[#f8f6f6]">
          <div
            class="chat-container-align"
            v-for="(messageList, messageIndex) in leadData?.messages.slice(1)"
            :key="messageIndex"
          >
            <div
              v-if="messageList.role === 'comment'"
              class="relative"
            >
            <div class="absolute left-1/2 top-1/2 h-[0.5px] w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-500/50">

            </div>
              <p
                class="relative mx-auto w-fit rounded-sm border bg-gray-100 px-2 py-1 text-xs font-thin"
              >
                {{ messageList.content }}
              </p>
            </div>
            <!-- User Message -->
            <div class="message-left-align" v-if="messageList.role === 'user'">
              <span class="text-[14px]" style="color: #8a8a8a">{{
                leadData?.botUser?.name
              }}</span>
              <div
                class="current-user flex items-end justify-center rounded-l-xl rounded-br-xl"
              >
                <div>{{ messageList.content }}</div>
              </div>
              <div class="text-[12px] opacity-60">
                {{ formatDate(new Date(messageList.createdAt), "hh:mm a") }}
              </div>
            </div>
            <!-- Assistant Message -->
            <div
              class="message-right-align"
              v-if="messageList.role === 'assistant'"
            >
              <span class="text-[14px]" style="color: #8a8a8a">{{
                leadData?.bot.metadata.prompt.NAME
              }}</span>
              <div
                class="ai-reply-align flex flex-col gap-2 rounded-r-xl rounded-bl-xl"
              >
                <MdText :content="JSON.parse(messageList.content).response" />
                <div class="flex flex-col">
                  <div class="flex items-center gap-2">
                    <div
                      class="flex items-center"
                      v-for="(btn, btnIndex) in JSON.parse(messageList.content)
                        .canned"
                      :key="btnIndex"
                    >
                      <p
                        class="pricing-align-btn rounded-xl p-2"
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
      </div>
    </div>
  </Page>
  <ConfirmationModal
    v-model:open="isDeleteConfirmationOpen"
    title="Confirm Delete"
    :description="`Are you sure you want to delete this lead - ${leadData?.botUser?.name} ?`"
    @confirm="handleDelete"
  />
</template>

<script setup lang="ts">
  import MdText from "~/components/MdText.vue";
  definePageMeta({
    middleware: "admin-only",
  });

  const router = useRouter();
  const route = useRoute("leads-id");
  const paramId: any = route;

  const { status, data: leadData } = await useLazyFetch(
    () => `/api/org/chat/${route.params.id}`,
    {
      server: false,
    },
  );
  const isPageLoading = computed(() => status.value === "pending");

  const details = computed(() => {
    if (!leadData.value) return [undefined, undefined];
    const { params, ...rest } = leadData.value.metadata as Record<string, any>;
    let metaData: any = Object.entries(rest).map(([key, value]) => {
      if (key === "os") {
        return ["OS", value];
      } else if (key === "ipAddress") {
        return ["IP Address", value];
      }
      return [key, value];
    });
    console.log({ metaData });
    metaData = [
      ...metaData,
      ["Name", leadData?.value?.botUser?.name],
      ["Email", leadData?.value?.botUser?.email],
      ["Mobile", leadData?.value?.botUser?.mobile],
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
</script>
<style scoped>
  .header-align {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 20px;
    /* border-bottom: 0.5px solid rgba(181, 181, 181, 1); */
  }

  /* .client_info_align {
    display: flex;
    flex-direction: column;
    align-items: start;
  } */

  /* .tab-align {
    padding: 0;
    color: rgba(138, 138, 138, 1);
    font-weight: 800;
    position: relative;
    display: inline-block;
    text-decoration: none;
    text-align: left;
  } */

  /* .group-tap-align {
    background-color: white;
    color: rgba(66, 75, 209, 1);
  } */

  /* .tab-align:active {
    color: rgba(66, 75, 209, 1);
    font-weight: 800;
    text-decoration: underline;
    text-underline-offset: 8px;
  } */

  /* .chatinfo-align {
  width: 50%;
  height: 75vh;
  background: #ffffff;
  box-shadow: 0px 2px 24px 0px rgba(0, 0, 0, 0.05) !important;
  overflow-y: hidden;
} */

  .chat-header-align {
    width: 100%;
    height: 70px;
    /* background: #424bd1; */
    color: white;
    padding: 0 20px;
  }

  .profile-align {
    width: 50px;
    height: 50px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 2px 24px 0px rgba(0, 0, 0, 0.05) !important;
  }

  .message-left-align {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: end;
    /* justify-content: end; */
  }

  .chat-container-align {
    width: 100%;
    padding: 20px;
  }

  .current-user {
    flex-direction: column;
    background: white;
    /* min-width: 20%; */
    max-width: 80%;
    padding: 10px;
    color: black;
    margin-top: 10px;
  }

  .message-right-align {
    width: 90%;
    /* background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 24px 0px rgba(0, 0, 0, 0.05) !important; */
  }

  .ai-profile-align {
    background: #424bd1;
    color: white;
    width: 50px;
    height: 50px;
  }

  .ai-reply-align {
    margin-top: 10px;
    min-height: 80px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 2px 24px 0px rgba(0, 0, 0, 0.05) !important;
    padding: 20px;
  }

  .web-align-btn {
    background: #ec848b;
    color: white;
    padding: 10px;
  }

  .pricing-align-btn {
    /* color: #424bd1; */
    width: auto;
    /* color: white; */
    /* padding: 3% 10px; */
    /* border: 1px solid #424bd1; */
  }

  .all-message-align {
    height: 65vh;
    overflow-y: scroll;
  }

  /* .custom-underline {
  position: relative;
  display: inline-block;
  text-decoration: none;
} */
</style>
