import { ref, nextTick } from 'vue';
import { useBotStore } from "~/store/chatBotStore"; // Import Pinia store
import {
  Phone,
  NotepadText,
  Bot,
  Cog,
  BrainCircuit,
  IdCard,
} from "lucide-vue-next";
export const useStepStatus = (route) => {
  const botStore = useBotStore();
  // const { documentsList, refreshDocuments } = useDocumentsList(route.params.id);
  // const { botDetails, loading, error, refreshBot } = useBotDetails(route.params.id);
  // const { botDetails, loading, error, refreshBot } = botStore.initBotDetails(route.params.id);
  
  const accordionItems = ref([
    { value: "botdetails", icon: NotepadText, title: "Basic Bot Details", content: "Choose name, region, language and timezone for your bot", subtitle: "Choose name, region, language and timezone for your bot", status: "Incomplete" },
    { value: "botidentity", icon: IdCard, title: "Bot Identity", content: "Set your bot’s call type, industry, role & goal", subtitle: "Set your bot’s call type, industry, role & goal", status: "Incomplete" },
    { value: "botSetup", icon: Bot, title: "Bot Setup", content: "Set up your bot’s features, responses, and preferences", subtitle: "Set up your bot’s features, responses, and preferences", status: "Incomplete" },
    { value: "botKnowledge", title: "Bot Knowledge", content: "Company details and goals imported", icon: BrainCircuit, subtitle: "Company details and goals imported" },
    { value: "telephoneSetup", icon: Phone, title: "Telephone Setup", content: "Set up your Telephone system to handle calls automatically and direct callers to the right place", subtitle: "Set up your Telephone system to handle calls automatically and direct callers to the right place" },
    { value: "advancedSetup", icon: Cog, title: "Advanced Setup", content: "Fine-tune your bot with advanced settings and custom options", subtitle: "Fine-tune your bot with advanced settings and custom options" }
  ]);

  const updateStepStatus = async (step: any) => {
    await nextTick();
    const stepIndex = accordionItems.value.findIndex(item => item.value === step);

    if (stepIndex !== -1) {
      accordionItems.value[stepIndex] = {
        ...accordionItems.value[stepIndex]};
      accordionItems.value = [...accordionItems.value]; // Force reactivity
    }
  };

  return {
    accordionItems,
    updateStepStatus,
  };
};
