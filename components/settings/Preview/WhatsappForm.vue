<template>
  <form @submit="handleConnect" class="space-y-2">
    <div class="grid grid-cols-1 gap-4">
      <SelectField name="integrationId" :options="
          integrationsData?.map((integration: any) => ({
            label: integration.name,
            value: integration.id,
          }))
        " label="Integration" placeholder="Select your integration"
        helperText="template will be created with this integration" required />
      <div class="flex gap-3 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
        <TextField type="text" :disableSpecialCharacters="true" name="name" label="Name you template"
          placeholder="Enter name" required @input="dispatchTemplateState()" :textFieldMaxLength="512">
        </TextField>
        <SelectField name="languageCode" :options="languageList" label="Select language"
          placeholder="Select your language" required />
        <!-- helperText="template will be created with this language" -->
      </div>
      <div>
        <div class="pt-4">
          <SelectField name="header" :options="headerOptions" label="Header" placeholder="Enter type" @input="
              setFieldValue('headerFile', {});
              dispatchTemplateState();
            " />
        </div>
      </div>
      <TextField v-if="values.header === 'text'" type="text" name="headerText" placeholder="Enter Value" required
        @input="dispatchTemplateState()" :textFieldMaxLength="60">
      </TextField>

      <FieldArray v-if="values.header === 'text'" name="headerTextTemplateVariables" v-slot="{ fields, push, remove }">
        <fieldset class="InputGroup" v-for="(field, idx) in fields" :key="field.key">
          <div class="flex items-end gap-2">
            <SelectField :options="variableOptions" :label="'Variable' + ' ' + varaibleLabelName(idx)"
              :id="`textname_${idx}`" :name="`headerTextTemplateVariables[${idx}]`" />
            <UiButton variant="outline" type="button" class="mt-2"
              @click="removeTemplateVariable(idx, remove, fields, 'headerText')">
              <CloseIcon class="h-4 w-4" />
            </UiButton>
          </div>
        </fieldset>
        <UiTooltipProvider>
          <UiTooltip>
            <UiTooltipTrigger as-child>
              <!-- <UiButton type="button" class="mt-2 max-w-[130px]" color="primary" :disabled="fields.length >= 1" @click="
                  () => {
                    push('');
                    setFieldValue(
                      'headerText',
                      (values.headerText || '') + `{{${fields.length}}}`,
                    );

                    dispatchTemplateState();
                  }
                ">
                Add Variable
              </UiButton> -->
            </UiTooltipTrigger>
            <UiTooltipContent>
              <p>Variables are limited to maximum of 1</p>
            </UiTooltipContent>
          </UiTooltip>
        </UiTooltipProvider>
      </FieldArray>

      <div v-if="values.header === 'image'">
        <span class="semibold pt-4 text-sm"> Header Content </span>
        <FileUpload @change="uploadFile" label="Upload Image" name="headerFile" :url="values?.headerFile?.url"
          :required="true" accept="image/png,image/jpeg" :fileType="'image'" :class="'h-24 cursor-pointer'"
          :helperText="'Accept Only JPG and PNG'" />
        <!-- <TextField type='file' name="headerImage" accept="image/png, image/jpeg"/> -->
      </div>
      <div v-else-if="values.header === 'document'">
        <span class="semibold pt-4 text-sm"> Header Content </span>
        <FileUpload @change="uploadFile" label="Upload Document" name="headerFile" :url="values?.headerFile?.url"
          :required="true" accept="application/pdf" :fileType="'file'" :class="'h-24 cursor-pointer'"
          :helperText="'Accept Only Pdf'" />
      </div>
      <div v-else-if="values.header === 'video'">
        <span class="semibold pt-4 text-sm"> Header Content </span>
        <FileUpload @change="uploadFile" label="Upload Video" name="headerFile" :url="values?.headerFile?.url"
          :required="true" accept="video/mp4" :fileType="'video'" :class="'h-24 cursor-pointer'"
          :helperText="'Accept Only Video'" />
      </div>

      <TextField @input="updateBody($event)" :isTextarea="true" type="text" name="body" label="Body"
        placeholder="Enter Value" :textAreaMaxLength='1024' required>
      </TextField>

      <FieldArray name="templateVariables" v-slot="{ fields, push, remove }">
        <fieldset class="InputGroup" v-for="(field, idx) in fields" :key="field.key">
          <div :class="['flex gap-2', field.value ? 'items-end' : 'items-center']">
            <SelectField :options="variableOptions" :label="'Variable' + ' ' + varaibleLabelName(idx)"
              :id="`name_${idx}`" :name="`templateVariables[${idx}]`" />
            <UiButton variant="outline" type="button" class="mt-2" @click="removeTemplateVariable(idx, remove, fields)">
              <CloseIcon class="h-4 w-4" />
            </UiButton>
          </div>
        </fieldset>

        <UiButton type="button" class="mt-2 max-w-[130px]" color="primary" :disabled="fields.length >= 15" @click="
            () => {
              push('');
              setFieldValue(
                'body',
                (values.body || '') + `{{${fields.length}}}`,
              );
              dispatchTemplateState();
            }
          ">
          Add Variable +
        </UiButton>
      </FieldArray>

      <TextField @input="dispatchTemplateState()" type="text" label="Footer" name="footer" placeholder="Enter Value">
      </TextField>
    </div>
    <div class="flex items-center justify-end">
      <UiButton type="submit" class="mt-2" color="primary" :loading="isLoading">Submit
      </UiButton>
    </div>
  </form>
</template>
<script setup lang="ts">
  import { debounce } from "chart.js/helpers";
  import { FieldArray } from "vee-validate";
  import TextField from "~/components/formComponents/TextField.vue";
  import { useTemplateStore } from "~/store/whatsAppTemplateStore";
  import { whatsAppTemplateSchema } from "~/validationSchema/settings/whatAppTemplateValidation";
  import { whatsappTemplateLanguageList } from '~/composables/whatsappTemplateLanguageList'

  
  const templateStore = useTemplateStore();

  // import countryData from '~/assets/country-codes.json'
  definePageMeta({
    middleware: "admin-only",
  });
  const isLoading = ref(false);
  const { languageList } = whatsappTemplateLanguageList()
  
  const {
    status: integrationLoadingStatus,
    data: integrationsData,
    refresh: integrationRefresh,
  } = await useLazyFetch("/api/org/integrations?q=channel", {
    server: false,
    default: () => [],
  });

  const headerOptions = [
    { label: "None", value: "none" },
    { label: "Text", value: "text" },
    { label: "Image", value: "image" },
  ];
  // { label: "Video", value: "video" },
  // { label: "Document", value: "document" },
  // { label: "Location", value: "Location" },

  const emit = defineEmits<{
    (e: "confirm"): void;
    (edit: "getApistatus"): void;
  }>();
  const whatsppModalState = defineProps<{
    open: Boolean;
    id: String;
    getStatus: Boolean;
  }>();

watchEffect(async () => {
  resetForm()
  if (whatsppModalState?.id && whatsppModalState.getStatus) {
    const { metadata: getSingleDetails }: any = await $fetch(`/api/templates/${whatsppModalState.id}`);
    setFieldValue("name", getSingleDetails.name);
    setFieldValue("header", getSingleDetails.header);
    setFieldValue("headerText", getSingleDetails.headerText);
    setFieldValue("headerFile", getSingleDetails.headerFile);
    setFieldValue("headerLocation", getSingleDetails.headerLocation);
    setFieldValue("body", getSingleDetails.body);
    setFieldValue("footer", getSingleDetails.footer);
    setFieldValue("integrationId", getSingleDetails.integrationId);
    if (getSingleDetails.templateVariables)
      setFieldValue("templateVariables", getSingleDetails.templateVariables);
    if (getSingleDetails.headerTextTemplateVariables)
      setFieldValue(
        "headerTextTemplateVariables",
        getSingleDetails.headerTextTemplateVariables,
      );
    dispatchTemplateState();
    emit("getApistatus");
  }
});

  const {
    errors,
    setErrors,
    setFieldValue,
    handleSubmit,
    defineField,
    values,
    resetForm,
  } = useForm({
    validationSchema: whatsAppTemplateSchema,
  });

  const dispatchTemplateState = () => {
    debounce(
      templateStore.updateValues({
        ...values,
        templateVariables: stringifyJson(values.templateVariables),
        headerTextTemplateVariables: stringifyJson(
          values.headerTextTemplateVariables,
        ),
      }),
      1000,
    );
  };

  const updateBody = ($event: any) => {
    // if (["{", "}"].includes($event)) {
    //   setTimeout(() => {
    //     let body = values.body;
    //     let templateVariables = [...(values.templateVariables || [])]; // Clone the array
    //     if (body?.indexOf("{") > -1 && $event === "{") {
    //       templateVariables.push("");
    //       body = body.replace("{", `{{${templateVariables.length}}}`);
    //       setFieldValue("templateVariables", templateVariables);
    //       setFieldValue("body", body);
    //     } else if (body?.indexOf("}}") > -1 && $event === "}") {
    //       templateVariables.push("");
    //       setFieldValue("templateVariables", templateVariables);
    //     }
    // dispatchTemplateState()

    //   }, 0); // Delay to allow input update
    // } else if ($event === "keydown") {
    //   setTimeout(() => {
    //     let body = values.body?.replace(" ", "");
    //     let templateVariables = [...(values.templateVariables || [])];
    //     templateVariables = templateVariables.filter(
    //       (el, index) => !(body.indexOf(`{{${index + 1}`) > -1),
    //     );
    //     setFieldValue("templateVariables", templateVariables);
    //    dispatchTemplateState()
    //   }, 0);
    // }
    // else{
    // dispatchTemplateState()
    // }
    dispatchTemplateState();
  };

  const removeTemplateVariable = (idx, remove, fields, type = "body") => {
    setFieldValue(type, values[type]?.replace(`{{${idx + 1}}}`, ""));
    fields.forEach((field, index) => {
      if (index > idx) {
        setFieldValue(
          type,
          values[type]?.replace(`{{${index + 1}}}`, `{{${index}}}`),
        );
      }
    });
    remove(idx);
    dispatchTemplateState();
  };

const uploadFile = async ($event: any) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    setFieldValue("headerFile", { url: e.target.result, file: $event[0] });
    dispatchTemplateState();
  };
  reader.readAsDataURL($event[0]);
};
const varaibleLabelName = (id: any) => {
    return `{{${id + 1}}}`;
  };
  const parseJson = (str: any = []) => {
    return JSON.parse(str);
  };

  const stringifyJson = (str: any = []) => {
    return JSON.stringify(str);
  };

  const channel = ref("form");

  setFieldValue("name", templateStore.values.name);
  setFieldValue("footer", templateStore.values.footer);
  setFieldValue("body", templateStore.values.body);
  setFieldValue("header", templateStore.values.header);
  setFieldValue("headerText", templateStore.values.headerText);
  setFieldValue("headerLocation", templateStore.values.headerLocation);
  setFieldValue(
    "templateVariables",
    parseJson(templateStore.values.templateVariables),
  );
  setFieldValue("integrationId", templateStore.values.integrationId);
  setFieldValue("languageCode", 'en');
  setFieldValue(
    "headerTextTemplateVariables",
    parseJson(templateStore.values.headerTextTemplateVariables),
  );
  if (
    ["text", "image", "video", "document"].includes(templateStore.values.header)
  )
    setFieldValue(
      "headerFile",
      templateStore.values.headerFile instanceof Object
        ? templateStore.values.headerFile
        : {},
    );
  // // if(values)
  // const updatChannel = (value: any) => {
  //   channel.value = value;
  // };

  watch(
    () => errors,
    (newValue) => {},
  );
  const variableOptions = [
    { label: "First Name", value: "firstName" },
    { label: "Last Name", value: "lastName" },
    { label: "Full Name", value: "fullName" },
    { label: "Email", value: "email" },
    { label: "Mobile", value: "mobile" },
  ];

  const handleConnect = handleSubmit(async (value: any) => {
    try {
      isLoading.value = true;
      if (values?.headerFile?.file instanceof File) {
        const formData = new FormData();
        formData.append("files", values?.headerFile?.file);
        const [res] = await $fetch("/api/uploads", {
          method: "POST",
          body: formData,
        });
        setFieldValue("headerFile", res);
      }
      if (whatsppModalState?.id) {
        await $fetch(`/api/templates/${whatsppModalState.id}`, {
          method: "PUT",
          body: {
            metadata: { ...values },
            name: values.name,
            integrationId: values.integrationId,
          },
        });
        toast.success("Updated successfully");
      } else {
        const {name,integrationId , languageCode, ...rest} = values
        await $fetch("/api/templates", {
          method: "POST",
          body: {
            metadata: { ...rest },
            templateName: values.name,
            integrationId: values.integrationId,
            languageCode: values.languageCode,
          },
        });
        toast.success("Created successfully");
      }
      emit("confirm");
      templateStore.resetValues();
      isLoading.value = false;
    } catch (error: any) {
      toast.error(error.statusMessage);
       isLoading.value = false;
    }
    finally {
       isLoading.value = false;
    }
  });
</script>