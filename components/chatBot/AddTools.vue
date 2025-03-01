<template>
  <!-- :bread-crumbs="[
    { label: `${botDetails?.name}`, to: `/bot-management/chat-bot/${botDetails?.id}` },
    {
      label: 'Intent Management',
      to: `/bot-management/chat-bot/${botDetails?.id}/intent-management`,
    },
  ]"  -->
  <!-- <Page title="Add tools" :bread-crumbs="[
    {
      label: `${botDetails.name}`,
      to: `/bot-management/chat-bot/${botDetails.id}`,
    },
    {
      label: 'Add tools',
      to: `/bot-management/chat-bot/${botDetails.id}/tools`,
    },
  ]" :disableSelector="true" :disable-back-button="false" :disableElevation="false"> -->
  <div class="pt-8">
    <form @submit.prevent="dynamicToolsForm" class="space-y-6 pt-2 sm:pt-2 md:pt-0">
      <!-- Default Tools Section -->
      <div class="mb-6">
        <div class="flex flex-wrap gap-4">
          <UiFormField v-slot="{ value, handleChange }" name="date_time">
            <UiFormItem class="w-full sm:w-full md:w-[49%]">
              <div class="flex justify-between">
                <UiLabel class="text-[14px] font-medium">Current Date & Time</UiLabel>
                <UiFormControl>
                  <UiSwitch id="date_time" :checked="value" @update:checked="(checked) => {
                    handleChange(checked);
                  }" :style="{ background: value ? '#424BD1' : '#8A8A8A' }" />
                </UiFormControl>
                <UiFormMessage />
              </div>
            </UiFormItem>
          </UiFormField>

          <UiFormField v-slot="{ value, handleChange }" name="schedule_appointment">
            <UiFormItem class="w-full sm:w-full md:w-[49%]">
              <div class="flex justify-between">
                <UiLabel class="text-[14px] font-medium">Schedule Appointment</UiLabel>
                <UiFormControl>
                  <UiSwitch id="schedule_appointment" :checked="value" @update:checked="(checked) => {
                    handleChange(checked);
                  }" :style="{ background: value ? '#424BD1' : '#8A8A8A' }" />
                </UiFormControl>
                <UiFormMessage />
              </div>
            </UiFormItem>
          </UiFormField>

          <UiFormField v-slot="{ value, handleChange }" name="site_visit">
            <UiFormItem class="w-full sm:w-full md:w-[49%]">
              <div class="flex justify-between">
                <UiLabel class="text-[14px] font-medium">Schedule Site Visit</UiLabel>
                <UiFormControl>
                  <UiSwitch id="site_visit" :checked="value" @update:checked="(checked) => {
                    handleChange(checked);
                  }" :style="{ background: value ? '#424BD1' : '#8A8A8A' }" />
                </UiFormControl>
                <UiFormMessage />
              </div>
            </UiFormItem>
          </UiFormField>
          <UiFormField v-slot="{ value, handleChange }" name="schedule_call">
            <UiFormItem class="w-full sm:w-full md:w-[49%]">
              <div class="flex justify-between">
                <UiLabel class="text-[14px] font-medium"> Schedule Call </UiLabel>
                <UiFormControl>
                  <UiSwitch id="schedule_call" :checked="value" @update:checked="(checked) => {
                    handleChange(checked);
                  }" :style="{ background: value ? '#424BD1' : '#8A8A8A' }" />
                </UiFormControl>
                <UiFormMessage />
              </div>
            </UiFormItem>
          </UiFormField>
          <div class="flex grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 items-center gap-3 w-full">
            <UiFormField v-slot="{ value, handleChange }" name="schedule_call_with_voice">
              <UiFormItem class="w-full pr-0 sm:pr-0 md:pr-[6px]">
                <div class="flex justify-between">
                  <UiLabel class="text-[14px] font-medium"> Schedule a Call with Voice Bot </UiLabel>
                  <UiFormControl>
                    <UiSwitch id="schedule_call_with_voice" :checked="value" @update:checked="(checked) => {
                      handleChange(checked);
                    }" :style="{ background: value ? '#424BD1' : '#8A8A8A' }" :disabled="!values.schedule_call" />
                  </UiFormControl>
                  <UiFormMessage />
                </div>
              </UiFormItem>
            </UiFormField>
            <span class="w-full">
              <SelectField name="voice_bot" label="Voice Bots" placeholder="Select Bot"
                :options="voiceBotDetails.map((bot) => ({ label: bot.name, value: bot.id }))" :required="true"
                :disabled="!values.schedule_call_with_voice" :closeIcon="true" />
            </span>
          </div>
        </div>
      </div>
      <div class="mb-4">
        <div>
          <FieldArray name="customTools" v-slot="{ fields, push, remove }">
            <div v-if="values.clientFormControl">
              <fieldset v-for="(tool, toolIdx) in fields" :key="tool.key">
                <div class="border p-4 mb-4 space-y-6">
                  <h3 class="text-lg font-bold">Client Tool {{ toolIdx + 1 }}</h3>
                  <div class="flex gap-3">
                    <!-- Tool Name -->
                    <TextField :label="`Name`" :id="`tool_name_${toolIdx}`" :name="`customTools[${toolIdx}].name`"
                      placeholder="Enter tool name" required />
                    <!-- Tool Endpoint -->
                    <TextField :label="`Endpoint`" :id="`tool_endpoint_${toolIdx}`"
                      :name="`customTools[${toolIdx}].endpoint`" placeholder="Enter tool endpoint" required />
                  </div>

                  <!-- Tool Description -->
                  <TextField :label="`Description`" :id="`tool_description_${toolIdx}`"
                    :name="`customTools[${toolIdx}].description`" :isTextarea="true"
                    placeholder="Enter tool description" required />

                  <FieldArray :name="`customTools.${toolIdx}.parameters.properties`"
                    v-slot="{ fields: paramFields, push: pushParam, remove: removeParam }">
                    <div v-if="values.propertieFormControl">
                      <div v-for="(param, paramIdx) in paramFields" :key="param.key" class="mt-4 pb-2">
                        <h4 class="font-semibold"> Parameter {{ paramIdx + 1 }} </h4>
                        <div
                          class="gap-2 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-3 mb-3">
                          <!-- Parameter Name -->
                          <TextField :label="`Parameter Name`" :id="`param_name_${toolIdx}_${paramIdx}`"
                            :name="`customTools[${toolIdx}].parameters.properties[${paramIdx}].name`"
                            placeholder="Enter parameter name" required />

                          <!-- Parameter Type -->
                          <SelectField :label="`Type`" :id="`param_type_${toolIdx}_${paramIdx}`"
                            :name="`customTools[${toolIdx}].parameters.properties[${paramIdx}].type`"
                            :options="parameterTypes" required />

                          <!-- Parameter Description -->
                          <TextField :label="`Description`" :id="`param_desc_${toolIdx}_${paramIdx}`"
                            :name="`customTools[${toolIdx}].parameters.properties[${paramIdx}].description`"
                            :isTextarea="true" placeholder="Enter parameter description" required />
                          <div class="flex items-center justify-around w-full">
                            <UiFormField v-slot="{ value, handleChange }"
                              :name="`customTools[${toolIdx}].parameters.properties[${paramIdx}].required`">
                              <UiFormItem class="w-[49%]">
                                <div class="flex justify-between">
                                  <UiLabel class="text-[14px] font-medium">Required</UiLabel>
                                  <UiFormControl>
                                    <UiSwitch :label="`Required`" :id="`param_required_${toolIdx}_${paramIdx}`"
                                      :checked="value" @update:checked="(checked) => {
                                        handleChange(checked);
                                      }" :style="{ background: value ? '#424BD1' : '#8A8A8A' }" />
                                  </UiFormControl>
                                  <UiFormMessage />
                                </div>
                              </UiFormItem>
                            </UiFormField>
                            <!-- Required -->

                            <!-- Remove Parameter -->
                            <UiButton variant="outline" type="button" @click="removeParam(paramIdx)">
                              <CloseIcon class="w-4 h-4" />
                            </UiButton>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Add Parameter Button -->
                    <div class="flex items-center w-full justify-end gap-2">
                      <UiButton v-if="values.clientFormControl" type="button" @click="() => {
                        if (!values.propertieFormControl) {
                          setFieldValue('propertieFormControl', true)
                          // return
                        }
                        pushParam({ name: '', type: 'string', required: true })
                      }">
                        Add Parameter
                      </UiButton>
                      <UiButton type="button" @click="remove(toolIdx)">
                        Remove Client Tool
                      </UiButton>
                    </div>
                  </FieldArray>
                </div>
              </fieldset>
            </div>

            <!-- Add Client Tool Button -->
            <div class="flex w-full justify-end gap-2">
              <UiButton class="mt-2" type="button" @click="() => {
                if (!values.clientFormControl) {
                  setFieldValue('clientFormControl', true)
                  // return
                }
                push({ name: '', description: '', endpoint: '', parameters: { type: 'object', properties: [] } })

              }">
                Add Client Tool
              </UiButton>
            </div>
          </FieldArray>
        </div>
      </div>

      <div class="flex w-full justify-end gap-2">
        <UiButton type="submit" size="lg" :loading="isLoading">
          Submit
        </UiButton>
      </div>
    </form>
  </div>
  <!-- </Page> -->
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate';
import CloseIcon from "~/components/icons/CloseIcon.vue";
import { FieldArray } from "vee-validate";
import { addToolChatBotschema } from "~/validationSchema/botManagement/voiceBot/addToolsValidation";
import { useTransformApiResponse } from "~/composables/botManagement/voiceBot/useTransformApiResponse";
import { useBotDetails } from '~/composables/botManagement/chatBot/useBotDetails';

definePageMeta({
  middleware: "admin-only",
});

const isLoading = ref(false);
const route = useRoute("chat-bot-id-tools");
const paramId: any = route;
const config = useRuntimeConfig()
// const botDetails: any = await getBotDetails(paramId.params.id);
// const { botDetails, loading, error, refreshBot } = useBotDetails(route.params.id);
const voiceBotDetails = await getVoiceBotList()
const { transformApiResponse } = useTransformApiResponse();
// const uploadedAudio = ref();

// watch(botDetails?.value, () => {
//   if (botDetails?.value) {
//     setFieldValue('customTools', botDetails?.value.tools.customTools);
//   }
// }, { deep: true, immediate: true })

const parameterTypes = reactive([
  { label: 'String', value: 'string' },
  { label: 'Integer', value: 'integer' },
  { label: 'Boolean', value: 'boolean' },
  { label: 'Number', value: 'number' }
]);


const { handleSubmit, values, resetForm, errors, setFieldValue } = useForm({
  validationSchema: addToolChatBotschema,
  initialValues: {
    date_time: true,
    schedule_appointment: false,
    site_visit: false,
    schedule_call: false,
    clientFormControl: false,
    propertieFormControl: false,
    customTools: []
  }
});
// setFieldValue('date_time', botDetails?.tools?.defaultTools.includes('date_time') ?? true)
// setFieldValue('schedule_appointment', botDetails?.tools?.defaultTools?.includes('schedule_appointment') ?? true)
// setFieldValue('site_visit', botDetails?.tools?.defaultTools?.includes('site_visit') ?? false)
// setFieldValue('schedule_call', botDetails?.tools?.defaultTools?.includes('schedule_call') ??  true)
// setFieldValue('customTools', botDetails?.tools?.customTools ?? [])
// setFieldValue(`clientFormControl`, botDetails?.tools?.clientFormControl ?? false)
// setFieldValue(`propertieFormControl`, botDetails?.tools?.propertieFormControl ?? false)

onMounted(() => {
  const formattedToolsDetails = transformApiResponse(botDetails.value)
  console.log(formattedToolsDetails)
  setFieldValue('date_time', formattedToolsDetails?.date_time ?? true);
  setFieldValue('schedule_appointment', formattedToolsDetails?.schedule_appointment ?? false);
  setFieldValue('site_visit', formattedToolsDetails.site_visit ?? false);
  setFieldValue('schedule_call', formattedToolsDetails?.schedule_call ?? false);
  setFieldValue('schedule_call_with_voice', formattedToolsDetails?.schedule_call_with_voice ?? false);
  setFieldValue('voice_bot', formattedToolsDetails?.voice_bot ?? '');
  setFieldValue('clientFormControl', formattedToolsDetails.clientFormControl ?? false);
  setFieldValue('propertieFormControl', formattedToolsDetails.propertieFormControl ?? false);
  setFieldValue('customTools', formattedToolsDetails.customTools ?? []);

})

watch(() => values.schedule_call, (newValues) => {
  if (!newValues) {
    setFieldValue('schedule_call_with_voice', false)
  }
})

watch(() => values.schedule_call_with_voice, (newValues) => {
  if (!newValues) {
    setFieldValue('voice_bot', "")
  }
})
// const dynamicToolsForm = handleSubmit(async (values: any) => {
//   isLoading.value = true;
//   isLoading.value = false;
//   const defaultTools = [];
//   if (values.date_time) defaultTools.push('date_time');
//   if (values.schedule_appointment) defaultTools.push('schedule_appointment');
//   if (values.site_visit) defaultTools.push('site_visit');
//   if (values.schedule_call) defaultTools.push('schedule_call');

//   const payload = {
//     tools: {
//       defaultTools,
//       clientFormControl: values.clientFormControl,
//       propertieFormControl: values.propertieFormControl,
//       customTools: values.customTools,
//     }
//   };
//   console.log(payload, "payload -- payload")
//   // await updateLLMConfig(payload, botDetails?.id, "Tools added successfully.")
// });

// const transformApiResponse = (apiResponse: any) => {
//   console.log(apiResponse, "apiResponse -- apiResponse")
//   const tools = apiResponse.tools || {};
//   console.log(tools, "tools -- tools")
//   // Convert defaultTools back to individual flags
//   const defaultToolsSet = new Set(tools.defaultTools || []);
//   const transformedData: any = {
//     date_time: defaultToolsSet.has("date_time"),
//     schedule_appointment: defaultToolsSet.has("schedule_appointment"),
//     site_visit: defaultToolsSet.has("site_visit"),
//     schedule_call: defaultToolsSet.has("schedule_call"),
//     clientFormControl: true,
//     propertieFormControl: true,
//     customTools: [],
//   };

//   // Convert toolEndpoints into a key-value map
//   const toolEndpoints = tools.toolEndpoints.reduce((acc, obj) => {
//     return { ...acc, ...obj };
//   }, {});

//   // Convert customTools back to original format
//   transformedData.customTools = tools.customTools.map((tool) => {
//     const functionData = tool.function;
//     return {
//       name: functionData.name,
//       description: functionData.description,
//       endpoint: toolEndpoints[functionData.name] || "",
//       parameters: {
//         type: "object",
//         properties: Object.entries(functionData.parameters.properties).map(
//           ([key, value]: any) => ({
//             name: key
//               .replace(/_/g, " ")
//               .replace(/\b\w/g, (char) => char.toUpperCase()), // Convert to Title Case
//             type: value.type,
//             description: value.description,
//             required: functionData.parameters.required.includes(key),
//           })
//         ),
//       },
//     };
//   });
//   console.log(transformedData, "transformedData")
//   return transformedData;
// };
// Convert response

const dynamicToolsForm = handleSubmit(async (values: any) => {
  isLoading.value = true;
  console.log(values, "values -- values")
  const defaultTools = [];
  if (values.date_time) defaultTools.push('date_time');
  if (values.schedule_appointment) defaultTools.push('schedule_appointment');
  if (values.site_visit) defaultTools.push('site_visit');
  if (values.schedule_call) defaultTools.push('schedule_call');
  if (values.schedule_call_with_voice) defaultTools.push('schedule_call_with_voice');

  const customTools = values.customTools.map(tool => ({
    type: "function",
    function: {
      name: tool.name.replace(/\s+/g, "_").toLowerCase(), // Convert name to snake_case
      description: tool.description,
      parameters: {
        type: "object",
        properties: tool.parameters.properties.reduce((acc, prop) => {
          acc[prop.name.replace(/\s+/g, "_").toLowerCase()] = {
            type: prop.type,
            description: prop.description
          };
          return acc;
        }, {}),
        required: tool.parameters.properties
          .filter(prop => prop.required)
          .map(prop => prop.name.replace(/\s+/g, "_").toLowerCase())
      }
    }
  }));

  const toolEndpoints = values.customTools.map(tool => ({
    [tool.name.replace(/\s+/g, "_").toLowerCase()]: tool.endpoint
  }));

  const payload: any = {
    id: botDetails.value.id,
    tools: {
      defaultTools,
      customTools,
      toolEndpoints,
      voiceBotId: values.voice_bot,
    },
    metadata: {
      ...botDetails.value.metadata,
    },
  };


  console.log(payload, "payload -- formatted payload");
  await updateBotDetails(payload)

  isLoading.value = false;
  // await updateLLMConfig(payload, botDetails?.id, "Tools added successfully.");
});

</script>
