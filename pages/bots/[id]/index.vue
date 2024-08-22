<template>
  <div class="py-[7px] px-[25px]">
    <div class="header-align flex items-center justify-between">
      <div class="flex items-center gap-2">
        <UiButton variant="ghost" size="icon" @click="handleGoBack">
          <Icon name="ic:round-arrow-back-ios-new" class="h-5 w-5" />
        </UiButton>
        <span class="text-[20px] font-bold">{{ botDetails.name }}</span>
      </div>

      <ConfirmationModal v-model:open="modelOpen" title="Confirm Delete" description="Are you sure you want to delete ?"
        @confirm="handleDeleteBot" />
    </div>
    <div class="mt-[30px]">
      <div class="flex items-center w-full border-b pt-[10px] pr-[0px] pb-[10px] pl-[20px] mb-[35px] border-[#b5b5b5]">
        <div class="flex items-center justify-between w-full">
          <div class="items-cetner flex gap-4">
            <div v-if="botDetails.documentId" class="flex items-center text-[#1abb00] gap-[5px]">
              <div class="flex items-center bg-[#1abb00] w-[6px] h-[6px] rounded-full"></div>
              <span class="lg:text-[16px] md:text-[13px]">Active</span>
            </div>
            <!-- v-else -->
            <div v-else class="flex items-center gap-[5px] text-[#ff0000] pl-2 font-medium">
              <div class="flex items-center bg-[#ff0000] w-[6px] h-[6px] rounded-full"></div>
              <span class="lg:text-[16px] md:text-[14px]">Inactive</span>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <span class="lg:text-[17px] md:text-[14px] font-bold text-black">Date Created:
              <span class="lg:text-[15px] md:text-[13px] font-medium text-black">{{
                dateFormate
              }}</span>
            </span>
            <UiButton class="bg-[#424bd1] hover:bg-[#424bd1]/90 disabled:opacity-50 lg:text-[16px] md:text-[14px]"
              @click="handleActivateBot" :disabled="isSubmitting" v-if="!botDetails.documentId">
              Activate Bot</UiButton>
            <span v-if="botDetails.documentId" class="flex gap-4">
              <UiButton class="bg-[#ff0000] text-white rounded-[8px] p-2.5 text-[14px] font-medium"
                @click="deactivateBot">Deactivate Bot
              </UiButton>
              <ConfirmationModal v-model:open="modalOpen" title="Confirm Deactivation"
                description="Are you sure you want to deactivate bot ?" @confirm="deactivateBotDialog" />
              <UiButton as="a" :href="previewUrl" target="_blank"
                class="bg-[#474df9] text-[14px] font-medium text-white hover:bg-[#474df9] hover:brightness-90">Preview
                Bot</UiButton>
              <UiButton class="bg-[#e1dede] text-black hover:bg-[#d4d2d2]" @click="copyScript">Copy Script</UiButton>
            </span>
            <UiButton variant="destructive" @click="handleDelete" class="bg-[#ff0000] pl-4 hover:bg-[#ff0000]/90">
              <Icon name="lucide:trash-2" />
            </UiButton>
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
            class="deploy-bot-list-align text-[15px] text-black"
            v-for="list in getDocumentList.documents.filter(
              (item: any) => item.status === 'ready',
            )" :key="list.id" @click="async () => {
                isSubmitting = true;
                isDocumentListOpen = false;
                await singleDocumentDeploy(list);
              }
              ">
            {{ list.name }}
          </UiButton>
        </UiDialogContent>
      </LazyUiDialog>
      <div v-for="(list, index) in dataList" :key="index">
        <NuxtLink :to="`${list.routeName}`"
          class="flex items-center justify-between bg-[#ffffff] py-[20px] px-[30px] w-full rounded-[10px] my-[17px] mx-0 cursor-pointer text-[14px] hover:text-[#ffbc42] hover:bg-[#fff8eb] field_shadow"
          @click="botManagementDetails(list, index)">
          <div class="flex items-center w-full gap-4 rounded-[10px]">
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
          <!-- <div v-if="!list.arrowChange">
          <img src="assets\icons\left_arrow.svg" width="30">
        </div> -->
          <!-- <div v-else>
          <img src="assets\icons\yellow_left_arrow.svg" width="30">
        </div> -->
        </NuxtLink>
      </div>
    </div>
  </div>
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
  const route = useRoute("bots-id");
  const paramId: any = route;
  const botDetails = ref(await getBotDetails(paramId.params.id));
  const modelOpen = ref(false);
  const modalOpen = ref(false);
  const isDocumentListOpen = ref(false);
  const isSubmitting = ref(false);
  const getDocumentList: any = ref();

onMounted(async () => {
  getDocumentList.value = await listDocumentsByBotId(paramId.params.id);
  botDetails.value = await getBotDetails(paramId.params.id);
});
const handleGoBack = () => {
  return navigateTo({
    name: "bots",
  });
};
const dataList = ref([
  {
    _id: 1,
    bot: "UI Customization",
    helperText: "Color,Logo,Icon etc...",
    routeName: "bots-id-ui-customization",
  },
  {
    _id: 2,
    bot: "CRM Configuration",
    helperText: "Add CRM to manage your leads effectively",
    routeName: "bots-id-crm-config",
  },

  {
    _id: 3,
    bot: "Bot Configuration",
    helperText: "Name,Description,Notes etc...",
    routeName: "bots-id-config",
  },
  {
    _id: 4,
    bot: "Document Management",
    helperText: "Knowledge base,Training data etc...",
    routeName: "bots-id-documents",
  },
  {
    _id: 5,
    bot: "Intent Management",
    helperText: "Add your intents Eg: Location Virtual Tour etc...",
    routeName: "bots-id-intent-management",
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
  return `https://tring-databot.pripod.com/?orgname=WMS&chatbotid=${paramId.params.id}&brandcolor=${col}&mode=preview`;
});
// onMounted(async () => {
//   console.log(paramId.params.id, "paramId")
//   try {
//     botDetails.value =
//   } catch (error) {
//     console.error("Error fetching bot details:", error);
//   }
// })

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
  console.log("Bot Id", paramId.params.id);
  await deployDocument(paramId.params.id, list.id);
  botDetails.value = await getBotDetails(paramId.params.id);
};

const handleDelete = () => {
  modelOpen.value = true;
};

const handleDeleteBot = () => {
  modelOpen.value = false;
  deleteBot(route.params.id);
};

const handleActivateBot = async () => {
  isSubmitting.value = true;
  const activeDocuments = botDetails.value.documents.filter(
    (d) => d.status === "ready",
  );

  if (activeDocuments.length === 0) {
    toast.success("Please add document to activate bot");
    return navigateTo({
      name: "bots-id-documents",
      params: { id: paramId.params.id },
    });
  }

  if (activeDocuments.length === 1) {
    try {
      await singleDocumentDeploy(activeDocuments[0]);
    } catch (err) {
      isSubmitting.value = false;
      toast.error("Failed to active the bot, try again");
      return;
    }
  }

  isSubmitting.value = false;
  isDocumentListOpen.value = true;
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
