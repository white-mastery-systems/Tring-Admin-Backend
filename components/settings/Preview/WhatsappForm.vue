<script setup lang="ts">
  import { debounce } from "chart.js/helpers";
  import { FieldArray } from "vee-validate";
  import TextField from "~/components/formComponents/TextField.vue";
  import { useTemplateStore } from "~/store/whatsAppTemplateStore";
  import { whatsAppTemplateSchema } from "~/validationSchema/settings/whatAppTemplateValidation";
  const templateStore = useTemplateStore();
  console.log("dispatchTemplate", templateStore.values.templateVariables);

  // import countryData from '~/assets/country-codes.json'
  definePageMeta({
    middleware: "admin-only",
  });

  const varaibleLabelName = (id) => {
    return `{{${id + 1}}}`;
  };
    const parseJson = (str:any = []) => {
    return JSON.parse(str);
  };

  const stringifyJson = (str:any = []) => {
    return JSON.stringify(str) ;
  };
  const headerOptions = [
    { label: "None", value: "none" },
    { label: "Text", value: "text" },
    { label: "Image", value: "image" },
    { label: "Video", value: "video" },
    { label: "Document", value: "document" },
    { label: "Location", value: "Location" },
  ];

  const emit = defineEmits<{
    (e: "confirm"): void;
    (edit: "getApistatus"): void;
  }>();
  const whatsppModalState = defineProps<{
    open: Boolean;
    id: String;
    getStatus: Boolean;
  }>();
  console.log(whatsppModalState.open, whatsppModalState.id);

  watch(whatsppModalState.open, (newValue) => {
    console.log({ newValue });
  });
  watch(
    () => whatsppModalState.id,
    (newValue) => {
      console.log({ newValue });
    },
  );

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
    console.log("dispatchTemplate", values.templateVariables);
    debounce(
      templateStore.updateValues({
        ...values,
        templateVariables: stringifyJson(values.templateVariables),
        headerTextTemplateVariables: stringifyJson(
          values.headerTextTemplateVariables ,
        ),
      }),
      1000,
    );
    console.log("dispatchTemplate", templateStore.values.templateVariables);
  };



  if (whatsppModalState?.id && whatsppModalState.getStatus) {
    const { metadata: getSingleDetails }: any = await $fetch(
      `/api/templates/${whatsppModalState.id}`,
    );
    setFieldValue("name", getSingleDetails.name);
    setFieldValue("header", getSingleDetails.header);
    setFieldValue("headerText", getSingleDetails.headerText);
    setFieldValue("headerFile", getSingleDetails.headerFile);
    setFieldValue("headerLocation", getSingleDetails.headerLocation);
    setFieldValue("body", getSingleDetails.body);
    setFieldValue("footer", getSingleDetails.footer);
  if(getSingleDetails.templateVariables)  setFieldValue(
      "templateVariables",
      getSingleDetails.templateVariables,
    );
 if(getSingleDetails.headerTextTemplateVariables)   setFieldValue(
      "headerTextTemplateVariables",
      getSingleDetails.headerTextTemplateVariables,
    );
    dispatchTemplateState();
    emit("getApistatus");
  } else {
    resetForm();
  }
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
    const formData = new FormData();
    Array.from($event).forEach((file) => {
      formData.append("files", file);
    });
    const [res] = await $fetch("/api/uploads", {
      method: "POST",
      body: formData,
    });

    setFieldValue("headerFile", res);
    dispatchTemplateState();
  };

  // const addVoiceBot = async (value: any) => {
  //   try {
  //     const bot = await $fetch("/api/voicebots", {
  //       method: "POST",
  //       body: { name: value.newBotName },
  //     });
  //     return navigateTo({
  //       name: "bot-management-voice-bot-id",
  //       params: { id: bot.id },
  //     });
  //   } catch (err: any) {
  //     toast.error(err.data.data[0].message);
  //   }
  // };

  const handleConnect = handleSubmit(async (value: any) => {
    try {
      if (whatsppModalState?.id) {
        await $fetch(`/api/templates/${whatsppModalState.id}`, {
          method: "PUT",
          body: { metadata: { ...values }, name: values.name },
        });
        toast.success("Updated successfully");
      } else {
        await $fetch("/api/templates", {
          method: "POST",
          body: { metadata: { ...values }, name: values.name },
        });
        toast.success("Created successfully");
      }
      emit("confirm");
      templateStore.resetValues();
    } catch (error: any) {
      console.log(error);

      toast.error(error.statusMessage);
    }
  });

  const channel = ref("form");
  console.log(templateStore.values.templateVariables);

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
  setFieldValue(
    "headerTextTemplateVariables",
    parseJson(templateStore.values.headerTextTemplateVariables),
  );
  if (
    ["text", "image", "video", "document"].includes(templateStore.values.header)
  )
    setFieldValue("headerFile", templateStore.values.headerFile);
  // if(values)
  const updatChannel = (value: any) => {
    channel.value = value;
  };

  watch(
    () => errors,
    (newValue) => {
      console.log(errors);
    },
  );
</script>

<template>
  <form @submit="handleConnect" class="space-y-2">
    <div class="grid grid-cols-1 gap-4">
      <TextField
        type="text"
        :disableSpecialCharacters="true"
        name="name"
        label="Name  Of Template"
        placeholder="Enter name"
        required
        @input="dispatchTemplateState()"
      >
      </TextField>
      <div>
        <div class="pt-4">
          <SelectField
            name="header"
            :options="headerOptions"
            label="Header"
            placeholder="Enter type"
            required
            @input="
              setFieldValue('headerFile', {});
              dispatchTemplateState();
            "
          />
        </div>
      </div>

      <TextField
        v-if="values.header === 'text'"
        type="text"
        name="headerText"
        placeholder="Enter Value"
        required
        @input="dispatchTemplateState()"
      >
      </TextField>

      <FieldArray
        v-if="values.header === 'text'"
        name="headerTextTemplateVariables"
        v-slot="{ fields, push, remove }"
      >
        <fieldset
          class="InputGroup"
          v-for="(field, idx) in fields"
          :key="field.key"
        >
          <TextField
            :label="'Variable' + ' ' + varaibleLabelName(idx)"
            :id="`textname_${idx}`"
            :name="`headerTextTemplateVariables[${idx}]`"
          />

          <button
            type="button"
            @click="removeTemplateVariable(idx, remove, fields, 'headerText')"
          >
            remove
          </button>
        </fieldset>

        <UiButton
          type="button"
          class="mt-2 max-w-[130px]"
          color="primary"
          @click="
            () => {
              push('');
              setFieldValue(
                'headerText',
                (values.headerText || '') + `{{${fields.length}}}`,
              );
              console.log('pushed');
              dispatchTemplateState();
            }
          "
        >
          Add Variable +
        </UiButton>
      </FieldArray>

      <div v-if="values.header === 'image'">
        <span class="semibold pt-4 text-sm"> Header Content </span>
        <imageField
          @change="uploadFile"
          name="headerFile"
          accept="image/png, image/jpeg"
        />
        <!-- <TextField type='file' name="headerImage" accept="image/png, image/jpeg"/> -->
      </div>
      <div v-else-if="values.header === 'document'">
        <span class="semibold pt-4 text-sm"> Header Content </span>
        <imageField
          @change="uploadFile"
          name="headerFile"
          accept="application/pdf"
        />
      </div>
      <div v-else-if="values.header === 'video'">
        <span class="semibold pt-4 text-sm"> Header Content </span>
        <imageField @change="uploadFile" name="headerFile" accept="video/mp4" />
      </div>

      <TextField
        @input="updateBody($event)"
        :isTextarea="true"
        type="text"
        name="body"
        label="Body"
        placeholder="Enter Value"
        required
      >
      </TextField>

      <FieldArray name="templateVariables" v-slot="{ fields, push, remove }">
        <fieldset
          class="InputGroup"
          v-for="(field, idx) in fields"
          :key="field.key"
        >
          <TextField
            :label="'Variable' + ' ' + varaibleLabelName(idx)"
            :id="`name_${idx}`"
            :name="`templateVariables[${idx}]`"
          />

          <button
            type="button"
            @click="removeTemplateVariable(idx, remove, fields)"
          >
            remove
          </button>
        </fieldset>

        <UiButton
          type="button"
          class="mt-2 max-w-[130px]"
          color="primary"
          @click="
            () => {
              push('');
              setFieldValue(
                'body',
                (values.body || '') + `{{${fields.length}}}`,
              );
              dispatchTemplateState();
            }
          "
        >
          Add Variable +
        </UiButton>
      </FieldArray>

      <TextField
        @input="dispatchTemplateState()"
        type="text"
        label="Footer"
        name="footer"
        placeholder="Enter Value"
      >
      </TextField>
    </div>
    <div class="flex items-center justify-end">
      <UiButton type="submit" class="mt-2" color="primary">Submit </UiButton>
    </div>
  </form>
</template>
