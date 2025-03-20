<script setup lang="ts">
import { useField } from "vee-validate";
import { FileText, Globe,Home, ShoppingCart, Plane, PhoneCall, FileDown, Landmark,
  Banknote,
  Stethoscope,
  Lightbulb,
  Truck,
  GraduationCap,
  Server } from 'lucide-vue-next';

const props = defineProps<{
  errors: Record<string, any>;
  suggestionsContent: Array<any>;
  loading: boolean;
  refreshSuggestions: () => void;
}>();

const uploadDocumentRef = ref(null);
defineExpose({ uploadDocumentRef })
const { value: selectedType } = useField("selectedType")
const { value: type } = useField("type");

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
const companyDetails = ref('')
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
// Function to handle button click
const selectType = (types: string) => {
  if (!type.value && (types != 'Website')) {
    toast.error('Please select an industry before proceeding.');
    return
  }
  selectedType.value = types;
};

const buttons = [
  { label: "Website", icon: Globe },
  { label: "Text", icon: FileText },
];
const selectIndustry = (value: string) => {
  // selectedType.value = value;
  type.value = value
};


const changeKnowledge = () => {
  selectedType.value = ''
}
</script>

<template>
  <UiCard class="border-0 flex flex-col shadow-none h-full">
    <!-- Header Section -->
    <UiCardHeader class="p-0">
      <div class="flex items-center justify-between gap-4 px-4 pb-2 pt-2">
        <div class="flex flex-col gap-[3px]">
          <UiCardTitle class="font-bold text-[18px] md:text-[20px] text-[#09090B]">
            Build Your Bot's Knowledge
          </UiCardTitle>
          <UiCardDescription class="font-normal text-[14px] text-[#71717A]">
            Enter your industry type and other details
          </UiCardDescription>
        </div>
        <UiCardDescription class="text-[14px] font-medium">
          <span class="text-[#09090B]">Step 1</span><span class="text-[#64748B]">/6</span>
        </UiCardDescription>
      </div>
      <UiSeparator orientation="horizontal" class="bg-[#E2E8F0]" />
    </UiCardHeader>
    
    <!-- Main Content Area -->
    <div class="flex flex-col items-center px-4 pb-4 pt-2 flex-grow overflow-auto">
      <!-- Initial Selection Screen -->
      <div v-if="!selectedType" class="flex flex-col w-full h-full">
        <UiCardContent class="grid p-0 gap-2 mb-4">
          <div class="flex items-center grid grid-cols-2 gap-3 text-left">
            <span class="font-medium text-left text-[16px] md:text-[18px]">Select your Call Type</span>
            <SelectField 
              name="boundDirection" 
              :options="boundList" 
              placeholder="Select a direction" 
            />
          </div>
          <UiSeparator orientation="horizontal" class="bg-[#E2E8F0] mt-2" />
          <span class="font-medium text-left text-[16px] md:text-[18px]">
            Industries
          </span>
          
          <RadioGroup 
            v-model="type" 
            class="flex gap-4 w-full overflow-x-auto min-h-[165px] overflow-y-hidden" 
            :class="props.loading ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''" 
            :disabled="true"
          >
            <div
              v-for="intent in intentTypes"
              :key="intent.value"
              class="min-w-[100px] max-w-[100px] min-h-[100px] max-h-[100px] md:min-w-[135px] md:max-w-[135px] md:min-h-[135px] md:max-h-[135px]"
              @click.stop="selectIndustry(intent.value)"
            >
              <RadioGroupItem :id="intent.value" :value="intent.value" class="peer hidden" />
              <Label
                :for="intent.value"
                class="w-full h-full flex items-center justify-center p-4 rounded-lg bg-[#F2F2F2] transition-all duration-300"
                :class="[type === intent.value ? 'border-2 border-[#09090b]' : 'border-transparent']"
              >
                <component :is="intent.icon" class="w-[50px] h-[50px]" :stroke-width="0.75" />
              </Label>
              <div class="text-[12px] font-medium mt-2 text-center">{{ intent.label }}</div>
            </div>
          </RadioGroup>
        </UiCardContent>
        
        <div class="flex flex-col items-center justify-center w-full gap-5 bg-[#FCFCFC] border border-1 rounded-lg p-4 flex-grow">
          <div class="space-y-1 flex flex-col text-center">
            <div class="font-bold text-[18px] md:text-[20px] text-[#09090B]">
              Select Your Bot's Knowledge Source
            </div>
            <div class="font-normal text-[14px] text-[#71717A] mt-2">
              Import your company details and goals through your <br>
              <span class="text-[#18181B]">website link or by text input</span>
            </div>
          </div>
          
          <div class="flex justify-center gap-3 w-full md:w-[40%] lg:w-[30%] mt-4">
            <UiButton
              type="button"
              variant="default"
              class="bg-[#000000] text-[#ffffff] font-regular flex-1"
              @click="selectType('Website')"
            >
              <component :is="buttons[0].icon" class="mr-2 w-5 h-5" />
              {{ buttons[0].label }}
            </UiButton>
            <UiButton
              type="button"
              variant="outline"
              class="border-[#000000] text-[#000000] hover:text-[#ffffff] hover:bg-[#000000] font-regular flex-1"
              @click="selectType('Text')"
              :loading="props.loading && 'Text'"
              :disabled="props.loading && 'Text'"
            >
              <component :is="buttons[1].icon" class="mr-2 w-5 h-5" />
              {{ buttons[1].label }}
            </UiButton>
          </div>
        </div>
      </div>

      <!-- Knowledge Type Sections -->
      <div v-else class="w-full h-full">
        <!-- Website Section -->
        <div v-if="selectedType === 'Website'" class="w-full py-4 space-y-4 h-full flex flex-col">
          <div class="flex items-center justify-between w-full">
            <span class="font-bold text-[18px] md:text-[20px] text-[#09090B]">Website</span>
            <UiButton 
              type="button" 
              class="bg-[#000000] px-4 py-0 text-[12px] md:text-[14px]" 
              @click="changeKnowledge()"
            >
              Change Knowledge Source
            </UiButton>
          </div>
          <div class="bg-[#E2E8F0] rounded-lg p-4 text-[12px] md:text-[14px] text-left">
            <div class="font-medium">Note:</div>
            <div>
              All your company's branding elements, including key information, will be automatically imported from the website link you provide, ensuring a seamless and accurate representation of your brand.
            </div>
          </div>
          <div class="flex flex-col gap-3 w-full flex-grow">
            <WebScrapingForm />
            <div class="flex flex-col gap-2 text-[14px] text-left font-medium">
              <span>
                Website generated details (Knowledge Base)
              </span>
              <ScrapDateDocumentUpload :refresh="props.refresh" />
            </div>
          </div>
        </div>

        <!-- Text Section -->
        <div v-else-if="selectedType === 'Text'" class="w-full py-4 h-full flex flex-col">
          <div class="flex items-center justify-between w-full">
            <span class="font-bold text-[18px] md:text-[20px] text-[#09090B]">Text</span>
            <UiButton 
              type="button" 
              class="bg-[#000000] px-4 py-0 text-[12px] md:text-[14px]" 
              @click="changeKnowledge()"
            >
              Change Knowledge Source
            </UiButton>
          </div>
          <div class="bg-[#E2E8F0] rounded-lg p-4 text-[12px] md:text-[14px] my-4 text-left">
            <div class="font-medium">Note:</div>
            <div>A sample text for the industry has been provided below. You can edit the necessary fields to complete the process.</div>
          </div>
          <div class="text-left flex flex-col gap-2 flex-grow">
            <span class="text-[14px] font-medium">Tell us about your company</span>
            <TextDocumentUpload 
              ref="uploadDocumentRef" 
              :refresh="props.refresh" 
              :contentSuggestions="props.suggestionsContent" 
              class="flex-grow" 
            />
          </div>
        </div>
      </div>
    </div>
  </UiCard>
</template>