

<script setup lang="ts">
import { debounce } from "chart.js/helpers";
  import { FieldArray } from "vee-validate";
  import TextField from "~/components/formComponents/TextField.vue";
  import { useTemplateStore } from "~/store/whatsAppTemplateStore";
import { whatsAppTemplateSchema } from "~/validationSchema/settings/whatAppTemplateValidation";
  const templateStore = useTemplateStore();
  // import countryData from '~/assets/country-codes.json'
  definePageMeta({
    middleware: "admin-only",
  });

  const isLoading = ref(false)
  const varaibleLabelName = (id) => {
    return `{{${id + 1}}}`;
  };
  const headerOptions = [
    { label: "None", value: "none" },
    { label: "Text", value: "text" },
    { label: "Image", value: "image" },
    { label: "Video", value: "video" },
    { label: "Document", value: "document" },
    { label: "Location", value: "Location" },
  ];

  const emit = defineEmits<{ (e: "confirm"): void }>();
  const whatsppModalState  = defineProps<{
open:String,
id:String
}>();

  watch(whatsppModalState, (newValue) => {
    console.log({ newValue });
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
  watch(
    () => whatsppModalState.value.open,
    async (newState) => {
      console.log(whatsppModalState?.value?.id);
      if (whatsppModalState?.value?.id) {
        const getSingleDetails: any = await $fetch(
          `/api/templates/${whatsppModalState.value.id}`,
        );
        setFieldValue("name", getSingleDetails.name);
        setFieldValue("header", getSingleDetails.header);
        setFieldValue("headerText", getSingleDetails.headerText);
        setFieldValue("headerFile", getSingleDetails.headerFile);
        setFieldValue("headerLocation", getSingleDetails.headerLocation);
        setFieldValue("body", getSingleDetails.body);
        setFieldValue("footer", getSingleDetails.footer);
        setFieldValue("templateVariables", getSingleDetails.templateVariables);
      } else {
        resetForm();
      }
    },
  );
  watch(errors, (newValue) => {
    console.log({ newValue });
  })
  const updateBody = ($event: any) => {
    if (["{", "}"].includes($event)) {
      setTimeout(() => {
        let body = values.body;
        let templateVariables = [...(values.templateVariables || [])]; // Clone the array
        if (body?.indexOf("{") > -1 && $event === "{") {
          templateVariables.push("");
          body = body.replace("{", `{{${templateVariables.length}}}`);
          setFieldValue("templateVariables", templateVariables);
          setFieldValue("body", body);
        } else if (body?.indexOf("}}") > -1 && $event === "}") {
          templateVariables.push("");
          setFieldValue("templateVariables", templateVariables);
        }
    dispatchTemplateState()

      }, 0); // Delay to allow input update
    } else if ($event === "keydown") {
      setTimeout(() => {
        let body = values.body?.replace(" ", "");
        let templateVariables = [...(values.templateVariables || [])];
        templateVariables = templateVariables.filter(
          (el, index) => !(body.indexOf(`{{${index + 1}`) > -1),
        );
        setFieldValue("templateVariables", templateVariables);
       dispatchTemplateState()
      }, 0);
    }
    else{
    dispatchTemplateState()
    }

  };

  const removeTemplateVariable = (idx, remove, fields) => {
    setFieldValue("body", values.body?.replace(`{{${idx + 1}}}`, ""));
    fields.forEach((field, index) => {
      if (index > idx) {
        setFieldValue(
          "body",
          values.body?.replace(`{{${index + 1}}}`, `{{${index}}}`),
        );
      }
    });
    remove(idx);
    dispatchTemplateState()
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
    dispatchTemplateState()
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

  const handleConnect = handleSubmit(async (values: any) => {
    isLoading.value = true
    try {
      if(!!values.headerFile){
        values.headerFile = JSON.stringify(values.headerFile)
      }
      if (whatsppModalState.value?.id) {
        await $fetch(`/api/templates/${whatsppModalState.value.id}`, {
          method: "PUT",
          body: {...values},
        });
        toast.success("Updated successfully");
      } else {
        await $fetch("/api/templates", { method: "POST", body: values });
        toast.success("Created successfully");
      }
      emit("confirm");
      templateStore.resetValues()
    } catch (error: any) {
      console.log(error);
      
      toast.error(error.statusMessage);
      isLoading.value = false
    }
    isLoading.value = false
  });



  const channel = ref("form");

  
  setFieldValue("name", templateStore.values.name);
  setFieldValue("footer",  templateStore.values.footer);
  setFieldValue("body",  templateStore.values.body);
  setFieldValue("header",  templateStore.values.header);
  setFieldValue("headerText",  templateStore.values.headerText)
  setFieldValue("headerLocation",  templateStore.values.headerLocation)
  if(['text', 'image', 'video', 'document'].includes( templateStore.values.header))  setFieldValue("headerFile",  templateStore.values.headerFile)
  // if(values)
  const updatChannel = (value: any) => {
    channel.value = value;
  }


  const dispatchTemplateState =  ()=>{
    console.log('dispatchTemplate');
    
    debounce(templateStore.updateValues(values),1000)
  }
</script>

<template>
  {{ errors }}
  <form @submit="handleConnect" class="space-y-2">
    <div class="grid grid-cols-1 gap-4">
      <TextField type="text" :disableSpecialCharacters="true" name="name" label="Name  Of Template"
        placeholder="Enter name" required @input="dispatchTemplateState()">
      </TextField>
      <div>
        <div class="pt-4">
          <SelectField name="header" :options="headerOptions" label="Header" placeholder="Enter type" required
            @input="dispatchTemplateState()" />
        </div>
      </div>

      <TextField v-if="values.header === 'text'" type="text" name="headerText" placeholder="Enter Value" required
        @input="dispatchTemplateState()">
      </TextField>

      <div v-if="values.header === 'image'">
        <span class="semibold pt-4 text-sm"> Header Content </span>
        <imageField @change="uploadFile" name="headerFile" accept="image/png, image/jpeg" />
        <!-- <TextField type='file' name="headerImage" accept="image/png, image/jpeg"/> -->
      </div>
      <div v-else-if="values.header === 'document'">
        <span class="semibold pt-4 text-sm"> Header Content </span>
        <imageField @change="uploadFile" name="headerFile" accept="application/pdf" />
      </div>
      <div v-else-if="values.header === 'video'">
        <span class="semibold pt-4 text-sm"> Header Content </span>
        <imageField @change="uploadFile" name="headerFile" accept="video/mp4" />
      </div>

      <TextField @input="updateBody($event)" :isTextarea="true" type="text" name="body" placeholder="Enter Value"
        required>
      </TextField>

      <FieldArray name="templateVariables" v-slot="{ fields, push, remove }">
        <fieldset class="InputGroup" v-for="(field, idx) in fields" :key="field.key">
          <TextField :label="'Variable' + ' ' + varaibleLabelName(idx)" :id="`name_${idx}`"
            :name="`templateVariables[${idx}]`" />

          <button type="button" @click="removeTemplateVariable(idx, remove, fields)">
            remove
          </button>
        </fieldset>

        <button class="text-align-right" type="button" @click="
                  () => {
                    push('');
                    setFieldValue(
                      'body',
                      (values.body || '') + `{{${fields.length}}}`,
                    );
                    dispatchTemplateState()
                  }
                ">
          Add Variable +
        </button>
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