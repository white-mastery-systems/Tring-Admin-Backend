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
        <!-- <div> -->
        <TextField name="title" label="Title" placeholder="Title" />
        <TextField :name="`fields[0].label`" label="Label" placeholder="Label" />
        <SelectField :name="`fields[0].type`" label="Type" :options="typeList" required />
        <SelectField :name="`fields[0].required`" label="Required" :options="requiredList" required />
        <TextField :name="`fields[0].placeholder`" label="Placeholder" placeholder="Placeholder" />
        <TextField :name="`fields[0].model`" label="Model" placeholder="Model" />
      </div>
      <div class="flex w-full justify-end gap-2">
        <div>
          <UiButton color="primary" type="button" size="lg" @click="addField">Add Field</UiButton>
        </div>
        <UiButton color="primary" type="submit" size="lg" :loading="isLoading">
          Submit
        </UiButton>
      </div>
    </form>
  </Page>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useForm } from 'vee-validate'; // assuming you're using vee-validate
import * as z from 'zod'; // assuming you're using zod for validation

const isLoading = ref(false);
const route = useRoute("bot-management-chat-bot-id-dynamic-form");
const botDetails: any = await getBotDetails(route.params.id);
const formattedValue:any = ref([])

const requiredList = reactive([
  { label: "Yes", value: true },
  { label: "No", value: false },
]);
const typeList = reactive([
  { label: "Text", value: "text" },
  { label: "Email", value: "email" },
  { label: "Number", value: "number" },
  { label: "Date", value: "date" },
  { label: "Time", value: "time" },
  { label: "Textarea", value: "textarea" },
]);

const formSchema = toTypedSchema(
  z.object({
    title: z.string({ required_error: "Title is required." }).min(2, "Title must be at least 2 characters."),
    fields: z.array(
      z.object({
        type: z.string({ required_error: "Type is required." }),
        label: z.string({ required_error: "Label is required." }),
        placeholder: z.string().optional(),
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
  const formattedData: any = {
    title: values.title,
    fields: formattedValue.value.length > 0 ? formattedValue.value : values.fields
  };
  await dynamicaFormDetails(route.params.id, { formStructure: formattedData})
});

const addField = () => {
  if (!values.title) return
  values.fields?.forEach((items: any) => {
    formattedValue.value.push({...items})
  })
  toast.success("Field added successfully", formattedValue.value.length);
  console.log(formattedValue.value, "formattedValue -- formattedValue")
};

const removeField = (index: number) => {
  values.fields?.splice(index, 1);
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
