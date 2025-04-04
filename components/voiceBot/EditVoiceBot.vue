<script setup lang="ts">
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { ChevronDownIcon, Subtitles } from "lucide-vue-next"; // Import Lucide icons
// import CrmConfiguration from '@/components/chatBot/CrmConfiguration.vue';
import { useRoute } from 'vue-router';
import { useStepStatus } from "@/composables/botManagement/voiceBot/useVoiceBotStepStatus";
import BotDetails from '@/components/voiceBot/BotDetails.vue';
import TelephoneSetup from '@/components/voiceBot/TelephoneSetup.vue';
import BotSetup from '@/components/voiceBot/BotSetup.vue';
import BotIdentity from '@/components/voiceBot/BotIdentity.vue';
import BotKnowledge from '@/components/voiceBot/BotKnowledge.vue';
import AdvancedSetup from '@/components/voiceBot/AdvancedSetup.vue';

const props = defineProps<{
  botDetails: any;
  loading: boolean;
  refreshBot: () => void
}>();
// const { updateStepStatus, accordionItems, botDetails, documentsList } = useStepStatus();
const route = useRoute();
// const { botDetails, loading, error, refreshBot } = useBotDetails(route.params.id);
const { accordionItems, updateStepStatus } = useStepStatus(route);
const stepComponents: Record<string, any> = {
  botdetails: BotDetails,
  telephoneSetup: TelephoneSetup,
  botSetup: BotSetup,
  botidentity: BotIdentity,
  botKnowledge: BotKnowledge,
  advancedSetup: AdvancedSetup,
  // botConfiguration: BotConfiguration,
  // emailnotifications: EmailConfiguration,
  // AdvancedSetup: DynamicForm,
}
const emit = defineEmits(["cofirm"]);
const openValues = ref([""]);
// Call `updateStepStatus` on mount to ensure status updates after refresh
onMounted(() => {
  updateStepStatus("botdetails"); // Default value (will update later)
});


</script>
<template>
  <div class="px-4 sm:px-4 md:px-0">
    <Accordion type="multiple" v-model="openValues" class="w-full flex flex-col gap-5" collapsible>
      <AccordionItem v-for="item in accordionItems" :key="item.value" :value="item.value"
        class="mb-0 border-[1px]  p-6 rounded-lg">
        <AccordionTrigger
          class="flex items-center gap-2 font-medium no-underline decoration-transparent hover:no-underline py-0">
          <!-- Left Icon -->
          <div class="flex items-center justify-between gap-2 w-full">
            <div class="flex items-center gap-2">
              <!-- <div class="flex items-center justify-center min-w-11 min-h-11 bg-[#FFF8EB] rounded-full">
                <component :is="item.icon" :stroke-width="1.5" :size="18" class="text-[#FFBC42B]"></component>
              </div> -->
              <div
                class="flex items-center justify-center min-w-9 min-h-9 sm:min-w-9 sm:min-h-9 md:min-w-11 md:min-h-11 bg-[#FFF8EB] rounded-full">
                <component :is="item.icon" :stroke-width="1.5" class="text-[#FFBC42] w-4 sm:w-4 md:w-5"></component>
              </div>
              <!-- <img src="/assets/icons/create_bot_link.svg" width="35" class="rounded-lg" /> -->
              <!-- <LucideIcon :name="item.icon" class="w-5 h-5 text-blue-500" /> -->
              <div class="flex flex-col items-start gap-1 pl-4">
                <span class="text-[12px] sm:text-[12px] md:text-[16px]">
                  {{ item.title }}
                </span>
                <span class="text-[8px] sm:text-[8px] md:text-[10px] text-[#71717A] text-start">
                  {{ item.subtitle }}
                </span>
              </div>
            </div>
            <!-- <div v-if="item.status" class="flex items-center gap-1 pr-4">
            <div class="w-[7px] h-[7px] bg-[#000000] rounded-full">

            </div>
            <span class="font-medium text-[10px] sm:text-[10px] md:text-[14px]">
              {{ item.status }}
            </span>
          </div> -->
          </div>
        </AccordionTrigger>
        <AccordionContent class="text-gray-700 text-sm">
          <UiSeparator class="mt-6 mb-5 h-[0.7px]"></UiSeparator>
          <!-- {{ item.content }} -->
          <!-- <component :is="stepComponents[item.value]" /> -->
          <component :is="stepComponents[item.value]" :botDetails="props.botDetails" :refreshBot="props.refreshBot"
            :loading="props.loading" @statusUpdated="updateStepStatus" class="mt-2" />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
</template>