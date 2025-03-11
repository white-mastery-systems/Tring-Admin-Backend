<script setup lang="ts">
import { useField } from "vee-validate";
import { Home, ShoppingCart, Settings, Info, Plane, HandPlatter, PhoneCall, Ambulance, Globe, FileText, FileDown } from 'lucide-vue-next';
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
// const emit = defineEmits(['update:selectedType']);
// Track which option is selected
// const selectedType = ref<string | null>(null);
const companyDetails = ref('')
// Function to handle button click
const selectType = (type: string) => {
  // emit('update:selectedType', type);
  selectedType.value = type;
  // emit("update:values", { ...props.values, type });
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

const intentTypes = [
  { id: 1, value: "real-estate", content: "Real Estate", icon: Home },
  { id: 2, value: "e-commerce", content: "E-commerce", icon: ShoppingCart },
  { id: 3, value: "travel", content: "Travel", icon: Plane },
  { id: 4, value: "hospitality", content: "Hospitality", icon: HandPlatter },
  { id: 5, value: "telecommunications", content: "Telecommunications", icon: PhoneCall },
  { id: 6, value: "finance-bank", content: "Finance Bank", icon: Ambulance },
];

// ✅ Function to update industry selection
const selectIndustry = (value: string) => {
  selectedType.value = value;
};
const changeKnowledge = () => {
  selectedType.value = ''
}
</script>

<template>
  <Card class="border-0 flex flex-col justify-between h-[95%]">
    <CardHeader>
      <div class="flex items-center justify-between gap-4 px-4 pt-4">
        <div class="flex flex-col gap-[6px]">
          <CardTitle class="font-bold text-[16px] text-[16px] md:text-[20px] text-[#09090B]">Build Your Bot’s Knowledge
          </CardTitle>
          <CardDescription class="font-normal text-[12px] sm:text-[12px] md:text-[14px] text-[#71717A]">Import your
            company details and goals through
            your website link, by document upload, or by text input (Can select either one)</CardDescription>
        </div>
        <CardDescription class="text-[14px] font-medium">
          <span class="text-[#09090B]">Step 1</span><span class="text-[#64748B]">/4</span>
        </CardDescription>
      </div>
      <UiSeparator orientation="horizontal" class="bg-[#E2E8F0] mt-3" />
    </CardHeader>
    <div class="flex flex-col items-center text-center px-4 h-full w-full"
      :class="[(selectedType) ? 'justify-start' : 'justify-center']">
      <div v-if="!selectedType" class="flex flex-col items-center justify-center gap-3 space-y-3">
        <div class="space-y-1 flex flex-col items-center">
          <div class="font-bold text-[16px] text-[16px] md:text-[20px] text-[#09090B]">
            Select Your Bot’s Knowledge Source
          </div>
          <div class="font-normal text-[12px] sm:text-[12px] md:text-[14px] text-[#71717A] w-[85%]">
            Import your company details and goals through your <span class="text-[#18181B]">
              website link, by document upload,
              or by text input
            </span>
          </div>
        </div>
        <div class="flex justify-center gap-3 w-[80%]">
          <UiButton type="button" variant="outline" v-for="(btn, index) in buttons" :key="index"
            class="w-full py-2 border-[#000000] text-[#000000] hover:text-[#ffffff] hover:bg-[#000000] font-regular"
            @click="selectType(btn.label)">
            <component :is="btn.icon" class="mr-2 w-5 h-5" />
            {{ btn.label }}
          </UiButton>
        </div>
      </div>
      <div v-else class="w-full">
        <div v-if="selectedType === 'Website'" class="w-full py-4 space-y-4">
          <div class="flex items-center justify-between w-full px-0">
            <span class="font-bold text-[20px] text-[#09090B]">
              Website
            </span>
            <span>
              <UiButton type="button" class="bg-[#000000] px-4 py-0" @click="changeKnowledge()">Change Knowledge
                Source</UiButton>
            </span>
          </div>
          <div class="bg-[#E2E8F0] rounded-lg text-left p-4 text-[14px]">
            <div class="font-medium">
              Note:
            </div>
            <div>
              All your company's branding elements, including colors, logos, and key information, will be automatically
              imported from the website link you provide, ensuring a seamless and accurate representation of your brand
            </div>
          </div>
          <!-- <UiSeparator orientation="horizontal" class="bg-[#E2E8F0]" /> -->
          <div class="flex flex-col gap-5 w-full sm:w-full md:w-[70%]">
            <div class="mt-2">
              <WebScrapingForm />
            </div>
            <div>
              <!-- {{ scrapData.scrapedData.knowledge_base.document_content }} -->
              <ScrapDateDocumentUpload :refresh="props.refresh" />
            </div>
            <!-- <TextField name="scrapData" label="Website generated details and goals" :isTextarea="true">
                </TextField> -->
          </div>
        </div>
        <div v-else-if="selectedType === 'Document'" class="w-full py-4">
          <div class="flex items-center justify-between w-full px-0">
            <span class="font-bold text-[20px] text-[#09090B]">
              Website
            </span>
            <span>
              <UiButton type="button" class="bg-[#000000] px-4 py-0" @click="changeKnowledge()">Change Knowledge
                Source</UiButton>
            </span>
          </div>
          <div class="bg-[#E2E8F0] rounded-lg text-left p-4 text-[14px] my-3">
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

        <div v-else-if="selectedType === 'Text'" class="w-full py-4 space-y-3">
          <div class="flex items-center justify-between w-full px-0">
            <span class="font-bold text-[20px] text-[#09090B]">
              Website
            </span>
            <span>
              <UiButton type="button" class="bg-[#000000] px-4 py-0" @click="changeKnowledge()">Change Knowledge
                Source</UiButton>
            </span>
          </div>
          <div class="bg-[#E2E8F0] rounded-lg text-left p-4 text-[14px] my-3">
            <div class="font-medium">
              Note:
            </div>
            <div>
              A Sample Text for the industry has been provided below. You can edit the necessary fields to complete the
              process
            </div>
          </div>
          <div class="py-6 px-0 w-[50%] min-h-[300px]">
            <p class="text-left text-[14px] py-1 text-[#000000]">Tell us about your company</p>
            <TextDocumentUpload ref="uploadDocumentRef" :refresh="props.refresh" />
            <!-- <UiTextarea calss="text-[#71717A]" v-model="companyDetails" class="h-[200px]" :resizable="false"
              placeholder="Enter text..." label="Tell us about your company">
            </UiTextarea> -->
          </div>
        </div>
      </div>
    </div>
  </Card>
</template>
