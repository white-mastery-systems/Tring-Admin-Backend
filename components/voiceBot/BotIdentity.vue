<template>
  <!-- :bread-crumbs="[
    { label: `${botDetailsList.name}`, to: `/bot-management/chat-bot/${botDetailsList.id}` },
    {
      label: 'Intent Management',
      to: `/bot-management/chat-bot/${botDetailsList.id}/intent-management`,
    },
  ]"  -->
  <!-- <Page title="Bot Details" :bread-crumbs="[]" :disableSelector="true" :disable-back-button="false"
    :disableElevation="false"> -->
  <div class="pb-2 sm:pb-0">
    <!-- {{props.botDetails}} -->
    <form @submit.prevent="onSubmit" class="flex flex-col gap-2">
      <div class="flex items-center grid grid-cols-2 gap-3 text-left">
        <span class="font-medium text-left text-[14px] sm:text-[14px] md:text-[18px]">Select your Call Type</span>
        <SelectField name="boundDirection" :options="boundList" :disabled="true" placeholder="Select a direction" />
      </div>
      <UiSeparator orientation="horizontal" class="bg-[#E2E8F0] my-3 h-[0.5px]" />
      <div class="flex flex-col w-full h-full overflow-x-auto">
        <UiCard class="border-0 ma-0 shadow-none">
          <UiCardContent class="grid p-0 gap-2 mb-4 space-y-3">
            <span class="font-medium text-left text-[14px] sm:text-[14px] md:text-[18px]">
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
                  :class="[(values.type === intent.value) ? 'border-2 border-[#09090b]' : 'border-transparent']">
                  <component :is="intent.icon" class="w-[50px] h-[50px]" :stroke-width="0.75" />
                </Label>
                <div class="text-[12px] font-medium mt-2 text-center">{{ intent.label }}</div>
              </div>
            </RadioGroup>
            <UiSeparator orientation="horizontal" class="bg-[#E2E8F0] mt-2 h-[0.5px]" />
            <!-- Role -->
            <span class="font-medium text-left text-[14px] sm:text-[14px] md:text-[18px]">
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
                    <div class="h-full w-full rounded-full border border-gray-400"
                      :class="{ 'border-black': values.role === option.value }"></div>
                    <div v-if="values.role === option.value"
                      class="absolute inset-0 m-auto h-3 w-3 rounded-full bg-black"></div>
                  </div>
                  <div class="flex flex-col gap-1">
                    <Label :for="option.value" class="font-medium text-[12px] sm:text-[12px] md:text-[14px]">{{
                      option.name }}</Label>
                    <span class="text-[#71717A] text-[10px] sm:text-[10px] md:text-[12px]">{{ option.description
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
                    <div class="h-full w-full rounded-full border border-gray-400"
                      :class="{ 'border-black': values.role === 'custom' }"></div>
                    <div v-if="values.role === 'custom'" class="absolute inset-0 m-auto h-3 w-3 rounded-full bg-black">
                    </div>
                  </div>
                  <div class="flex flex-col gap-1">
                    <Label for="custom" class="font-medium text-[12px] sm:text-[12px] md:text-[14px]">Custom</Label>
                    <span class="text-[#71717A] text-[10px] sm:text-[10px] md:text-[12px]">"e.g., 'Rental Management
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
              <!-- <div class="py-0 sm:py-0 md:py-6 px-0 min-h-[100px]"> -->
              <!-- <p class="text-left text-[12px] sm:text-[12px] md:text-[14px] py-1 text-[#000000] font-medium">Tell us
                  your Chatbot’s Role in the Company</p> -->
              <!-- <TextField :isTextarea="true">

                </TextField> -->
              <!-- <TextField name="otherRole" type="text" class="centered-placeholder h-[200px]"
                  label="Tell us about your company" placeholder="e.g., 'Sales Assistant'" required>
                </TextField> -->
              <!-- <div class="min-h-[200px]"> -->
              <div class="spcace-y-2 grid w-full grid-cols-1 gap-2">
                <!-- <TextField   label="Document Id" name="documentId" 
          placeholder="Document Id"  /> -->
                <!-- <SelectField name="role" label="Role" placeholder="Role is required" :options="roles" :required="true" /> -->
                <TextField label="Tell us your Chatbot’s Role in the Company" name="otherRole" placeholder="Tell us
                  your Chatbot’s Role in the Company" :isTextarea="true" required />
              </div>
              <!-- <TextField name="otherRole" type="text" class="h-full" label="Tell us
                  your Chatbot’s Role in the Company" placeholder="e.g., 'Sales Assistant" required>
              </TextField> -->
              <!-- </div> -->
              <!-- <UiTextarea name="otherRole" class="h-[95px] text-[12px] sm:text-[12px] md:text-[14px]"
                  :resizable="false" placeholder="e.g., 'Sales Assistant" label="Tell us about your company">
                </UiTextarea> -->
              <!-- </div> -->
              <!-- <div v-if="values.role === ' custom'" class="mt-4 flex items-center gap-4 p-4 rounded-lg">
            <input v-model="customInput" type="text" placeholder="Enter custom intent"
              class="border px-4 py-2 w-full rounded-lg text-[14px] sm:text-[14px] md:text-[16px] h-20" />
        </div> -->
            </div>
            <UiSeparator orientation="horizontal" class="bg-[#E2E8F0] mt-2 h-[0.5px]" />
            <!-- Goal -->
            <span class="font-medium text-left text-[14px] sm:text-[14px] md:text-[18px]">
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
                    <div class="h-full w-full rounded-full border border-gray-400"
                      :class="{ 'border-black': values.goal === option.value }"></div>
                    <div v-if="values.goal === option.value"
                      class="absolute inset-0 m-auto h-3 w-3 rounded-full bg-black"></div>
                  </div>
                  <div class="flex flex-col gap-1">
                    <Label :for="option.value" class="font-medium text-[12px] sm:text-[12px] md:text-[14px]">{{
                      option.name }}</Label>
                    <span class="text-[#71717A] text-[10px] sm:text-[10px] md:text-[12px]">{{ option.description
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
                    <div class="h-full w-full rounded-full border border-gray-400"
                      :class="{ 'border-black': values.goal === 'custom' }"></div>
                    <div v-if="values.goal === 'custom'" class="absolute inset-0 m-auto h-3 w-3 rounded-full bg-black">
                    </div>
                  </div>
                  <div class="flex flex-col gap-1">
                    <Label for="custom" class="font-medium text-[12px] sm:text-[12px] md:text-[14px]">Custom</Label>
                    <span class="text-[#71717A] text-[10px] sm:text-[10px] md:text-[12px]">"e.g., 'Rental Management
                      Assistant
                      – Help users find and manage rental properties easily.'"</span>
                  </div>
                </div>
              </div>
            </UiRadioGroup>

            <!-- Show input field only if "Custom" is selected -->
            <div class="flex items-center gap-5 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 w-full"
              v-if="values.goal === 'custom'">
              <!-- <div v-if="values.goal === ' custom'" class="mt-4 flex items-center gap-4 p-4 rounded-lg">
            <input v-model="customInput" type="text" placeholder="Enter custom intent"
              class="border px-4 py-2 w-full rounded-lg text-[14px] sm:text-[14px] md:text-[16px] h-20" />
        </div> -->
              <!-- <div>
                <p class="text-left text-[12px] sm:text-[12px] md:text-[14px] py-1 text-[#000000]">Tell us your
                  Chatbot’s Goal in the Company</p>
                <UiTextarea name="otherGoal" class="h-[95px] text-[12px] sm:text-[12px] md:text-[14px]"
                  :resizable="false"
                  placeholder="e.g., 'Rental Management Assistant – Help users find and manage rental properties easily.'"
                  label="Tell us about your company">
                </UiTextarea>
              </div> -->
              <div class="spcace-y-2 grid w-full grid-cols-1 gap-2">
                <!-- <TextField   label="Document Id" name="documentId" 
          placeholder="Document Id"  /> -->
                <!-- <SelectField name="role" label="Role" placeholder="Role is required" :options="roles" :required="true" /> -->
                <TextField label="Tell us your Chatbot’s Goal in the Company" name="otherGoal"
                  placeholder="e.g., 'Rental Management Assistant – Help users find and manage rental properties easily.'"
                  :isTextarea="true" required />
              </div>
            </div>

          </UiCardContent>
        </UiCard>
      </div>
      <div class="flex w-full justify-end">
        <UiButton color="primary" type="submit" class="w-[120px] self-end" size="lg" :loading="isLoading">
          Submit
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
const welcomeFilesData = ref([]);
const concludeFilesData = ref([]);
const deleteFileBucket = ref([]);
const breadcrumbStore = useBreadcrumbStore();
const { value: type } = useField("type");
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
// const { languageList } = useVoiceLanguageList();
// const { formattedTimeZones } = useTImeList();
const isLoading = ref(false);

// breadcrumbStore.setBreadcrumbs([
//   {
//     label: 'Bot Details',
//     to: `/voice-bot/${props.botDetails.id}/identity-management`,
//   },
//   {
//     label: `${props.botDetails.name}`,
//     to: `/voice-bot/${props.botDetails.id}`,
//   },
// ]);

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

Object.entries(props.botDetails?.botDetails ?? {}).forEach(([key, value]: any) => {
  if (values.hasOwnProperty(key)) {
    setFieldValue(key, value);
  }
});
// setFieldValue("newBotName", props.botDetails?.name ?? "");
setFieldValue("type", props.botDetails?.botDetails?.industryType ?? "");
setFieldValue("boundDirection", props.botDetails?.botDetails?.callType ?? "");
setFieldValue("role", props.botDetails?.botDetails?.role ?? "");
setFieldValue("goal", props.botDetails?.botDetails?.goal ?? "");
setFieldValue("otherRole", props.botDetails?.botDetails?.otherRole ?? "");
setFieldValue("otherGoal", props.botDetails?.botDetails?.otherGoal ?? "");

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

const onSubmit = handleSubmit(async (value: any) => {
  isLoading.value = true;

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

  isLoading.value = false;
});
const selectIndustry = (value: string) => {
  // Update the type
  // type.value = value;
  setFieldValue("type", value);
  // IMPORTANT: Emit a complete update with ALL values
  // emit("update:values", {
  //   ...props.values,
  //   type: value,
  //   boundDirection: boundDirection.value,
  //   selectedType: selectedType.value
  // });
};


</script>