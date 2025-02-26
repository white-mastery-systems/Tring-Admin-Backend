<template>
  <!-- <DialogWrapper v-model="agentModalState" :title="agentModalState.id ? 'Modify Chat Bot' : 'Add a New Chat Bot'"> -->
  <form @submit.prevent="handleAddEditBot" class="flex items-center px-2">
    <div class="flex items-center w-full gap-2 sm:gap-2 md:gap-6">
      <span class="font-semibold w-[210px] text-[10px] sm:text-[10px] md:text-[16px] ">Import from Website</span>
      <TextField class="border-0 field_shadow" name="url" placeholder="URL" required>
      </TextField>
      <UiButton type="submit" :loading="isLoading" class="text-[12px] h-[40px]">
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
import { botTypes } from '~/composables/botManagement/chatBot/useBotType'
definePageMeta({
  middleware: "admin-only",
});
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
  console.log(values, "values -- values");
  if (!values.url) {
    toast.error("URL is required");
    return;
  }
  isLoading.value = true;
  try {
    // if (agentModalState.value.id) {
    const bot = await $fetch(`/api/bots/${queryId.value}`, {
      method: "PUT",
      body: values,
    });
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