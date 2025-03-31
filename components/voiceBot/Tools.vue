<template>
  <div class="pb-7">
    <div class="my-5 flex items-center justify-between">
      <div class="text-[18px] font-bold">Add Tools</div>
      <!-- <UiButton @click="
        () => {
          // Add action if needed
        }
      ">
        Refresh
      </UiButton> -->
    </div>

    <form @submit.prevent="dynamicToolsForm" class="space-y-6">
      <!-- Default Tools Section -->
      <div class="mb-6">
        <div class="flex flex-wrap gap-4">
          <UiFormField v-slot="{ value, handleChange }" name="currentDate">
            <UiFormItem class="w-[49%]">
              <div class="flex justify-between">
                <UiLabel class="text-[14px] font-medium">Current Date</UiLabel>
                <UiFormControl>
                  <UiSwitch id="currentDate" :checked="value" @update:checked="(checked) => {
                    handleChange(checked);
                  }" :style="{ background: value ? '#FFBC42' : '#8A8A8A' }" />
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
                  }" :style="{ background: value ? '#FFBC42' : '#8A8A8A' }" />
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
                  }" :style="{ background: value ? '#FFBC42' : '#8A8A8A' }" />
                </UiFormControl>
                <UiFormMessage />
              </div>
            </UiFormItem>
          </UiFormField>

          <UiFormField v-slot="{ value, handleChange }" name="genderIdentification">
            <UiFormItem class="w-[49%]">
              <div class="flex justify-between">
                <UiLabel class="text-[14px] font-medium"> Gender Identification </UiLabel>
                <UiFormControl>
                  <UiSwitch id="genderIdentification" :checked="value" @update:checked="(checked) => {
                    handleChange(checked);
                  }" :style="{ background: value ? '#FFBC42' : '#8A8A8A' }" />
                </UiFormControl>
                <UiFormMessage />
              </div>
            </UiFormItem>
          </UiFormField>
        </div>
      </div>

      <div class="mb-4">
        <div>
          <FieldArray name="clientTools" v-slot="{ fields, push, remove }">
            <div v-if="values.clientFormControl">
              <fieldset v-for="(tool, toolIdx) in fields" :key="tool.key">
                <div class="border p-4 mb-4 space-y-6">
                  <h3 class="text-lg font-bold">Client Tool {{ toolIdx + 1 }}</h3>
                  <div class="flex gap-3">
                    <!-- Tool Name -->
                    <TextField :label="`Name`" :id="`tool_name_${toolIdx}`" :name="`clientTools[${toolIdx}].name`"
                      placeholder="Enter tool name" required />
                    <!-- Tool Endpoint -->
                    <TextField :label="`Endpoint`" :id="`tool_endpoint_${toolIdx}`"
                      :name="`clientTools[${toolIdx}].endpoint`" placeholder="Enter tool endpoint" required />
                  </div>

                  <!-- Tool Description -->
                  <TextField :label="`Description`" :id="`tool_description_${toolIdx}`"
                    :name="`clientTools[${toolIdx}].description`" :isTextarea="true"
                    placeholder="Enter tool description" required />


                  <UiFormField v-slot="{ handleChange, value }" :name="`clientTools[${toolIdx}].audio`">
                    <UiFormItem class="flex w-full flex-col items-start">
                      <UiLabel class="pb-2 text-lg font-medium">Audio</UiLabel>
                      <div>
                        <imageField :isLoading="isLoading" :name="`clientTools[${toolIdx}].audio`" @change="($event) => {
                          uploadAudioFile($event, toolIdx);
                        }
                        " :showFilename="false" :multiple="true" :accept="'audio/*'" />
                      </div>
                      <UiFormMessage />
                      <span class="text-xs text-gray-500">Upload audio files for the tool.</span>
                    </UiFormItem>
                  </UiFormField>

                  <div v-if="values.clientTools[toolIdx]?.name">
                    <div
                      v-for="(concludeFile, concludeFileIndex) in props.audioResponseData[values?.clientTools[toolIdx]?.name]"
                      class="grid gap-2">
                      <div class="flex gap-3">
                        <span>
                          {{
                            `${concludeFile?.audio}.wav`
                          }}
                        </span>
                        <span>
                          {{ concludeFile.transcription }}
                        </span>
                      </div>

                      <UiButton @click="
                        deleteFile(concludeFile, toolIdx, concludeFileIndex)
                        " size="icon" type="button" style="min-width: 80px !important">
                        remove
                      </UiButton>
                    </div>
                  </div>

                  <FieldArray :name="`clientTools.${toolIdx}.parameters.properties`"
                    v-slot="{ fields: paramFields, push: pushParam, remove: removeParam }">
                    <div v-if="values.propertieFormControl">
                      <div v-for="(param, paramIdx) in paramFields" :key="param.key" class="mt-4 pb-2">
                        <h4 class="font-semibold"> Parameter {{ paramIdx + 1 }} </h4>
                        <div
                          class="gap-2 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-3 mb-3">
                          <!-- Parameter Name -->
                          <TextField :label="`Parameter Name`" :id="`param_name_${toolIdx}_${paramIdx}`"
                            :name="`clientTools[${toolIdx}].parameters.properties[${paramIdx}].name`"
                            placeholder="Enter parameter name" required />

                          <!-- Parameter Type -->
                          <SelectField :label="`Type`" :id="`param_type_${toolIdx}_${paramIdx}`"
                            :name="`clientTools[${toolIdx}].parameters.properties[${paramIdx}].type`"
                            :options="parameterTypes" required />

                          <!-- Parameter Description -->
                          <TextField :label="`Description`" :id="`param_desc_${toolIdx}_${paramIdx}`"
                            :name="`clientTools[${toolIdx}].parameters.properties[${paramIdx}].description`"
                            :isTextarea="true" placeholder="Enter parameter description" required />
                          <div class="flex items-center justify-around w-full">
                            <UiFormField v-slot="{ value, handleChange }"
                              :name="`clientTools[${toolIdx}].parameters.properties[${paramIdx}].required`">
                              <UiFormItem class="w-[49%]">
                                <div class="flex justify-between">
                                  <UiLabel class="text-[14px] font-medium">Required</UiLabel>
                                  <UiFormControl>
                                    <UiSwitch :label="`Required`" :id="`param_required_${toolIdx}_${paramIdx}`"
                                      :checked="value" @update:checked="(checked) => {
                                        handleChange(checked);
                                      }" :style="{ background: value ? '#FFBC42' : '#8A8A8A' }" />
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
              <UiButton color="primary" class="mt-2" type="button" @click="() => {
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
        <UiButton color="primary" type="submit" size="lg" :loading="isLoading">
          Submit
        </UiButton>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { Icon, UiButton } from "#components";
import { useForm } from 'vee-validate';
import CloseIcon from "~/components/icons/CloseIcon.vue";
import * as z from 'zod';
import { FieldArray } from "vee-validate";
import { addToolschema } from "~/validationSchema/botManagement/voiceBot/addToolsValidation";

definePageMeta({
  middleware: "admin-only",
});

const isLoading = ref(false);
const formattedToolsConfig = ref(null);
const route = useRoute("voice-bot-id-tools");
const paramId: any = route;
const props = defineProps<{ botDetails: any; loading: boolean; audioResponseData: any; audioDataRefresh: () => void; refreshBot: () => void }>();

// const props.botDetails(await getVoiceBotDetails(route.params.id));
const config = useRuntimeConfig();
const formattedUploadAudioFile = ref({});
const deleteFileBucket = ref([]);

// Using an alias for audioResponseData
// const {
//   audioResponseData: integrationsData,
//   loading,
//   error,
//   audioDataRefresh
// } = usePrerecordedAudioMetadata(
//   route.params.id,
//   props.botDetails.organizationId
// );
// Fetch audio data
// const {
//   data: integrationsData,
//   status,
//   refresh: audioDataRefresh,
// } = await useLazyFetch(`${config.public.voiceBotBaseUrl}/prerecordedAudio/metaData`, {
//   server: false,
//   params: {
//     bot_id: route.params.id,
//     organization_id: props.botDetails.organizationId
//   },
//   default: () => [],
// });

// Update page title
watchEffect(() => {
  if (props.botDetails) {
    const userName = props.botDetails?.name ?? "Unknown Bot Name";
    useHead({
      title: `Voice Bot | ${userName} - Add Tools`,
    });
  }
});

// Watch props.botDetails.tools.clientTools
watch(() => props.botDetails?.tools.clientTools, () => {
  if (Array.isArray(props.botDetails?.tools.clientTools)) {
    formattedUploadAudioFile.value = {}; // Reset object
    props.botDetails.tools.clientTools.forEach((item) => {
      formattedUploadAudioFile.value[item.name] = item.audio; // Add key-value pairs
    });
  }
}, { immediate: true });

// Parameter types options
const parameterTypes = reactive([
  { label: 'String', value: 'string' },
  { label: 'Integer', value: 'integer' },
  { label: 'Boolean', value: 'boolean' },
  { label: 'Number', value: 'number' }
]);

// Form setup
const { handleSubmit, values, resetForm, errors, setFieldValue } = useForm({
  validationSchema: addToolschema,
  initialValues: {
    currentDate: true,
    concludeCall: true,
    forwardCall: false,
    genderIdentification: true,
    clientFormControl: false,
    propertieFormControl: false,
    clientTools: []
  }
});

// Set initial values
setFieldValue('currentDate', props.botDetails?.tools?.defaultTools?.includes('currentDate') ?? true);
setFieldValue('concludeCall', props.botDetails?.tools?.defaultTools?.includes('concludeCall') ?? true);
setFieldValue('forwardCall', props.botDetails?.tools?.defaultTools?.includes('forwardCall') ?? false);
setFieldValue('genderIdentification', props.botDetails?.tools?.defaultTools?.includes('genderIdentification') ?? true);
setFieldValue('clientTools', props.botDetails?.tools?.clientTools ?? []);
setFieldValue('clientFormControl', props.botDetails?.tools?.clientFormControl ?? false);
setFieldValue('propertieFormControl', props.botDetails?.tools?.propertieFormControl ?? false);

// Upload audio file handler
const uploadAudioFile = (event: Event, toolIdx: number) => {
  const files = event;
  if (!files || files.length === 0) return;
  let uploadedFiles: any = [];

  try {
    Array.from(files).forEach((file, index) => {
      uploadedFiles.push(file);
    });

    // Update the tool's audio field in `clientTools`
    setFieldValue(`clientTools[${toolIdx}].audio`, uploadedFiles);
  } catch (error) {
    console.error("Error uploading file:", error);
  }

  let formData = new FormData();
  if (props.botDetails.id) {
    formData.append("bot_id", props.botDetails.id);
  }
  if (props.botDetails.organizationId) {
    formData.append("organization_id", props.botDetails.organizationId);
  }
  formData.append("language", props.botDetails.speechToTextConfig?.language ?? "en-US");

  // Append intent
  if (values?.clientTools[toolIdx].name) {
    formData.append("intent", values?.clientTools[toolIdx].name);
  } else {
    toast.error("Client tools name is required");
    setFieldValue(`clientTools[${toolIdx}].audio`, []);
    return;
  }

  // Append files
  uploadedFiles.forEach((file: any) => {
    if (file instanceof File) {
      formData.append("files", file);
    }
  });

  audioUpload(formData, toolIdx);
};

// Audio upload handler
const audioUpload = async (formData: any, index: any) => {
  isLoading.value = true;
  if (props.botDetails.botDetails && props.botDetails.botDetails?.agentLanguage) {
    try {
      const response = await fetch(
        `${config.public.voiceBotBaseUrl}/prerecordedAudio`,
        {
          method: "POST",
          body: formData,
        },
      );
      formattedUploadAudioFile.value = await response.json();

      values.clientTools?.forEach((item: any, index: number) => {
        // Iterate through entries of formattedUploadAudioFile.value
        for (const [key, value] of Object.entries(formattedUploadAudioFile.value)) {
          if (item.name === key) {
            // Set the field value if the name matches the key
            setFieldValue(`clientTools[${index}].audio`, value);
          }
        }
      });

      if (Array.isArray(values.clientTools)) {
        formattedUploadAudioFile.value = {}; // Reset object
        values.clientTools.forEach((item: any) => {
          formattedUploadAudioFile.value[item.name] = item.audio; // Add key-value pairs
        });
      }

      audioDataRefresh();
      toast.success("Audio uploaded successfully. Please submit the form.");
    } catch (error) {
      isLoading.value = false;
      console.error("Error:", error);
    } finally {
      isLoading.value = false;
    }
  } else {
    isLoading.value = false;
    toast.error("Please Fill Bot Details.");
    await navigateTo({
      name: "voice-bot-id-identity-management",
      params: { id: paramId.params.id },
    });
  }
};

// Delete file handler
const deleteFile = (file: any, toolIdx: any, index: any) => {
  formattedUploadAudioFile.value[values.clientTools[toolIdx].name].splice(index, 1);

  values.clientTools?.forEach((item: any, index: number) => {
    for (const [key, value] of Object.entries(formattedUploadAudioFile.value)) {
      if (item.name === key) {
        // Set the field value if the name matches the key
        setFieldValue(`clientTools[${index}].audio`, value);
      }
    }
  });

  deleteFileBucket.value.push(file?.audio);
  if (deleteFileBucket.value.length) {
    audioDelete(values.clientTools[toolIdx].name, toolIdx, index);
  }
};

// Audio delete handler
const audioDelete = async (toolName: any, toolIdx: any, index: any) => {
  try {
    const formData = new FormData();
    deleteFileBucket.value.forEach((item) => {
      formData.append('files', item);
    });
    formData.append('bot_id', props.botDetails.id);
    formData.append('language', props.botDetails.speechToTextConfig?.language ?? "en-US");
    formData.append('organization_id', props.botDetails.organizationId);
    formData.append('intent', toolName);

    const deleteResponse = await fetch(`${config.public.voiceBotBaseUrl}/prerecordedAudio`, {
      method: "DELETE",
      body: formData,
    });
    const formattedResponse = await deleteResponse.json();

    if (Array.isArray(values.clientTools)) {
      formattedUploadAudioFile.value = {}; // Reset object
      values.clientTools.forEach((item: any) => {
        formattedUploadAudioFile.value[item.name] = item.audio; // Add key-value pairs
      });
    }

    audioDataRefresh();
    deleteFileBucket.value = [];
  } catch (error) {
    console.error("Error:", error);
  } finally {
    toast.success("Audio deleted successfully.");
  }
};

// Form submission handler
const dynamicToolsForm = handleSubmit(async (values: any) => {
  isLoading.value = true;

  const defaultTools = [];
  if (values.currentDate) defaultTools.push('currentDate');
  if (values.concludeCall) defaultTools.push('concludeCall');
  if (values.forwardCall) defaultTools.push('forwardCall');
  if (values.genderIdentification) defaultTools.push('genderIdentification');

  const payload = {
    tools: {
      defaultTools,
      clientFormControl: values.clientFormControl,
      propertieFormControl: values.propertieFormControl,
      clientTools: values.clientTools,
    }
  };

  await updateLLMConfig(payload, props.botDetails.id, "Tools added successfully.");
  if (typeof props.refreshBot === 'function') {
    props.refreshBot();
  } else {
    console.error("refresh function is not available", props.refreshBot);
  }
  isLoading.value = false;
});
</script>