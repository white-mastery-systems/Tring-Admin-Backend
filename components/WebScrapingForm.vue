<template>
  <form @submit.prevent="handleAddEditBot" class="flex items-center px-0">
    <div class="flex w-full sm:w-full md:w-[60%] gap-2 sm:gap-2 md:gap-3"
      :class="(errors.url) ? 'items-center' :'items-end'">
      <TextField name="url" placeholder="e.g., https://yourwebsite.com"
        class="text-[10px] sm:text-[10px] md:text-[14px]" label="Import from Website Link">
      </TextField>
      <UiButton type="submit" color="primary" :loading="isLoading" :disabled="props.isUploading" class="px-6 mb-1 button_shadow rounded-lg">
        Import
      </UiButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { useCleanJson } from "~/composables/botManagement/chatBot/useCleanJson";
import { useVoiceBotCleanJson } from "~/composables/botManagement/chatBot/useVoiceBotCleanJson";
import { botStore } from '~/store/botStore';

definePageMeta({
  middleware: "admin-only",
});

const props = defineProps<{
  botType: string;
  isUploading: boolean;
}>();


const scrapData = botStore();
const { cleanAndParseJson } = useCleanJson();
const { cleanAndParseVoiceBotJson } = useVoiceBotCleanJson();
const isLoading = ref(false);

const formSchema = toTypedSchema(
  z.object({
    url: z.string({ required_error: 'URL must start with https'}).min(1, "URL is required").refine((val) => val.startsWith("https://"), {
      message: "URL must start with https",
    }),
  })
);


const { handleSubmit, setFieldValue, resetForm, values, errors } = useForm({
  validationSchema: formSchema,
});

const clearTextField = () => {
  setFieldValue("url", "");
};
defineExpose({ clearTextField });

const handleAddEditBot = handleSubmit(async (values) => {
  if (!values.url) {
    toast.error('Please enter a valid URL before importing.')
    return
  }

  isLoading.value = true;

  try {
    // Fetch the scraped data from the API
    const scrapedData: any = await $fetch(`/api/org/webScrape?type=${props.botType}`, {
      method: "POST",
      body: values,
    });

    // Use the appropriate parsing function based on the bot type
    if (props.botType === 'voice') {
      const parsedVoiceBotData = cleanAndParseVoiceBotJson(scrapedData);
      console.log("Parsed Voice Bot Data:", parsedVoiceBotData);

      // Update store 
      scrapData.voiceBotScrapedData = parsedVoiceBotData;

      // Also save to localStorage as backup
      try {
        localStorage.setItem('voiceBotScrapedData', JSON.stringify(parsedVoiceBotData));
        console.log("Voice bot data saved to localStorage");
      } catch (storageErr) {
        console.error("Failed to save to localStorage:", storageErr);
      }

      toast.success("Voice bot data imported successfully.");
    }
    if (props.botType === 'chat') {
      // For regular chatbots, use the standard parser
      const parsedData = cleanAndParseJson(scrapedData);
      scrapData.scrapedData = parsedData;

      // Check if parsing was successful
      if (parsedData && parsedData.knowledge_base && parsedData.knowledge_base.document_content) {
        toast.success("Chatbot data imported successfully.");
      } else {
        toast.error("Failed to parse chatbot data.");
      }
    }
  } catch (err: any) {
    console.error("Import error:", err);
    toast.error(err?.statusMessage || "Failed to import data.");
  } finally {
    isLoading.value = false;
  }
});
</script>