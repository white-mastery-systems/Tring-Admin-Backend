<template>
  <DialogWrapper
    v-model="modalState"
    :title="modalState?.id ? `Edit Intent` : 'Add Intent'"
  >
    <UiForm class="flex flex-col gap-2" @submit="handleCreateEditIntent()">
      <UiFormField
        v-model="intentField"
        v-bind="intentFieldAttrs"
        name="intent"
      >
        <UiFormItem class="w-full">
          <UiFormLabel
            >Actions<UiLabel class="text-lg text-red-500">*</UiLabel>
          </UiFormLabel>
          <UiFormControl>
            <UiSelect v-model="intentField" v-bind="intentFieldAttrs">
              <UiSelectTrigger>
                <UiSelectValue placeholder="Select Intent" />
              </UiSelectTrigger>
              <UiSelectContent>
                <UiSelectItem v-for="intent in intents" :value="intent.value">{{
                  intent.label
                }}</UiSelectItem>
              </UiSelectContent>
            </UiSelect>
          </UiFormControl>
          <span class="text-red-500">
            {{ errors.intent }}
          </span>
          <span class="text-xs text-gray-500">Select your intent.</span>
        </UiFormItem>
      </UiFormField>
      <UiFormField
        v-if="values.intent === 'location' || values.intent === 'virtual_tour'"
        v-model="linkField"
        v-bind="linkFieldAttrs"
        name="link"
      >
        <UiFormItem class="w-full">
          <UiFormLabel
            >Add Link <UiLabel class="text-lg text-red-500">*</UiLabel>
          </UiFormLabel>
          <UiFormControl>
            <UiInput
              v-model="linkField"
              v-bind="linkFieldAttrs"
              type="text"
              placeholder="Eg: enter your preferred value"
            />
          </UiFormControl>
          <span class="text-red-500">
            {{ errors.link }}
          </span>
          <span class="text-xs text-gray-500">Enter intent link</span>
          <UiFormMessage />
        </UiFormItem>
      </UiFormField>

      <div v-if="values.intent === 'images' || values.intent === 'brochure'">
        <div>
          <label
            class="dark:hover:bg-bray-800 flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 bg-contain bg-center bg-no-repeat hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
          >
            Upload file
            <input
              class="hidden"
              type="file"
              @change="handleFileChange"
              multiple
              :accept="
                (() => {
                  if (values.intent === 'images') {
                    return 'image/*';
                  } else {
                    return 'application/pdf';
                  }
                })()
              "
            />
          </label>
          <span class="text-sm text-red-700" v-if="errors.file">
            {{ errors.file }}
          </span>
        </div>
        <p v-if="selectedFileName" class="mt-2 text-sm text-gray-600">
          {{ selectedFileName }}
        </p>

        <UiFormField v-model="fileName" v-bind="fileNameAttrs" name="fileName">
          <UiFormItem class="w-full">
            <UiFormLabel>
              Intent Name <UiLabel class="text-lg text-red-700">*</UiLabel>
            </UiFormLabel>
            <UiFormControl>
              <UiInput
                :class="errors.fileName ? 'border-red-700' : ''"
                type="text"
                v-model="fileName"
                v-bind="fileNameAttrs"
                placeholder="Eg:Amenties"
              />
            </UiFormControl>
            <p v-if="errors.fileName" class="mt-0 text-sm text-red-700">
              {{ errors.fileName }}
            </p>
            <span class="text-xs text-gray-500"
              >Enter a unique name to identify the intent</span
            >
          </UiFormItem>
        </UiFormField>
      </div>

      <UiDialogFooter>
        <UiButton
          class="bg-[#424bd1] hover:bg-[#424bd1] hover:brightness-110"
          type="submit"
        >
          Save changes
        </UiButton>
      </UiDialogFooter>
    </UiForm>
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
      label: "brochure",
      value: "brochure",
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
      const intentDetails = await $fetch<{ intent: string; link?: string }>(
        `/api/bots/${botDetails.id}/intents/${value.id}`,
      );
      setFieldValue("intent", intentDetails.intent);
      setFieldValue("link", intentDetails?.link);
      // setFieldValue("link", intentDetails?.link);
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
        values.intent === "brochure" &&
        !files?.map((file: any) => file.type.type?.includes("pdf"))
      ) {
        toast.error("unsppported pdf type");
      }
      fileRef.value = target.files;
      selectedFileName.value = files?.map((file) => file.type).join(",");
      // setFieldValue("file", Array.from(target.files));
    } else {
      fileRef.value = null;
      selectedFileName.value = null;
      setFieldValue("file", "");
    }
  };

  const handleCreateEditIntent = handleSubmit(async (values) => {
    if (modalState.value.id) {
      const intentDetails: any = {
        id: botDetails.id,
        intentId: modalState.value.id,
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
