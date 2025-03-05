<script setup lang="ts">
import { defineProps, defineEmits, ref } from 'vue';
import { Home, ShoppingCart, Plane, HandPlatter, PhoneCall, Ambulance, Terminal } from 'lucide-vue-next';
import { botStore } from '~/store/botStore';

const props = defineProps<{
  values: Record<string,any>;
  errors: Record < string, any >;
}> ();

const selectedFile = ref()
const emit = defineEmits(["update:values"]);
const intentOptions = ref([
  { label: "Help users find properties based on their preferences (budget, location, type, amenities) and provide personalized listings", value: "greeting", content: 'Property Inquiry & Recommendations' },
  { label: "Capture user details, qualify leads, and schedule property viewings or meetings with agents", value: "faq", content: 'Lead Generation & Appointment Booking' },
  { label: "Offer loan and mortgage estimations, connect users with financial advisors, and guide them through the home-buying process", value: "support", content: 'Mortgage & Financing Assistance' },
  { label: "Provide estimated property values, connect sellers with agents, and assist in listing properties for sale or rent", value: "sales", content: 'Property Valuation & Selling Assistance' },
]);
const scrapData = botStore();
const toggleIntent = (value) => {
  const index = values.intent.indexOf(value);
  if (index === -1) {
    props.values.intent.push(value); // Add if not selected
  } else {
    props.values.intent.splice(index, 1); // Remove if already selected
  }
};
const fileUpload = async () => {
  // selectedFile.value[0].name;
  //
  if (selectedFile.value && selectedFile.value[0]) {
    const file = selectedFile.value[0];
    if (!file.type.includes("pdf")) {
      toast.error("Unsupported file type. Only PDFs are allowed.");
      selectedFile.value = null;
      return;
    }
    const payload: any = {
      botId: paramId.params.id,
      document: {
        name: selectedFile.value[0].name,
        files: selectedFile.value[0],
      },
    };
    await createDocument(payload.botId, payload.document);
    documents.value = await listDocumentsByBotId(paramId.params.id);
    selectedFile.value = null;
  } else {
    selectedFile.value = null;
  }
};
</script>

<template>
  <Card class="border-0 ma-0">
    <CardHeader>
      <div class="flex flex-col gap-4 px-4 pt-4">
        <CardDescription class="text-[14px] sm:text-[14px] md:text-[18px] font-medium">
          <span class="text-[#09090B]">Step 3</span><span class="text-[#64748B]">/3</span>
        </CardDescription>
        <div class="flex flex-col gap-[6px]">
          <CardTitle class="font-bold text-[16px] text-[16px] md:text-[20px] text-[#09090B]">Build Your Bot’s Knowledge
          </CardTitle>
          <CardDescription class="font-normal text-[12px] sm:text-[12px] md:text-[14px] text-[#71717A]">Import your
            company details and goals through
            your website link, by document upload, or by text input (Can select either one)</CardDescription>
        </div>
      </div>
    </CardHeader>

    <div class="mt-4">
      <UiSeparator orientation="horizontal" class="bg-[#E2E8F0] w-full h-[0.5px]" />
    </div>

    <CardContent class="grid gap-6 px-0">
      <!-- min-h-[300px] sm:min-h-[350px] md:min-h-[427px] max-h-[95vh] -->
      <div class="flex items-center gap-4 w-full gap-5 min-h-[300px] sm:min-h-[350px] md:min-h-[427px] max-h-[95vh]">
        <UiTabs default-value="website" class="block sm:block md:flex w-full h-full">
          <div
            class="flex flex-col justify-self-start sm:justify-self-start md:justify-between items-center h-full w-full sm:w-full md:w-[20%] p-4 overflow-y-auto">
            <UiTabsList
              class="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-1 bg-[#F4F4F5] h-[15%] sm:h-[15%] md:h-[35%] w-full">
              <UiTabsTrigger value="website"
                class="text-[12px] sm:text-[12px] md:text-[14px] data-[state=active]:bg-black data-[state=active]:text-white">
                Website
              </UiTabsTrigger>
              <UiTabsTrigger value="document"
                class="text-[12px] sm:text-[12px] md:text-[14px] data-[state=active]:bg-black data-[state=active]:text-white">
                Document Bot
              </UiTabsTrigger>
              <UiTabsTrigger value="text"
                class="text-[12px] sm:text-[12px] md:text-[14px] data-[state=active]:bg-black data-[state=active]:text-white">
                Text Bot
              </UiTabsTrigger>
            </UiTabsList>
            <div class="hidden sm:hidden md:flex bg-[#e1e8f0] rounded-sm p-2 gap-2">
              <div class="pt-1">
                <Terminal class="w-4 h-4" />
              </div>
              <div class="flex flex-col">
                <div class="font-medium text-[10px] sm:text-[10px] md:text-[14px]">
                  Heads up!
                </div>
                <div class="text-[10px] sm:text-[10px] md:text-[12px]">
                  All your company's branding elements, including colors, logos, and key information, will be
                  automatically imported from the website link you provide, ensuring a seamless and accurate
                  representation of your brand
                </div>
              </div>
            </div>
            <div class="block sm:block md:hidden w-full sm:w-full md:w-[80%]">
              <UiTabsContent value="website" class="mt-0">
                <div class="flex items-center justify-between w-full py-4 px-0 sm:px-0 md:px-4">
                  <span class="font-bold text-[20px] text-[#09090B]">
                    Website
                  </span>
                  <span>
                    <UiButton class="bg-[#64748B] px-6 py-0">Reset</UiButton>
                  </span>
                </div>
                <UiSeparator orientation="horizontal" class="bg-[#E2E8F0]" />
                <div class="flex flex-col gap-5">
                  <WebScrapingForm />
                  <TextField name="scrapData" label="Website generated details and goals" :isTextarea="true">
                  </TextField>
                </div>
              </UiTabsContent>
              <UiTabsContent value="document" class="mt-0">
                <div class="flex items-center justify-between w-full px-0 py-4">
                  <span class="font-bold text-[20px] text-[#09090B]">
                    Document
                  </span>
                  <span>
                    <UiButton class="bg-[#64748B] px-6 py-0">Reset</UiButton>
                  </span>
                </div>
                <UiSeparator orientation="horizontal" class="bg-[#E2E8F0]" />
                <div class="flex justify-center w-full p-0 sm:p-0 md:p-4">
                  <div class="w-full">
                    <CreateBotDocumentManagement />
                  </div>
                </div>
              </UiTabsContent>
              <UiTabsContent value="text" class="mt-0">
                <div class="flex items-center justify-between w-full px-0 py-4">
                  <span class="font-bold text-[20px] text-[#09090B]">
                    Text
                  </span>
                  <span>
                    <UiButton class="bg-[#64748B] px-6 py-0">Reset</UiButton>
                  </span>
                </div>
                <UiSeparator orientation="horizontal" class="bg-[#E2E8F0]" />
                <div class="py-6 px-0">
                  <TextField name="scrapData" label="Tell us about your company" :isTextarea="true">
                  </TextField>
                </div>
              </UiTabsContent>
            </div>
          </div>
          <UiSeparator orientation="vertical" class="hidden sm:hidden md:flex bg-[#E2E8F0] w-[0.5px]" />
          <div class="hidden sm:hidden md:block w-full sm:w-full md:w-[80%]">
            <UiTabsContent value="website" class="mt-0">
              <div class="flex items-center justify-between w-full px-0 py-4 px-4">
                <span class="font-bold text-[20px] text-[#09090B]">
                  Website
                </span>
                <span>
                  <UiButton class="bg-[#64748B] px-6 py-0">Reset</UiButton>
                </span>
              </div>
              <UiSeparator orientation="horizontal" class="bg-[#E2E8F0]" />
              <div class="flex flex-col gap-5 p-4">
                <div class="mt-2">
                  <WebScrapingForm />
                </div>
                <div>
                  <!-- {{ scrapData.scrapedData.knowledge_base.document_content }} -->
                  <ScrapDateDocumentUpload />
                </div>
                <!-- <TextField name="scrapData" label="Website generated details and goals" :isTextarea="true">
                </TextField> -->
              </div>
            </UiTabsContent>
            <UiTabsContent value="document" class="mt-0">
              <div class="flex items-center justify-between w-full p-4">
                <span class="font-bold text-[20px] text-[#09090B]">
                  Document
                </span>
                <span>
                  <UiButton class="bg-[#64748B] px-6 py-0">Reset</UiButton>
                </span>
              </div>
              <UiSeparator orientation="horizontal" class="bg-[#E2E8F0]" />
              <div class="flex justify-center w-full p-4">
                <div class="w-full">
                  <CreateBotDocumentManagement />
                </div>
              </div>
            </UiTabsContent>
            <UiTabsContent value="text" class="mt-0">
              <div class="flex items-center justify-between w-full p-4">
                <span class="font-bold text-[20px] text-[#09090B]">
                  Text
                </span>
                <span>
                  <UiButton class="bg-[#64748B] px-6 py-0">Reset</UiButton>
                </span>
              </div>
              <UiSeparator orientation="horizontal" class="bg-[#E2E8F0]" />
              <div class="p-4">
                <TextField name="scrapData" label="Tell us about your company" :isTextarea="true">
                </TextField>
              </div>
            </UiTabsContent>
          </div>
        </UiTabs>
      </div>
    </CardContent>
  </Card>
</template>
