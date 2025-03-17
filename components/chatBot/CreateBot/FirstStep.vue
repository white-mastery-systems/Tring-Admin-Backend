<script setup lang="ts">
import { useField } from "vee-validate";
import { Home, ShoppingCart, Settings, Info, Plane, HandPlatter, PhoneCall, Ambulance, Globe, FileText, FileDown } from 'lucide-vue-next';
import { useContentSuggestions } from "~/composables/botManagement/chatBot/useContentSuggestions";
// import { Button } from "@/components/ui/button";
// import { Home, Settings, Info } from "lucide-vue-next";

const props = defineProps<{
  errors: Record<string, any>;
  refresh: () => void
}>();
// const props = defineProps<{ botDetails: any; refreshBot: () => void }>();
const uploadDocumentRef = ref(null);
defineExpose({ uploadDocumentRef })
const { value: selectedType } = useField("selectedType")
const { value: type } = useField("type");
// const emit = defineEmits(['update:selectedType']);
// Track which option is selected
// const selectedType = ref<string | null>(null);
const { contentSuggestions, loading, error, refreshSuggestions } = useContentSuggestions(type ?? 'real-estate');

const companyDetails = ref('')
// Function to handle button click
const selectType = (type: string) => {
  // emit('update:selectedType', type);
  selectedType.value = type;
  // emit("update:values", { ...props.values type });
};

const buttons = [
  { label: "Website", icon: Globe },
  { label: "Document", icon: FileText },
  { label: "Text", icon: FileDown },
];
// // ✅ Use `useField()` from vee-validate
// const { value: companyName } = useField("companyName");
// const { value: chatbotName } = useField("name");
// const { value: selectedIndustry } = useField("industry");

const intentTypes = ref([
  { label: "Real Estate", value: "real-estate" },
  { label: "Government Sectors", value: "government-sectors" },
  { label: "Finance & Banking", value: "finance-banking"},
  { label: "Healthcare", value: "healthcare" },
  { label: "E-commerce", value: "e-commerce"},
  { label: "Energy & Utilities", value: "energy-utilities" },
  { label: "Telecommunications", value: "telecommunications" },
  { label: "Travel & Hospitality", value: "travel-hospitality" },
  { label: "Logistics", value: "logistics" },
  { label: "Education & Training", value: "education-training" },
  { label: "IT Service", value: "it-service" },
]);

watch(type, () => {
  console.log('insied watch')
  refreshSuggestions(); // Call refresh when type changes
});
// ✅ Function to update industry selection
const selectIndustry = (value: string) => {
  selectedType.value = value;
};
const changeKnowledge = () => {
  selectedType.value = ''
}
</script>

<template>
  <UiCard class="border-0 flex flex-col justify-between" :class="(!!selectedType) ? '' : 'h-[95%]'">
    <UiCardHeader class="p-0">
      <div class="flex items-center justify-between gap-4 px-4 pt-4">
        <div class="flex flex-col gap-[6px]">
          <UiCardTitle class="font-bold text-[16px] text-[16px] md:text-[20px] text-[#09090B]">Build Your Bot’s Knowledge
          </UiCardTitle>
          <UiCardDescription class="font-normal text-[12px] sm:text-[12px] md:text-[14px] text-[#71717A]">Import your
            company details and goals through
            your website link, by document upload, or by text input (Can select either one)</UiCardDescription>
        </div>
        <UiCardDescription class="text-[14px] font-medium">
          <span class="text-[#09090B]">Step 1</span><span class="text-[#64748B]">/4</span>
        </UiCardDescription>
      </div>
      <UiSeparator orientation="horizontal" class="bg-[#E2E8F0] mt-3" />
    </UiCardHeader>
    <div class="flex flex-col items-center text-center px-4 h-full w-full"
      :class="[(selectedType) ? 'justify-start' : 'justify-center']">
      <div v-if="!selectedType" class="flex flex-col items-center justify-center gap-3 space-y-3">
        <div class="space-y-1 flex flex-col">
          <div class="font-bold text-[16px] text-[16px] md:text-[20px] text-[#09090B] pt-3 sm:pt-3">
            Select Your Bot’s Knowledge Source
          </div>
          <div class="font-normal text-[12px] sm:text-[12px] md:text-[14px] text-[#71717A] w-[85%]">
            Import your company details and goals through your <span class="text-[#18181B]">
              website link, by document upload,
              or by text input
            </span>
          </div>
        </div>
        <div class="flex flex-wrap justify-center gap-3 w-full sm:w-full md:w-[80%] md:flex-nowrap">
        <UiButton
          type="button"
          variant="outline"
          v-for="(btn, index) in buttons"
          :key="index"
          class="border-[#000000] text-[#000000] hover:text-[#ffffff] hover:bg-[#000000] font-regular w-full sm:w-full md:flex-1"
          @click="selectType(btn.label)"
        >
          <component :is="btn.icon" class="mr-2 w-5 h-5" />
          {{ btn.label }}
        </UiButton>
      </div>
      </div>
      <div v-else class="w-full">
        <div v-if="selectedType === 'Website'" class="w-full py-4 space-y-4">
          <div class="flex items-center justify-between w-full px-0">
            <span class="font-bold text-[18px] sm:text-[18px] md:text-[20px] text-[#09090B]">
              Website
            </span>
            <span>
              <UiButton type="button" class="bg-[#000000] px-4 py-0 text-[12px] sm:text-[12px] md:text-[14px]" @click="changeKnowledge()">Change Knowledge
                Source</UiButton>
            </span>
          </div>
          <div class="bg-[#E2E8F0] rounded-lg text-left p-4 text-[12px] sm:text-[12px] md:text-[14px]">
            <div class="font-medium">
              Note:
            </div>
            <div>
              All your company's branding elements, including colors, logos, and key information, will be automatically
              imported from the website link you provide, ensuring a seamless and accurate representation of your brand
            </div>
          </div>
          <!-- <UiSeparator orientation="horizontal" class="bg-[#E2E8F0]" /> -->
          <div class="flex flex-col gap-3 w-full">
            <div class="">
              <WebScrapingForm />
            </div>
            <div>
              <p class="text-left text-[12px] sm:text-[12px] md:text-[14px] py-1 text-[#000000] font-medium">Website generated details and goals</p>
              <!-- {{ scrapData.scrapedData.knowledge_base.document_content }} -->
              <ScrapDateDocumentUpload :refresh="props.refresh" />
            </div>
            <!-- <TextField name="scrapData" label="Website generated details and goals" :isTextarea="true">
                </TextField> -->
          </div>
        </div>
        <div v-else-if="selectedType === 'Document'" class="w-full py-4">
          <div class="flex items-center justify-between w-full px-0">
            <span class="font-bold text-[18px] sm:text-[18px] md:text-[20px] text-[#09090B]">
              Document
            </span>
            <span>
              <UiButton type="button" class="bg-[#000000] px-4 py-0 text-[12px] sm:text-[12px] md:text-[14px]" @click="changeKnowledge()">Change Knowledge
                Source</UiButton>
            </span>
          </div>
          <div class="bg-[#E2E8F0] rounded-lg text-left p-4 text-[12px] sm:text-[12px] md:text-[14px] my-4">
            <div class="font-medium">
              Note:
            </div>
            <div>
              A Sample document for the industry has been provided below. You can download and edit the necessary fields
              of this document and upload it
            </div>
          </div>
          <div class="flex justify-center w-full mt-8">
            <div class="w-full">
              <CreateBotDocumentManagement :refresh="props.refresh" />
            </div>
          </div>
        </div>

        <div v-else-if="selectedType === 'Text'" class="w-full py-4 space-y-4">
          <div class="flex items-center justify-between w-full px-0">
            <span class="font-bold text-[18px] sm:text-[18px] md:text-[20px] text-[#09090B]">
              Text
            </span>
            <span>
              <UiButton type="button" class="bg-[#000000] px-4 py-0 text-[12px] sm:text-[12px] md:text-[14px]" @click="changeKnowledge()">Change Knowledge
                Source</UiButton>
            </span>
          </div>
          <div class="bg-[#E2E8F0] rounded-lg text-left p-4 text-[12px] sm:text-[12px] md:text-[14px] my-4">
            <div class="font-medium">
              Note:
            </div>
            <div>
              A Sample Text for the industry has been provided below. You can edit the necessary fields to complete the
              process
            </div>
          </div>
          <div>
            <div class="w-[50%] text-left">
              <!-- industry.map((role) => ({ label: role, value: role })) -->
              <SelectField name="type" label="Industry" v-model="type" placeholder="Select Industry" :options="intentTypes.map((industry) => ({ label: industry.label, value: industry.value }))" required></SelectField>
            </div>
            <div class="px-0 w-full">
            <p class="text-left text-[12px] sm:text-[12px] md:text-[14px] py-3 text-[#000000] font-medium">Tell us about your company</p>
            <TextDocumentUpload ref="uploadDocumentRef" :refresh="props.refresh" :contentSuggestions="contentSuggestions" />
            <!-- <UiTextarea calss="text-[#71717A]" v-model="companyDetails" class="h-[200px]" :resizable="false"
              placeholder="Enter text..." label="Tell us about your company">
            </UiTextarea> -->
          </div>
          </div>
        </div>
      </div>
    </div>
  </UiCard>
</template>
