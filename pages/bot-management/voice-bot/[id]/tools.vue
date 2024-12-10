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
      <!-- {{ values.clientTools?.length }} -->
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
                        <!-- <input type="file" accept="audio/*" multiple
                          @change="($event) => uploadAudioFile($event, toolIdx)" /> -->
                      </div>
                      <UiFormMessage />
                      <span class="text-xs text-gray-500">Upload audio files for the tool.</span>
                    </UiFormItem>
                  </UiFormField>
                  <div v-if="values.clientTools[toolIdx]?.name">
                    <div
                      v-for="(concludeFile, concludeFileIndex) in formattedUploadAudioFile[values?.clientTools[toolIdx]?.name]"
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
                        " size="icon" color="primary" type="button" style="min-width: 80px !important">
                        remove
                      </UiButton>
                    </div>
                  </div>
                  <!-- {{ clientTools[toolIdx].name }} || working.... -->
                  <!-- Parameters -->
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
                            <!-- <UiSwitch :label="`Required`" :id="`param_required_${toolIdx}_${paramIdx}`"
                              :name="`clientTools[${toolIdx}].parameters.properties[${paramIdx}].required`" /> -->
                            <UiFormField v-slot="{ value, handleChange }"
                              :name="`clientTools[${toolIdx}].parameters.properties[${paramIdx}].required`">
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
                      <UiButton v-if="values.clientFormControl" color="primary" type="button" @click="() => {
                        if (!values.propertieFormControl) {
                          setFieldValue('propertieFormControl', true)
                          // return
                        }
                        pushParam({ name: '', type: 'string', required: true })
                      }">
                        Add Parameter
                      </UiButton>
                      <UiButton color="primary" type="button" @click="remove(toolIdx)">
                        Remove Client Tool
                      </UiButton>
                    </div>
                  </FieldArray>

                  <!-- Remove Client Tool -->
                  <!-- <div class="flex w-full justify-end gap-2">
                    <UiButton color="primary" class="mt-4 ml-4" type="button" @click="remove(toolIdx)">
                      Remove Client Tool
                    </UiButton>
                  </div> -->
                </div>
              </fieldset>
            </div>

            <!-- Add Client Tool Button -->
            <div class="flex w-full justify-end gap-2">
              <UiButton class="mt-2" color="primary" type="button" @click="() => {
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
  </Page>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate';
import CloseIcon from "~/components/icons/CloseIcon.vue";
import * as z from 'zod';
import { FieldArray } from "vee-validate";
import { objectEntries } from '@vueuse/core';

definePageMeta({
  middleware: "admin-only",
});

const isLoading = ref(false);
const formattedToolsConfig = ref(null);
const route = useRoute("bot-management-voice-bot-id-tools");
const botDetailsList: any = await getVoiceBotDetails(route.params.id);
const config = useRuntimeConfig()
const formattedUploadAudioFile = ref({})
// const uploadedAudio = ref();
const deleteFileBucket = ref([]);

watch(botDetailsList.value, () => {
  if (botDetailsList.value) {
    setFieldValue('clientTools', botDetailsList.value.tools.clientTools);
  }
}, { deep: true, immediate: true })

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
    clientFormControl: z.boolean(),
    propertieFormControl: z.boolean(),
    clientTools: z.array(
      z.object({
        name: z.string().optional(),
        description: z.string().optional(),
        endpoint: z.string().optional(),
        audio: z.any().optional(),
        parameters: z.object({
          type: z.literal("object"),
          properties: z.array(
            z.object({
              name: z.string().optional(),
              type: z.enum(["string", "integer", "boolean", "number"]),
              description: z.string().optional(),
              required: z.boolean()
            })
          ),
        })
      })
    )
  })
    .superRefine((data, ctx) => {
      console.log(data, "data");
      if (data.clientFormControl) {
        data.clientTools.forEach((clientTool, index) => {
          // Validate each clientTool
          if (!clientTool.name) {
            ctx.addIssue({
              path: ["clientTools", index, "name"],
              message: "Client tool name is required",
            });
          }
          if (!clientTool.description) {
            ctx.addIssue({
              path: ["clientTools", index, "description"],
              message: "Client tool description is required",
            });
          }
          if (!clientTool.endpoint) {
            ctx.addIssue({
              path: ["clientTools", index, "endpoint"],
              message: "Client tool endpoint is required",
            });
          } else {
            try {
              new URL(clientTool.endpoint); // Validate URL format
            } catch {
              ctx.addIssue({
                path: ["clientTools", index, "endpoint"],
                message: "Invalid URL format",
              });
            }
          }

          // Check if properties exist in parameters and validate them
          if (data.propertieFormControl) {
            clientTool.parameters?.properties.forEach((property, propIndex) => {
              if (!property.name?.trim()) {
                ctx.addIssue({
                  path: [
                    "clientTools",
                    index,
                    "parameters",
                    "properties",
                    propIndex,
                    "name",
                  ],
                  message: "Parameter name is required",
                });
              }
              if (!property.description?.trim()) {
                ctx.addIssue({
                  path: [
                    "clientTools",
                    index,
                    "parameters",
                    "properties",
                    propIndex,
                    "description",
                  ],
                  message: "Parameter description is required",
                });
              }
            });

            // If no properties exist, add a validation issue for the missing properties
            // if (!clientTool.parameters?.properties.length) {
            //   ctx.addIssue({
            //     path: ["clientTools", index, "parameters", "properties"],
            //     message: "At least one parameter property is required",
            //   });
            // }
          }
        });
      }
    }))

const { handleSubmit, values, resetForm, errors, setFieldValue } = useForm({
  validationSchema: formSchema,
  initialValues: {
    currentDate: true,
    concludeCall: true,
    forwardCall: false,
    clientFormControl: false,
    propertieFormControl: false,
    clientTools: [
      //   {
      //   name: "",
      //   description: "",
      //   endpoint: "",
      //   parameters: {
      //     type: "object",
      //     properties: [

      //     ],
      //   }
      // }
    ]
  }
});

// setFieldValue(`clientTools[0].parameters.properties[0].required`, true)
setFieldValue('currentDate', botDetailsList?.tools?.defaultTools?.includes('currentDate') ?? true)
setFieldValue('concludeCall', botDetailsList?.tools?.defaultTools?.includes('concludeCall') ?? true)
setFieldValue('forwardCall', botDetailsList?.tools?.defaultTools?.includes('forwardCall') ?? false)
setFieldValue('clientTools', botDetailsList?.tools?.clientTools ?? [])
setFieldValue(`clientFormControl`, botDetailsList?.tools?.clientFormControl ?? false)
setFieldValue(`propertieFormControl`, botDetailsList?.tools?.propertieFormControl ?? false)
// setFieldValue(`clientTools[0].parameters.properties[0].required`, true)


watch(errors, (newValues) => {
  console.log(newValues)
})
watch(() => botDetailsList?.tools.clientFormControl, () => {
  // responseHandle()
  if (Array.isArray(botDetailsList?.tools.clientTools)) {
    formattedUploadAudioFile.value = {}; // Reset object
    botDetailsList.tools.clientTools.forEach((item: any) => {
      formattedUploadAudioFile.value[item.name] = item.audio; // Add key-value pairs
    })
  }
}, { immediate: true })


const uploadAudioFile = (event: Event, toolIdx: number) => {
  const files = event;
  if (!files || files.length === 0) return;
  let uploadedFiles: any = [];
  // let lastFileIndex = getLastFileNumber()
  try {
    Array.from(files).forEach((file, index) => {
      let fileType = file.type.split("/").pop();
      let fileName = file.name
      // let fileName = `tool_${toolIdx}_audio_${index + 1 + lastFileIndex}.${fileType}`;
      let blob = file.slice(0, file.size, file.type);
      let newFile = new File([blob], fileName, { type: file.type });

      uploadedFiles.push(newFile);
    });

    // Update the tool's audio field in `clientTools`
    setFieldValue(`clientTools[${toolIdx}].audio`, uploadedFiles);
  } catch (error) {
    console.error("Error uploading file:", error);
  }


  let formData = new FormData();
  if (botDetailsList.id) {
    formData.append("bot_id", botDetailsList.id);
  }
  if (botDetailsList.organizationId) {
    formData.append("organization_id", botDetailsList.organizationId);
  }
  // if (botDetails.speechToTextConfig?.language) {
  formData.append("language", botDetailsList.speechToTextConfig?.language ?? "en-US");
  // }


  // Append intent
  if (values?.clientTools[toolIdx].name) {
    formData.append("intent", values?.clientTools[toolIdx].name);
  } else {
    toast.error("Client tools name is required");
    // values.clientTools[toolIdx].audio
    setFieldValue(`clientTools[${toolIdx}].audio`, []);
    return
  }
  // Append files from welcome and conclude data
  uploadedFiles.forEach((file: any) => {
    if (file instanceof File) {
      formData.append("files", file);
    }
  });

  audioUpload(formData, toolIdx)
};


const audioUpload = async (formData: any, index: any) => {
  // formattedUploadAudioFile.value.welcome = [];
  // formattedUploadAudioFile.value.conclude = [];
  // formattedUploadAudioFile.value.filler = [];
  isLoading.value = true;
  try {
    const response = await fetch(
      `${config.public.voiceBotUrl}/prerecordedAudio/`,
      {
        method: "POST",
        body: formData,
        // redirect: "manual",
      },
    );
    formattedUploadAudioFile.value = await response.json()
    values.clientTools?.forEach((item: any, index: number) => {
      // Log the formatted upload audio file for the current item's name

      // Iterate through entries of formattedUploadAudioFile.value
      for (const [key, value] of Object.entries(formattedUploadAudioFile.value)) {
        if (item.name === key) {
          console.log(value, "value -- value");
          // Set the field value if the name matches the key
          setFieldValue(`clientTools[${index}].audio`, value);
        }
      }
    });

    if (Array.isArray(values.clientTools)) {
      formattedUploadAudioFile.value = {}; // Reset object
      values.clientTools.forEach((item: any) => {
        formattedUploadAudioFile.value[item.name] = item.audio; // Add key-value pairs
      })
    }
    // uploadedAudio.value = {
    //   Audios: {
    //     audio: formattedUploadAudioFile.value,
    //   }
    // }
  } catch (error) {
    isLoading.value = false;
    console.error("Error:", error);
  } finally {
    isLoading.value = false;
    console.log("finally");
    // concludeFilesData.value = []
    // welcomeFilesData.value = []
    // fillerFilesData.value = []
  }
};

const deleteFile = (file: any, toolIdx: any, index: any) => {
  formattedUploadAudioFile.value[values.clientTools[toolIdx].name].splice(index, 1)
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
    audioDelete(values.clientTools[toolIdx].name);
  }
}

const audioDelete = async (toolName: any) => {
  try {
    const formData = new FormData();

    deleteFileBucket.value.forEach((item) => {
      formData.append('files', item);
    })
    formData.append('bot_id', botDetailsList.id);
    formData.append('language', botDetailsList.speechToTextConfig?.language ?? "en-US");
    formData.append('organization_id', botDetailsList.organizationId);
    formData.append('intent', toolName);


    const deleteResponse = await fetch(`${config.public.voiceBotUrl}/prerecordedAudio/`, {
      method: "DELETE",
      body: formData,
    });
    const formattedResponse = await deleteResponse.json()
    if (Array.isArray(values.clientTools)) {
      formattedUploadAudioFile.value = {}; // Reset object
      values.clientTools.forEach((item: any) => {
        formattedUploadAudioFile.value[item.name] = item.audio; // Add key-value pairs
      })
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    toast.success("Audio deleted successfully.")
  }
};

// const getLastFileNumber = (maxNumber = 10000): number => {
//   const files: { name: string }[] = []; // Replace with your actual list of files

//   // Extract existing numbers from file names
//   const usedNumbers = new Set(
//     files.map((file) => {
//       const match = file.name.match(/\d+/); // Extract digits from the file name
//       return match ? parseInt(match[0], 10) : 0;
//     })
//   );

//   let randomNumber: number;
//   let attempts = 0;

//   // Generate a random number not already in use
//   do {
//     randomNumber = Math.floor(Math.random() * maxNumber) + 1; // Random number between 1 and maxNumber
//     attempts++;
//     if (attempts > maxNumber) throw new Error("Failed to generate a unique number");
//   } while (usedNumbers.has(randomNumber));

//   return randomNumber;
// };



const dynamicToolsForm = handleSubmit(async (values: any) => {
  isLoading.value = true;
  isLoading.value = false;
  const defaultTools = [];
  if (values.currentDate) defaultTools.push('currentDate');
  if (values.concludeCall) defaultTools.push('concludeCall');
  if (values.forwardCall) defaultTools.push('forwardCall');


  const payload = {
    tools: {
      defaultTools,
      clientFormControl: values.clientFormControl,
      propertieFormControl: values.propertieFormControl,
      clientTools: values.clientTools,
    }
  };


  await updateLLMConfig(payload, botDetailsList.id, "Tools added successfully.")
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
