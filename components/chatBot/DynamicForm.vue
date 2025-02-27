<template>
  <!-- <Page title="Dynamic Form" :bread-crumbs="[
    {
      label: `${botDetails.name}`,
      to: `/bot-management/chat-bot/${botDetails.id}`,
    },
    {
      label: 'Dynamic Form',
      to: `/bot-management/chat-bot/${botDetails.id}/dynamic-form`,
    },
  ]" :description="true" :disableSelector="false" :disable-back-button="false"> -->
  <div class="pt-3">
    <form @submit.prevent="dynamicForm" class="space-y-4">
      <div class="flex grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-3 px-2">
        <SelectField name="fields[0].type" label="Type" :options="typeList" required />
        <TextField name="fields[0].label" label="Label" placeholder="Label" required />
        <!-- <SelectField name="fields[0].required" label="Required" :options="requiredList" required /> -->
        <TextField name="fields[0].placeholder" label="Placeholder" placeholder="Placeholder" required />
        <TextField name="fields[0].errorMessage" label="Error Message" placeholder="Enter error message" required />
        <!-- <TextField v-if="values.fields[0].type === 'text'" name="fields[0].minLength" label="Minimum Length"
          type="number" placeholder="Minimum length" /> -->
        <!-- <TextField v-if="values.fields[0].type === 'text'" name="fields[0].maxLength" label="Maximum Length"
          type="number" placeholder="Maximum length" /> -->
        <TextField v-if="values.fields[0].type === 'text'" :disableCharacters="true" name="fields[0].minLength"
          label="Minimum Length" helperText="" required placeholder="Minimum length" />
        <TextField v-if="values.fields[0].type === 'text'" :disableCharacters="true" name="fields[0].maxLength"
          label="Maximum Length" helperText="" required placeholder="Maximum length" />
      </div>
      <div class="flex w-full justify-end gap-2">
        <div>
          <UiButton type="button" size="lg" @click="addField()"> Add Field</UiButton>
        </div>
        <UiButton type="submit" size="lg" :loading="isLoading">Submit</UiButton>
      </div>
    </form>
    <!-- Preview Section -->
    <div class="mt-8" v-if="formattedValue.length">
      <h2 class="text-xl font-semibold">Form Preview</h2>
      <form class="space-y-4">
        <div v-for="(field, index) in formattedValue" :key="index" class="space-y-3 flex items-end gap-2">
          <!-- Type Field in Preview -->
          <!-- {{ field.placeholder }} -->
          <div v-if="field.type === 'date'" class="w-full">
            <DatePickerField :name="field.model" :label="field.label" :placeholder="field.placeholder" required
              disabled />
          </div>
          <div v-else-if="field.type === 'time'" class="w-full">
            <TimePickerField :name="field.model" :label="field.label" :placeholder="field.placeholder" required
              disabled>
            </TimePickerField>
            <!-- <UiButton variant="outline" type="button" @click="removeField(index)">
                <CloseIcon class="w-4 h-4" />
              </UiButton> -->
          </div>
          <div v-else class="w-full">
            <TextField :name="field.model" :label="field.label" :placeholder="field.placeholder" :type="field.type"
              required disabled />
          </div>
          <UiButton variant="outline" type="button" @click="removeField(index)">
            <CloseIcon class="w-4 h-4" />
          </UiButton>
        </div>
      </form>
    </div>

    <CommunicationChannelConfig />
    <AddTools />
  </div>

  <!-- </Page> -->
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useForm } from 'vee-validate'; // assuming you're using vee-validate
import * as z from 'zod'; // assuming you're using zod for validation
import CloseIcon from "~/components/icons/CloseIcon.vue";
import { useToCamelCase } from "~/composables/botManagement/chatBot/useToCamelCase";
import { dynamicFormSchema } from "~/validationSchema/botManagement/chatBot/dynamicFormValidation";

const isLoading = ref(false);
const route: any = useRoute("chat-bot-id-dynamic-form");
const botDetails: any = await getBotDetails(route.params.id);
const { toCamelCase } = useToCamelCase();

const requiredList = reactive([
  { label: "Yes", value: true },
  { label: "No", value: false },
]);
const typeList = reactive([
  { label: "Text", value: "text" },
  { label: "Email", value: "email" },
  { label: "Number", value: "number" },
  { label: "Phone", value: "phone" },
  { label: "Date", value: "date" },
  { label: "Time", value: "time" },
  // { label: "Textarea", value: "textarea" },
]);

const formattedToolsConfig = computed(() => {
  // Format the getAddTools data for better readability
  return {
    defaultTools: getAddTools.value.defaultTools,
    clientTools: getAddTools.value.clientTools.map((tool) => ({
      name: tool.name,
      description: tool.description,
      endpoint: tool.endpoint,
      parameters: tool.parameters.properties.map((param) => ({
        name: param.name,
        type: param.type,
        description: param.description,
        required: param.required ? "Yes" : "No",
      })),
    })),
  };
});


const {
  data: formattedValue,
  status,
  refresh: integrationRefresh,
} = await useLazyFetch(`/api/bots/${botDetails.id}`, {
  server: false,
  default: () => [],
  transform: (integrations: any) => {
    return integrations.formStructure?.fields ?? []
  }
});

const phoneNumberPattern = /^\+?[1-9]\d{1,14}$/

const { handleSubmit, values, errors, setFieldValue, resetForm } = useForm({
  validationSchema: dynamicFormSchema,
  initialValues: {
    fields: [{
      label: '',
      type: 'text',
      errorMessage: '',
      minLength: '1',
      maxLength: '10',
      placeholder: ''
    }],
  },
});

const dynamicForm = handleSubmit(async (values: any) => {
  // title: values.title,
  const formattedData: any = {
    fields: formattedValue.value.length > 0 ? formattedValue.value : values.fields.map((field: any) => ({
      ...field,
      required: true,
      model: toCamelCase(field.label)  // Convert label to camelCase for each field
    }))
  };
  await dynamicaFormDetails(route.params.id, { formStructure: formattedData })
});

const addField = () => {
  const isValid = values.fields?.every((field) => {
    if (field.type === "Text") {
      // For type 'Text', check all fields
      return field.label && field.type && field.errorMessage &&
        field.minLength !== undefined && field.maxLength !== undefined && field.placeholder;
    } else {
      // For other types, only check label, placeholder, and errorMessage
      return field.label && field.placeholder && field.errorMessage;
    }
  });
  if (!isValid) {
    toast.error("Please fill in all required fields before adding.");
    return;
  }

  values.fields?.forEach((items: any) => {
    formattedValue.value.push({ ...items, required: true, model: toCamelCase(items.label) })
  })
  toast.success(`Field added successfully ${formattedValue.value.length}`);
};

const removeField = async (index: number) => {
  formattedValue.value?.splice(index, 1);
  await deleteDynamicForm({
    payload: { fields: formattedValue.value },
    botId: route.params.id,
  });
};
</script>