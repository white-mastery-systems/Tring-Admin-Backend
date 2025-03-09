import { ref, nextTick } from 'vue';

export const useStepStatus = (route) => {
  const { documentsList, refreshDocuments } = useDocumentsList(route.params.id);
  const { botDetails, loading, error, refreshBot } = useBotDetails(route.params.id);
  
  const accordionItems = ref([
    { value: "uiCustomization", title: "Customize Your Chatbot’s Look", content: "Choose colors, fonts, and styles to match your brand", icon: "Home", subtitle: "Choose colors, fonts, and styles to match your brand", status: "Incomplete" },
    { value: "botConfiguration", title: "Bot Setup", content: "Set up your bot’s features, responses, and preferences", icon: "Settings", subtitle: "Set up your bot’s features, responses, and preferences", status: "Incomplete" },
    // { value: "crmIntegrations", title: "CRM Integrations", content: "Click here to deploy your new chatbot", icon: "Settings", subtitle: "Click here to deploy your new chatbot" },
    { value: "emailnotifications", title: "Email Notifications", content: "Setup updates with email alerts for leads generated & bot activities", icon: "Settings", subtitle: "Setup updates with email alerts for leads generated & bot activities" },
    { value: "AdvancedSetup", title: "Advanced Setup", content: "Fine-tune your bot with advanced settings and custom options", icon: "Settings", subtitle: "Fine-tune your bot with advanced settings and custom options" }
  ]);

  const updateStepStatus = async (step, status) => {
    await nextTick();
    console.log(botDetails.value?.documents, "botDetails.value?.documents")
    console.log(documentsList.value?.length, "documentsList.value?.length --")
    const stepIndex = accordionItems.value.findIndex(item => item.value === step);

    if (stepIndex !== -1) {
      accordionItems.value[stepIndex] = {
        ...accordionItems.value[stepIndex],
        status: status === "completed"
          ? stepIndex === 1
            ? botDetails.value?.documents?.length > 0 && documentsList.value?.length > 0
              ? "Completed"
              : "Incomplete"
            : "Completed"
          : "Incomplete",
      };
      accordionItems.value = [...accordionItems.value]; // Force reactivity
    }
  };

  return {
    accordionItems,
    updateStepStatus,
    documentsList,
    refreshDocuments,
    botDetails,
    loading,
    error,
    refreshBot
  };
};
