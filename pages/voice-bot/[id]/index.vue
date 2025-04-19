<template>
  <page :title="botDetails.name ?? ''" :bread-crumbs="[]" :disableSelector="true" :disable-back-button="false"
    :disable-elevation="true" custom-back-router="/voice-bot">
    <template #actionButtons>
      <div class="flex w-full items-center pl-[7px] pr-[0px] overflow-x-scroll">
        <div class="flex w-full items-center justify-between gap-2 overflow-x-scroll sm:flex-row py-1">
          <div class="items-cetner flex gap-4">
            <div v-if="botDetails.active" class="flex items-center gap-[5px] text-[#1abb00]">
              <div class="flex h-[6px] w-[6px] items-center rounded-full bg-[#1abb00]"></div>
              <span class="text-[15px] sm:text-[15px] md:text-[17px] lg:text-[16px] xl:text-[16px]">Active</span>
            </div>
            <div v-else class="flex items-center gap-[5px] pl-2 font-medium text-[#ff0000]">
              <div class="flex h-[6px] w-[6px] items-center rounded-full bg-[#ff0000]"></div>
              <span class="md:text-[14px] lg:text-[16px]">Inactive</span>
            </div>
          </div>
          <div
            class="flex flex-col items-start justify-center gap-4 sm:flex-row sm:items-center lg:items-center xl:items-center">
            <div class="flex items-center gap-3">
              <div class="flex flex-col items-center gap-1">
                <UiButton class="bg-[#424bd1] text-[14px] p-2 hover:bg-[#424bd1]/90 disabled:opacity-50"
                  @click="handleActivateBot" :disabled="botDetails.active">
                  <span class="hidden lg:inline"> Activate Bot </span>
                  <span class="flex flex-col items-center justify-center lg:hidden">
                    <component :is="Bot"></component>
                  </span>
                </UiButton>
                <div class="block text-[5px] lg:hidden"> Activate Bot </div>
              </div>
              <span class="flex items-center gap-4">
                <div class="flex flex-col items-center gap-1">
                  <UiButton
                    class="rounded-[8px] bg-[#ff0000] p-2 p-2.5 text-[14px] font-medium text-white hover:bg-[#ff0000] hover:brightness-90"
                    @click="deactivateBot" :disabled="!botDetails.active">
                    <!-- Deactivate Bot -->
                    <span class="hidden lg:inline"> Deactivate Bot </span>
                    <!-- Icon for small screens -->
                    <span class="flex flex-col items-center justify-center lg:hidden">
                      <Icon name="bx:block" class="h-5 w-5" />
                    </span>
                  </UiButton>
                  <div class="block text-[5px] lg:hidden">Deactivate Bot</div>
                </div>
                <div class="flex flex-col items-center gap-1">
                  <UiButton v-if="botDetails.active" color="primary" as="a" @click="previewBot()"
                    class="p-3 text-[14px] font-medium text-[#000000] gap-2 border-[#000000] button_shadow rounded-xl cursor-pointer">
                    <span class="hidden lg:inline"> Preview Bot </span>
                    <span class="flex flex-col items-center justify-center lg:hidden">
                      <PhoneCall class="w-4 h-4" />
                    </span>
                  </UiButton>
                  <div class="block text-[5px] lg:hidden">Preview Bot</div>
                </div>
              </span>
              <div class="flex flex-col items-center gap-1">
                <UiButton variant="destructive" @click="handleDelete"
                  class="bg-[#ff0000] p-3 hover:bg-[#ff0000]/90 hover:brightness-90">
                  <Icon name="lucide:trash-2" class="h-4 w-4" />
                </UiButton>
                <div class="block text-[5px] lg:hidden">Delete</div>
              </div>
              <div class="flex flex-col items-center gap-1" @click="agentModalState.open = true">
                <UiButton variant="destructive"
                  class="flex items-center justify-center bg-[#424bd1] p-3 hover:bg-[#424bd1]/90 hover:brightness-90">
                  <Icon name="lucide:pen" class="h-4 w-4" />
                </UiButton>
                <div class="block text-[5px] lg:hidden">Edit</div>
              </div>
              <ConfirmationModal v-model:open="deleteModalState" title="Are you sure?"
                description="Are you sure you want to delete voice bot ?" @confirm="handleDeleteBot" />
              <ConfirmationModal v-model:open="modalOpen" title="Confirm Deactivation"
                description="Are you sure you want to deactivate bot ?" @confirm="deactivateBotDialog" />
            </div>
          </div>
        </div>
      </div>
    </template>
    <div
      class="font-bold text-[18px] sm:text-[18px] md:text-[20px] leading-none px-4 sm:px-4 md:px-0 mb-2 my-5 sm:my-5 md:my-0">
      View and Edit your Voicebot features
    </div>
    <EditVoiceBot :botDetails="botDetails" :refreshBot="refreshBot" :loading="loading" />
    <VoiceBotSuccessFulMessageModal v-model="store.createBotVoiceSuccessfulState" @success="() => {
      console.log('success');
      store.createBotVoiceSuccessfulState.open = false;
      // refreshBot();
    }" />
    <CreateEditVoiceBotModal v-model="agentModalState" @editConfirm="() => {
        agentModalState.open = false;
        refreshBot()
      }" />
  </page>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { toast } from "vue-sonner";
import { Bot, PhoneCall } from "lucide-vue-next";
import { useBreadcrumbStore } from "~/store/breadcrumbs"; // Import the store
import { useVoiceBotDetails } from "~/composables/botManagement/voiceBot/useVoiceBotDetails ";
import { botStore } from '~/store/botStore';
import { useRoute } from "vue-router";

definePageMeta({
  middleware: "admin-only",
});
const route = useRoute("voice-bot-id");
const paramId: any = route;
const breadcrumbStore = useBreadcrumbStore();
const { botDetails, loading, error, refreshBot } = useVoiceBotDetails(paramId.params.id)
const agentModalState = ref({ open: false, id: paramId.params.id });

const deleteModalState = ref(false);
const modalOpen = ref(false);
const store = botStore();

watchEffect(() => {
  if (botDetails.value) {
    const userName = botDetails.value.name ?? 'Unknown Bot Name';
    useHead({
      title: `Voice Bot | ${userName}`,
    });
    breadcrumbStore.setBreadcrumbs([
      {
        label: 'Voice Bot',
        to: `/voice-bot`,
      },
      {
        label: `${userName}` ?? 'No Name',
        to: `/voice-bot`,
      },
    ]);
  }
});

const deactivateBot = async () => {
  modalOpen.value = true;
};
const deactivateBotDialog = async () => {
  await handleActivateBot()
  modalOpen.value = false;
};

const botScript =
  "<" +
  `script src="https://tring-databot.pripod.com/widget.js" data-chatbotid="${paramId.params.id}" data-orgname="WMS">` +
  "</" +
  "script>";

const handleDelete = () => {
  deleteModalState.value = true;
};

const handleDeleteBot = () => {
  deleteModalState.value = false;
  deleteVoiceBot(route.params.id);
};
const previewBot = () => {
  store.createBotVoiceSuccessfulState.open = true
  store.createBotVoiceSuccessfulState.handleContent = true
}


const handleActivateBot = async () => {
  if (botDetails.value.ivrConfig === null) {
    toast.error("Please configure telephone Setup first");
  } else if (botDetails.value.botDetails === null) {
    toast.error("Please configure Basic Bot Details first");
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