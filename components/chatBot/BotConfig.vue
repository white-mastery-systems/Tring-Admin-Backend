<template>
  <div class="mx-0 gap-3">
    <form @submit.prevent="handleUpdateBotConfig" class="space-y-5">
      <div class="flex gap-4">
        <TextField name="NAME" label="Bot Name" placeholder="Eg. Noah,Bob,Chris,Ted">
        </TextField>
        <TextField name="COMPANY" label="Company Name" placeholder="Eg. Google, Amazon">
        </TextField>
      </div>
      <div class="flex gap-4 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
        <div class="w-full">
          <SelectField name="ROLE" label="Bot's Role" placeholder="Select Role" :options="[
            ...(Array.isArray(intentOptions?.roles) ? intentOptions.roles.map((role: any) => ({
              label: role.name,
              value: role.value
            })) : []),
            { label: 'Custom', value: 'custom' }
          ]" />

          <!-- helperText="enter role of your bot" -->
          <TextField v-if="values.ROLE === 'custom'" class="focus:outline-none focus:ring-0 focus:border-transparent"
            name="otherRole">
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
          ]" />

          <!-- helperText="enter goal of your bot" -->
          <TextField v-if="values.GOAL === 'custom'" name="otherGoal">
          </TextField>
        </div>
        <SelectField name="LANGUAGE" :options="chatBotList" label="Language" placeholder="Language">
        </SelectField>
      </div>
      <TextField name="NOTES" label="Notes" :isTextarea="true">
      </TextField>
      <TextField name="DESCRIPTION" label="Company Description" :isTextarea="true">
      </TextField>
      <div class="flex w-full justify-end">
        <UiButton color="primary" type="submit" size="lg" :disabled="!formHasChanged" :loading="isLoading">
          {{ formHasChanged ? 'Submit' : 'No Changes' }}
        </UiButton>
      </div>
    </form>
  </div>
</template>
<script setup lang="ts">
import { useLanguageList } from '~/composables/chatBotLanguageList';
import { botConfigSchema } from '~/validationSchema/botManagement/chatBot/botConfigurationValidation';
import { useChatbotConfig } from '~/composables/botManagement/chatBot/useChatbotConfig';


const props = defineProps<{ botDetails: any; refreshBot: () => void }>();
const { chatBotList } = useLanguageList();
const emit = defineEmits(["statusUpdated"]);
const { intentOptions, status, error, fetchConfig } = useChatbotConfig();
const originalValues = ref({}); // Add ref for original values
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

  originalValues.value = { ...defaultFormValues };
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

const hasFormChanged = () => {
  const keysToCheck = [
    "NAME", "COMPANY", "ROLE", "GOAL", "NOTES",
    "DESCRIPTION", "otherRole", "otherGoal", "errorMessage", "LANGUAGE"
  ];

  for (const key of keysToCheck) {
    // Skip if not in both objects
    if (!(key in values) || !(key in originalValues.value)) {
      continue;
    }

    // Use string comparison for more reliable results
    const originalVal = String(originalValues.value[key] || '');
    const currentVal = String(values[key] || '');

    if (originalVal !== currentVal) {
      return true;
    }
  }

  return false;
};
// Add this computed property to your component
const formHasChanged = computed(() => {
  return hasFormChanged();
});

const handleUpdateBotConfig = handleSubmit(async (values: any) => {
  isLoading.value = true

  // Only call the API if something has changed
  if (hasFormChanged()) {
    const payload: any = {
      id: props?.botDetails?.id,
      metadata: {
        ...props?.botDetails?.metadata,
        prompt: {
          ...values,
        },
      },
    };
    await updateBotDetails(payload, true);
    // Update original values after successful update
    nextTick(() => {
      originalValues.value = {
        NAME: values.NAME,
        COMPANY: values.COMPANY,
        ROLE: values.ROLE,
        GOAL: values.GOAL,
        NOTES: values.NOTES,
        DESCRIPTION: values.DESCRIPTION,
        otherRole: values.otherRole,
        otherGoal: values.otherGoal,
        errorMessage: values.errorMessage,
        LANGUAGE: values.LANGUAGE,
      };
    });
  } else {
    console.log('No changes detected, skipping API call');
  }

  isLoading.value = false
});
</script>
