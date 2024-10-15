<template>
  <page :title="botDetails.name ?? ''" :bread-crumbs="[
    {
      label: `${botDetails.name}`,
      to: `/bot-management/voice-bot`,
    },
    {
      label: 'Voice Bot',
      to: `/bot-management/voice-bot`,
    },
  ]" :disableSelector="true" :disable-back-button="false" :disable-elevation="true"
    custom-back-router="/bot-management/voice-bot">
    <div class="">
      <div class="flex w-full items-center border-b border-[#b5b5b5] pb-[10px] pl-[7px] pr-[0px]">
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
            <!-- <span
              class="text-[15px] font-bold text-black sm:text-[15px] md:text-[17px] lg:text-[17px] xl:text-[17px]"
              >Date Created:
              <span
                class="font-medium text-black md:text-[17px] lg:text-[15px]"
                >{{ dateFormate }}</span
              >
            </span> -->
            <div class="flex items-center gap-3">
              <UiButton class="bg-[#424bd1] hover:bg-[#424bd1]/90 disabled:opacity-50 md:text-[14px] lg:text-[16px]"
                @click="handleActivateBot" :disabled="isSubmitting" v-if="!botDetails.documentId">
                Activate Bot</UiButton>
              <span v-if="botDetails.documentId" class="flex items-center gap-4">
                <div class="flex flex-col items-center gap-1">
                  <UiButton
                    class="rounded-[8px] bg-[#ff0000] p-2 p-2.5 text-[14px] font-medium text-white hover:bg-[#ff0000] hover:brightness-90"
                    @click="deactivateBot">
                    <!-- Deactivate Bot -->
                    <span class="hidden lg:inline"> Deactivate Bot </span>
                    <!-- Icon for small screens -->
                    <span class="flex flex-col items-center justify-center lg:hidden">
                      <Icon name="bx:block" class="h-5 w-5" />
                    </span>
                  </UiButton>
                  <div class="block text-[7px] lg:hidden">Deactivate Bot</div>
                </div>

                <ConfirmationModal v-model:open="modalOpen" title="Confirm Deactivation"
                  description="Are you sure you want to deactivate bot ?" @confirm="deactivateBotDialog" />
                <div class="flex flex-col items-center gap-1">
                  <UiButton as="a" :href="previewUrl" target="_blank"
                    class="bg-[#474df9] p-2 text-[14px] font-medium text-white hover:bg-[#474df9] hover:brightness-90">
                    <span class="hidden lg:inline"> Preview Bot </span>
                    <span class="flex items-center justify-center lg:hidden">
                      <Icon name="entypo:controller-play" class="h-5 w-5" />
                    </span>
                  </UiButton>
                  <div class="block text-[7px] lg:hidden">Preview Bot</div>
                </div>
                <div class="flex flex-col items-center gap-1">
                  <UiButton class="bg-[#e1dede] p-2 text-black hover:bg-[#d4d2d2]" @click="copyScript">
                    <span class="hidden lg:inline"> Copy Script </span>
                    <span class="flex items-center justify-center lg:hidden">
                      <Icon name="mdi:content-copy" class="h-4 w-4 px-1 text-white" />
                    </span>
                  </UiButton>
                  <div class="block text-[7px] lg:hidden">Copy Script</div>
                </div>
              </span>
              <div class="flex flex-col items-center gap-1">
                <UiButton variant="destructive" @click="handleDelete"
                  class="bg-[#ff0000] p-2 hover:bg-[#ff0000]/90 hover:brightness-90">
                  <Icon name="lucide:trash-2" class="h-4 w-4" />
                </UiButton>
                <div class="block text-[7px] lg:hidden">Delete</div>
              </div>
              <ConfirmationModal v-model:open="deleteModalState" title="Are you sure?"
                description="Are you sure you want to delete voice bot ?" @confirm="handleDeleteBot" />
            </div>
          </div>

          <!-- <span class="font-semibold content-align">Date Created</span>
          <span class="font-semibold content-align">Status</span> -->
        </div>
      </div>
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
            class="deploy-bot-list-align bg-white text-[15px] text-black shadow-3xl hover:bg-[#fff8eb] hover:text-[#ffbc42]"
            v-for="list in getDocumentList.documents.filter(
              (item: any) => item.status === 'ready',
            )" :key="list.id" @click="
              async () => {
                isSubmitting = true;
                isDocumentListOpen = false;
                await singleDocumentDeploy(list);
              }
            ">
            {{ list.name }}
          </UiButton>
        </UiDialogContent>
      </LazyUiDialog>
      <div class="pb-8">
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
    </div>
  </page>
</template>
<script setup lang="ts">
  definePageMeta({
    middleware: "admin-only",
  });
  import { useClipboard } from "@vueuse/core";
  import { ref } from "vue";
  import { toast } from "vue-sonner";
  const router = useRouter();
  // const selectedValue = ref("Today");
  const route = useRoute("bot-management-voice-bot-id");
  const paramId: any = route;
  const botDetails = ref(await getVoiceBotDetails(paramId.params.id));
  const deleteModalState = ref(false);
  const modalOpen = ref(false);
  const isDocumentListOpen = ref(false);
  const isSubmitting = ref(false);
  const getDocumentList: any = ref();

   watchEffect(() => {
  if (botDetails.value) {
    const userName = botDetails.value.name ?? 'Unknown Bot Name';
    useHead({
      title: `Voice Bot | ${userName}`,
    });
  }
   });

  onMounted(async () => {
    getDocumentList.value = await listDocumentsByBotId(paramId.params.id);
    botDetails.value = await getVoiceBotDetails(paramId.params.id);
  });
  const handleGoBack = () => {
    return navigateTo({
      name: "bot-management-voice-bot",
    });
  };
  const dataList = ref([
    {
      _id: 7,
      bot: "Talent Management",
      helperText:
        "Manage talent, including hiring, onboarding, and onboarding flows for the voice bot.",
      routeName: "bot-management-voice-bot-id-talent-mangement",
    },
    {
      _id: 7,
      bot: "Speech To Text Configurations",
      helperText:
        "Configure speech-to-text capabilities for the voice bot, including language detection, speech recognition, and text-to-speech.",
      routeName: "bot-management-voice-bot-id-speech-to-text-config",
    },
    {
      _id: 7,
      bot: "Text To Speech Configurations",
      helperText:
        "Configure text-to-speech capabilities for the voice bot, including voice synthesis, and speech synthesis.",
      routeName: "bot-management-voice-bot-id-text-to-speech-config",
    },
    {
      _id: 1,
      bot: "Bot Details",
      helperText:
        "This bot assists with managing user identities, including authentication, authorization, and user profiles.",
      routeName: "bot-management-voice-bot-id-identity-management",
    },
    {
      _id: 2,
      bot: "CRM Configuration",
      helperText:
        "Configure CRM integration for the voice bot, enabling it to access and update customer data during voice interactions.",
      routeName: "bot-management-voice-bot-id-crm-config",
    },
    {
      _id: 3,
      bot: "LLM Configuration",
      helperText:
        "Set up large language models for the voice bot, optimizing it for understanding and generating natural language responses.",
      routeName: "bot-management-voice-bot-id-llm-config",
    },
    {
      _id: 4,
      bot: "IVR Configuration",
      helperText:
        "Configure the IVR settings to manage call flows and automate responses for the voice bot.",
      routeName: "bot-management-voice-bot-id-ivr-config",
    },
    {
      _id: 5,
      bot: "Default Intents",
      helperText:
        "Define the intents that the voice bot will recognize and respond to during interactions with users.",
      routeName: "bot-management-voice-bot-id-intent-config",
    },
  ]);

  const dateFormate = computed(() => {
    if (botDetails && botDetails.value.createdAt) {
      return formatDateStringToDate(botDetails.value.createdAt);
    }
    return null;
  });

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
    return `${window.location.origin}/preview.html?orgname=WMS&chatbotid=${paramId.params.id}&brandcolor=${col}&secondarycolor=${secondaryColor}&mode=preview`;
  });

  

  const botManagementDetails = async (list: any, index: any) => {
    // console.log(list.bot.trim().toLowerCase().replace(/\s+/g, ' ') , "list")
    // if (list.bot === dataList.value[index].bot) {
    await navigateTo({
      name: list.routeName,
      params: { id: paramId.params.id },
    });
    // }
  };
  const deactivateBot = async () => {
    modalOpen.value = true;
  };

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
  const copyScript = async () => {
    copy(botScript);
    toast.success("Copied to clipboard");
  };

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

  const handleActivateBot = async () => {};
</script>

<style scoped>
  /* .bot-manage-main-container {
    padding: 7px 25px;
  } */

  .header-align {
    font-family: segoe UI Regular;
  }
</style>
