<template>
  <Page title="Dynamic Form" :bread-crumbs="[
    {
      label: `${botDetails.name}`,
      to: `/bot-management/chat-bot/${botDetails.id}`,
    },
    {
      label: 'Dynamic Form',
      to: `/bot-management/chat-bot/${botDetails.id}/dynamic-form`,
    },
  ]" :description="true" :disableSelector="false" :disable-back-button="false">
    <form @submit.prevent="dynamicForm" class="space-y-4">
      <div class="flex grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-3 px-2">
        <SelectField name="fields[0].type" label="Type" :options="typeList" required />
        <TextField name="fields[0].label" label="Label" placeholder="Label" required />
        <!-- <SelectField name="fields[0].required" label="Required" :options="requiredList" required /> -->
        <TextField name="fields[0].placeholder" label="Placeholder" placeholder="Placeholder" required />
        <TextField name="fields[0].errorMessage" label="Error Message" placeholder="Enter error message" required />
        <TextField v-if="values.fields[0].type === 'text'" name="fields[0].minLength" label="Minimum Length"
          type="number" placeholder="Minimum length" />
        <TextField v-if="values.fields[0].type === 'text'" name="fields[0].maxLength" label="Maximum Length"
          type="number" placeholder="Maximum length" />
      </div>
      <div class="flex w-full justify-end gap-2">
        <div>
          <UiButton color="primary" type="button" size="lg" @click="addField">Add Field</UiButton>
        </div>
        <UiButton color="primary" type="submit" size="lg" :loading="isLoading">Submit</UiButton>
      </div>
    </form>
    <!-- Preview Section -->
    <div class="mt-8" v-if="formattedValue.length">
      <h2 class="text-xl font-semibold">Form Preview</h2>
      <form class="space-y-4">
        <div v-for="(field, index) in formattedValue" :key="index" class="space-y-3 flex items-end gap-2">
          <!-- Type Field in Preview -->
          <div v-if="field.type === 'Date'" class="w-full">
            <DatePickerField :name="field.model" :label="field.label" :placeholder="field.placeholder" required
              disabled />
          </div>
          <div v-else-if="field.type === 'Time'" class="w-full">
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

  </Page>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useForm } from 'vee-validate'; // assuming you're using vee-validate
import * as z from 'zod'; // assuming you're using zod for validation
import CloseIcon from "~/components/icons/CloseIcon.vue";

const isLoading = ref(false);
const route:any = useRoute("bot-management-chat-bot-id-dynamic-form");
const botDetails: any = await getBotDetails(route.params.id);

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
const dynamicFormFieldObj = ref([])

  const {
    data: formattedValue,
    status,
    refresh: integrationRefresh,
  } = await useLazyFetch(`/api/bots/${botDetails.id}`, {
    server: false,
    default: () => [],
    transform: (integrations: any) => {
      return integrations.formStructure?.fields
    }
  });

const phoneNumberPattern = /^\+?[1-9]\d{1,14}$/
const formSchema = toTypedSchema(
  z.object({
    fields: z.array(
      z.object({
        type: z.string({ required_error: "Type is required." }).min(2,"Type is required."),
        label: z.string({ required_error: "Label is required." }).min(2, "Label is required."),
        placeholder: z.string({ required_error: "Placeholder is required." }).min(2, "Placeholder is required."), // Make placeholder required
        errorMessage: z.string({ required_error: "Error message is required." }).min(2, "Error message is required."), // Make errorMessage required
        minLength: z.number().optional(),
        maxLength: z.number().optional(),
      })
    ),
  })
);

const { handleSubmit, values, setFieldValue,resetForm } = useForm({
  validationSchema: formSchema,
  initialValues: {
    fields: [{
      label: '',
      type: 'text',
      errorMessage: '',
      minLength: 1,
      maxLength: 10,
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
  await dynamicaFormDetails(route.params.id, { formStructure: formattedData})
});

const toCamelCase = (str: string) => {
  return str
    .toLowerCase()
    .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) =>
      index === 0 ? match.toLowerCase() : match.toUpperCase()
    )
    .replace(/\s+/g, '');
}
const addField = () => {
  console.log(formattedValue.value.length, "formattedValue.value.length")
  console.log((formattedValue.value.length === 1), "formattedValue.value.length === 1")
  if (!formattedValue.value.length) {
    const isValid = values.fields.every((field) =>
      field.label && field.type && field.errorMessage &&
      field.minLength !== undefined && field.maxLength !== undefined && field.placeholder
    );

    if (!isValid) {
      toast.error("Please fill in all required fields before adding.");
      return;
    }
    if (!isValid) return
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




<!-- <template>
  <Page title="Dynamic Form" :bread-crumbs="[
  {
  label: `${botDetails.name}`,
  to: `/bot-management/chat-bot/${botDetails.id}`,
  },
  {
    label: 'Dynamic Form',
  to: `/bot-management/chat-bot/${botDetails.id}/dynamic-form`,
  },
  ]" :description="true" :disableSelector="false" :disable-back-button="false">
    <form @submit.prevent="dynamicForm" class="space-y-4">
      <div class="flex grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-3 px-2">
        <TextField name="title" label="Title" placeholder="Title">
        </TextField>
        <TextField name="fields[0].label" label="label" placeholder="label">
        </TextField>
        <SelectField name="fields[0].type" label="Type" placeholder="Select Type" :options="typeList" required />
        <SelectField name="fields[0].required" label="required" placeholder="Select required" :options="requiredList"
          required />
        <TextField name="fields[0].placeholder" label="placeholder" placeholder="placeholder">
        </TextField>
        <TextField name="fields[0].model" label="model" placeholder="model">
        </TextField>
      </div>
      <div class="flex w-full justify-end">
        <UiButton color="primary" type="submit" size="lg" :loading="isLoading">
          Submit
        </UiButton>
      </div>
    </form>
  </Page>
</template>

<script setup lang="ts">
const isLoading = ref(false)
const route = useRoute("bot-management-chat-bot-id-dynamic-form");
const botDetails: any = await getBotDetails(route.params.id);

const requiredList = reactive([
  {
    label: "Yes",
    value: true
  }, {
    label: "No",
    value: false
  },
])
const typeList = reactive([
  {
    label: "Text",
    value: "text"
  }, {
    label: "Email",
    value: "email"
  }, {
    label: "Number",
    value: "number"
  }, {
    label: "Date",
    value: "date"
  }, {
    label: "Time",
    value: "time"
  }, {
    label: "Textarea",
    value: "textarea"
  },
])
const formSchema = toTypedSchema(
  z.object({
    title: z.string({ required_error: "Title is required." })
          .min(2, "Title must be at least 2 characters."),
    fields: z.array(
      z.object({
        type: z.string({ required_error: "Type is required." }),
        label: z.string({ required_error: "Label is required." }),
        placeholder: z.string().optional().optional(),
        model: z.string({ required_error: "Model is required." }).optional(),
        required: z.boolean().optional(),
      })
    ),
  })
);

const { handleSubmit, values, setFieldValue } = useForm({
  validationSchema: formSchema,
  initialValues: {
    title: '',
    fields: [{
      label: '',
      type: 'text',
      required: false,
      placeholder: '',
      model: ''
    }],
  },
});
const dynamicForm = handleSubmit(async (values: any) => {
  console.log(JSON.stringify(values), "values -- values")
  // const formattedData = {
  //   title: values.title, // or use a dynamic title if needed
  //   fields: values.fields, // Directly use the array of fields
  // };
  // console.log(formattedData, "formattedData -- ")
  // isLoading.value = true
  // isLoading.value = false
})
</script> -->
