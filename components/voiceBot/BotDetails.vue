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
  <div class="pb-0 sm:pb-0 md:pb-2 sm:pb-0">
    <!-- {{props.botDetails}} -->
    <form @submit.prevent="onSubmit" class="flex flex-col gap-2">
      <!-- <span class="font-medium text-left text-[16px] md:text-[18px]">
          Industries
        </span>
        <div class="flex flex-col w-full h-full overflow-x-auto">
          <UiCard class="border-0 ma-0 shadow-none">
            <UiCardContent class="grid p-0 gap-2 mb-4">
              <RadioGroup v-model="values.type" class="flex gap-4 w-full overflow-x-auto min-h-[165px] overflow-y-hidden"
                :class="!props.loading ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''">
                <div v-for="intent in intentTypes" :key="intent.value"
                  class="min-w-[100px] max-w-[100px] min-h-[100px] max-h-[100px] md:min-w-[135px] md:max-w-[135px] md:min-h-[135px] md:max-h-[135px]"
                  @click.stop="selectIndustry(intent.value)">
                  <RadioGroupItem :id="intent.value" :value="intent.value" class="peer hidden" />
                  <Label :for="intent.value"
                    class="w-full h-full flex items-center justify-center p-4 rounded-lg bg-[#F2F2F2] transition-all duration-300 "
                    :class="[(values.type ===  intent.value) ? 'border-2 border-[#09090b]' : 'border-transparent']">
                    <component :is="intent.icon" class="w-[50px] h-[50px]" :stroke-width="0.75" />
                  </Label>
                  <div class="text-[12px] font-medium mt-2 text-center">{{ intent.label }}</div>
                </div>
              </RadioGroup>
          </UiCardContent>
          </UiCard>
          </div> -->
      <div class="flex grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4">
        <TextField name="newBotName" label="Voicebot Name" placeholder="Enter bot name" />
        <TextField name="agentName" label="Voicebot Agent Name" placeholder="Enter agent name" />
        <!-- <SelectField name="boundDirection" label="Call Type" :options="boundList"
              placeholder="Select a direction" /> -->
        <!-- helperText="Select your language." -->
        <SelectField name="agentLanguage" :options="languageList" label="Language" placeholder="Agent Language">
        </SelectField>
        <RegionISOCodeSelect name="region" label="Country" helperText="Select your country" />
        <CountryTimeZones name="timezone" label="Time Zones" helperText="Enter your time zones" />
        <!-- {{ formattedTimeZones }} -->
        <!-- <UiFormField v-slot="{ value, handleChange }" name="backgroundSoundControler">
            <UiFormItem class="w-[49%]">
              <div class="flex justify-between">
                <UiLabel class="text-[14px] font-medium">Background Sound Controller</UiLabel>
                <UiFormControl>
                  <UiSwitch id="backgroundSoundControler" :checked="value" @update:checked="(checked) => {
                    handleChange(checked);
                  }" :style="{ background: value ? '#424BD1' : '#8A8A8A' }" />
                </UiFormControl>
                <UiFormMessage />
              </div>
            </UiFormItem>
          </UiFormField>
          <SelectField name="backgroundSounds" :options="backgroundSoundList" label="Background Sounds"
            :disabled="!values.backgroundSoundControler" placeholder="Select Background Sound"
            helperText="Select your background sound." required></SelectField> -->
        <!-- <TextField name="agentLanguage" label="Agent Language" required placeholder="Enter agent language" /> -->
      </div>
      <div class="flex w-full justify-end mt-4">
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
const welcomeFilesData = ref([]);
const concludeFilesData = ref([]);
const deleteFileBucket = ref([]);
const breadcrumbStore = useBreadcrumbStore();
// const { value: type } = useField("type");
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

const roles = [
  {
    value: "Customer Support",
    label: "Customer Support",
    helperText: "Assist customers with their questions and issues.",
  },
  {
    value: "Receptionist",
    label: "Receptionist",
    helperText: "Handles visitor interactions and phone calls.",
  },
];

// const intentTypes = [
//   { label: "Real Estate", value: "real-estate", icon: Home },
//   { label: "Government Sectors", value: "government-sectors", icon: Landmark },
//   { label: "Finance & Banking", value: "finance-banking", icon: Banknote },
//   { label: "Healthcare", value: "healthcare", icon: Stethoscope },
//   { label: "E-commerce", value: "e-commerce", icon: ShoppingCart },
//   { label: "Energy & Utilities", value: "energy-utilities", icon: Lightbulb },
//   { label: "Telecommunications", value: "telecommunications", icon: PhoneCall },
//   { label: "Travel & Hospitality", value: "travel-hospitality", icon: Plane },
//   { label: "Logistics", value: "logistics", icon: Truck },
//   { label: "Education & Training", value: "education-training", icon: GraduationCap },
//   { label: "IT Service", value: "it-service", icon: Server },
// ];
const { languageList } = useVoiceLanguageList();
const { formattedTimeZones } = useTImeList();
const isLoading = ref(false);

const botSchema = toTypedSchema(
  z.object({
    // type: z
    // .string({ required_error: "Industry type is required" })
    // .min(2, "Industry type is required."),
    newBotName: z.string({ required_error: "Bot Name is required" }).min(1, { message: "Bot Name is required" }),
    // boundDirection: z.string({ required_error: "Bound Direction is required" }).min(1, { message: "Bound Direction is required" }),
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
    // backgroundSoundControler: z.boolean().optional(),
    // backgroundSounds: z
    //   .string().optional()
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
setFieldValue("newBotName", props.botDetails?.name ?? "");
// setFieldValue("type", props.botDetails?.botDetails?.industryType ?? "");
// setFieldValue("boundDirection", props.botDetails?.botDetails?.callType ?? "");
watchEffect(() => {
  if (props.botDetails) {
    const userName = props.botDetails?.name ?? "Unknown Bot Name";
    useHead({
      title: `Voice Bot | ${userName} - Identity Management`,
    });
  }
});

// watch(() => values.type,(newType) => {
//     if (newType === "") {
//     toast.error("Please select an industry before proceeding.");
//     return;
//   }
// })

const onSubmit = handleSubmit(async (value: any) => {
  // updateLLMConfig()
  // boundDirection: value.boundDirection,
  // industry: value.industry,
  isLoading.value = true;
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
  console.log("payload", payload,props.botDetails);
  await updateLLMConfig(payload, props.botDetails.id, "Bot information added successfully.");
  if (typeof props.refreshBot === 'function') {
    props.refreshBot();
  } else {
    console.error("refreshBot is not a function", props.refreshBot);
  }
  isLoading.value = false;

  // return navigateTo({
  //   name: "voice-bot-id",
  //   params: { id: botDetailsList.id },
  // });
});
const selectIndustry = (value: string) => {
  // Update the type
  // type.value = value;
  console.log(value, "value -- value")
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
