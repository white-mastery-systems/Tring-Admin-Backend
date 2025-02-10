<template>
  <Page title="Pre Recorded Audio" :bread-crumbs="[
    {
      label: `${botDetails.name}`,
      to: `/bot-management/voice-bot/${botDetails.id}`,
    },
    {
      label: 'Pre Recorded Audio',
      to: `/bot-management/voice-bot/${botDetails.id}/pre-recorded-audio`,
    },
  ]" :disableSelector="true" :disable-back-button="false" :disableElevation="false">
    <div class="pb-2 sm:pb-0">
      <!-- {{ audioResponseData }} -->
      <form @submit="onSubmit" class="flex flex-col gap-2 space-y-2">
        <div class="flex grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-3">
          <!-- <TextField name="intent" label="Intent " required placeholder="Enter Intent " /> -->
          <SelectField name="intent" :options="intentList" label="Intent" placeholder="Select Intent"
            helperText="Select your intent." required></SelectField>
        </div>
        <!-- {{ values }} || sdfdsuyfg -->
        <div class="flex">
          <!-- sm:w-full md:w-[15%] lg:w-[15%] xl:w-[15%] -->
          <div v-if="values.intent === 'welcome'" class="w-full gap-3 pt-2">
            <div style="align-self: center">Welcome Audio</div>
            <div>
              <imageField :isLoading="isLoading" name="welcomeAudio" @change="($event) => {
                uploadFile($event, 'welcome', 'welcomeFile');
              }
                " :fileName="values.welcomeAudio" :showFilename="false" :multiple="true" :accept="'audio/*'" />
            </div>
            <!-- {{ welcomeFilesData }}
            {{ formattedUploadAudioFile }} -->
            <div v-for="(welcomeFile, welcomeFileIndex) in audioResponseData?.welcome">
              <div class="flex gap-3">
                <span>
                  {{ `${welcomeFile.audio}.wav` }}
                </span>
                <span>
                  {{ welcomeFile.transcription }}
                </span>
              </div>

              <UiButton type="button" size="icon" color="primary" style="min-width: 80px !important" @click="
                deleteFile(welcomeFile, audioResponseData?.welcome, welcomeFileIndex)
                ">
                remove
              </UiButton>
            </div>
          </div>
          <!-- sm:w-full md:w-[15%] lg:w-[15%] xl:w-[15%] -->
          <div v-if="values.intent === 'conclude'" class="w-full gap-3 pt-2">
            <div style="align-self: center">Conclude Audio</div>
            <div>
              <imageField :isLoading="isLoading" name="concludeAudio" @change="($event) => {
                uploadFile($event, 'conclude', 'concludeFile');
              }
                " :fileName="values.welcomeAudio" :showFilename="false" :multiple="true" :accept="'audio/*'" />
            </div>

            <div v-for="(concludeFile, concludeFileIndex) in audioResponseData?.conclude" class="grid gap-2">
              <div class="flex gap-3">
                <span>
                  {{
                    `${concludeFile.audio}.wav`
                  }}
                </span>
                <span>
                  {{ concludeFile.transcription }}
                </span>
              </div>

              <UiButton @click="
                deleteFile(concludeFile, audioResponseData?.conclude, concludeFileIndex)
                " size="icon" color="primary" type="button" style="min-width: 80px !important">
                remove
              </UiButton>
            </div>
          </div>
          <div v-if="values.intent === 'filler'" class="w-full gap-3 pt-2">
            <div style="align-self: center">Filler Audio</div>
            <div>
              <imageField :isLoading="isLoading" name="fillerAudio" @change="($event) => {
                uploadFile($event, 'filler', 'fillerFile');
              }
                " :fileName="values.fillerAudio" :showFilename="false" :multiple="true" :accept="'audio/*'" />
            </div>

            <div v-for="(fillerFile, fillerFileIndex) in audioResponseData?.filler" class="grid gap-2">
              <div class="flex gap-3">
                <span>
                  {{
                    `${fillerFile.audio}.wav`
                  }}
                </span>
                <span>
                  {{ fillerFile.transcription }}
                </span>
              </div>

              <UiButton @click="
                deleteFile(fillerFile, audioResponseData?.filler, fillerFileIndex)
                " size="icon" color="primary" type="button" style="min-width: 80px !important">
                remove
              </UiButton>
            </div>
          </div>
          <div v-if="values.intent === 'ambientNoise'" class="w-full gap-3 pt-2">
            <div>
              <div>
                <div style="align-self: center">Ambient Noise Audio</div>
                <div>
                  <imageField :isLoading="isLoading" name="ambientNoiseAudio" @change="($event) => {
                    uploadFile($event, 'ambientNoise', 'ambientNoiseFile');
                  }
                    " :fileName="values.ambientNoiseAudio" :showFilename="false" :multiple="true"
                    :accept="'audio/*'" />
                </div>
              </div>
            </div>
            <div v-for="(ambientNoiseFile, ambientNoiseFileIndex) in audioResponseData?.ambientNoise"
              class="gap-2 space-y-3">
              <div
                class="flex items-center gap-3 min-h-[90px] grid grid-cols-1 sm:grid-cols-1 md:grid-cols-4 lg:grid-cols-4  xl:grid-cols-4">
                <span>
                  {{
                    `${ambientNoiseFile.audio}.wav`
                  }}
                </span>
                <span v-if="ambientNoiseFile.transcription.trim() !== ''">
                  {{ ambientNoiseFile.transcription }}
                </span>
                <div class="flex flex-col w-full sm:w-full gap-2">
                  <RangeSlider :step="0.05" :name="parseFloat(ambientNoiseFile.volume)" label="Ambient Sound"
                    @update="updateAmbientSound(ambientNoiseFileIndex, $event)" required
                    placeholder="Enter ambient sound" :min="0" :max="1" />
                </div>

                <UiButton @click="
                  deleteFile(ambientNoiseFile, audioResponseData.ambientNoise, ambientNoiseFileIndex)
                  " size="icon" color="primary" type="button" style="min-width: 80px !important">
                  remove
                </UiButton>
              </div>

            </div>
          </div>
          <div v-if="values.intent === 'forwardCall'" class="w-full gap-3 pt-2">
            <div style="align-self: center">Forward Call Audio</div>
            <div>
              <imageField :isLoading="isLoading" name="forwardCallAudio" @change="($event) => {
                uploadFile($event, 'forwardCall', 'forwardCallFile');
              }
                " :fileName="values.forwardCallAudio" :showFilename="false" :multiple="true" :accept="'audio/*'" />
            </div>

            <div v-for="(forwardCallFile, forwardCallFileIndex) in audioResponseData?.forwardCall" class="grid gap-2">
              <div class="flex gap-3">
                <span>
                  {{
                    `${forwardCallFile.audio}.wav`
                  }}
                </span>
                <span>
                  {{ forwardCallFile.transcription }}
                </span>
              </div>

              <UiButton @click="
                deleteFile(forwardCallFile, audioResponseData?.forwardCall, forwardCallFileIndex)
                " size="icon" color="primary" type="button" style="min-width: 80px !important">
                remove
              </UiButton>
            </div>
          </div>
        </div>
        <div class="flex w-full justify-end">
          <UiButton type="submit" class="w-[120px] self-end bg-[#424bd1] hover:bg-[#424bd1] hover:brightness-110"
            size="lg" :loading="isLoading">
            Submit
          </UiButton>
        </div>
      </form>
    </div>
  </Page>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "admin-only",
});
const route = useRoute("bot-management-voice-bot-id-identity-management");
const paramId: any = route;
const botDetails: any = await getVoiceBotDetails(route.params.id);
const welcomeFilesData = ref([]);
const concludeFilesData = ref([]);
const fillerFilesData = ref([]);
const ambientNoiseFilesData = ref([]);
const forwardCallFilesData = ref([]);
const deleteFileBucket = ref([]);
const intentList = ref([
  {
    label: "Ambient Sound",
    value: "ambientNoise",
  }, {
    label: "Forward Call",
    value: "forwardCall",
  }, {
    label: "Welcome",
    value: "welcome",
  }, {
    label: "Conclude",
    value: "conclude",
  }, {
    label: "Filler",
    value: "filler",
  },
])
const isLoading = ref(false);
const config = useRuntimeConfig()


const {
  data: audioResponseData,
  status,
  refresh: audioDataRefresh,
} = await useLazyFetch(`${config.public.voiceBotBaseUrl}/prerecordedAudio/metaData`, {
  server: false,
  params: {
    bot_id: route.params.id,
    organization_id: botDetails.organizationId
  },
  default: () => [],
});
const botSchema = toTypedSchema(
  z.object({
    intent: z.string({ required_error: "Intent is required" }).min(1, "Intent is required"),
    welcomeAudio: z.any().optional(),
    concludeAudio: z.any().optional(),
    fillerAudio: z.any().optional(),
    ambientNoiseAudio: z.any().optional(),
    forwardCallAudio: z.any().optional(),
  })
    .superRefine((data, ctx) => {
      // Conditional validation for 'welcome' intent
      if (
        data.intent === "welcome" &&
        (!data.welcomeAudio && (!audioResponseData.value?.welcome || !audioResponseData.value?.welcome.length))
      ) {
        ctx.addIssue({
          path: ["welcomeAudio"],
          message: "Welcome file is required for the 'welcome' intent.",
        });
      }

      // Conditional validation for 'conclude' intent
      if (
        data.intent === "conclude" &&
        (!data.concludeAudio && (!audioResponseData.value?.conclude || !audioResponseData.value?.conclude.length))
      ) {
        ctx.addIssue({
          path: ["concludeAudio"],
          message: "Conclude file is required for the 'conclude' intent.",
        });
      }
      if (
        data.intent === "filler" &&
        (!data.fillerAudio && (!audioResponseData.value?.filler || !audioResponseData.value?.filler.length))
      ) {
        ctx.addIssue({
          path: ["fillerAudio"],
          message: "Filler audio file is required for the 'filler' intent.",
        });
      }
      if (
        data.intent === "ambientNoise" &&
        ((!data.ambientNoiseAudio) && (!audioResponseData.value?.ambientNoise || !audioResponseData.value.ambientNoise.length))
      ) {
        ctx.addIssue({
          path: ["ambientNoiseAudio"],
          message: "Ambient noise audio file is required for the 'ambientNoise' intent.",
        });
      }
      if (
        data.intent === "forwardCall" &&
        (!data.forwardCallAudio && (!audioResponseData.value?.forwardCall || !audioResponseData.value?.forwardCall.length))
      ) {
        ctx.addIssue({
          path: ["forwardCallAudio"],
          message: "Forward call audio file is required for the 'forwardCall' intent.",
        });
      }
    })
);

const {
  setFieldValue,
  handleSubmit,
  errors,
  defineField,
  resetForm,
  values,
} = useForm({
  validationSchema: botSchema,
  initialValues: {
    // name: "",
  },
});

if (botDetails?.intent) setFieldValue("intent", botDetails?.intent)
else {
  setFieldValue("intent", 'welcome')
}
watchEffect(async () => {
  if (botDetails) {
    const userName = botDetails?.name ?? "Unknown Bot Name";
    useHead({
      title: `Voice Bot | ${userName} - Identity Management`,
    });
    // await handleApiResponse(botDetails)
  }
});

const welcomeString = ref("");
const concludeString = ref("");
const fillerString = ref("");
const ambientNoiseString = ref("");
const forwardCallString = ref("");

const uploadFile = (
  files: any,
  type = "welcome",
  fieldName = "welcomeFile",
) => {
  try {
    let newFiles: any = [];
    Array.from(files).forEach((file: any, fileIndex: any) => {
      newFiles.push(file);
      if (fieldName === "welcomeFile") {
        welcomeFilesData.value.push(file);
      } else if (fieldName === "concludeFile") {
        concludeFilesData.value.push(file);
      } else if (fieldName === "fillerFile") {
        fillerFilesData.value.push(file);
      } else if (fieldName === "ambientNoiseFile") {
        ambientNoiseFilesData.value.push(file);
      } else if (fieldName === "forwardCallFile") {
        forwardCallFilesData.value.push(file);
      }
    });

    let fileNames = newFiles?.map((file) => file.name).join(",");
    if (fieldName === "welcomeFile") {
      welcomeString.value +=
        welcomeString.value.length > 0 ? "," + fileNames : fileNames;
      setFieldValue('welcomeAudio', welcomeString.value);
    } else if (fieldName === "concludeFile") {
      concludeString.value +=
        concludeString.value.length > 0 ? "," + fileNames : fileNames;
      setFieldValue('concludeAudio', concludeString.value);
    } else if (fieldName === "fillerFile") {
      fillerString.value +=
        fillerString.value.length > 0 ? "," + fileNames : fileNames;
      setFieldValue('fillerAudio', fillerString.value);
    } else if (fieldName === "ambientNoiseFile") {
      ambientNoiseString.value +=
        ambientNoiseString.value.length > 0 ? "," + fileNames : fileNames;
      setFieldValue('ambientNoiseAudio', ambientNoiseString.value);
    } else {
      forwardCallString.value +=
        forwardCallString.value.length > 0 ? "," + fileNames : fileNames;
      setFieldValue('forwardCallAudio', forwardCallString.value);
    }

  } catch (error) {
    console.log(error);
  }
  let formData = new FormData();
  if (botDetails.id) {
    formData.append("bot_id", botDetails.id);
  }
  if (botDetails.organizationId) {
    formData.append("organization_id", botDetails.organizationId);
  }
  // if (botDetails.speechToTextConfig?.language) {
  formData.append("language", botDetails.botDetails?.agentLanguage ?? "");
  // }


  // Append intent
  if (values.intent) {
    formData.append("intent", values.intent);
  }
  // Append files from welcome and conclude data
  [...welcomeFilesData.value, ...concludeFilesData.value, ...fillerFilesData.value, ...ambientNoiseFilesData.value, ...forwardCallFilesData.value].forEach((file: any) => {
    if (file instanceof File) {
      formData.append("files", file);
    }
  });

  audioUpload(formData, type)
};

const deleteFile = async (data, files, index) => {
  files.splice(index, 1);
  if (data?.audio) {
    deleteFileBucket.value.push(data?.audio);
    await audioDelete(botDetails)
    await audioDataRefresh()
  }
};

const audioUpload = async (formData: any) => {
  isLoading.value = true;
  if (botDetails.botDetails && botDetails.botDetails?.agentLanguage) {
    try {
      await fetch(
        `${config.public.voiceBotBaseUrl}/prerecordedAudio/`,
        {
          method: "POST",
          body: formData,
          // redirect: "manual",
        },
      );
      audioDataRefresh()
      toast.success("Audio uploaded successfully. Please submit the form.")
      // return response;
    } catch (error) {
      isLoading.value = false;
    } finally {
      isLoading.value = false;
      concludeFilesData.value = []
      welcomeFilesData.value = []
      fillerFilesData.value = []
      ambientNoiseFilesData.value = []
      forwardCallFilesData.value = []
    }
  } else {
    isLoading.value = false
    toast.error("Please Fill Bot Details.");
    await navigateTo({
      name: "bot-management-voice-bot-id-identity-management",
      params: { id: paramId.params.id },
    });
    // return
  }
};
const ambientNoiseAudioUpload = async () => {
  // Ensure we're not modifying the original array directly if not needed
  const modifiedFilesData = audioResponseData.value?.ambientNoise?.map((item: any) => {
    return {
      filename: `${item.audio}.wav`,
      volume: item.volume,
    }
  });

  const payload = {
    items: modifiedFilesData,
    botId: botDetails.id,
    organizationId: botDetails.organizationId,
  };

  try {
    await $fetch(
      `${config.public.voiceBotBaseUrl}/prerecordedAudio/`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json", // Ensure the content is JSON
        },
        body: payload,
      }
    );
    toast.success("Audio uploaded successfully");
  } catch (error) {
    isLoading.value = false;
    console.error("Error:", error);
  } finally {
    isLoading.value = false;
  }
};

const audioDelete = async (data: any) => {
  try {
    const formData = new FormData();
    deleteFileBucket.value.forEach((item) => {
      formData.append('files', item);
    })
    formData.append('bot_id', data.id);
    formData.append('language', data.speechToTextConfig?.language ?? "en-US");
    formData.append('organization_id', data.organizationId);
    formData.append('intent', values.intent);


    await fetch(`${config.public.voiceBotBaseUrl}/prerecordedAudio/`, {
      method: "DELETE",
      body: formData,
    });
  } catch (error) {
    console.error("Error:", error);
  } finally {
    toast.success("Audio deleted successfully. Please submit the form.");
  }
};

const updateAmbientSound = (index, newVolume) => {
  if (audioResponseData.value?.ambientNoise?.length) {
    audioResponseData.value.ambientNoise[index].volume = newVolume
  }
  if (index >= 0 && index < ambientNoiseFilesData.value.length) {
    ambientNoiseFilesData.value[index].volume = newVolume;
  } else {
    console.error("Invalid index for ambient noise file");
  }
};



const onSubmit = handleSubmit(async (value: any) => {
  // updateLLMConfig()
  isLoading.value = true;
  await ambientNoiseAudioUpload()
  let payload = {
    intent: values.intent,
  }
  await updateLLMConfig(payload, botDetails.id, "Pre-recorded audio files updated successfully.");
  isLoading.value = false;

  return navigateTo({
    name: "bot-management-voice-bot-id",
    params: { id: botDetails.id },
  });
});
</script>
