<script setup lang="ts">
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { ChevronDownIcon, Subtitles } from "lucide-vue-next"; // Import Lucide icons
import UiCustomization from '@/components/chatBot/UiCustomization.vue';
import BotConfiguration from '@/components/chatBot/BotConfiguration.vue';
import CrmConfiguration from '@/components/chatBot/CrmConfiguration.vue';
import { nextTick } from "vue";

const stepComponents: Record<string, any> = {
  uiCustomization: UiCustomization,
  botConfiguration: BotConfiguration,
  crmIntegrations: CrmConfiguration,
}
const emit = defineEmits(["cofirm"]);
// const defaultValue = 'uiCustomization'
const openValues = ref(["uiCustomization", "botConfiguration"]);

// const defaultValue = "item1";
const accordionItems = ref([
  { value: "uiCustomization", title: "UI Customization", content: "Setup the way your chat looks", icon: "Home", subtitle: "Setup the way your chat looks", status: "Incomplete" },
  { value: "botConfiguration", title: "Bot Configuration", content: "Setup the way you bot works", icon: "Settings", subtitle: "Setup the way you bot works", status: "Incomplete" },
  { value: "crmIntegrations", title: "CRM Integrations", content: "Click here to deploy your new chatbot", icon: "Settings", subtitle: "Click here to deploy your new chatbot",},
  { value: "Advanced Setup", title: "Advanced Setup", content: "Click here to deploy your new chatbot", icon: "Settings", subtitle: "Click here to deploy your new chatbot" },
]);

const updateStepStatus = async (step: string, status: string) => {
  await nextTick(); // Ensures Vue updates the DOM first
  emit('cofirm', { step, status });
  const stepIndex = accordionItems.value.findIndex(item => item.value === step);
  if (stepIndex !== -1) {
    accordionItems.value[stepIndex] = {
      ...accordionItems.value[stepIndex],
      status: status === "completed" ? "Completed" : "Incomplete",
    };
    accordionItems.value = [...accordionItems.value]; // Force reactivity
  }
};

// Call `updateStepStatus` on mount to ensure status updates after refresh
onMounted(() => {
  updateStepStatus("uiCustomization", "incomplete"); // Default value (will update later)
});


</script>
<template>
  <Accordion type="multiple" v-model="openValues" class="w-full" collapsible >
    <AccordionItem v-for="item in accordionItems" :key="item.value" :value="item.value"
      class="mb-3 border-none p-6 rounded-lg box_shadow">
      <AccordionTrigger
        class="flex items-center gap-2 font-medium no-underline decoration-transparent hover:no-underline py-0">
        <!-- Left Icon -->
        <div class="flex items-center justify-between gap-2 w-full">
          <div class="flex items-center gap-2">
            <img src="/assets/icons/create_bot_link.svg" width="35" class="rounded-lg" />
            <!-- <LucideIcon :name="item.icon" class="w-5 h-5 text-blue-500" /> -->
            <div class="flex flex-col items-start gap-1 pl-4">
              <span class="text-[14px] sm:text-[14px] md:text-[16px]">
                {{ item.title }}
              </span>
              <span class="text-[8px] sm:text-[8px] md:text-[10px] text-[#71717A]">
                {{ item.subtitle }}
              </span>
            </div>
          </div>
          <div v-if="item.status" class="flex items-center gap-1 pr-4">
            <div class="w-[7px] h-[7px] bg-[#000000] rounded-full">

            </div>
            <span class="font-medium text-[10px] sm:text-[10px] md:text-[14px]">
              {{ item.status }}
            </span>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent class="text-gray-700 text-sm">
        <!-- {{ item.content }} -->
        <!-- <component :is="stepComponents[item.value]" /> -->
        <component :is="stepComponents[item.value]" @statusUpdated="updateStepStatus" />
      </AccordionContent>
    </AccordionItem>
  </Accordion>
</template>