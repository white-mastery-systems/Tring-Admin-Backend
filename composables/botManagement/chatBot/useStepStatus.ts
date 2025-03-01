import { ref, nextTick } from 'vue';

export const useStepStatus = (route) => {
  const { documentsList, refreshDocuments } = useDocumentsList(route.params.id);
  const { botDetails, loading, error, refreshBot } = useBotDetails(route.params.id);
  
  const accordionItems = ref([
    { value: "uiCustomization", title: "UI Customization", content: "Setup the way your chat looks", icon: "Home", subtitle: "Setup the way your chat looks", status: "Incomplete" },
    { value: "botConfiguration", title: "Bot Configuration", content: "Setup the way your bot works", icon: "Settings", subtitle: "Setup the way your bot works", status: "Incomplete" },
    // { value: "crmIntegrations", title: "CRM Integrations", content: "Click here to deploy your new chatbot", icon: "Settings", subtitle: "Click here to deploy your new chatbot" },
    { value: "AdvancedSetup", title: "Advanced Setup", content: "Click here to deploy your new chatbot", icon: "Settings", subtitle: "Click here to deploy your new chatbot" }
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
