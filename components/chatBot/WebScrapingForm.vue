<template>
  <!-- <DialogWrapper v-model="agentModalState" :title="agentModalState.id ? 'Modify Chat Bot' : 'Add a New Chat Bot'"> -->
  <form @submit.prevent="handleAddEditBot" class="flex items-center px-0">
    <div class="flex items-end w-full gap-2 sm:gap-2 md:gap-6">
      <!-- <span class="font-semibold w-[210px] text-[10px] sm:text-[10px] md:text-[16px] ">Import from Website</span> -->
      <TextField name="url" placeholder="URL" label="Import from Website Link" required>
      </TextField>
      <UiButton type="submit" :loading="isLoading" class="px-6 mb-">
        Import
      </UiButton>
    </div>
    <!-- <div class="mt-2 flex w-full justify-end">
      </div> -->
  </form>
  <!-- </DialogWrapper> -->
</template>

<script setup lang="ts">
import { ToastTitle } from "radix-vue";
import { useRoute } from "vue-router";
import { any } from "zod";
import { botTypes } from '~/composables/botManagement/chatBot/useBotType'
import { useCleanJson } from "~/composables/botManagement/chatBot/useCleanJson";
import { botStore } from '~/store/botStore';

// import { useCleanJson } from "~/composables/botManagement/chatBot/useCleanJson";

definePageMeta({
  middleware: "admin-only",
});
const scrapData = botStore();
const { cleanAndParseJson } = useCleanJson();
// const emit = defineEmits(["scrapedData"]);

// const agentModalState = defineModel<{ open: boolean; id: any }>({
//   default: {
//     open: false,
//     id: null,
//   },
// });
const route = useRoute();
const queryId = ref(route.params?.id);
// const emit = defineEmits<{
//   (e: "confirm"): void;
//   (e: "editConfirm"): void;
// }>();
const isLoading = ref(false);

const formSchema = toTypedSchema(
  z.object({
    url: z.string().optional(),
  })
);

const { handleSubmit, setFieldValue, resetForm, values, errors } = useForm({
  validationSchema: formSchema,
});

// watch(
//   () => agentModalState.value.open,
//   async () => {
//     resetForm();
//     if (agentModalState.value.id) {
//       const getSingleDetails: any = await $fetch(
//         `/api/bots/${agentModalState.value.id}`,
//       );
//       setFieldValue("name", getSingleDetails.name);
//       setFieldValue("type", getSingleDetails.type);
//       if (getSingleDetails?.integrationId) {
//         setFieldValue("integrationId", getSingleDetails?.integrationId);
//       }
//     }
//   },
// );

const handleAddEditBot = handleSubmit(async (values) => {
  // console.log(values, "values -- values");
  // if (!values.url) {
  //   toast.error("URL is required");
  //   return;
  // }
  isLoading.value = true;
  try {
    
    const scrapedData: any = await $fetch("/api/org/webScrape", {
      method: "POST",
      body: values,
    });
    const parsedData = cleanAndParseJson(scrapedData);
    scrapData.scrapedData = parsedData;
    // console.log(parsedData, "parsedData -- parsedData")
    // emit("scrapedData", parsedData); 
    toast.success("Updated successfully");
    // }
    // if (agentModalState.value.id) {
    //   emit("editConfirm");
    // } else {
    //   emit("confirm");
    // }
  } catch (err: any) {
    isLoading.value = false;
    toast.error(err.data.data[0].message);
  }
  isLoading.value = false;
});
const {
  status: integrationLoadingStatus,
  data: integrationsData,
  refresh: integrationRefresh,
} = await useLazyFetch("/api/org/integrations", {
  server: false,
  query: {
    q: "ecommerce",
  },
  default: () => [],
});
</script>