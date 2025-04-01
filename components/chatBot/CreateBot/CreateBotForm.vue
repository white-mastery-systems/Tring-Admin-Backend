<script setup lang="ts">
import { ref, watch } from 'vue';
import { useForm } from 'vee-validate';
import { botCreateSchema } from '~/validationSchema/botManagement/chatBot/createBot';
import { ArrowLeft, Goal } from 'lucide-vue-next';
import { useBotDocuments } from '~/composables/botManagement/chatBot/useBotDocuments';
import { useRoute } from 'vue-router'
import { botStore } from "~/store/botStore";
import { useBotDetails } from '~/composables/botManagement/chatBot/useBotDetails';
import { useChatbotConfig } from '~/composables/botManagement/chatBot/useChatbotConfig';
import { useContentSuggestions } from "~/composables/botManagement/chatBot/useContentSuggestions";
import { useDocumentUpload } from "~/composables/botManagement/chatBot/useDocumentUpload"; // Import the composable

const step = ref(1);
const route = useRoute();
const paramId: any = route;
const { status, documents, refresh } = useBotDocuments(route.params.id);
const scrapData = botStore();
const isLoading = ref(false)
const stepOneRef = ref(null);
const pageLoading = ref(false)
const isSubmitting = ref(false)
const isDocumentListOpen = ref(false);
const intervalId = ref<any>(null); // Store the interval ID
const logoData = ref()
const { intentOptions, fetchConfig } = useChatbotConfig();
// const uploadComposable = useDocumentUpload();
const { uploadStatus, isUploading, uploadError, createDocuments, resetUploadStatus } = useDocumentUpload();
// const uploadDocumentRef = ref(null);
// const selectedType = ref('')
// ✅ Define a single form
const { errors, values, handleSubmit, validateField, validate, setFieldValue } = useForm({
  validationSchema: botCreateSchema,
  initialValues: {
    color: hslToHex('236, 61%, 54%, 1'),
    secondaryColor: hslToHex('236, 61%, 74%'),
  },
});
const { contentSuggestions, suggestionLoading, suggestionError, fetchSuggestions } = useContentSuggestions();
const { botDetails, loading, error, refreshBot } = useBotDetails(route.params.id);
const showNextButton = computed(() => (step.value < 4) && !!values?.selectedType);
const showBackButton = computed(() => (step.value === 1) && values?.selectedType)

// ✅ Watch errors for debugging (optional)
watch(() => values.type, (newType) => {
  if (newType) {
    fetchSuggestions(newType);
  }
});
watch(() => scrapData, (newscrapData) => {
  if (!newscrapData) return;
  const extractHSLValues = (hslString) => hslString.replace(/hsl\(|\)/g, "");
  setFieldValue('NAME', newscrapData.scrapedData.chatbot.name ?? '');
  setFieldValue('COMPANY', newscrapData.scrapedData.brand?.name ?? '');
  setFieldValue('type', newscrapData.scrapedData.brand?.industry ?? '');
  setFieldValue('color', hslToHex(extractHSLValues(newscrapData.scrapedData.chatbot.primary_color)) ?? "236, 61%, 54%, 1");
  setFieldValue('secondaryColor', hslToHex(extractHSLValues(newscrapData.scrapedData.chatbot.secondary_color)) ?? "236, 61%, 74%");
  setFieldValue('ROLE', 'custom');
  setFieldValue('GOAL', 'custom');
  setFieldValue('otherRole', newscrapData.scrapedData.chatbot.role);
  setFieldValue('logo', { url: newscrapData.scrapedData.brand?.logo_url } ?? {});
  setFieldValue("otherGoal", newscrapData.scrapedData.chatbot.goal || "");
}, { deep: true, immediate: true });

watch(() => botDetails.value, (newDetails) => {
  if (newDetails) { // Ensure newDetails is not null
    // setFieldValue('BotName', newDetails?.name ?? '');
  }
}, { deep: true, immediate: true });

watch(
  () => status.value,
  (newStatus) => {
    if (((step.value === 1) && values.selectedType === 'Text')) {
      if (newStatus === "success") {
        isLoading.value = false;
        step.value++;
      }
    }
  },
  { deep: true, immediate: true }
);
// setFieldValue('NAME', botDetails.value.name ?? '');
const isDataLoading = computed(() => status.value === "pending");
// watch(() => scrapData.scrapedData?.knowledge_base?.document_content,(newValue) => {
//   refresh()
// },{deep: true, immediate: true})

// ✅ Fields to validate per step
const stepFields = {
  1: ["","type"], // Assuming validation for step 1 is based on document length
  2: ["BotName", "NAME", "COMPANY", "color", "secondaryColor", "logo"], // Step 2 fields
  3: ["ROLE", "otherRole", "otherGoal"] // Include otherRole and otherGoal for step 3
};


onMounted(() => {
  if (botDetails.value) {
    console.log(botDetails.value, "botDetails.value -- botDetails.value")
  }
})
const nextStep = async () => {
  const fieldsToValidate = stepFields[step.value] || [];
  let isValid = true;

  // Validate each field in the current step individually
  for (const field of fieldsToValidate) {
    const { valid } = await validateField(field);
    if (!valid) {
      isValid = false;
    }
  }
  if ((step.value === 1) && values.selectedType === 'Text') {
    if (stepOneRef.value?.uploadDocumentRef?.generatePDFAndUpload) {
      // setTimeout(() => {
      if (!documents.value.documents.length) {
        stepOneRef.value.uploadDocumentRef.generatePDFAndUpload(); // Call function from TextDocumentUpload
      }
      // }, 0);
    }
  }
  if ((step.value === 1) && !documents.value.documents.length) {
    if (values.selectedType !== 'Text') {
      toast.error("Please provide at least one document");
      return;
    } else {
      isLoading.value = true;
      return;
    }
  }

  if ((step.value === 2) && !values.type) {
    toast.error("Please select an industry before proceeding.");
    return
  }
  if (step.value === 3) {
    if (!values.ROLE) {
      toast.error("Please provide a value for Role");
      return; // Stop execution if ROLE is missing
    }

    if (values.ROLE === 'custom' && !values.otherRole) {
      toast.error("Please provide a custom value for Role");
      return;
    }
  }
  if (isValid) {
    // if ((step.value === 1) && values.selectedType === 'Text') {
    //   // setTimeout(() => {
    //     step.value++;
    //   // }, 0);
    // } else {
    step.value++; // Move to next step
    // }
  } else {
    console.log("Validation failed! Fix errors before proceeding.");
  }
};
watch(
  () => botDetails,
  (newValue, oldValue) => {
    if (step.value === 1 && values.selectedType === 'Text') {
      step.value++;
    }
  },
  { deep: true, immediate: true }
);

const prevStep = () => {
  if (step.value > 1) step.value--;
};
const backRoute = () => {
  navigateTo("/chat-bot");
}
const firstStepBack = () => {
  setFieldValue('selectedType', '')
}
const getLogoChange = (file: any, logo: any) => {
  logoData.value = file
};
// const triggerPDFUpload = () => {
//   if (uploadDocumentRef.value) {
//     uploadDocumentRef.value.generatePDFAndUpload();
//   }
// };
// ✅ Final form submission
const submitForm = handleSubmit(async (values) => {
  await refreshBot()
  let uploadedDetails = null;
  if (typeof logoData.value === "object") {
    console.log(logoData.value, "logoData.value -- logoData.value")
    uploadedDetails = await uploadLogo(botDetails.value.id, logoData.value.file);
  }
  isLoading.value = true;
  try {
    if (!values.COMPANY || !values.NAME || !values.ROLE || !values.color) {
      toast.error("Please fill in all required fields.");
      isLoading.value = false
      return;
    }
    if (!values.GOAL) {
      toast.error("Please provide a value for Goal");
      isLoading.value = false
      return
    }
    if (values.GOAL === 'custom' && !values.otherGoal) {
      toast.error("Please provide a custom value for Goal");
      isLoading.value = false
      return
    }
    console.log(values.logo.url, "values.logo.url")
    console.log(uploadedDetails?.metadata?.ui?.logo, "uploadedDetails?.metadata?.ui?.logo -- uploadedDetails?.metadata?.ui?.logo")
    // uploadedDetails?.metadata?.ui?.logo ?? props.botDetails.metadata.ui.logo,
    const payload = {
      id: botDetails.value?.id,
      type: values.type,
      name: values.BotName,
      metadata: {
        ui: {
          ...botDetails.value?.metadata.ui,
          logo: (scrapData.scrapedData && Object.keys(scrapData.scrapedData).length > 0)
            ? (values.logo ? values.logo.url : uploadedDetails?.metadata?.ui?.logo ?? botDetails?.metadata?.ui?.logo)
            : uploadedDetails?.metadata?.ui?.logo ?? botDetails?.metadata?.ui?.logo,
          color: hexToHSL(values.color),
          secondaryColor: hexToHSL(values.secondaryColor),
          fontFamily: "Kanit",
          widgetSound: true,
          generateLead: true,
          onlineStatus: true,
          defaultRibbon: true,
          defaultSelect: true,
          widgetPosition: 'Right'
        },
        prompt: {
          ...botDetails.value?.metadata.prompt,
          COMPANY: values.COMPANY,
          NAME: values.NAME,
          ROLE: values.ROLE,
          GOAL: values.GOAL,
          NOTES: "",
          INTENTS: "-details\n-other",
          LANGUAGE: "English - en",
          otherRole: values.otherRole,
          otherGoal: values.otherGoal,
          DESCRIPTION: "",
          errorMessage: "Uh-oh, Can you try reloading the page and try chatting with me? It seems like our system is facing an issue. Thank you for your understanding",
        },
        tools: {
          customTools: [],
          defaultTools: ['date_time'],
        },
      },
    };

    await updateBotDetails(payload,false);
    if (botDetails.value?.documents.length === 1) {
      await checkDocumentStatus(botDetails.value?.documents[0]);
    } else {
      isDocumentListOpen.value = true
      isLoading.value = false
    }
    // await navigateTo({
    //   name: "chat-bot-id",
    //   params: { id: botDetails.id },
    // });
    // toast.success("Bot details updated successfully!");
  } catch (error) {
    console.error("Error updating bot details:", error);
    toast.error("Something went wrong. Please try again.");
  }
  // isLoading.value = false
});

const checkDocumentStatus = async (selectedDocumentStatus: any) => {
  if (status.value !== "success") return;

  // First check if the document is already ready before showing loading state and toast
  await refreshBot(); // Fetch the latest document status
  const selectedDocument = botDetails.value?.documents.find(
    document => document.id === selectedDocumentStatus.id
  );
  
  // If the document is already ready, don't show the deployment toast or start interval
  if (selectedDocument && selectedDocument.status === "ready") {
    isLoading.value = false;
    
    if (!documents.value?.documentId) {
      try {
        await handleActivateBot();
        if (botDetails.value?.documents.length === 1) {
          // createBotsuccessfulState.value.open = true;
        }
      } catch (error) {
        console.error("handleActivateBot failed:", error);
      } finally {
        isLoading.value = false; // Stop loading after activation
      }
    }
    return; // Exit early if already ready
  }

  // Continue with regular deployment flow if document is not ready
  isLoading.value = true; // Ensure loading starts
  setTimeout(() => {
    toast.success("Your bot is being deployed. Please wait...");
  }, 1000);

  let toastInterval = 0; // Counter to track every 16 seconds

  intervalId.value = setInterval(async () => {
    await refreshBot(); // Fetch the latest document status
    const selectedDocument = botDetails.value?.documents.find(
      document => document.id === selectedDocumentStatus.id
    );
    
    // Check if the document exists before accessing its status
    const documentStatus = selectedDocument ? selectedDocument.status : null;
    
    // Show toast every 16 seconds (i.e., every second iteration of 8-sec polling)
    toastInterval += 8;
    if (toastInterval % 12 === 0 && documentStatus !== "ready") {
      toast.success("Your bot is still being deployed. Please wait...");
    }

    if (documentStatus === "ready") {
      clearInterval(intervalId.value); // Stop polling
      // scrapData.scrapedData = []
      // await navigateTo({
      //   name: "chat-bot-id",
      //   params: { id: botDetails.id },
      // });
      isLoading.value = false;

      if (!documents.value?.documentId) {
        try {
          await handleActivateBot();
          if (botDetails.value?.documents.length === 1) {
            // createBotsuccessfulState.value.open = true;
          }
        } catch (error) {
          console.error("handleActivateBot failed:", error);
        } finally {
          isLoading.value = false; // Stop loading after activation
        }
      }
    }
  }, 8000); // Poll every 8 seconds
};

const handleActivateBot = async () => {
  isSubmitting.value = true;
  const activeDocuments = botDetails.value?.documents.filter(
    (d) => d.status === "ready",
  );
  // if (activeDocuments.length === 0) {
  //   toast.error("Please add document to activate bot");
  //   return navigateTo({
  //     name: "chat-bot-id",
  //     params: { id: paramId.params.id },
  //   });
  // }
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
  isLoading.value = false
  isDocumentListOpen.value = true;
  
};
const singleDocumentDeploy = async (list: any) => {
  isLoading.value = true
  await deployDocument(paramId.params.id, list.id, true);
  await refreshBot() // new function refreshBot added
  await checkDocumentStatus(list);
  isLoading.value = false
  // botDetails.value = await getBotDetails(paramId.params.id);
};
watch(() => values.type, (newType) => {
  fetchConfig(newType);
}, { deep: true, immediate: true });
// ✅ Clear interval when the component is unmounted
onUnmounted(() => {
  if (intervalId.value !== null) {
    clearInterval(intervalId.value);
    intervalId.value = null;
    scrapData.scrapedData = []
  }
});
</script>

<template>
  <div class="h-[calc(100dvh-2.5rem)] overflow-y-auto">
    <!-- <div>
      <LoadingOverlay :loading="isLoading" class="w-[80%]" />
    </div> -->
    <div class="flex items-center gap-2 font-bold py-3 px-5">
      <div class="flex items-center gap-2 cursor-pointer" @click="backRoute()">
        <span class="cursor-pointer">
          <component :is="ArrowLeft"></component>
        </span>
        <span class="text-[20px] text-[20px] md:text-[24px]"> Create Chatbot </span>
      </div>
    </div>
    <UiSeparator orientation="horizontal" class="bg-[#E2E8F0] w-full" />
    <!-- <div class="px-6 py-6 pb-0 flex-1 overflow-hidden min-h-[400px] md:min-h-[500px] max-h-[80vh]"> -->
    <!-- <div class="px-6 py-6 pb-0 flex-1 overflow-hidden min-h-[585px] md:min-h-[585px] max-h-[95vh]"> -->
    <div class="px-6 py-6 pb-0 flex-1 overflow-auto min-h-[400px] md:min-h-[500px] h-[calc(100vh-8rem)] max-h-[95vh] flex">
      <!-- <TextDocumentUpload ref="uploadDocumentRef" v-show="false" /> -->
      <form class="border border-gray-300 rounded-lg flex flex-col justify-between h-full flex-1 overflow-auto">
        <!-- @update:values="(newValues) => values = newValues" -->
        <FirstStep ref="stepOneRef" v-show="step === 1" v-model:values="values" :errors="errors" :refresh="refresh" :suggestionsContent="contentSuggestions" :refreshSuggestions="fetchSuggestions" :loading="suggestionLoading" />
        <SecondStep v-show="step === 2" v-model:values="values" :errors="errors" @changeLogo="getLogoChange" />
        <ThirdStep v-show="step === 3" v-model:values="values" :errors="errors" :intentOptions="intentOptions" />
        <FourthStep v-show="step === 4" v-model:values="values" :errors="errors" :disabled="isLoading" :intentOptions="intentOptions" />
        <!-- {{ step === 2 && (values.intent.length === 0) }} -->
        <div class="flex justify-end w-full gap-[12px] p-4">
          <UiButton v-if="(step > 1)" :disabled="isLoading" type="button" @click="prevStep" class="px-8 button_shadow border border-[#FFBC42] text-[#FFBC42] hover:text-[#FFBC42] rounded-lg" variant="outline">Back</UiButton>
          <UiButton v-if="showBackButton" type="button" @click="firstStepBack" class="px-8 button_shadow border border-[#FFBC42] text-[#FFBC42] hover:text-[#FFBC42] rounded-lg" variant="outline">Back
          </UiButton>
          <UiButton v-if="showNextButton" type="button" @click="nextStep" color="primary" class="px-8 button_shadow rounded-lg"
            :loading="isUploading || isDataLoading || isLoading">Next
          </UiButton>
          <UiButton color="primary" type="button" v-if="step === 4" @click="submitForm" class="px-8 button_shadow rounded-lg" :loading="isLoading">
            Create Bot
          </UiButton>
        </div>
      </form>
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
        <!-- .filter(
            (item: any) => item.status === 'ready',
          ) -->
        <UiButton
          class="bg-white text-[15px] text-black shadow-3xl hover:bg-[#fff8eb] hover:text-[#ffbc42] min-w-[90%] max-w-[100%]"
          v-for="list in documents.documents" :key="list.id" @click="async () => {
            isSubmitting = true;
            isDocumentListOpen = false;
            await singleDocumentDeploy(list);
          }
          ">
          <span class="w-[95%] truncate">
            {{ list.name }}
          </span>
        </UiButton>
      </UiDialogContent>
    </LazyUiDialog>
  </div>
</template>
