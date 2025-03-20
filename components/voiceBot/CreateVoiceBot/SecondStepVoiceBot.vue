<script setup lang="ts">
import { useField } from "vee-validate";
import { ref } from "vue";
import {
  Landmark,
  Banknote,
  Home,
  Stethoscope,
  ShoppingCart,
  Lightbulb,
  PhoneCall,
  Plane,
  Truck,
  GraduationCap,
  Server
} from "lucide-vue-next";
import { useVoiceLanguageList } from '~/composables/voiceBotLanguageList';
// import { useChatbotConfig } from '~/composables/botManagement/chatBot/useChatbotConfig';

const props = defineProps<{
  errors: Record<string, any>;
  values: Record<string, any>;
}>();

const { languageList } = useVoiceLanguageList();
// ✅ Use `useField()` from vee-validate
const { value: COMPANY } = useField("COMPANY");
const { value: newBotName } = useField("newBotName");
const { value: agentLanguage } = useField("agentLanguage");
const { value: agentName, } = useField("agentName");
const { value: selectedType } = useField("type");
const { value: logo } = useField("logo");
const { value: BotName } = useField("BotName");
const colorInput = ref();
const secondarycolorInput = ref();

// const { intentOptions, status, error, fetchConfig } = useChatbotConfig();

// Call fetchConfig when needed (e.g., on mount or on type change)

const logoData = ref()
// ✅ Function to update industry selection
// const selectIndustry = (value: any) => {
//   selectedType.value = value;
//   // props.fetchConfig(value);
// };
const openPrimaryColorPicker = () => colorInput.value.$el.click();
const openSecondaryColorPicker = () => secondarycolorInput.value.$el.click();
const handleLogoChange = (event: any) => {
  // Assuming event returns an array of files, take the first one
  logoData.value = event[0];
  const reader = new FileReader();
  reader.onload = (e) => {
    // Update the field value with the data URL
    logo.value = { url: e.target.result };
  };
  reader.readAsDataURL(logoData.value);
};
</script>

<template>
  <UiCard class="border-0">
    <UiCardHeader class="p-0">
      <div class="flex items-center justify-between gap-4 px-4 pt-4">
        <div class="flex flex-col gap-[6px]">
          <UiCardTitle class="font-bold text-[16px] text-[16px] md:text-[20px] text-[#09090B]">Basic bot details
          </UiCardTitle>
          <UiCardDescription class="font-normal text-[12px] sm:text-[12px] md:text-[14px] text-[#71717A]">
            Enter your basic bot details
          </UiCardDescription>
        </div>
        <UiCardDescription class="text-[14px] font-medium">
          <span class="text-[#09090B]">Step 2</span><span class="text-[#64748B]">/6</span>
        </UiCardDescription>
      </div>
    </UiCardHeader>

    <div class="mt-4">
      <UiSeparator orientation="horizontal" class="bg-[#E2E8F0] w-full h-[0.5px]" />
    </div>


    <UiCardContent class="grid gap-6 my-6 px-4">
      <!-- {{ intentTypes }} || intentTypes -->
      <!-- ✅ Industry selection - FIXED: Using selectedType directly in the class binding -->
      <!-- <RadioGroup v-model="selectedType" class="flex gap-4 w-full overflow-x-auto min-h-[165px] overflow-y-hidden">
        <div v-for="intent in intentTypes" :key="intent.value"
          class="min-w-[100px] max-w-[100px] min-h-[100px] max-h-[100px] md:min-w-[135px] md:max-w-[135px] md:min-h-[135px] md:max-h-[135px]"
          @click.stop="selectIndustry(intent.value)">
          <RadioGroupItem :id="intent.value" :value="intent.value" class="peer hidden" />
          <Label :for="intent.value"
            class="w-full h-full flex items-center justify-center p-4 rounded-lg bg-[#F2F2F2] transition-all duration-300"
            :class="[selectedType === intent.value ? 'border-2 border-[#09090b]' : 'border-transparent']">
            <component :is="intent.icon" class="w-[50px] h-[50px]" :stroke-width="0.75" />
          </Label>
          <div class="text-[12px] md:text-[12px] font-medium mt-2 text-center">{{ intent.label }}</div>
        </div>
      </RadioGroup> -->
      <!-- {{ props }} || asdad -->
      <!-- ✅ Company Name & Chatbot Name fields -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextField name="newBotName" label="Voicebot Name" class="text-[14px]" placeholder="Enter your bot name"
          v-model="newBotName" />
          <TextField name="agentName" label="Voicebot Agent Name" class="text-[14px]" placeholder="Enter your voicebot agent name"
          v-model="agentName" />
          <!-- <SelectField
            name="industry"
            label="Industry"
            placeholder="Select Role"
            :options="[]"
            :required="true"
            /> -->
            <SelectField name="agentLanguage" :options="languageList" label="Agent Language" placeholder="Agent Language" />
            <RegionISOCodeSelect name="region" label="Region" helperText="Enter your region" />
            <CountryTimeZones name="timezone" label="Time Zones" helperText="Enter your time zones" />
        <!-- <TextField label="Chatbot Name" name="BotName" class="text-[14px]" placeholder="Enter Your Chatbot Name"
          v-model="BotName" />
        <TextField label="Chat Agent Name" name="NAME" class="text-[14px]" placeholder="Enter Your Chat Agent Name"
          v-model="COMPANY" /> -->
      </div>
    </UiCardContent>
  </UiCard>
</template>