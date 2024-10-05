<template>
  <DialogWrapper v-model="modalState" :title="modalState?.id ? `Edit Intent` : 'Add Intent'">
    <form @submit="handleCreateEditIntent" class="space-y-3">
      <SelectField name="intent" :multiple="false" :required="true" label="Actions" helperText="Select your intent."
        placeholder="Select Intent" :options="intents" />
      <!-- <UiSelectItem v-for="intent in intents" :value="intent.value">{{
        intent.label
      }}</UiSelectItem> -->
      <div v-if="(values.intent === 'location') || (values.intent === 'virtual_tour')">
        <TextField name="link" label="Add Link" helperText="Enter intent link"
          placeholder="Eg: enter your preferred value" />
      </div>
      <div v-if="values.intent === 'images' || values.intent === 'brochures'">
        {{ values.intent }}
        <div>
          <label
            class="dark:hover:bg-bray-800 flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 bg-contain bg-center bg-no-repeat hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600">
            Upload file
            <input class="hidden" type="file" @change="handleFileChange" multiple :accept="(() => {
                if (values.intent === 'images') {
                  return 'image/*';
                } else {
                  return 'application/pdf';
                }
              })()
              " />
          </label>
          <span class="text-sm text-red-700" v-if="errors.file">
            {{ errors.file }}
          </span>
        </div>
        <p v-if="selectedFileName" class="mt-2 max-w-[100%] text-wrap break-words break-all text-sm text-gray-600">
          {{ selectedFileName }}
        </p>
        <!-- <div class="mt-3">
          <TextField name="fileName" label="Intent Name" helperText="Enter a unique name to identify the intent"
            placeholder="Eg:Amenties" />
        </div> -->
      </div>
      <div class="flex justify-end">
        <UiButton type="submit" class="mt-2" color="primary">
          Save changes
        </UiButton>
      </div>
    </form>
  </DialogWrapper>
</template>

<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { ref } from "vue";
import { createEditIntentValidation } from "~/validationSchema/createEditIntentValidation";
const route = useRoute("bot-management-chat-bot-id-intent-management");
const intents = [
  {
    label: "Location",
    value: "location",
  },
  {
    label: "Virtual Tour",
    value: "virtual_tour",
  },
  {
    label: "Schedule Call",
    value: "schedule_call",
  },
  {
    label: "Schedule Site Visit",
    value: "site_visit",
  },
  {
    label: "Images",
    value: "images",
  },
  {
    label: "Brochures",
    value: "brochures",
  },
];
const emit = defineEmits(["success"]);
const botDetails: any = await getBotDetails(route.params.id);
const modalState = defineModel<{ open: boolean; id: string | null }>({
  default: { open: false, id: null },
  required: true,
});

const {
  handleSubmit,
  defineField,
  errors,
  setFieldValue,
  values,
  handleReset,
} = useForm({
  validationSchema: toTypedSchema(createEditIntentValidation),
});
watch(errors, (newError) => {
  console.log({ newError });
});

watch(
  () => modalState.value,
  async (value) => {
    handleReset();
    fileRef.value = null;
    selectedFileName.value = null;
    if (!value.id) return;
    const intentDetails:any = await $fetch<{ intent: string; link?: string }>(
      `/api/bots/${botDetails.id}/intents/${value.id}`,
    );
    setFieldValue("intent", intentDetails.intent);
    if (intentDetails?.link) setFieldValue("link", intentDetails?.link);
    fileRef.value = intentDetails?.uploads?.map(
      (file: any) => new File([file.content], file.name, { type: file.type })
    ) || [];
    selectedFileName.value = intentDetails?.uploads?.map((file: any) => file.name).join(",");
    // setFieldValue("fileName", intentDetails.fileName); // need fileName value from api response
  },
  { deep: true },
);

const [intentField, intentFieldAttrs] = defineField("intent");
const [linkField, linkFieldAttrs] = defineField("link");
const [fileName, fileNameAttrs] = defineField("fileName");
const fileRef = ref<FileList | null>(null);
const selectedFileName = ref<string | null>(null);

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const files = Array.from(target.files);

    if (
      values.intent === "images" &&
      !files?.map((file: any) => file.type.type?.includes("image/"))
    ) {
      toast.error("unsppported image type");
    } else if (
      values.intent === "brochures" &&
      !files?.map((file: any) => file.type.type?.includes("pdf"))
    ) {
      toast.error("unsppported pdf type");
    }
    fileRef.value = target.files;
    selectedFileName.value = files?.map((file) => file.name).join(",");
    // setFieldValue("file", Array.from(target.files));
  } else {
    fileRef.value = null;
    selectedFileName.value = null;
    setFieldValue("file", "");
  }
};

const handleCreateEditIntent = handleSubmit(async (values) => {
  if (modalState.value.id) {
    if (fileRef.value) {
      const formData = new FormData();
      Array.from(fileRef.value).forEach((file) => {
        formData.append("files", file);
      });
      const uploads = await $fetch(`/api/uploads`, {
        method: "POST",
        body: formData,
      });
      const intentDetails: any = {
        id: botDetails.id,
        intentId: modalState.value.id,
        uploads,
        ...values,
      };
      await updateBotIntentById({
        intentDetails,
        onSuccess: () => {
          modalState.value.open = false;
          toast.success("Intent updated successfully");
          emit("success");
        },
      });
    }
  } else {
    if (fileRef.value) {
      const formData = new FormData();
      Array.from(fileRef.value)?.map((file) => {
        formData.append("files", file);
      });
      const uploads = await $fetch(`/api/uploads`, {
        method: "POST",
        body: formData,
      });
      const intentDetails: any = {
        id: botDetails.id,
        uploads,
        ...values,
      };
      await createBotIntents({
        intentDetails,
        onSuccess: () => {
          modalState.value.open = false;
          toast.success("Intent added successfully");
          emit("success");
        },
      });
    } else {
      const intentDetails: any = {
        id: botDetails.id,
        ...values,
      };
      await createBotIntents({
        intentDetails,
        onSuccess: () => {
          modalState.value.open = false;
          toast.success("Intent added successfully");
          emit("success");
        },
      });
    }
  }
  return true;
});
</script>
