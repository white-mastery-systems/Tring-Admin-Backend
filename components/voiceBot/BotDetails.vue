<template>
  <div class="pb-0 sm:pb-0 md:pb-2 sm:pb-0">
    <form @submit.prevent="onSubmit" class="flex flex-col gap-2">
      <div class="flex grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4">
        <TextField name="newBotName" label="Voicebot Name" placeholder="Enter bot name" />
        <TextField name="agentName" label="Voicebot Agent Name" placeholder="Enter agent name" />
        <SelectField name="agentLanguage" :options="languageList" label="Language" placeholder="Agent Language">
        </SelectField>
        <RegionISOCodeSelect name="region" label="Country" helperText="Select your country" />
        <CountryTimeZones name="timezone" label="Time Zones" helperText="Enter your time zones" />
      </div>
      <div class="flex w-full justify-end mt-4">
        <!-- <UiButton color="primary" type="submit" class="w-[120px] self-end" size="lg" :loading="isLoading">
          Submit
        </UiButton> -->
        <UiButton color="primary" type="submit" class="w-[120px] self-end" size="lg" :loading="isLoading"
          :disabled="!formHasChanged">
          {{ formHasChanged ? 'Submit' : 'No Changes' }}
        </UiButton>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useVoiceLanguageList } from '~/composables/voiceBotLanguageList';
import { useTImeList } from '~/composables/timeZones';
import { useBreadcrumbStore } from "~/store/breadcrumbs"; // Import the store
import { useField } from "vee-validate";
import { FileText, Globe,Home, ShoppingCart, Plane, PhoneCall, FileDown, Landmark,
  Banknote,
  Stethoscope,
  Lightbulb,
  Truck,
  GraduationCap,
  Server } from 'lucide-vue-next';

const config = useRuntimeConfig()
definePageMeta({
  middleware: "admin-only",
});
// const route = useRoute("voice-bot-id-identity-management");
// const botDetailsList: any = await getVoiceBotDetails(route.params.id);
const props = defineProps<{ botDetails: any; loading: boolean; refreshBot: () => void }>();
const originalValues = ref({}); // Add ref for original values

const { languageList } = useVoiceLanguageList();
const isLoading = ref(false);

const botSchema = toTypedSchema(
  z.object({
    newBotName: z.string({ required_error: "Bot Name is required" }).min(1, { message: "Bot Name is required" }),
    agentName: z
      .string({ required_error: "Agent Name is required" })
      .min(1, { message: "Agent Name is required" }),
    agentLanguage: z
      .string({ required_error: "Agent Language is required" })
      .min(1, { message: "Agent Language is required" }),
    region: z
      .string({ required_error: "Country is required" })
      .min(1, "Country is required"),
    timezone: z
      .string({ required_error: "Time zone is required" })
      .min(1, "Time zone is required"),
  })
);
const {
  setFieldValue,
  handleSubmit,
  errors,
  defineField,
  resetForm,
  values,
} = useForm({
  validationSchema: botSchema,
  initialValues: {
  },
});

// Watch for bot details changes and set form values
watch(() => props.botDetails, (newBotDetails) => {
  if (newBotDetails) {
    // Set form values from bot details
    Object.entries(newBotDetails?.botDetails ?? {}).forEach(([key, value]: any) => {
      if (values.hasOwnProperty(key)) {
        setFieldValue(key, value);
      }
    });
    setFieldValue("newBotName", newBotDetails?.name ?? "");

    // Store original values after form is populated
    nextTick(() => {
      originalValues.value = {
        newBotName: values.newBotName || "",
        agentName: values.agentName || "",
        agentLanguage: values.agentLanguage || "",
        region: values.region || "",
        timezone: values.timezone || "",
      };
    });
  }
}, { immediate: true, deep: true });

setFieldValue("newBotName", props.botDetails?.name ?? "");
watchEffect(() => {
  if (props.botDetails) {
    const userName = props.botDetails?.name ?? "Unknown Bot Name";
    useHead({
      title: `Voice Bot | ${userName} - Identity Management`,
    });
  }
});

const hasFormChanged = () => {
  // Skip comparison if no original values are set yet
  if (Object.keys(originalValues.value).length === 0) return false;
  
  const fieldsToCheck = ["newBotName", "agentName", "agentLanguage", "region", "timezone"];
  
  for (const field of fieldsToCheck) {
    const originalValue = String(originalValues.value[field] || "");
    const currentValue = String(values[field] || "");
    
    if (originalValue !== currentValue) {
      return true;
    }
  }
  
  return false;
};

// Computed property for template binding
const formHasChanged = computed(() => {
  return hasFormChanged();
});

const onSubmit = handleSubmit(async (value: any) => {
  isLoading.value = true;
  
  // Only make API call if form has changed
  if (hasFormChanged()) {
    const modifiedData = {
      newBotName: value.newBotName,
      agentName: value.agentName,
      agentLanguage: value.agentLanguage,
      region: value.region,
      timezone: value.timezone,
    }
    const payload = {
      botDetails: modifiedData,
    };
    await updateLLMConfig(payload, props.botDetails.id, "Bot information added successfully.");
    
    if (typeof props.refreshBot === 'function') {
      props.refreshBot();
    } else {
      console.error("refreshBot is not a function", props.refreshBot);
    }
    
    // Update original values after successful update
    nextTick(() => {
      originalValues.value = {
        newBotName: value.newBotName,
        agentName: value.agentName,
        agentLanguage: value.agentLanguage,
        region: value.region,
        timezone: value.timezone,
      };
    });
  } else {
    console.log("No changes detected, skipping API call");
  }
  
  isLoading.value = false;
});
</script>
