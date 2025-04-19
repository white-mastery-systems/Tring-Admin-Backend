<script setup lang="ts">
import { useField } from "vee-validate";
import { Home, ShoppingCart, Plane, PhoneCall, Globe, FileText, FileDown, Landmark,
  Banknote,
  Stethoscope,
  Lightbulb,
  Truck,
  GraduationCap,
  Hotel,
  Server } from 'lucide-vue-next';
  
  const props = defineProps<{
    errors: Record<string, any>;
    suggestionsContent: Array<any>;
    loading: boolean;
    isUploading: boolean;
    documents: Array<any>;
    page: any;
    totalCount: any;
    totalPageCount: any;
    refresh: () => void;
    refreshSuggestions: () => void;
  }>();

const uploadDocumentRef = ref(null);
defineExpose({ uploadDocumentRef })
const { value: selectedType } = useField("selectedType")
const { value: type } = useField("type");
const previousType = ref(type.value);

const companyDetails = ref('')
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
  { label: "Document", icon: FileText },
  { label: "Text", icon: FileDown },
];

const intentTypes = [
  { label: "Real Estate", value: "real-estate", icon: Home },
  { label: "Government Sectors", value: "government-sectors", icon: Landmark },
  { label: "Finance & Banking", value: "finance-banking", icon: Banknote },
  { label: "Healthcare", value: "healthcare", icon: Stethoscope },
  { label: "E-commerce", value: "e-commerce", icon: ShoppingCart },
  { label: "Energy & Utilities", value: "energy-utilities", icon: Lightbulb },
  { label: "Telecommunications", value: "telecommunications", icon: PhoneCall },
  // { label: "Travel & Hospitality", value: "travel-hospitality", icon: Plane },
  { label: "Travel", value: "travel", icon: Plane },
  { label: "Hospitality", value: "hospitality", icon: Hotel },
  { label: "Logistics", value: "logistics", icon: Truck },
  { label: "Education & Training", value: "education-training", icon: GraduationCap },
  { label: "IT Service", value: "it-service", icon: Server },
];

// Replace the existing watch function with this one
watch(() => selectedType.value, (newSelectedType) => {
  if (newSelectedType === 'Text') {
    // Only call refreshSuggestions if type has changed
    if (type.value !== previousType.value) {
      props.refreshSuggestions(type.value);
      previousType.value = type.value;
    }
  }
}, { deep: true, immediate: true });

// Also add a separate watch for type changes
watch(() => type.value, (newType, oldType) => {
  if (selectedType.value === 'Text' && newType !== oldType) {
    props.refreshSuggestions(newType);
    previousType.value = newType;
  }
}, { deep: true });

// ✅ Function to update industry selection
const selectIndustry = (value: string) => {
  // selectedType.value = value;
  type.value = value
};
</script>

<template>
  <BotSetupCard title="Build Your Bot’s Knowledge"
    :description="(selectedType === 'Website') ? 'Import your company details and goals through your website link, by document upload, or by text input' : (selectedType === 'Document') ? 'Import your company details and goals through your website link, by document upload, or by text input' : (selectedType === 'Text') ? 'Import your company details and goals through your website link, by document upload, or by text input' : 'Select your industry type and source of knowledge' "
    currentStep="1" totalSteps="5">
    <div class="flex flex-col items-center text-center h-full w-full"
      :class="selectedType ? 'justify-start' : 'justify-center'">
      <div v-show="!selectedType" class="gap-3 space-y-3 w-full overflow-x-hidden">
        <!-- Scrollable Radio Group -->
        <UiCardContent class="grid gap-3 p-0 mb-6">
          <span class="font-medium text-left text-[16px] md:text-[18px] leading-none">Industries</span>
          <RadioGroup v-model="type" class="flex gap-4 w-full overflow-x-auto min-h-[165px] overflow-y-hidden"
            :disabled="true">
            <div v-for="intent in intentTypes" :key="intent.value"
              class="min-w-[100px] max-w-[100px] min-h-[100px] max-h-[100px] md:min-w-[138px] md:max-w-[138px] md:min-h-[135px] md:max-h-[135px]"
              @click.stop="selectIndustry(intent.value)">
              <RadioGroupItem :id="intent.value" :value="intent.value" class="peer hidden" />
              <Label :for="intent.value"
                class="w-full h-full border flex items-center justify-center p-4 rounded-lg bg-[#fffff] transition-all duration-300"
                :class="[type === intent.value ? 'border-3 border-[#FFBC42] bg-[#FFBC42]' : 'border-1 border-[#D9D9D9]']">
                <component :is="intent.icon" class="w-[30px] h-[30px] sm:w-[30px] sm:h-[30px] md:w-[50px] md:h-[50px]"
                  :class="[(type === intent.value) ? 'text-[#FFFFFF]' : '']" :stroke-width="0.75" />
              </Label>
              <div class="text-[10px] sm:text-[10px] md:text-[12px] font-medium mt-2 text-center">{{ intent.label }}
              </div>
            </div>
          </RadioGroup>
        </UiCardContent>
        <div
          class="flex flex-col items-center justify-center w-full gap-5 bg-[#FCFCFC] border border-1 rounded-lg p-4 sm:p-4 md:p-8 flex-grow">
          <div class="space-y-1 flex flex-col w-full sm:w-full md:w-[55%]">
            <div class="font-bold text-[14px] sm:text-[14px] md:text-[20px] text-[#09090B] leading-none">
              Select Your Bot's Knowledge Source
            </div>
            <div class="font-normal text-[10px] sm:text-[10px] md:text-[14px] text-[#71717A]">
              Import your company details and goals through your
              <span class="text-[#18181B]">website link, by document upload, or by text input</span>
            </div>
          </div>
          <!-- {{props.loading}} || wasdsa -->
          <div class="flex flex-wrap justify-center gap-3 w-[50%] sm:w-[50%] md:w-[60%] lg:md:w-[40%]">
            <UiButton type="button" variant="outline" v-for="(btn, index) in buttons" :key="index"
              class="border-[#DCDCDC] text-[10px] sm:text-[10px] md:text-[14px] text-[#000000] hover:text-[#ffffff] hover:bg-[#FFBC42] hover:border-[#FFBC42] font-regular w-full md:flex-1 new_bot_button_shadow"
              @click="selectType(btn.label)">
              <component :is="btn.icon" class="mr-2 w-3 h-3 sm:w-3 sm:h-3 md:w-5 md:h-5" />
              {{ btn.label }}
            </UiButton>
          </div>
        </div>

      </div>

      <!-- Knowledge Type Sections -->
      <div v-show="selectedType" class="w-full">
        <div v-show="selectedType === 'Website'" class="w-full space-y-4">
          <div class="flex items-center justify-between w-full">
            <span class="font-bold text-[12px] sm:text-[12px] md:text-[20px] text-[#09090B]">Website</span>
          </div>
          <div class="bg-[#E2E8F0] rounded-lg p-4 text-[10px] sm:text-[10px] md:text-[14px] text-left">
            <div class="font-medium">Note:</div>
            <div>
              All your company's branding elements, including colors, logos, and key information, will be automatically
              imported from the website link you provide, ensuring a seamless and accurate representation of your brand.
            </div>
          </div>
          <div class="flex flex-col gap-3 w-full">
            <WebScrapingForm botType="chat" :isUploading="props.isUploading" />
            <ScrapDateDocumentUpload :refresh="props.refresh" :IndustryType="type" />
          </div>
        </div>

        <div v-show="selectedType === 'Document'" class="w-full py-0 sm:py-0 md:py-4">
          <div class="flex items-center justify-between w-full">
            <span class="font-bold text-[18px] md:text-[20px] text-[#09090B]">Document</span>
          </div>
          <div class="bg-[#E2E8F0] rounded-lg p-4 text-[12px] md:text-[14px] my-4 text-left">
            <div class="font-medium">Note:</div>
            <div>
              A sample document for the industry has been provided below. You can download and edit the necessary fields
              of this document and upload it.
            </div>
          </div>
          <CreateBotDocumentManagement :refresh="props.refresh" :documents="documents" :props="props"
            :totalPageCount="totalPageCount" :totalCount="totalCount" :isUploading="props.isUploading" />
        </div>
        <div v-show="selectedType === 'Text'" class="w-full space-y-4">
          <div class="flex items-center justify-between w-full">
            <span class="font-bold text-[18px] md:text-[20px] text-[#09090B]">Text</span>
          </div>
          <div class="bg-[#E2E8F0] rounded-lg p-4 text-[12px] md:text-[14px] my-4 text-left">
            <div class="font-medium">Note:</div>
            <div>A sample text for the industry has been provided below. You can edit the necessary fields to complete
              the process.</div>
          </div>
          <div class="text-left flex flex-col gap-2">
            <span class="text-[14px] font-medium">Tell us about your company</span>
            <TextDocumentUpload ref="uploadDocumentRef" :refresh="props.refresh" :IndustryType="type"
              :loading="props.loading" :contentSuggestions="props.suggestionsContent" :documents="documents" />
          </div>
        </div>
      </div>
    </div>
  </BotSetupCard>
</template>
