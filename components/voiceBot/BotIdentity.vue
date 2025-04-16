<template>
  <div class="pb-2 sm:pb-0">
    <form @submit.prevent="onSubmit" class="flex flex-col gap-2">
      <div class="flex items-center grid grid-cols-2 gap-3 text-left">
        <span class="font-medium text-left text-[12px] sm:text-[12px] md:text-[16px] lg:text-[18px]">Select your Call
          Type</span>
        <SelectField name="boundDirection" :options="boundList" :disabled="true" placeholder="Select a direction" />
      </div>
      <UiSeparator orientation="horizontal" class="bg-[#E2E8F0] my-3 h-[0.5px]" />
      <div class="flex flex-col w-full h-full overflow-x-auto">
        <UiCard class="border-0 ma-0 shadow-none">
          <UiCardContent class="grid p-0 gap-2 mb-4 space-y-3">
            <span class="font-medium text-left text-[12px] sm:text-[12px] md:text-[16px] lg:text-[18px]">
              Industries
            </span>
            <RadioGroup v-model="values.type" class="flex gap-4 w-full overflow-x-auto min-h-[165px] overflow-y-hidden"
              :class="true ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''">
              <!-- :class="[(errors.type && !values.type) ? 'border-2 border-[#ff0000] rounded-lg' : 'border-transparent']" -->
              <div v-for="intent in intentTypes" :key="intent.value"
                class="min-w-[100px] max-w-[100px] min-h-[100px] max-h-[100px] md:min-w-[135px] md:max-w-[135px] md:min-h-[135px] md:max-h-[135px]"
                @click.stop="selectIndustry(intent.value)">
                <RadioGroupItem :id="intent.value" :value="intent.value" class="peer hidden" />
                <Label :for="intent.value"
                  class="w-full h-full flex items-center justify-center p-4 rounded-lg bg-[#F2F2F2] transition-all duration-300 "
                  :class="[(values.type === intent.value) ? 'border-2 border-[#FFBC42] bg-[#FFBC42]' : 'border-[#D9D9D9]']">
                  <component :is="intent.icon" class="w-[50px] h-[50px]"
                    :class="[(values.type === intent.value) ? 'text-[#FFFFFF]' : '']" :stroke-width="0.75" />
                </Label>
                <div class="text-[10px] sm:text-[10px] md:text-[12px] lg:text-[12px] font-medium mt-2 text-center">{{
                  intent.label }}
                </div>
              </div>
            </RadioGroup>
            <UiSeparator orientation="horizontal" class="bg-[#E2E8F0] mt-2 h-[0.5px]" />
            <!-- Role -->
            <span class="font-medium text-left text-[12px] sm:text-[12px] md:text-[16px] lg:text-[18px]">
              Bot Role
            </span>
            <UiRadioGroup v-model="values.role" name="role" :options="intentOptions?.roles" :isVertical="true"
              ion="vertical" class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-5">
              <div v-for="option in intentOptions?.roles" :key="option.value"
                class="flex items-center gap-4 border p-4 rounded-lg cursor-pointer min-h-[100px]" @click="() => {
                  setFieldValue('role', option.value)
                }">
                <div class="flex gap-4">
                  <!-- Custom radio circle matching the design -->
                  <div class="relative flex items-center justify-center h-5 w-5 flex-shrink-0">
                    <div class="h-full w-full rounded-full border"
                      :class="[values.role === option.value ? 'border-[#FFBC42]' : 'border-gray-400']"></div>
                    <div v-if="values.role === option.value"
                      class="absolute inset-0 m-auto h-3 w-3 rounded-full bg-[#FFBC42]"></div>
                  </div>
                  <div class="flex flex-col gap-1">
                    <Label :for="option.value"
                      class="font-medium text-[10px] sm:text-[10px] md:text-[12px] lg:text-[14px]">{{
                      option.name }}</Label>
                    <span class="text-[#71717A] text-[10px] sm:text-[10px] md:text-[12px] lg:text-[12px]">{{
                      option.description
                      }}</span>
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-4 border p-4 rounded-lg cursor-pointer min-h-[100px]" @click="() => {
                setFieldValue('role', 'custom')
              }">
                <div class="flex gap-4">
                  <!-- Custom radio for the "custom" option -->
                  <div class="relative flex items-center justify-center h-5 w-5 flex-shrink-0">
                    <div class="h-full w-full rounded-full border"
                      :class="[values.role === 'custom' ? 'border-[#FFBC42]' : 'border-gray-400']"></div>
                    <div v-if="values.role === 'custom'" class="absolute inset-0 m-auto h-3 w-3 rounded-full bg-[#FFBC42]">
                    </div>
                  </div>
                  <div class="flex flex-col gap-1">
                    <Label for="custom"
                      class="font-medium text-[10px] sm:text-[10px] md:text-[12px] lg:text-[14px]">Custom</Label>
                    <span class="text-[#71717A] text-[10px] sm:text-[10px] md:text-[12px] lg:text-[12px]">"e.g., 'Rental
                      Management
                      Assistant
                      – Help users find and manage rental properties easily.'"</span>
                  </div>
                </div>
              </div>
            </UiRadioGroup>
            <!-- {{ values }} -->
            <!-- Show input field only if "Custom" is selected -->
            <div class="flex items-center gap-5 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 w-full"
              v-if="values.role === 'custom'">
              <div class="spcace-y-2 grid w-full grid-cols-1 gap-2">
                <TextField label="Tell us your Chatbot’s Role in the Company" name="otherRole" placeholder="Tell us
                  your Chatbot’s Role in the Company" :isTextarea="true" required />
              </div>
            </div>
            <UiSeparator orientation="horizontal" class="bg-[#E2E8F0] mt-2 h-[0.5px]" />
            <!-- Goal -->
            <span class="font-medium text-left text-[12px] sm:text-[12px] md:text-[16px] lg:text-[18px]">
              Bot Goal
            </span>
            <!-- :class="props.disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''" -->
            <UiRadioGroup v-model="values.goal" orientation="vertical"
              class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-5">
              <div v-for="option in intentOptions?.goals" :key="option.value"
                class="flex items-center gap-4 border p-4 rounded-lg cursor-pointer min-h-[100px]" @click="() => {
                  setFieldValue('goal', option.value)
                }">
                <div class="flex gap-4">
                  <!-- Custom radio circle matching the design -->
                  <div class="relative flex items-center justify-center h-5 w-5 flex-shrink-0">
                    <div class="h-full w-full rounded-full border"
                      :class="[(values.goal === option.value) ? 'border-[#FFBC42]' : 'border-gray-400' ]"></div>
                    <div v-if="values.goal === option.value"
                      class="absolute inset-0 m-auto h-3 w-3 rounded-full bg-[#FFBC42]"></div>
                  </div>
                  <div class="flex flex-col gap-1">
                    <Label :for="option.value"
                      class="font-medium text-[10px] sm:text-[10px] md:text-[12px] lg:text-[14px]">{{
                      option.name }}</Label>
                    <span class="text-[#71717A] text-[10px] sm:text-[10px] md:text-[12px] lg:text-[12px]">{{
                      option.description
                      }}</span>
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-4 border p-4 rounded-lg cursor-pointer min-h-[100px]" @click="() => {
                setFieldValue('goal', 'custom')
              }">
                <div class="flex gap-4">
                  <!-- Custom radio for the "custom" option -->
                  <div class="relative flex items-center justify-center h-5 w-5 flex-shrink-0">
                    <div class="h-full w-full rounded-full border"
                      :class="[values.goal === 'custom' ? 'border-[#FFBC42]' : 'border-gray-400']"></div>
                    <div v-if="values.goal === 'custom'" class="absolute inset-0 m-auto h-3 w-3 rounded-full bg-[#FFBC42]">
                    </div>
                  </div>
                  <div class="flex flex-col gap-1">
                    <Label for="custom"
                      class="font-medium text-[10px] sm:text-[10px] md:text-[12px] lg:text-[14px]">Custom</Label>
                    <span class="text-[#71717A] text-[10px] sm:text-[10px] md:text-[12px] lg:text-[12px]">"e.g., 'Rental
                      Management
                      Assistant
                      – Help users find and manage rental properties easily.'"</span>
                  </div>
                </div>
              </div>
            </UiRadioGroup>

            <!-- Show input field only if "Custom" is selected -->
            <div class="flex items-center gap-5 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 w-full"
              v-if="values.goal === 'custom'">
              <div class="spcace-y-2 grid w-full grid-cols-1 gap-2">
                <TextField label="Tell us your Chatbot’s Goal in the Company" name="otherGoal"
                  placeholder="e.g., 'Rental Management Assistant – Help users find and manage rental properties easily.'"
                  :isTextarea="true" required />
              </div>
            </div>
          </UiCardContent>
        </UiCard>
      </div>
      <div class="flex w-full justify-end">
        <UiButton color="primary" type="submit" class="w-[120px] self-end" size="lg" :loading="isLoading"
          :disabled="!formHasChanged">
          {{ formHasChanged ? 'Submit' : 'No Changes' }}
        </UiButton>
      </div>
    </form>
  </div>
  <!-- </Page> -->
</template>

<script setup lang="ts">
import { useVoiceLanguageList } from '~/composables/voiceBotLanguageList';
import { useTImeList } from '~/composables/timeZones';
import { useBreadcrumbStore } from "~/store/breadcrumbs"; // Import the store
import { useField } from "vee-validate";
import {
  FileText, Globe, Home, ShoppingCart, Plane, PhoneCall, FileDown, Landmark,
  Banknote,
  Stethoscope,
  Lightbulb,
  Truck,
  GraduationCap,
  Server
} from 'lucide-vue-next';
import { useChatbotConfig } from '~/composables/botManagement/chatBot/useChatbotConfig';

const config = useRuntimeConfig()
definePageMeta({
  middleware: "admin-only",
});
// const route = useRoute("voice-bot-id-identity-management");
// const botDetailsList: any = await getVoiceBotDetails(route.params.id);
const props = defineProps<{ botDetails: any; loading: boolean; refreshBot: () => void }>();
const boundList = ref([
  {
    label: 'Both',
    value: 'both',
  },
  {
    label: 'Inbound',
    value: 'inbound'
  }, {
    label: 'Outbound',
    value: 'outbound',
  }
])
const originalValues = ref({}); // Add ref for original values


const { intentOptions, fetchConfig } = useChatbotConfig();

const intentTypes = [
  { label: "Real Estate", value: "real-estate", icon: Home },
  { label: "Government Sectors", value: "government-sectors", icon: Landmark },
  { label: "Finance & Banking", value: "finance-banking", icon: Banknote },
  { label: "Healthcare", value: "healthcare", icon: Stethoscope },
  { label: "E-commerce", value: "e-commerce", icon: ShoppingCart },
  { label: "Energy & Utilities", value: "energy-utilities", icon: Lightbulb },
  { label: "Telecommunications", value: "telecommunications", icon: PhoneCall },
  { label: "Travel & Hospitality", value: "travel-hospitality", icon: Plane },
  { label: "Logistics", value: "logistics", icon: Truck },
  { label: "Education & Training", value: "education-training", icon: GraduationCap },
  { label: "IT Service", value: "it-service", icon: Server },
];
const isLoading = ref(false);

const botSchema = toTypedSchema(
  z.object({
    type: z
      .string({ required_error: "Industry type is required" })
      .min(2, "Industry type is required."),
    boundDirection: z.string({ required_error: "Bound Direction is required" }).min(1, { message: "Bound Direction is required" }),
    role: z.string({ required_error: "Role is required" }).min(1, { message: "Role is required" }),
    goal: z.string({ required_error: "Goal is required" }).min(1, { message: "Goal is required" }),
    otherRole: z.string().optional(),
    otherGoal: z.string().optional(),
  }).superRefine((data, ctx) => {
    // Check if custom role is selected but the otherRole field is empty
    if (data.role === 'custom' && (!data.otherRole || data.otherRole.trim() === '')) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Custom role description is required",
        path: ["otherRole"]
      });
    }

    // Check if custom goal is selected but the otherGoal field is empty
    if (data.goal === 'custom' && (!data.otherGoal || data.otherGoal.trim() === '')) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Custom goal description is required",
        path: ["otherGoal"]
      });
    }
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

// Instead, add a watch function
watch(() => props.botDetails, (newBotDetails) => {
  if (newBotDetails) {
    // Set form values from bot details
    Object.entries(newBotDetails?.botDetails ?? {}).forEach(([key, value]: any) => {
      if (values.hasOwnProperty(key)) {
        setFieldValue(key, value);
      }
    });

    // Set specific fields
    setFieldValue("type", newBotDetails?.botDetails?.industryType ?? "");
    setFieldValue("boundDirection", newBotDetails?.botDetails?.callType ?? "");
    setFieldValue("role", newBotDetails?.botDetails?.role ?? "");
    setFieldValue("goal", newBotDetails?.botDetails?.goal ?? "");
    setFieldValue("otherRole", newBotDetails?.botDetails?.otherRole ?? "");
    setFieldValue("otherGoal", newBotDetails?.botDetails?.otherGoal ?? "");

    // After all field values are set, store original values
    nextTick(() => {
      originalValues.value = {
        type: values.type,
        boundDirection: values.boundDirection,
        role: values.role,
        goal: values.goal,
        otherRole: values.otherRole || '',
        otherGoal: values.otherGoal || '',
      };
    });
  }
}, { immediate: true, deep: true });

watch(() => props.botDetails?.botDetails?.industryType, async (newType) => {
  if (newType) {
    await fetchConfig(newType)
    // await fetchKnowledgeBase(newType)
    // fetchSuggestions(newType)
  }
}, { deep: true, immediate: true });
watchEffect(() => {
  if (props.botDetails) {
    const userName = props.botDetails?.name ?? "Unknown Bot Name";
    useHead({
      title: `Voice Bot | ${userName} - Identity Management`,
    });
  }
});
watch(errors,(newErrors) => {
  console.log(newErrors,"errors")
})

watch(() => values.type, (newType) => {
  if (newType === "") {
    toast.error("Please select an industry before proceeding.");
    return;
  }
})
onMounted(async () => {
  await fetchConfig(props.botDetails?.botDetails?.industryType)
});
// Check if form values have changed from original values
const hasFormChanged = () => {
  // Skip comparison if no original values are set yet
  if (Object.keys(originalValues.value).length === 0) {
    console.log("Original values not set yet");
    return false;
  }

  const fieldsToCheck = ["type", "boundDirection", "role", "goal", "otherRole", "otherGoal"];

  for (const field of fieldsToCheck) {
    const originalValue = String(originalValues.value[field] || "");
    const currentValue = String(values[field] || "");

    if (originalValue !== currentValue) {
      console.log(`Field changed: ${field}, Original: "${originalValue}", Current: "${currentValue}"`);
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
      ...props.botDetails.botDetails,
      boundDirection: value.boundDirection,
      industry: value.industry,
      role: values.role,
      goal: values.goal,
      otherRole: values?.otherRole ?? '',
      otherGoal: values?.otherGoal ?? '',
    };

    const payload = {
      botDetails: modifiedData,
    };
    const llmConfig = {
      ...props.botDetails.llmConfig,
      inboundPrompt: {},
      outboundPrompt: {},
    }
    payload.llmConfig = llmConfig;

    await updateLLMConfig(payload, props.botDetails.id, "Bot information added successfully.");

    if (typeof props.refreshBot === 'function') {
      props.refreshBot();
    } else {
      console.error("refresh function is not available", props.refreshBot);
    }

    // Update original values after successful update
    nextTick(() => {
      originalValues.value = {
        type: values.type,
        boundDirection: values.boundDirection,
        role: values.role,
        goal: values.goal,
        otherRole: values.otherRole || '',
        otherGoal: values.otherGoal || '',
      };
    });
  } else {
    console.log("No changes detected, skipping API call");
  }

  isLoading.value = false;
});

const selectIndustry = (value: string) => {
  setFieldValue("type", value);
};


</script>