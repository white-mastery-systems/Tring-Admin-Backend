<template>
  <div class="mx-0 gap-3">
    <!-- <div class="text-[18px] font-bold mb-3 mt-1">Basic Configurations</div> -->
    <form @submit.prevent="handleUpdateBotConfig" class="space-y-5">
      <div class="flex gap-4">
        <TextField name="NAME" label="Bot Name" placeholder="Eg. Noah,Bob,Chris,Ted" required>
        </TextField>
        <TextField name="COMPANY" label="Company Name" placeholder="Eg. Google, Amazon" required>
        </TextField>
      </div>
      <div class="flex gap-4 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
        <!-- {{ intentOptions }} || asdad -->
        <div class="w-full">
          <!-- :options="intentOptions.goals.map((role) => ({ label: role.name, value: role.value }))" -->
          <!-- helperText="This will determine the role of the bot and behavior." -->
          <SelectField name="ROLE" label="Bot's Role" placeholder="Select Role" :options="[
            ...(Array.isArray(intentOptions?.roles) ? intentOptions.roles.map((role: any) => ({
              label: role.name,
              value: role.value
            })) : []),
            { label: 'Custom', value: 'custom' }
          ]" required />

          <!-- helperText="enter role of your bot" -->
          <TextField v-if="values.ROLE === 'custom'" class="focus:outline-none focus:ring-0 focus:border-transparent"
            name="otherRole" required>
          </TextField>
        </div>
        <div class="w-full">
          <!-- helperText="The bot will be driving the conversation towards this goal." -->
          <SelectField name="GOAL" label="Bot's Goal" placeholder="Select Goal" :options="[
            ...(Array.isArray(intentOptions?.goals) ? intentOptions.goals.map((goal: any) => ({
              label: goal.name,
              value: goal.value
            })) : []),
            { label: 'Custom', value: 'custom' }
          ]" required />

          <!-- helperText="enter goal of your bot" -->
          <TextField v-if="values.GOAL === 'custom'" name="otherGoal" required>
          </TextField>
        </div>
        <SelectField name="LANGUAGE" :options="chatBotList" label="Language" placeholder="Language" required>
        </SelectField>
      </div>
      <!-- helperText="Enter a error mesage that will be shown a error when bot failed" -->
      <!-- <TextField isTextarea="true" name="errorMessage" placeholder="enter error message" required /> -->
      <!-- helperText="Here you can have additional instructions for your bot." -->
      <TextField name="NOTES" label="Notes" :isTextarea="true">
      </TextField>
      <!-- helperText="Here you can give the bot additional details about your
      company." -->
      <TextField name="DESCRIPTION" label="Company Description" :isTextarea="true">
      </TextField>
      <div class="flex w-full justify-end">
        <UiButton type="submit" size="lg" class="bg-[#DEDEDE] hover:bg-[#DEDEDE]" :loading="isLoading">
          Submit
        </UiButton>
      </div>
    </form>
  </div>
</template>
<script setup lang="ts">
import { useLanguageList } from '~/composables/chatBotLanguageList';
import { useConfig } from '~/composables/botManagement/chatBot/useConfig';
import { botConfigSchema } from '~/validationSchema/botManagement/chatBot/botConfigurationValidation';
import { botStore } from '~/store/botStore';
import { useChatbotConfig } from '~/composables/botManagement/chatBot/useChatbotConfig';


const props = defineProps<{ botDetails: any; refreshBot: () => void }>();
const showIntentDialog = ref(false);
const { chatBotList } = useLanguageList();
const { roles, goals } = useConfig();
const useStoreBotDetails = botStore();
const animationProps = {
  duration: 0,
};
const router = useRouter();
const route = useRoute("chat-bot-id-config");
const emit = defineEmits(["statusUpdated"]);
const { intentOptions, status, error, fetchConfig } = useChatbotConfig();
// const botDetails: any = await getBotDetails(route.params.id);
// const defaultFormValues = botDetails.value.metadata.prompt;
const isLoading = ref(false)

const { handleSubmit, values, setFieldValue } = useForm({
  validationSchema: botConfigSchema,
});
watch(() => props?.botDetails?.metadata?.prompt, (defaultFormValues) => {
  console.log('defaultFormValues.ROLE', defaultFormValues.ROLE)
  setFieldValue("NAME", defaultFormValues?.NAME || "");
  setFieldValue("COMPANY", defaultFormValues.COMPANY || "");
  setFieldValue("ROLE", defaultFormValues.ROLE || "");
  if (defaultFormValues.GOAL && defaultFormValues.otherGoal) {
    setFieldValue("GOAL", "custom");
  } else {
    setFieldValue("GOAL", defaultFormValues.GOAL || "custom");
  }
  if (defaultFormValues.ROLE && defaultFormValues.otherRole) {
    setFieldValue("ROLE", "custom");
  } else {
    setFieldValue("ROLE", defaultFormValues.ROLE || "custom");
  }
  setFieldValue("NOTES", defaultFormValues.NOTES || "");
  setFieldValue("DESCRIPTION", defaultFormValues.DESCRIPTION || "");
  setFieldValue("otherRole", defaultFormValues.otherRole || "");
  setFieldValue("otherGoal", defaultFormValues.otherGoal || "");
  setFieldValue("errorMessage", defaultFormValues.errorMessage || "");
  setFieldValue("LANGUAGE", defaultFormValues.LANGUAGE ?? "English - en");
}, { deep: true, immediate: true })


watchEffect(() => {
  if (props?.botDetails) {
    const userName = props?.botDetails?.name ?? 'Unknown Bot Name';
    useHead({
      title: `Chat Bot | ${userName} - Bot Config`,
    });
  }
});

const checkStatus = () => {
  const requiredFields = ["NAME", "COMPANY", "ROLE", "GOAL", "LANGUAGE"];

  const isCompleted = requiredFields.every(field => {
    const value = values[field];
    return value !== "" && value !== null && value !== undefined;
  });

  emit("statusUpdated", "botConfiguration", isCompleted ? "completed" : "incomplete");
};

watch(
  () => ({
    NAME: values.NAME,
    COMPANY: values.COMPANY,
    ROLE: values.ROLE,
    GOAL: values.GOAL,
    LANGUAGE: values.LANGUAGE,
  }),
  () => {
    checkStatus();
  },
  { deep: true, immediate: true } // Trigger on mount & changes
);
onMounted(() => {
  if (props?.botDetails?.type) {
    fetchConfig(props?.botDetails?.type);
  }
});

const handleUpdateBotConfig = handleSubmit(async (values: any) => {
  isLoading.value = true
  const payload: any = {
    id: props?.botDetails?.id,
    metadata: {
      ...props?.botDetails?.metadata,
      prompt: {
        ...values,
      },
    },
  };
  await updateBotDetails(payload,true);
  // emit('formSubmitted');
  isLoading.value = false
  // return navigateTo({
  //   name: "chat-bot-id",
  //   params: { id: botDetails.id },
  // });
});
</script>
