<template>
  <page :title="botDetails.name ?? ''" :bread-crumbs="[]" :disableSelector="true" :disable-back-button="false"
    :disable-elevation="true" custom-back-router="/voice-bot">
    <template #actionButtons>
      <div class="flex w-full items-center pl-[7px] pr-[0px]">
        <div class="flex w-full items-center justify-between gap-2 overflow-x-scroll sm:flex-row">
          <div class="items-cetner flex gap-4">
            <div v-if="botDetails.active" class="flex items-center gap-[5px] text-[#1abb00]">
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
            <!-- <span
              class="text-[15px] font-bold text-black sm:text-[15px] md:text-[17px] lg:text-[17px] xl:text-[17px]"
              >Date Created:
              <span
                class="font-medium text-black md:text-[17px] lg:text-[15px]"
                >{{ dateFormate }}</span
              >
            </span> -->
            <div class="flex items-center gap-3">
              <div class="flex flex-col items-center gap-1">
                <UiButton class="bg-[#424bd1] text-[14px] p-2 hover:bg-[#424bd1]/90 disabled:opacity-50"
                  @click="handleActivateBot" :disabled="botDetails.active">
                  <span class="hidden lg:inline"> Activate Bot </span>
                  <span class="flex flex-col items-center justify-center lg:hidden">
                    <component :is="Bot"></component>
                  </span>
                </UiButton>
                <div class="block text-[4px] lg:hidden"> Activate Bot </div>
              </div>
              <span class="flex items-center gap-4">
                <div class="flex flex-col items-center gap-1">
                  <UiButton
                    class="rounded-[8px] bg-[#ff0000] p-2 p-2.5 text-[14px] font-medium text-white hover:bg-[#ff0000] hover:brightness-90"
                    @click="handleActivateBot" :disabled="!botDetails.active">
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
                <!-- <div class="flex flex-col items-center gap-1">
                  <UiButton as="a" :href="previewUrl" target="_blank"
                    class="bg-[#474df9] p-2 text-[14px] font-medium text-white hover:bg-[#474df9] hover:brightness-90">
                    <span class="hidden lg:inline"> Preview Bot </span>
                    <span class="flex items-center justify-center lg:hidden">
                      <Icon name="entypo:controller-play" class="h-5 w-5" />
                    </span>
                  </UiButton>
                  <div class="block text-[4px] lg:hidden">Preview Bot</div>
                </div> -->
                <!-- <div class="flex flex-col items-center gap-1">
                  <UiButton class="bg-[#e1dede] p-2 text-black hover:bg-[#d4d2d2]" @click="copyScript">
                    <span class="hidden lg:inline"> Copy Script </span>
                    <span class="flex items-center justify-center lg:hidden">
                      <Icon name="mdi:content-copy" class="h-4 w-4 px-1 text-white" />
                    </span>
                  </UiButton>
                  <div class="block text-[4px] lg:hidden">Copy Script</div>
                </div> -->
              </span>
              <div class="flex flex-col items-center gap-1">
                <UiButton variant="destructive" @click="handleDelete"
                  class="bg-[#ff0000] p-2 hover:bg-[#ff0000]/90 hover:brightness-90">
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
              <ConfirmationModal v-model:open="deleteModalState" title="Are you sure?"
                description="Are you sure you want to delete voice bot ?" @confirm="handleDeleteBot" />
            </div>
          </div>
          <!-- <span class="font-semibold content-align">Date Created</span>
          <span class="font-semibold content-align">Status</span> -->
        </div>
      </div>
    </template>
    <div class="font-bold text-[20px] leading-none mb-2">
      View and Edit your Voicebot features
    </div>
    <EditVoiceBot :botDetails="botDetails" :refresh="refreshBot" :loading="loading" />
    <VoiceBotSuccessFulMessageModal v-model="createBotVoicesuccessfulState" @success="() => {
      console.log('success');
      createBotVoicesuccessfulState.open = false;
      // refreshBot();
    }" />
    <div class="" v-if=false>
      <LazyUiDialog v-if=" !botDetails.documentId" v-model:open="isDocumentListOpen">
        <UiDialogTrigger class=""> </UiDialogTrigger>
        <UiDialogContent align="end" class="sm:max-w-md">
          <UiDialogHeader>
            <UiDialogTitle>Launch Bot</UiDialogTitle>
            <UiDialogDescription>
              Choose a document to deploy your bot
            </UiDialogDescription>
          </UiDialogHeader>
          <UiButton
            class="deploy-bot-list-align bg-white text-[15px] text-black shadow-3xl hover:bg-[#fff8eb] hover:text-[#ffbc42]"
            v-for="list in getDocumentList.documents.filter(
              (item: any) => item.status === 'ready',
            )" :key="list.id" @click="async () => {
                isDocumentListOpen = false;
                await singleDocumentDeploy(list);
              }
              ">
            <!-- isSubmitting = true; -->
            {{ list.name }}
          </UiButton>
        </UiDialogContent>
      </LazyUiDialog>
      <div class="pb-10 mb-10">
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
      </div>
      <CreateEditVoiceBotModal v-model="agentModalState" @editConfirm="() => {
          agentModalState.open = false;
          refreshBot()
        }" />
    </div>
  </page>
</template>
<script setup lang="ts">
import { useClipboard } from "@vueuse/core";
import { ref } from "vue";
import { toast } from "vue-sonner";
import { Bot } from "lucide-vue-next";
import { useBreadcrumbStore } from "~/store/breadcrumbs"; // Import the store
import { useVoiceBotDetails } from "~/composables/botManagement/voiceBot/useVoiceBotDetails ";

definePageMeta({
  middleware: "admin-only",
});
const router = useRouter();
const createBotVoicesuccessfulState = ref({
  open: false,
});
// const selectedValue = ref("Today");
const route = useRoute("voice-bot-id");
const paramId: any = route;
const breadcrumbStore = useBreadcrumbStore();
// const botDetails = ref(await getVoiceBotDetails(paramId.params.id));
// const { data: botDetails, status: botLoadingStatus, refresh: integrationRefresh } = await useLazyFetch(`/api/voicebots/${route.params.id}`);
const { botDetails, loading, error, refreshBot } = useVoiceBotDetails(paramId.params.id)
const agentModalState = ref({ open: false, id: paramId.params.id });

breadcrumbStore.setBreadcrumbs([
  {
    label: 'Voice Bot',
    to: `/voice-bot`,
  },
  {
    label: `${botDetails.value?.name}`,
    to: `/voice-bot`,
  },
]);
const deleteModalState = ref(false);
const modalOpen = ref(false);
const isDocumentListOpen = ref(false);
const isSubmitting = ref(false);
const getDocumentList: any = ref();
const voiceBotActive = ref(false)
const audioResponseData = ref([])
const config = useRuntimeConfig()

watchEffect(() => {
  if (botDetails.value) {
    const userName = botDetails.value.name ?? 'Unknown Bot Name';
    useHead({
      title: `Voice Bot | ${userName}`,
    });
  }
});
watch(() => botDetails.value.active,(newActive) => {
  if (newActive) {
    createBotVoicesuccessfulState.value.open = true;
  }
})

onMounted(async () => {
  getDocumentList.value = await listDocumentsByBotId(paramId.params.id);
  // 27-03-2025 -- Commented below code as we are for now not using this API
  // audioResponseData.value = await getPreRecordedAudioDetails(paramId.params.id, botDetails.value?.organizationId, config)
});
const handleGoBack = () => {
  return navigateTo({
    name: "voice-bot",
  }); 
};
const dataList = ref([
  {
    _id: 1,
    bot: "Bot Details",
    helperText:
      "This bot assists with managing user identities, including authentication, authorization, and user profiles.",
    routeName: "voice-bot-id-identity-management",
  },
  {
    _id: 2,
    bot: "Speech To Text Configurations",
    helperText:
      "Configure speech-to-text capabilities for the voice bot, including language detection, speech recognition, and text-to-speech.",
    routeName: "voice-bot-id-speech-to-text-config",
  },
  {
    _id: 3,
    bot: "Text To Speech Configurations",
    helperText:
      "Configure text-to-speech capabilities for the voice bot, including voice synthesis, and speech synthesis.",
    routeName: "voice-bot-id-text-to-speech-config",
  },
  {
    _id: 4,
    bot: "LLM Configuration",
    helperText:
      "Set up large language models for the voice bot, optimizing it for understanding and generating natural language responses.",
    routeName: "voice-bot-id-llm-config",
  },
  {
    _id: 5,
    bot: "CRM Configuration",
    helperText:
      "Configure CRM integration for the voice bot, enabling it to access and update customer data during voice interactions.",
    routeName: "voice-bot-id-crm-config",
  },
  {
    _id: 6,
    bot: "Pre Recorded Audio",
    helperText:
      "Configure and upload pre-recorded audio clips for the voice bot.",
    routeName: "voice-bot-id-pre-recorded-audio",
  },
  {
    _id: 7,
    bot: "LLM Caching",
    helperText:
      "Optimize the performance of large language models by managing caching configurations.",
    routeName: "voice-bot-id-llm-caching",
  },
  {
    _id: 8,
    bot: "Tools",
    helperText:
      "Manage and configure tools integrated with the voice bot.",
    routeName: "voice-bot-id-tools",
  },
  {
    _id: 9,
    bot: "IVR Configuration",
    helperText:
      "Configure the IVR settings to manage call flows and automate responses for the voice bot.",
    routeName: "voice-bot-id-ivr-config",
  },
]);


const deactivateBotDialog = async () => {
  await disableBot(paramId.params.id);
  modalOpen.value = false;
};

const botScript =
  "<" +
  `script src="https://tring-databot.pripod.com/widget.js" data-chatbotid="${paramId.params.id}" data-orgname="WMS">` +
  "</" +
  "script>";

const { copy } = useClipboard({ source: botScript });

const singleDocumentDeploy = async (list: any) => {
  await deployDocument(paramId.params.id, list.id);
  botDetails.value = await getBotDetails(paramId.params.id);
};

const handleDelete = () => {
  deleteModalState.value = true;
};

const handleDeleteBot = () => {
  deleteModalState.value = false;
  deleteVoiceBot(route.params.id);
};

const handleActivateBot = async () => {
  if (botDetails.value.ivrConfig === null) {
    toast.error("Please configure IVR first");
    // return navigateTo({
    //   name: "voice-bot-id-ivr-config",
    //   params: { id: paramId.params.id },
    // })
  } else if (botDetails.value.botDetails === null) {
    toast.error("Please configure Bot Details first");
    // return navigateTo({
    //   name: "voice-bot-id-identity-management",
    //   params: { id: paramId.params.id },
    // })
  } else if (!audioResponseData.value.welcome.length || !audioResponseData.value.conclude.length) {
    toast.error("Please configure welcome and conclude Audio Response first");
    // return navigateTo({
    //   name: "voice-bot-id-pre-recorded-audio",
    //   params: { id: paramId.params.id },
    // })
  } else {
    let getActive = botDetails.value.active
    getActive = !getActive
    try {
      const voiceBotDetails = await $fetch(`/api/voicebots/${paramId.params.id}/deploy`, {
        method: "PUT", body: {
          active: getActive,
        },
      });
      refreshBot()
      if (voiceBotDetails.active) {
        toast.success("Activated successfully");
      } else {
        toast.error("Deactivated successfully")
      }
    } catch (error) {
      toast.error(error.statusMessage);
    }
  }
};

</script>

<style scoped>
/* .bot-manage-main-container {
    padding: 7px 25px;
  } */

.header-align {
  font-family: segoe UI Regular;
}
</style>
