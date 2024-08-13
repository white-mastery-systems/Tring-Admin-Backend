<template>
  <div class="bot-manage-main-container">
    <div class="header-align">
      <span class="text-[20px] font-bold"> Bot Management </span>
      <UiButton variant="destructive" @click="deleteBot(route.params.id)">
        <Icon name="lucide:trash-2" />
      </UiButton>
    </div>
    <div class="bot-main-align">
      <div class="list-header-align">
        <div class="header-content-align">
          <div class="items-cetner flex gap-4">
            <span class="content-align text-[17px] font-bold">{{
              botDetails.name
            }}</span>
            <!-- {{ botDetails }}
            {{ botDetails.documentId }} -->
            <div v-if="botDetails.documentId" class="acive_class">
              <div class="active-circle-align rounded-full"></div>
              <span class="text-[14px]">Active</span>
            </div>
            <!-- v-else -->
            <div v-else class="deacive_class pl-2 font-medium">
              <div class="deactive-circle-align rounded-full"></div>
              <span>Inactive</span>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <span class="text-[17px] font-bold text-black"
              >Date Created:
              <span class="text-[15px] font-medium text-black">{{
                dateFormate
              }}</span>
            </span>
            <UiDialog v-if="!botDetails.documentId">
              <UiDialogTrigger class="">
                <UiButton class="bg-[#424bd1] hover:bg-[#424bd1]/90"
                  >Deploy Bot</UiButton
                >
              </UiDialogTrigger>
              <UiDialogContent align="end" class="sm:max-w-md">
                <UiDialogHeader>
                  <UiDialogTitle>Launch Bot</UiDialogTitle>
                  <UiDialogDescription>
                    Choose a document to deploy your bot
                  </UiDialogDescription>
                </UiDialogHeader>
                <div
                  class="deploy-bot-list-align text-[15px]"
                  v-for="list in getDocumentList.filter(
                    (item: any) => item.status === 'ready',
                  )"
                  :key="list.id"
                >
                  <div class="list_align" @click="singleDocumentDeploy(list)">
                    <!-- <span
                      class="bot_name_align font-medium"
                      >{{ list.name }}</span
                    > -->
                    <button class="bot_name_align font-medium">
                      {{ list.name }}
                    </button>
                  </div>
                </div>
              </UiDialogContent>
            </UiDialog>
            <span v-if="botDetails.documentId" class="flex gap-4">
              <UiButton
                class="button-align text-[14px] font-medium"
                @click="deactivateBot"
                >Deactivate Bot</UiButton
              >
              <UiButton
                as="a"
                :href="previewUrl"
                target="_blank"
                class="bg-[#474df9] text-[14px] font-medium text-white hover:bg-[#474df9] hover:brightness-90"
                >Preview Bot</UiButton
              >
              <UiButton
                class="bg-[#e1dede] text-black hover:bg-[#d4d2d2]"
                @click="copyScript"
                >Copy Script</UiButton
              >
            </span>
          </div>
          <!-- <span class="font-semibold content-align">Date Created</span>
          <span class="font-semibold content-align">Status</span> -->
        </div>
      </div>
      <div
        class="bot-list-align text-[14px]"
        v-for="(list, index) in dataList"
        :key="index"
        @click="botManagementDetails(list, index)"
      >
        <div class="list_align">
          <span class="bot_name_align font-medium">{{ list.bot }}</span>
          <!-- <span class="font-medium pr-14">{{ list.createAt }}</span> -->
          <!-- <div v-if="list.status" class="pr-3 acive_class font-medium">
            <div class="rounded-full active-circle-align"></div>
            <span>Active</span>
          </div>
          <div v-else class="pl-2 deacive_class font-medium">
            <div class="rounded-full deactive-circle-align"></div>
            <span>Inactive</span>
          </div> -->
        </div>
        <div>
          <LeftArrowIcon class="arrow-aling hover:text-[#ffbc42]" />
        </div>
        <!-- <div v-if="!list.arrowChange">
          <img src="assets\icons\left_arrow.svg" width="30">
        </div> -->
        <!-- <div v-else>
          <img src="assets\icons\yellow_left_arrow.svg" width="30">
        </div> -->
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  definePageMeta({
    middleware: "admin-only",
  });
  import { ref } from "vue";
  import { toast } from "vue-sonner";
  import { useClipboard } from "@vueuse/core";
  const selectedValue = ref("Today");
  const route = useRoute("BotManagementDetails-id");
  const paramId: any = route;
  const botDetails = ref(await getBotDetails(paramId.params.id));

  const getDocumentList: any = ref();

  onMounted(async () => {
    getDocumentList.value = await listDocumentsByBotId(paramId.params.id);
    botDetails.value = await getBotDetails(paramId.params.id);
  });

  const dataList = ref([
    {
      _id: 1,
      bot: "UI Customization",
      routeName: "UiCustomization-id",
    },
    {
      _id: 2,
      bot: "CRM Integration",
      routeName: "",
    },
    {
      _id: 3,
      bot: "Bot Configuration",
      routeName: "CreateBot-id",
    },
    {
      _id: 4,
      bot: "Document Management",
      routeName: "BotDocumentManagement-id",
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
    return `https://tring-databot.pripod.com/?orgname=WMS&chatbotid=${paramId.params.id}&brandcolor=${
      col
    }`;
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
    await disableBot(paramId.params.id);
  };

  const botScript = `<script src="https://tring-databot.pripod.com/widget.js" data-chatbotid="${paramId.params.id}" data-orgname="WMS"/>`;

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
</script>

<style scoped>
  .bot-manage-main-container {
    padding: 7px 25px;
  }

  .header-align {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: segoe UI Regular;
  }

  .bot-main-align {
    margin-top: 30px;
  }

  .list_align {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    /* background: rgba(255, 255, 255, 1); */
    /* padding: 30px 30px; */
    /* box-shadow: 0px 2px 24px 0px rgba(0, 0, 0, 0.05) !important; */
    border-radius: 10px;
    /* gap: 100px; */
    /* margin: 10px 0; */
  }

  .bot-list-align {
    display: flex;
    align-items: center;
    justify-content: space-between;
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 1);
    padding: 20px 30px;
    width: 100% !important;
    box-shadow: 0px 2px 24px 0px rgba(0, 0, 0, 0.05) !important;
    border-radius: 10px;
    margin: 20px;
  }

  .deploy-bot-list-align {
    display: flex;
    align-items: center;
    justify-content: space-between;
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 1);
    padding: 20px 30px;
    width: 100% !important;
    box-shadow: 0px 2px 24px 0px rgba(0, 0, 0, 0.05) !important;
    border-radius: 10px;
  }

  .acive_class {
    display: flex;
    align-items: center;
    /* width: 50px; */
    color: rgba(26, 187, 0, 1) !important;
    gap: 5px;
  }

  /* .deacive_class {
  display: flex;
  align-items: center;
  gap: 5px;
  color: rgba(255, 0, 0, 1);
} */

  .active-circle-align {
    display: flex;
    align-items: center;
    background-color: rgba(26, 187, 0, 1);
    width: 6px;
    height: 6px;
  }
  .header-content-align {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }
  .list-header-align {
    padding: 10px 0px 10px 20px;
    display: flex;
    align-items: center;
    /* justify-content: space-between; */
    width: 100%;
    /* gap: 100px; */
    border-bottom: 0.5px solid rgba(181, 181, 181, 1);
  }
  .button-align {
    background-color: red;
    color: white;
    border-radius: 8px;
    padding: 10px 10px;
  }
  .bot-list-align:hover {
    color: rgba(255, 188, 66, 1);
    background: rgba(255, 248, 235, 1) !important;
  }
  .arrow-aling {
    width: 30px;
  }
  .deacive_class {
    display: flex;
    align-items: center;
    gap: 5px;
    color: rgba(255, 0, 0, 1);
    padding-inline-end: 201px;
  }
  .deactive-circle-align {
    display: flex;
    align-items: center;
    background-color: rgba(255, 0, 0, 1);
    width: 6px;
    height: 6px;
  }
  /* .right-dropdown-align {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 1);
  padding: 0px 10px;
  width: 200px !important;
  box-shadow: 0px 2px 24px 0px rgba(0, 0, 0, 0.05) !important;
  border-radius: 10px;
} */
  /* .deactive-circle-align {
  display: flex;
  align-items: center;
  background-color: rgba(255, 0, 0, 1);
  width: 5px;
  height: 5px;
} */

  /* .bot_name_align {
  width: 11%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
} */
</style>
