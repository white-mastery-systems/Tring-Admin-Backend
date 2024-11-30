<template>
  <!-- :bread-crumbs="[
    { label: `${botDetailsList.name}`, to: `/bot-management/chat-bot/${botDetailsList.id}` },
    {
      label: 'Intent Management',
      to: `/bot-management/chat-bot/${botDetailsList.id}/intent-management`,
    },
  ]"  -->
  <Page title="Add tools" :bread-crumbs="[
      {
        label: `${botDetailsList.name}`,
        to: `/bot-management/voice-bot/${botDetailsList.id}`,
      },
      {
        label: 'Add tools',
        to: `/bot-management/voice-bot/${botDetailsList.id}/tools`,
      },
    ]" :disableSelector="true" :disable-back-button="false" :disableElevation="false">
    <!-- <DialogWrapper v-model="toolsModalState" :title="(toolsModalState.id) ? 'Modify Tools' : 'Add Tools'"> -->
    <form @submit.prevent="dynamicToolsForm" class="space-y-6">
      <!-- Default Tools Section -->
      <div class="mb-6">
        <!-- <h2 class="text-xl font-semibold mb-4">Default Tools</h2> -->
        <div class="flex flex-wrap gap-4">
          <UiFormField v-slot="{ value, handleChange }" name="currentDate">
            <UiFormItem class="w-[49%]">
              <div class="flex justify-between">
                <UiLabel class="text-[14px] font-medium">Current Date</UiLabel>
                <UiFormControl>
                  <UiSwitch id="currentDate" :checked="value" @update:checked="(checked) => {
                  handleChange(checked);
                }" :style="{ background: value ? '#424BD1' : '#8A8A8A' }" />
                </UiFormControl>
                <UiFormMessage />
              </div>
            </UiFormItem>
          </UiFormField>

          <UiFormField v-slot="{ value, handleChange }" name="concludeCall">
            <UiFormItem class="w-[49%]">
              <div class="flex justify-between">
                <UiLabel class="text-[14px] font-medium">Conclude Call</UiLabel>
                <UiFormControl>
                  <UiSwitch id="concludeCall" :checked="value" @update:checked="(checked) => {
                  handleChange(checked);
                }" :style="{ background: value ? '#424BD1' : '#8A8A8A' }" />
                </UiFormControl>
                <UiFormMessage />
              </div>
            </UiFormItem>
          </UiFormField>

          <UiFormField v-slot="{ value, handleChange }" name="forwardCall">
            <UiFormItem class="w-[49%]">
              <div class="flex justify-between">
                <UiLabel class="text-[14px] font-medium">Forward Call</UiLabel>
                <UiFormControl>
                  <UiSwitch id="forwardCall" :checked="value" @update:checked="(checked) => {
                  handleChange(checked);
                }" :style="{ background: value ? '#424BD1' : '#8A8A8A' }" />
                </UiFormControl>
                <UiFormMessage />
              </div>
            </UiFormItem>
          </UiFormField>
        </div>
      </div>

      <!-- Client Tools Section -->
      <!-- <h2 class="text-xl font-semibold mb-4">Client Tools</h2> -->
      <div class="mb-4">
        <div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-3 px-2">
          <TextField :name="`clientTools[0].name`" label="Tool Name" placeholder="Enter tool name" required />
          <TextField :name="`clientTools[0].endpoint`" label="Endpoint URL" placeholder="Enter endpoint URL" required />
        </div>
        <TextField :name="`clientTools[0].description`" label="Description" placeholder="Enter tool description"
          required :isTextarea="true" />

        <!-- Dynamic Parameters Section -->
        <div class="mt-4">
          <!-- <h3 class="text-lg font-medium mb-3">Parameters</h3> -->
          <div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-3 mb-3">
            <TextField :name="`clientTools[0].parameters.properties[0].name`" label="Parameter Name"
              placeholder="Enter parameter name" required />
            <SelectField :name="`clientTools[0].parameters.properties[0].type`" label="Parameter Type"
              :options="parameterTypes" required />
            <TextField :name="`clientTools[0].parameters.properties[0].description`" label="Description"
              placeholder="Enter parameter description" required :isTextarea="true" />
            <SelectField :name="`clientTools[0].parameters.properties[0].required`" label="Required" :options="[
                  { label: 'Yes', value: true },
                  { label: 'No', value: false }
                ]" required />
          </div>
          <div class="flex w-full justify-end mt-2 gap-3">
            <UiButton color="primary" type="button" size="lg" @click="addParameter(toolIndex)">
              Add Parameter
            </UiButton>
            <UiButton color="primary" type="button" size="lg" @click="addClientTool(toolIndex)">Add Client Tool
            </UiButton>
          </div>
        </div>

        <!-- <div class="flex w-full justify-end mt-4">
          <UiButton variant="outline" type="button" @click="removeTool(toolIndex)">
            Remove Tool
          </UiButton>
        </div> -->
      </div>
      <!-- <div class="flex w-full justify-end mt-2">
          </div> -->

      <div class="flex w-full justify-end gap-2">
        <UiButton color="primary" type="submit" size="lg" :loading="isLoading">
          Submit
        </UiButton>
      </div>
    </form>

    <!-- Preview Section -->
    <div class="mt-8" v-if="getAddTools">
      <h2 class="text-xl font-semibold">Tools Configuration Preview</h2>
      <div v-for="(tool, toolIndex) in getAddTools.clientTools" :key="toolIndex"
        class="mb-6 border p-4 rounded relative">
        <div class="font-bold">{{ `Tools  ${toolIndex+1}` }}</div>
        <div class="w-full">
          <TextField :name="tool.name" label="Tool Name" :placeholder="tool.name" required disabled />
          <TextField :name="tool.description" label="Description" :placeholder="tool.description" required disabled
            :isTextarea="true" />
          <TextField :name="tool.endpoint" label="Endpoint URL" :placeholder="tool.endpoint" required disabled />
          <!-- <div class="flex gap-2"> -->
          <div v-for="(client, Index) in tool.parameters.properties" :key="Index" class="flex gap-2 w-full">
            <div class="w-[100%]">
              <TextField :name="client.name" label="Parameter Name" :placeholder="client.name" required />
              <TextField :name="client.type" label="Parameter Type" :placeholder="client.type" required />
              <TextField :name="client.description" label="Description" :placeholder="client.description" required
                :isTextarea="true" />
              <TextField :name="client.required" label="Required" :placeholder="client.required" required />
            </div>
            <div class="flex items-center">
              <UiButton variant="outline" type="button" @click="removeParametersField(toolIndex, Index)">
                <CloseIcon class="w-4 h-4" />
              </UiButton>
            </div>
          </div>
          <!-- </div> -->
        </div>
        <UiButton variant="outline" type="button" @click="removeClientField(toolIndex)" class="absolute top-2 right-2">
          <CloseIcon class="w-4 h-4" />
        </UiButton>
      </div>
      <!-- <pre class="bg-gray-100 p-4 rounded mt-4">
        {{ getAddTools }}
      </pre> -->
    </div>
    <!-- </DialogWrapper> -->
  </Page>
</template>

  <script setup lang="ts">
import { useForm } from 'vee-validate';
import CloseIcon from "~/components/icons/CloseIcon.vue";
import * as z from 'zod';
definePageMeta({
  middleware: "admin-only",
});

const isLoading = ref(false);
const formattedToolsConfig = ref(null);
const route = useRoute("bot-management-voice-bot-id-tools");
const botDetailsList: any = await getVoiceBotDetails(route.params.id);

// const emit = defineEmits<{ (e: "confirm"): void }>();
// const toolsModalState = defineModel<{ open: boolean; id: any }>({
//   default: {
//     open: false,
//     id: null,
//   },
// });

const getAddTools:any = ref(
  {
    defaultTools: [],
    clientTools: [
      {
        name: "",
        description: "",
        parameters: {
          type: "object",
          properties: [
          ]
        },
        endpoint: ""
      }
    ]
  }
)

watchEffect(async () => {
  const getRes = await getVoiceBotDetails(route.params.id)
  console.log(getRes, "getRes")
  getAddTools.value = getRes.tools
})
const parameterTypes = reactive([
  { label: 'String', value: 'string' },
  { label: 'Integer', value: 'integer' },
  { label: 'Boolean', value: 'boolean' },
  { label: 'Number', value: 'number' }
]);

const formSchema = toTypedSchema(
  z.object({
    currentDate: z.boolean(),
    concludeCall: z.boolean(),
    forwardCall: z.boolean(),
    clientTools: z.array(
      z.object({
        name: z.string().min(1, "Tool name is required"),
        description: z.string().min(1, "Description is required"),
        endpoint: z.string().url("Invalid URL format"),
        parameters: z.object({
          type: z.literal("object"),
          properties: z.array(
            z.object({
              name: z.string().min(1, "Parameter name is required"),
              type: z.enum(["string", "integer", "boolean", "number"]),
              description: z.string().min(1, "Parameter description is required"),
              required: z.boolean()
            })
          ),
        })
      })
    )
  })
);

const { handleSubmit, values, resetForm, errors, setFieldValue } = useForm({
  validationSchema: formSchema,
  initialValues: {
    currentDate: true,
    concludeCall: true,
    forwardCall: false,
    clientTools: [{
      name: "",
      description: "",
      endpoint: "",
      parameters: {
        type: "object",
        properties: [

        ],
      }
    }]
  }
});

setFieldValue(`clientTools[0].parameters.properties[0].required`, true)
setFieldValue(`clientTools[0].parameters.properties[0].type`, 'string')

watch(errors, (newValues) => {
  console.log(newValues)
})
watch(values, (newValues) => {
  getAddTools.value.defaultTools = []
  if (newValues.forwardCall) {
    getAddTools.value.defaultTools.push("forwardCall");
  }
  if (newValues.currentDate) {
    getAddTools.value.defaultTools.push("currentDate");
  }
  if (newValues.concludeCall) {
    getAddTools.value.defaultTools.push("concludeCall");
  }
  getAddTools.value.clientTools[getAddTools.value.clientTools.length - 1].name = newValues.clientTools[0].name
  getAddTools.value.clientTools[getAddTools.value.clientTools.length - 1].description = newValues.clientTools[0].description
  getAddTools.value.clientTools[getAddTools.value.clientTools.length - 1].endpoint = newValues.clientTools[0].endpoint
  // if (newValues.clientTools[0].name) {

  // }
  console.log(newValues, "newValues -- newValues")
})

const addParameter = () => {
  console.log('sadasdad')
  // Loop through the items in properties and push them into getAddTools
  values.clientTools[0].parameters.properties.forEach((item: any, index: number) => {
    getAddTools.value.clientTools[getAddTools.value.clientTools.length - 1].parameters.properties.push({ ...item }); // Assuming you want to add it to the first item in clientTools
  });
  toast.success(`Tool added successfully ${getAddTools.value.clientTools[getAddTools.value.clientTools.length - 1].parameters.properties.length}`);
  // Log the updated values for debugging
  console.log(getAddTools.value, "Updated getAddTools");
};

const removeTool = (index: number) => {
  values.clientTools.splice(index, 1);
};
const addClientTool = () => {
  resetForm()
  // Ensure both structures exist
  if (!Array.isArray(values.clientTools)) {
    console.error("values.clientTools is not an array");
    return;
  }

  if (!Array.isArray(getAddTools.value.clientTools)) {
    console.error("getAddTools.value.clientTools is not an array");
    return;
  }

  values.clientTools.forEach((item: any) => {
    // Check if the tool already exists
    const exists = getAddTools.value.clientTools.some(
      (existingItem: any) => existingItem.name === item.name // Use a unique property for comparison
    );

    if (!exists) {
      // Clone the item to avoid reference issues
      const newItem = {
        ...item,
        parameters: {
          ...item.parameters,
          properties: [], // Ensure properties is an empty array
        },
      };

      getAddTools.value.clientTools.push(newItem);
      toast.success(`Tool added successfully ${getAddTools.value.clientTools.length}`);
    } else {
      toast.error("Tool already exists");
    }
  });

  console.log(getAddTools.value, "Updated clientTools");
};

const removeParametersField = (toolIndex: number, Index: number) => {
  getAddTools.value.clientTools[toolIndex].parameters.properties.splice(Index, 1);
}
const removeClientField = (toolIndex: number) => {
  if (getAddTools.value.clientTools.length > 1) {
    getAddTools.value.clientTools.splice(toolIndex, 1);
  }
}

const dynamicToolsForm = handleSubmit(async (values: any) => {
  isLoading.value = true;
  let payload = {
    tools: getAddTools.value,
  };
  await updateLLMConfig(payload, botDetailsList.id, "Tools added successfully.")
  isLoading.value = false;
  // const defaultTools = [];
  // if (values.currentDate) defaultTools.push("currentDate");
  // if (values.concludeCall) defaultTools.push("concludeCall");
  // if (values.forwardCall) defaultTools.push("forwardCall");

  // const result = values.clientTools.map(tool => {
  //   // Create an object for each tool based on its properties
  //   const obj = tool.parameters.properties.reduce((acc, property) => {
  //     return property.name;
  //   }, {});
  //   console.log(obj, "obj")
  // })
  // console.log(result, "result --- result")
  // const formattedConfig = {
  //   tools: {
  //     defaultTools: defaultTools,
  //     clientTools: values.clientTools.map(tool => ({
  //       ...tool,
  //       parameters: {
  //         // ...tool.parameters,
  //         properties: [
  //           [values.clientTools]
  //         ]
  //         required: Object.keys(tool.parameters.properties)
  //           .filter(key => tool.parameters.properties[key].required)
  //       }
  //     }))
  //   }
  // };
  // console.log(formattedConfig, "formattedConfig -- formattedConfig")
  // formattedToolsConfig.value = formattedConfig;

  // Uncomment and implement actual API call
  // await updateToolsConfiguration(route.params.id, formattedConfig);
});
</script>
