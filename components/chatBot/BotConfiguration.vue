<template>
  <div class="mx-5 gap-3 py-2">
    <form @submit.prevent="handleUpdateBotConfig" class="space-y-3">
      <div class="flex gap-4">
        <TextField name="NAME" label="Bot Name" placeholder="Eg. Noah,Bob,Chris,Ted" required>
        </TextField>
        <TextField name="COMPANY" label="Company Name" placeholder="Eg. Google, Amazon" required>
        </TextField>
      </div>
      <div class="flex gap-4 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
        <div class="w-full">
          <!-- helperText="This will determine the role of the bot and behavior." -->
          <SelectField name="ROLE" label="Bot's Role" placeholder="Select Role"
           :options="roles" required />
          <!-- helperText="enter role of your bot" -->
          <TextField v-if="values.ROLE === 'Other'" name="otherRole" required>
          </TextField>
        </div>
        <div class="w-full">
          <!-- helperText="The bot will be driving the conversation towards this goal." -->
          <SelectField name="GOAL" label="Bot's Goal" placeholder="Select Goal" :options="goals" required />
          <!-- helperText="enter goal of your bot" -->
          <TextField v-if="values.GOAL === 'Other'" name="otherGoal" required>
          </TextField>
        </div>
        <SelectField name="LANGUAGE" :options="chatBotList" label="Language" placeholder="Language" required>
        </SelectField>
      </div>
      <!-- helperText="Enter a error mesage that will be shown a error when bot failed" -->
      <TextField isTextarea="true" name="errorMessage" placeholder="enter error message" required />
      <!-- helperText="Here you can have additional instructions for your bot." -->
      <TextField name="NOTES" label="Notes" :isTextarea="true">
      </TextField>
      <!-- helperText="Here you can give the bot additional details about your
      company." -->
      <TextField name="DESCRIPTION" label="Company Description" :isTextarea="true">
      </TextField>
      <div class="flex w-full justify-end">
        <UiButton type="submit" size="lg" :loading="isLoading">
          Submit
        </UiButton>
      </div>
    </form>
    <DocumentManagement></DocumentManagement>
  </div>
</template>
<script setup lang="ts">
import { useLanguageList } from '~/composables/chatBotLanguageList';
import { useConfig } from '~/composables/botManagement/chatBot/useConfig';
import { botConfigSchema } from '~/validationSchema/botManagement/chatBot/botConfigurationValidation';
import { botStore } from '~/store/botStore';

const showIntentDialog = ref(false);
const { chatBotList } = useLanguageList();
const { roles, goals } = useConfig();
const useStoreBotDetails = botStore();
const animationProps = {
  duration: 0,
};
const router = useRouter();
const route = useRoute("chat-bot-id-config");

const botDetails: any = await getBotDetails(route.params.id);
const defaultFormValues = botDetails.metadata.prompt;
const isLoading = ref(false)

const { handleSubmit, values, setFieldValue } = useForm({
  validationSchema: botConfigSchema,
});

setFieldValue("NAME", defaultFormValues.NAME || "");
setFieldValue("COMPANY", defaultFormValues.COMPANY || "");
setFieldValue("ROLE", defaultFormValues.ROLE || "");
if (defaultFormValues.GOAL && defaultFormValues.otherGoal) {
  setFieldValue("GOAL", "Other");
} else {
  setFieldValue("GOAL", defaultFormValues.GOAL || "Other");
}
if (defaultFormValues.ROLE && defaultFormValues.otherRole) {
  setFieldValue("ROLE", "Other");
} else {
  setFieldValue("ROLE", defaultFormValues.ROLE || "Other");
}
setFieldValue("NOTES", defaultFormValues.NOTES || "");
setFieldValue("DESCRIPTION", defaultFormValues.DESCRIPTION || "");
setFieldValue("otherRole", defaultFormValues.otherRole || "");
setFieldValue("otherGoal", defaultFormValues.otherGoal || "");
setFieldValue("errorMessage", defaultFormValues.errorMessage || "");
setFieldValue("LANGUAGE", defaultFormValues.LANGUAGE ?? "English - en");


watch(() => useStoreBotDetails,(newValue) => {
  setFieldValue("NAME", newValue.scrapedData.chatbot.name || "");
  setFieldValue("COMPANY", newValue.scrapedData.brand.name || "");
  setFieldValue("ROLE", 'Other' ?? "");
  setFieldValue("otherRole", newValue.scrapedData.chatbot.role || "");
  setFieldValue("GOAL", 'Other' ?? "");
  setFieldValue("otherGoal", newValue.scrapedData.chatbot.goal || "");
}, {deep: true});
watchEffect(() => {
  if (botDetails) {
    const userName = botDetails?.name ?? 'Unknown Bot Name';
    useHead({
      title: `Chat Bot | ${userName} - Bot Config`,
    });
  }
});

const handleUpdateBotConfig = handleSubmit(async (values: any) => {
  isLoading.value = true
  const payload: any = {
    id: botDetails.id,
    metadata: {
      ...botDetails.metadata,
      prompt: {
        ...values,
      },
    },
  };
  await updateBotDetails(payload);
  isLoading.value = false
  return navigateTo({
    name: "chat-bot-id",
    params: { id: botDetails.id },
  });
});
</script>
