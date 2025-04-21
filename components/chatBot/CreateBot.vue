<script setup lang="ts">
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { ChevronDownIcon, Subtitles } from "lucide-vue-next"; // Import Lucide icons
import UiCustomization from '@/components/chatBot/UiCustomization.vue';
import BotConfiguration from '@/components/chatBot/BotConfiguration.vue';
import DynamicForm from '@/components/chatBot/DynamicForm.vue';
import { useRoute } from 'vue-router';
import { useStepStatus } from "@/composables/botManagement/chatBot/useStepStatus";
import EmailConfiguration from './EmailConfiguration.vue';

const props = defineProps<{ botDetails: any; loading: boolean; documents: any; refreshBot: () => void; refresh: () => void }>();
const route = useRoute();
const { accordionItems, updateStepStatus } = useStepStatus(route);
const stepComponents: Record<string, any> = {
  uiCustomization: UiCustomization,
  botConfiguration: BotConfiguration,
  emailnotifications: EmailConfiguration,
  AdvancedSetup: DynamicForm,
}
const emit = defineEmits(["cofirm"]);
const openValues = ref([""]);
// Call `updateStepStatus` on mount to ensure status updates after refresh
onMounted(() => {
  updateStepStatus("uiCustomization"); // Default value (will update later)
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
              <div
                class="flex items-center justify-center min-w-9 min-h-9 sm:min-w-9 sm:min-h-9 md:min-w-11 md:min-h-11 bg-[#FFF8EB] rounded-full">
                <component :is="item.icon" :stroke-width="1.5" class="text-[#FFBC42] w-4 sm:w-4 md:w-5"></component>
              </div>
              <div class="flex flex-col items-start gap-1 pl-4">
                <span class="text-[12px] sm:text-[12px] md:text-[16px]">
                  {{ item.title }}
                </span>
                <span class="text-[6px] sm:text-[6px] md:text-[12px] text-[#71717A]">
                  {{ item.subtitle }}
                </span>
              </div>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent class="text-gray-700 text-sm">
          <UiSeparator class="mt-4 h-[0.7px]"></UiSeparator>
          <component :is="stepComponents[item.value]" :botDetails="props.botDetails" :refreshBot="props.refreshBot"
            :documents="props.documents" :refresh="props.refresh" :loading="props.loading"
            @statusUpdated="updateStepStatus" class="mt-2" />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
</template>