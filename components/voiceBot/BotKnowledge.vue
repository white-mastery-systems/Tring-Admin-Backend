<template>
  <div class="pb-2 sm:pb-0">
    <form @submit.prevent="onSubmit" class="flex flex-col gap-2">
      <div class="flex flex-col w-full h-full overflow-x-auto">
        <UiCard class="border-0 ma-0 shadow-none">
          <UiCardContent class="p-0 gap-2 mb-4 space-y-5">
            <!-- Prompt Configuration section title -->

            <!-- Tabs for Inbound/Outbound -->
            <UiTabs default-value="inbound" class="w-full">
              <UiTabsList
                class="grid w-full sm:w-full md:w-[30%] grid-cols-2 bg-[#FFF8EB] text-[#3D3D3D] border border-[#FFBC42] rounded-[10px]">
                <UiTabsTrigger value="inbound"
                  class="data-[state=active]:bg-[#FFBC42] data-[state=active]:text-white text-[10px] sm:text-[10px] md:text-[14px]">
                  Inbound
                </UiTabsTrigger>
                <UiTabsTrigger value="outbound"
                  class="data-[state=active]:bg-[#FFBC42] data-[state=active]:text-white text-[10px] sm:text-[10px] md:text-[10px] md:text-[14px]">
                  Outbound
                </UiTabsTrigger>
              </UiTabsList>
              <UiTabsContent value="inbound">
                <div v-if="Object.keys(inboundPrompt).length > 0"
                  class="flex items-start grid grid-cols-2 gap-6 w-full">
                  <!-- Dynamic sections based on inboundPrompt structure -->
                  <div v-for="(value, key) in inboundPrompt" :key="key" class="space-y-0">
                    <h2 class="text-xs sm:text-xs md:text-sm lg:text-lg text-[#000000] font-bold capitalize my-2">
                      {{
                      formatSectionTitle(key) }}</h2>
                    <div class="gap-4">
                      <textarea v-model="inboundPrompt[key]"
                        class="w-full min-h-32 resize-y outline-none border rounded border-[#CBD5E1] p-2 text-[12px] sm:text-[12px] md:text-[12px] lg:text-sm"
                        :placeholder="`Enter content here...`"></textarea>
                    </div>
                  </div>
                </div>
                <div v-else
                  class="flex justify-center items-center min-h-32 border rounded-md p-6 bg-gray-50 text-[12px] sm:text-[12px] md:text-[12px] lg:text-sm">
                  <p class="text-gray-500">No inbound prompt data available</p>
                </div>
              </UiTabsContent>

              <UiTabsContent value="outbound">
                <div v-if="Object.keys(outboundPrompt).length > 0"
                  class="flex items-start grid grid-cols-2 gap-6 w-full">
                  <div v-for="(value, key) in outboundPrompt" :key="key" class="space-y-0">
                    <h2 class="text-xs sm:text-xs md:text-sm lg:text-lg font-bold capitalize">{{
                      formatSectionTitle(key) }}</h2>
                    <div class="gap-4">
                      <textarea v-model="outboundPrompt[key]"
                        class="w-full min-h-32 resize-y outline-none border rounded p-2 text-xs sm:text-xs md:text-xs lg:text-sm"
                        :placeholder="`Enter content here...`"></textarea>
                      <!-- <textarea class="w-full min-h-32 resize-y outline-none border rounded p-2"
                        :placeholder="`Enter additional content here...`"></textarea> -->
                    </div>
                  </div>
                </div>
                <div v-else
                  class="flex justify-center items-center min-h-32 border rounded-md p-6 bg-gray-50 text-xs sm:text-xs md:text-xs lg:text-sm">
                  <p class="text-gray-500">No outbound prompt data available</p>
                </div>
              </UiTabsContent>
            </UiTabs>
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
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch, watchEffect } from 'vue';
import { useField, useForm } from "vee-validate";
import {
  Home, ShoppingCart, Plane, PhoneCall, Landmark,
  Banknote, Stethoscope, Lightbulb, Truck, GraduationCap, Server
} from 'lucide-vue-next';
import { useChatbotConfig } from '~/composables/botManagement/chatBot/useChatbotConfig';

// Props definition
const props = defineProps<{
  botDetails: any;
  loading: boolean;
  refreshBot: () => void
}>();
// Removed activeTab ref as it's now managed by UiTabs
const isLoading = ref(false);
const { value: type } = useField("type");

// Prompt data
const inboundPrompt = reactive(props.botDetails?.llmConfig?.inboundPrompt || {});
const outboundPrompt = reactive(props.botDetails?.llmConfig?.outboundPrompt || {});

// Add these to track original values
const originalInboundPrompt = ref({ ...props.botDetails?.llmConfig?.inboundPrompt } || {});
const originalOutboundPrompt = ref({ ...props.botDetails?.llmConfig?.outboundPrompt } || {});

// Add computed property to check for changes
const formHasChanged = computed(() => {
  return JSON.stringify(inboundPrompt) !== JSON.stringify(originalInboundPrompt.value) ||
    JSON.stringify(outboundPrompt) !== JSON.stringify(originalOutboundPrompt.value);
});

// Helper function to format section titles
const formatSectionTitle = (key) => {
  if (key.toLowerCase() === 'donts') return "Don't's";
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase());
};

// Dropdown options
const boundList = ref([
  { label: 'Both', value: 'both' },
  { label: 'Inbound', value: 'inbound' },
  { label: 'Outbound', value: 'outbound' }
]);

// Get configuration
const { intentOptions, fetchConfig } = useChatbotConfig();

// Form handling
const {
  setFieldValue,
  handleSubmit,
  errors,
  values,
} = useForm({
  validationSchema: {},
  initialValues: {},
});

// Set page title
watchEffect(() => {
  if (props.botDetails) {
    const userName = props.botDetails?.name ?? "Unknown Bot Name";
    useHead({
      title: `Voice Bot | ${userName} - Configuration`,
    });
  }
});

// Error logging
watch(errors, (newErrors) => {
  console.log(newErrors, "errors");
});

const onSubmit = handleSubmit(async (value: any) => {
  isLoading.value = true;

  try {
    const payload = {
      llmConfig: {
        inboundPrompt: { ...inboundPrompt },
        outboundPrompt: { ...outboundPrompt }
      }
    };

    await updateLLMConfig(payload, props.botDetails.id, "Bot information and prompts updated successfully.");

    // Update original values after successful submission
    originalInboundPrompt.value = { ...inboundPrompt };
    originalOutboundPrompt.value = { ...outboundPrompt };

    if (typeof props.refreshBot === 'function') {
      props.refreshBot();
    }
  } catch (error) {
    console.error("Error updating bot configuration:", error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
textarea {
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
  line-height: 1.5;
}
</style>