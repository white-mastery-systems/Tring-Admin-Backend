<template>
  <page :title="botDetails.name" :disableSelector="true" :disable-back-button="false" :disable-elevation="true"
    custom-back-router="/chat-bot">
    <template #actionButtons>
      <!-- <div class="flex justify-end"> -->
      <!-- <UiButton class="flex items-center justify-end border-none">
        Link channe
      </UiButton> -->
      <div class="flex flex-col w-full items-center overflow-x-scroll sm:flex-row">
        <div class="flex w-full items-center justify-between gap-2 overflow-x-scroll sm:flex-row">
          <div class="items-cetner flex gap-4">
            <div v-if="botDetails.documentId" class="flex items-center gap-[5px] text-[#1abb00]">
              <div class="flex h-[6px] w-[6px] items-center rounded-full bg-[#1abb00]"></div>
              <span class="text-[15px] sm:text-[15px] md:text-[17px] lg:text-[16px] xl:text-[16px]">Active</span>
            </div>
            <!-- v-else -->
            <div v-else class="flex items-center gap-[5px] pl-2 font-medium text-[#ff0000]">
              <div class="flex h-[6px] w-[6px] items-center rounded-full bg-[#ff0000]"></div>
              <span class="md:text-[14px] lg:text-[16px]">Inactive</span>
            </div>
          </div>
          <div
            class="flex flex-col items-start justify-center gap-4 sm:flex-row sm:items-center lg:items-center xl:items-center">
            <div
              class="items-top sm:items-top md:items-top mt-3 flex gap-3 sm:mt-3 md:mt-0 lg:mt-0 lg:items-center xl:mt-0 xl:items-center">
              <div class="flex flex-col items-center gap-1">
                <UiButton color="primary" class="p-3" @click="() => {
                  channelModalState.open = true;
                  channelModalState.id = botDetails.id;
                }
                ">
                  <span class="hidden lg:inline"> Configure channel </span>
                  <span class="flex flex-col items-center justify-center lg:hidden">
                    <component :is="Settings" :size="20"></component>
                  </span>
                </UiButton>
                <div class="block text-[4px] lg:hidden">Configure channel</div>
              </div>
              <div class="flex flex-col items-center gap-1" v-if="!botDetails.documentId">
                <UiButton class="bg-[#424bd1] text-[14px] p-2 hover:bg-[#424bd1]/90 disabled:opacity-50"
                  @click="handleActivateBot" :disabled="isSubmitting">
                  <span class="hidden lg:inline"> Activate Bot </span>
                  <span class="flex flex-col items-center justify-center lg:hidden">
                    <component :is="Bot"></component>
                  </span>
                </UiButton>
                <div class="block text-[4px] lg:hidden">Activate Bot</div>
              </div>
              <span v-if="botDetails.documentId" class="flex items-center gap-4">
                <div class="flex flex-col items-center gap-1">
                  <UiButton
                    class="rounded-[8px] bg-[#ff0000] py-2 px-3 text-[14px] font-medium text-white hover:bg-[#ff0000] hover:brightness-90"
                    @click="deactivateBot">
                    <!-- Deactivate Bot -->
                    <span class="hidden lg:inline"> Deactivate Bot </span>
                    <!-- Icon for small screens -->
                    <span class="flex flex-col items-center justify-center lg:hidden">
                      <Icon name="bx:block" class="h-5 w-5" />
                    </span>
                  </UiButton>
                  <div class="block text-[4px] lg:hidden">Deactivate Bot</div>
                </div>

                <ConfirmationModal v-model:open="modalOpen" title="Confirm Deactivation"
                  description="Are you sure you want to deactivate bot ?" @confirm="deactivateBotDialog" />
                <div class="flex flex-col items-center gap-1">
                  <UiButton as="a" :href="previewUrl" target="_blank" variant="outline"
                    class="py-2 px-3 text-[14px] font-medium text-[#000000] gap-2 border-[#000000]">
                    <Eye class="w-5 h-5" />
                    <span class="hidden lg:inline"> Preview Bot </span>
                    <!-- <span class="flex items-center justify-center lg:hidden">
                      <Icon name="entypo:controller-play" class="h-5 w-5" />
                    </span> -->
                  </UiButton>
                  <div class="block text-[4px] lg:hidden">Preview Bot</div>
                </div>
                <div class="flex flex-col items-center gap-1">
                  <UiButton color="primary" class="gap-2 py-2 px-3 button_shadow" @click="copyScript">
                    <FileCode class="w-5 h-5" />
                    <span class="hidden lg:inline"> Copy Script </span>
                    <!-- <span class="flex items-center justify-center lg:hidden">
                      <Icon name="mdi:content-copy" class="h-4 w-4 px-1 text-white" />
                    </span> -->
                  </UiButton>
                  <div class="block text-[4px] lg:hidden">Copy Script</div>
                </div>
              </span>
              <div class="flex flex-col items-center gap-1">
                <UiButton variant="destructive" @click="handleDelete"
                  class="flex items-center justify-center bg-[#ff0000] p-3 hover:bg-[#ff0000]/90 hover:brightness-90">
                  <Icon name="lucide:trash-2" class="h-4 w-4" />
                </UiButton>
                <div class="block text-[4px] lg:hidden">Delete</div>
              </div>
              <div class="flex flex-col items-center gap-1" @click="agentModalState.open = true">
                <UiButton variant="destructive"
                  class="flex items-center justify-center bg-[#424bd1] p-3 hover:bg-[#424bd1]/90 hover:brightness-90">
                  <Icon name="lucide:pen" class="h-4 w-4" />
                </UiButton>
                <div class="block text-[4px] lg:hidden">Edit</div>
              </div>
              <CreateEditChannelModal v-model="channelModalState" @success="handleSuccess" />
              <ConfirmationModal v-model:open="deleteModalState" title="Are you sure?"
                description="Are you sure you want to delete bot ?" @confirm="handleDeleteBot" />
              <AddChatBotModal v-model="agentModalState" @editConfirm="() => {
                agentModalState.open = false;
                navigateTo({ name: 'chat-bot' });
                // getAllChatBot()
              }
              "></AddChatBotModal>
            </div>
          </div>

          <!-- <span class="font-semibold content-align">Date Created</span>
          <span class="font-semibold content-align">Status</span> -->
        </div>
      </div>
      <!-- </div> -->
      <!-- Communication -->
    </template>
    <!-- <div class="-ml-6 -mr-10">
      <UiSeparator orientation="horizontal" class="bg-[#E2E8F0] w-full" />
    </div> -->
    <!-- <div>
    <CreateBotForm />
  </div> -->
    <LazyUiDialog v-if="!botDetails.documentId" v-model:open="isDocumentListOpen">
      <UiDialogTrigger class=""> </UiDialogTrigger>
      <UiDialogContent align="end" class="sm:max-w-md">
        <UiDialogHeader>
          <UiDialogTitle>Launch Bot</UiDialogTitle>
          <UiDialogDescription>
            Choose a document to deploy your bot
          </UiDialogDescription>
        </UiDialogHeader>
        <UiButton
          class="bg-white text-[15px] text-black shadow-3xl hover:bg-[#fff8eb] hover:text-[#ffbc42] min-w-[90%] max-w-[100%]"
          v-for="list in documents.documents.filter(
          (item: any) => item.status === 'ready',
        )" :key="list.id" @click="async () => {
          isSubmitting = true;
          isDocumentListOpen = false;
          try {
            await singleDocumentDeploy(list);
            store.createBotsuccessfulState.open = false;
          } catch (err) {
            store.createBotsuccessfulState.open = false;
          }
        }">

          <span class="w-[95%] truncate">
            {{ list.name }}
          </span>
        </UiButton>
      </UiDialogContent>
    </LazyUiDialog>
    <!-- <div ref="scrollTarget" class="border-[1px] border-solid border-[#E4E4E7] rounded-lg p-2">
      <WebScrapingForm />
    </div> -->
    <!-- <div>
      <CreateBotFields ref="childRef" @confirm="handleAddEditBot" />
    </div> -->
    <!-- leading-none -->
    <div class="font-bold text-[18px] sm:text-[18px] md:text-[20px] mt-4 px-4 sm:px-4 md:px-0">
      View and Edit your Chatbots features
    </div>

    <CreateBot :botDetails="botDetails" :documents="documents" :refresh="refresh" :refreshBot="refreshBot"
      :loading="loading" />
    <!-- <div class="flex justify-center">
      <UiButton @click="triggerChildSubmit">Create bot</UiButton>
    </div> -->
    <ChatBotSuccessfulMessageModal v-model="store.createBotsuccessfulState" :botDetails="botDetails"
      :refreshBot="refreshBot" @success="() => {
        store.createBotsuccessfulState.open = false;
        refreshBot()
      console.log('on success')
    }" />
    <div>
      <!-- <LazyUiDialog v-if="!botDetails.documentId" v-model:open="isDocumentListOpen">
        <UiDialogTrigger class=""> </UiDialogTrigger>
        <UiDialogContent align="end" class="sm:max-w-md">
          <UiDialogHeader>
            <UiDialogTitle>Launch Bot</UiDialogTitle>
            <UiDialogDescription>
              Choose a document to deploy your bot
            </UiDialogDescription>
          </UiDialogHeader>
          <UiButton
            class="bg-white text-[15px] text-black shadow-3xl hover:bg-[#fff8eb] hover:text-[#ffbc42] min-w-[90%] max-w-[100%]"
            v-for="list in documents.documents.filter(
              (item: any) => item.status === 'ready',
            )" :key="list.id" @click="async () => {
                isSubmitting = true;
                isDocumentListOpen = false;
                try {
                  await singleDocumentDeploy(list);
                  createBotsuccessfulState.open = false;
                } catch (err) {
                  createBotsuccessfulState.open = false;
                }
              }
              ">
            <span class="w-[95%] truncate">
              {{ list.name }}
            </span>
          </UiButton>
        </UiDialogContent>
      </LazyUiDialog> -->
      <!-- <div class="mb-[120px]">
        <div v-for="(list, index) in dataList" :key="index">
          <NuxtLink :to="{ name: list.routeName, params: { id: paramId.params.id } }"
            class="field_shadow mx-0 my-[17px] flex w-full cursor-pointer items-center justify-between rounded-[10px] bg-[#ffffff] px-[30px] py-[20px] text-[14px] hover:bg-[#fff8eb] hover:text-[#ffbc42]">
            <div class="flex w-full items-center gap-4 rounded-[10px]">
              <div class="flex flex-col space-y-2">
                <div class="flex flex-row gap-3">
                  <span class="bot_name_align font-medium">{{ list.bot }}</span>
                </div>
                <span class="text-xs text-gray-500">{{ list.helperText }}</span>
              </div>
              <Icon v-if="
                list.bot === 'Document Management' &&
                botDetails.documents.length === 0
              " class="h-6 w-6 text-red-500" name="nonicons:error-16" />
            </div>
            <div>
              <LeftArrowIcon class="w-[30px] hover:text-[#ffbc42]" />
            </div>
          </NuxtLink>
        </div>
      </div> -->
    </div>
  </page>
</template>
<script setup lang="ts">
definePageMeta({
  middleware: "admin-only",
});

import { useClipboard } from "@vueuse/core";
import { Bot, Settings, Eye, FileCode } from "lucide-vue-next";
import { ref } from "vue";
import { toast } from "vue-sonner";
// import CreateBot from "~/components/chatBot/CreateBot";
import { useDataList } from "~/composables/botManagement/chatBot/useDataList";
import { useBotDetails } from '~/composables/botManagement/chatBot/useBotDetails';
import { useDocumentsList } from '~/composables/botManagement/chatBot/useDocumentsList';
import { useBreadcrumbStore } from "~/store/breadcrumbs"; // Import the store
import { useBotDocuments } from '~/composables/botManagement/chatBot/useBotDocuments';
import { useBotList } from "~/composables/botManagement/chatBot/useBotList";
import { botStore } from '~/store/botStore';
import { useRoute, useRouter } from "vue-router";


const router = useRouter();
const route = useRoute("chat-bot-id");
const emit = defineEmits<{ (e: "confirm"): void }>();
const paramId: any = route;
const queryId = ref(route.params?.id);
const agentModalState = ref({ open: false, id: paramId.params.id });
const { status, documents, refresh } = useBotDocuments(route.params.id);
const store = botStore();
// const botDetails = ref(await getBotDetails(paramId.params.id));
const { botDetails, loading, error, refreshBot } = useBotDetails(route.params.id);
// const { documentsList, refreshDocuments } = useDocumentsList(route.params.id)
const deleteModalState = ref(false);
const modalOpen = ref(false);
const isDocumentListOpen = ref(false);
const isSubmitting = ref(false);
// const getDocumentList: any = ref();
const channelModalState = ref<{ open: boolean; id: string | null }>({
  open: false,
  id: null,
});
const { dataList } = useDataList()
const scrapedData = ref(null);
// const childRef = ref(null);
const scrollTarget = ref(null);
const breadcrumbStore = useBreadcrumbStore();
const { botListStatus, bots } = useBotList();
const isDataLoading = computed(() => status.value === "pending");
// const createBotsuccessfulState = ref({
//   open: false,
// });
// const pageLoading = ref(false);

// Use a ref to track if guard is registered
const guardRegistered = ref(false);
// Use a ref to store unregister function
const unregisterGuard = ref(null);

watch(
  () => botDetails.value?.name,
  (newName) => {
    const userName = newName ?? "Unknown Bot Name";
    breadcrumbStore.setBreadcrumbs([
      {
        label: "CreateBot", // Dynamic name
        to: `/chat-bot`,
      },
      {
        label: `${userName}`, // Dynamic name
        to: `/chat-bot/${queryId.value}`,
      },
    ]);
    useHead({
      title: `Chat Bot | ${userName}`,
    });
  },
  { deep: true, immediate: true }
);
// Watch for document ID changes
watch(() => botDetails.value?.documentId, (newId) => {
  if (newId) {
    store.scrapedData = [];
  }
},{deep: true, immediate: true});
// router.beforeEach((to, from) => {
//   store.lastVisitedRoute = from.path
// })

// watch(() => botDetails.value?.documentId, (newId) => {
//   console.log(newId, 'newId',store.lastVisitedRoute)
//   store.scrapedData = []
//   // && store.lastVisitedRoute.includes('/chat-bot/create-bot')
//   if (newId) {
//     createBotsuccessfulState.value.open = true
//   }
// })

const handleSuccess = () => {
  channelModalState.value.open = false;
  toast.success("Channel Created successfully");
};
// onMounted(() => {
//   console.log(botDetails.value?.documentId, 'botDetails.value?.documentId onMounted')
//   if (botDetails.value?.documentId) {
//     createBotsuccessfulState.value.open = true;
//   }
// })
// onMounted(async () => {
//   // getDocumentList.value = await listDocumentsByBotId(paramId.params.id);
//   if (!documents.value.documentId) {
//     await handleActivateBot()
//   } else {
//     setTimeout(() => {
//       createBotsuccessfulState.value.open = true;
//     }, 0);
//   }
  
//   // botDetails.value = await getBotDetails(paramId.params.id);
// });

const previewUrl = computed(() => {
  let col = botDetails.value.metadata.ui.color as string;
  col = col
    ?.split(" ")
    .map((element) => {
      if (element.at(-1) === "%") return element.slice(0, -1);
      else return element;
    })
    .join(" ");
  let secondaryColor = botDetails.value.metadata.ui.secondaryColor as string;
  secondaryColor = secondaryColor
    ?.split(" ")
    .map((element) => {
      if (element.at(-1) === "%") return element.slice(0, -1);
      else return element;
    })
    .join(" ");
  return `${window.location.origin}/preview.html?orgname=WMS&chatbotid=${paramId.params.id}&mode=preview`;
});

// const botManagementDetails = async (list: any, index: any) => {
//   await navigateTo({
//     name: list.routeName,
//     params: { id: paramId.params.id },
//   });
// };
const deactivateBot = async () => {
  modalOpen.value = true;
};

const deactivateBotDialog = async () => {
  await disableBot(paramId.params.id);
  await refreshBot() // new function refreshBot added
  // botDetails.value = await getBotDetails(paramId.params.id)
  modalOpen.value = false;
};

const botScript =
  "<" +
  `script src="${window?.location?.href?.includes("app.tringlabs.ai") ? "https://chat.tringlabs.ai" : "https://tring-databot.pripod.com"}/widget.js" data-chatbotid="${paramId.params.id}" data-orgname="WMS">` +
  "</" +
  "script>";

const { copy } = useClipboard({ source: botScript });
const copyScript = async () => {
  copy(botScript);
  toast.success("Copied to clipboard");
};

const singleDocumentDeploy = async (list: any) => {
  await deployDocument(paramId.params.id, list.id,false);
  refreshBot() // new function refreshBot added
  // botDetails.value = await getBotDetails(paramId.params.id);
};

const handleDelete = () => {
  deleteModalState.value = true;
};

const handleDeleteBot = () => {
  deleteModalState.value = false;
  deleteBot(route.params.id);
};

// const handleScrapedData = (data: any) => {
//   scrapedData.value = data;
//   console.log("Received in parent:", data);
// }handleFieldsChanges
const handleFieldsChanges = () => {
  console.log("Fields changed");
}

const handleAddEditBot = async (values: any) => {
  // const documentsList = await listDocumentsByBotId(paramId.params.id)
  // const list = await getDocumentsList(paramId.params.id)
  if (!botDetails.value.documents.length) {
    toast.error("Please add at least one document to deploy bot");
    if (scrollTarget.value) {
      scrollTarget.value?.scrollIntoView({ behavior: "smooth" });
    }
    return;
  } else if (!documentsList.value.length) {
    toast.error("Please add at least one document to deploy bot");
    if (scrollTarget?.value) {
      scrollTarget.value.scrollIntoView({ behavior: "smooth" });
    }
    return
  }
  // console.log("documentsList", documentsList.documents.length);
  try {
    // if (agentModalState.value.id) {
    const bot = await $fetch(`/api/bots/${queryId.value}`, {
      method: "PUT",
      body: values,
    });
    toast.success("Updated successfully");
    // }
    // if (agentModalState.value.id) {
    //   emit("editConfirm");
    // } else {
    //   emit("confirm");
    // }
  } catch (err: any) {
    toast.error(err.data.data[0].message);
  }
}

// const triggerChildSubmit = () => {
//   if (!childRef.value.values.name && !childRef.value.values.type) {
//     if (scrollTarget.value) {
//       scrollTarget.value.scrollIntoView({ behavior: "smooth" });
//     }
//   }
//   if (childRef.value) {
//     childRef.value.handleAddEditBot();
//   }
// };

const handleActivateBot = async () => {
  await refreshBot()
  isSubmitting.value = true;
  const hasLogoInUI = botDetails.value?.metadata?.ui?.logo;
  
  // If no logo in UI, check if organization has a logo
  const hasOrgLogo = botDetails.value?.organization?.logo?.url;
  
  if (!hasLogoInUI && !hasOrgLogo) {
    toast.error("Please fill all required in Customize Your Chatbot's Look");
    isSubmitting.value = false;
    return;
  }
  
  // Check required fields in prompt metadata
  const promptMetadata = botDetails.value?.metadata?.prompt;
  const hasName = promptMetadata.NAME;
  const hasRole = promptMetadata?.ROLE;
  const hasCompanyName = promptMetadata?.COMPANY;
  const hasGoal = promptMetadata?.GOAL;
  const hasLanguage = promptMetadata?.LANGUAGE;

  if (!hasName || !hasRole || !hasCompanyName || !hasGoal || !hasLanguage) {
    toast.error("Please fill all required fields in bot setup");
    isSubmitting.value = false;
    return;
  }
  const activeDocuments = botDetails.value.documents.filter(
    (d) => d.status === "ready",
  );
  if (activeDocuments.length === 0) {
    toast.error("Please add document to activate bot");
    return navigateTo({
      name: "chat-bot-id",
      params: { id: paramId.params.id },
    });
  } else if (!botDetails.value.metadata?.prompt?.NAME) {
    toast.error("Please add bot setup to activate bot");
    return navigateTo({
      name: "chat-bot-id",
      params: { id: paramId.params.id },
    });
  } else if (!botDetails.value.metadata.ui?.logo) {
    toast.error("Please update bot user interface to activate bot");
    return navigateTo({
      name: "chat-bot-id",
      params: { id: paramId.params.id },
    });
  }
  if (activeDocuments.length === 1) {
    try {
      await singleDocumentDeploy(activeDocuments[0]);
    } catch (err) {
      store.createBotsuccessfulState.open = false
      isSubmitting.value = false;
      toast.error("Failed to active the bot, try again");
      return;
    }
  } else {
    isDocumentListOpen.value = true;
  }
  isSubmitting.value = false;
};
onUnmounted(() => {
  if (unregisterGuard.value) {
    unregisterGuard.value() // Remove the guard
    guardRegistered.value = false;
  }
})
</script>

<style scoped>
.header-align {
  font-family: segoe UI Regular;
}
</style>