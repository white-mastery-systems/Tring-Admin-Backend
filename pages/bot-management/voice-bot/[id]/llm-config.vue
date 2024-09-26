<template>
  <Page
    title="LLM Configuration"
    :bread-crumbs="[
      {
        label: `${botDetails.name}`,
        to: `/bot-management/voice-bot/${botDetails.id}`,
      },
      {
        label: 'LLM Configuration',
        to: `/bot-management/voice-bot/${botDetails.id}/llm-config`,
      },
    ]"
    :disableSelector="true"
    :disable-back-button="false"
    :disable-elevation="false"
  >
    <div class="shadow-md mx-5 rounded-lg">
      <form  @submit="onSubmit">
        <div  class='grid grid-cols-2 gap-2 w-full'>
       <SelectField name="provider" label="Provider" placeholder="Select Provider"
          :options="provider" :required="true" />

       <SelectField name="model" label="Model" placeholder="Select Model"
          :options="models" :required="true" />

        <SelectField name="tokens" label="Max Tokens" placeholder="Max Tokens"
          :options="tokens.map((token) => ({ label: token, value: token }))" :required="true" />

    
         <div   
           class="flex flex-col gap-2 mt-5">
           <RangeSlider
          :step="0.1"
          :name="values.temperature"
          label="Temperature"
          @update="
            ($event) => {
              setFieldValue('temperature',$event);
            }
          "
          required
          placeholder="Enter speaking Rate"
          min="0"
          max="1"
        />
          </div>


        </div>
        
        <div class="grid grid-cols-1 gap-2 w-full spcace-y-2 ">
          <!-- <TextField   label="Document Id" name="documentId" 
          placeholder="Document Id"  /> -->
          <SelectField name="role" label="Role" placeholder="Role is required"
          :options="roles" :required="true" />
          <TextField  label="Guide" name="guide" 
          placeholder="Include your company details along with the specifics of the service the bot will be providing"  :isTextarea="true"/>
          <TextField  label="Additional Instructions" name="instruction" 
          placeholder="Include your company details along with the specifics of the service the bot will be providing"  :isTextarea="true"/>
          <TextField  label="Notes" name="notes" 
          placeholder="Notes the data"  :isTextarea="true"/>
          <TextField  label="Domain Rules" name="domainRules" 
          placeholder="Domain Rules"  :isTextarea="true"/>
        </div>


        <UiButton  type="submit" class="bg-[#424bd1] hover:bg-[#424bd1] hover:brightness-110 mt-2" size="lg">Submit</UiButton>

      
        <!-- copy paste the class  below-->
        <!-- class="h-[50px] rounded-lg bg-[#f6f6f6] font-medium" -->
      </form>

    </div>
  </Page>
</template>
<script setup lang="ts">
import { lLmConfigurationValidation } from '~/validationSchema/botManagement/LLmConfigurationValidation';
  const router = useRouter();
  const route = useRoute("bot-management-voice-bot-id-llm-config");

// import { lLmConfigurationValidation } from "~/validationSchema/botManagement/llmConfigurationValidation";

  const provider = [
    {
      value: "openai",
      label: "OpenAI",
    },
    {
      value: "google",
      label: "Gemini",
    },
  ];

  const models = [
    {
      value: "gpt-4o-mini",
      label: "gpt-4o-mini",
    },
    {
      value: "gemini-1.5-flash",
      label: "gemini-1.5-flash",
    },
  ];

  const roles = [
    {
      label: "Customer Support",
      value: "Assist customers with their questions and issues.",
    },
    {
      label: "Receptionist",
      value:
        "Assist customers queries about room bookings and hotel information",
    },
    {
      label: "Perform other custom tasks as needed.",
      value: "Other",
    },
  ];

  const tokens = ["1024", "2048", "4096"];

  const animationProps = {
    duration: 0,
  };

  const defaultValues = {
    provider: provider[0].value,
    model: models[0].value,
    tokens: tokens[1],
    temperature: 0,
    documentId: "",
    role: roles[1].value,
    guide: "",
    instruction: "",
    notes: "",
    domainRules: "",
  };







  const botDetails: any = await getVoiceBotDetails(route.params.id)
   console.log(botDetails)
   

  const {
    setFieldValue,
    handleSubmit,
    errors,
    values,
    defineField,
    resetForm,
  } = useForm({
    validationSchema: lLmConfigurationValidation,
    initialValues: {
      // name: "",
    },
  });
        Object.entries(botDetails.llmConfig).forEach(([key, value]: any) => {
          if (values.hasOwnProperty(key)) {
            setFieldValue(key, value);
          }
        });

  const onSubmit = handleSubmit(async (value: any) => {
    await updateLLMConfig({llmConfig:value}, botDetails.id);
    return navigateTo({
      name: "bot-management-voice-bot-id",
      params: { id: botDetails.id },
    });
  });

  // const handleLLMConfig = async (values: any) => {
  //   const payload: any = {
  //     provider: values.provider,
  //     model: values.model,
  //     tokens: values.tokens,
  //     temperature: values.temperature,
  //     documentId: values.documentId,
  //     role: values.role,
  //     guide: values.guide,
  //     instruction: values.instruction,
  //     notes: values.notes,
  //     domainRules: values.domainRules,
  //   };

  // };
</script>
