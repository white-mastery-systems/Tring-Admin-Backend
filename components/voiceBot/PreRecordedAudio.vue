<template>
  <div class="pb-7">
    <div class="my-5 flex items-center justify-between">
      <div class="text-xs sm:text-xs md:text-sm lg:text-lg font-bold">Pre Recorded Audio</div>
    </div>

    <form @submit="onSubmit" class="flex flex-col gap-2 space-y-2">
      <div class="flex grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-3">
        <SelectField name="intent" :options="intentList" label="Intent" placeholder="Select Intent"></SelectField>
      </div>

      <div class="flex">
        <div v-if="values.intent === 'welcome'" class="w-full gap-3 pt-2">
          <div style="align-self: center" class="text-xs sm:text-xs md:text-sm mb-2">Welcome Audio</div>
          <div>
            <imageField :isLoading="isLoading" name="welcomeAudio" @change="($event) => {
              uploadFile($event, 'welcome', 'welcomeFile');
            }" :fileName="values.welcomeAudio" :showFilename="false" :multiple="true" :accept="'audio/*'" />
          </div>

          <div v-for="(welcomeFile, welcomeFileIndex) in audioResponseData?.welcome">
            <div class="flex gap-3">
              <span>{{ `${welcomeFile.audio}.wav` }}</span>
              <span>{{ welcomeFile.transcription }}</span>
            </div>

            <UiButton type="button" size="icon" color="primary" style="min-width: 80px !important" @click="
              deleteFile(welcomeFile, audioResponseData?.welcome, welcomeFileIndex)">
              remove
            </UiButton>
          </div>
        </div>

        <div v-if="values.intent === 'conclude'" class="w-full gap-3 pt-2">
          <div style="align-self: center">Conclude Audio</div>
          <div>
            <imageField :isLoading="isLoading" name="concludeAudio" @change="($event) => {
              uploadFile($event, 'conclude', 'concludeFile');
            }" :fileName="values.welcomeAudio" :showFilename="false" :multiple="true" :accept="'audio/*'" />
          </div>

          <div v-for="(concludeFile, concludeFileIndex) in audioResponseData?.conclude" class="grid gap-2">
            <div class="flex gap-3">
              <span>{{ `${concludeFile.audio}.wav` }}</span>
              <span>{{ concludeFile.transcription }}</span>
            </div>

            <UiButton @click="
              deleteFile(concludeFile, audioResponseData?.conclude, concludeFileIndex)
              " size="icon" color="primary" type="button" style="min-width: 80px !important">
              remove
            </UiButton>
          </div>
        </div>

        <div v-if="values.intent === 'filler'" class="w-full gap-3 pt-2">
          <div style="align-self: center" class="mb-2">Filler Audio</div>
          <div>
            <imageField :isLoading="isLoading" name="fillerAudio" @change="($event) => {
              uploadFile($event, 'filler', 'fillerFile');
            }" :fileName="values.fillerAudio" :showFilename="false" :multiple="true" :accept="'audio/*'" />
          </div>

          <div v-for="(fillerFile, fillerFileIndex) in audioResponseData?.filler" class="grid gap-2">
            <div class="flex gap-3">
              <span>{{ `${fillerFile.audio}.wav` }}</span>
              <span>{{ fillerFile.transcription }}</span>
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
              <div style="align-self: center" class="mb-2">Ambient Noise Audio</div>
              <div>
                <imageField :isLoading="isLoading" name="ambientNoiseAudio" @change="($event) => {
                  uploadFile($event, 'ambientNoise', 'ambientNoiseFile');
                }" :fileName="values.ambientNoiseAudio" :showFilename="false" :multiple="true" :accept="'audio/*'" />
              </div>
            </div>
          </div>
          <div v-for="(ambientNoiseFile, ambientNoiseFileIndex) in audioResponseData?.ambientNoise"
            class="gap-2 space-y-3">
            <div
              class="flex items-center gap-3 min-h-[90px] grid grid-cols-1 sm:grid-cols-1 md:grid-cols-4 lg:grid-cols-4  xl:grid-cols-4">
              <span>{{ `${ambientNoiseFile.audio}.wav` }}</span>
              <span v-if="ambientNoiseFile.transcription.trim() !== ''">
                {{ ambientNoiseFile.transcription }}
              </span>
              <div class="flex flex-col w-full sm:w-full gap-2">
                <RangeSlider :step="0.05" :name="parseFloat(ambientNoiseFile.volume)" label="Ambient Sound"
                  @update="updateAmbientSound(ambientNoiseFileIndex, $event)" required placeholder="Enter ambient sound"
                  :min="0" :max="1" />
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
            }" :fileName="values.forwardCallAudio" :showFilename="false" :multiple="true" :accept="'audio/*'" />
          </div>

          <div v-for="(forwardCallFile, forwardCallFileIndex) in audioResponseData?.forwardCall" class="grid gap-2">
            <div class="flex gap-3">
              <span>{{ `${forwardCallFile.audio}.wav` }}</span>
              <span>{{ forwardCallFile.transcription }}</span>
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
        <UiButton color="primary" type="submit" class="w-[120px] self-end" size="lg" :loading="isLoading"
          :disabled="!formHasChanged">
          {{ formHasChanged ? 'Submit' : 'No Changes' }}
        </UiButton>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { UiButton } from "#components";
import { useRoute } from "vue-router";
definePageMeta({
  middleware: "admin-only",
});
const config = useRuntimeConfig();
// Bot details and breadcrumbs
const props = defineProps<{ botDetails: any; loading: boolean; audioResponseData: any; audioDataRefresh: () => void; refreshBot: () => void }>();

// State variables
const welcomeFilesData = ref([]);
const concludeFilesData = ref([]);
const fillerFilesData = ref([]);
const ambientNoiseFilesData = ref([]);
const forwardCallFilesData = ref([]);
const deleteFileBucket = ref([]);
const isLoading = ref(false);
const originalValues = ref({
  intent: '',
  welcomeAudio: '',
  concludeAudio: '',
  fillerAudio: '',
  ambientNoiseAudio: '',
  forwardCallAudio: '',
  ambientNoiseFiles: []
});

const intentList = ref([
  {
    label: "Ambient Sound",
    value: "ambientNoise",
  }, {
    label: "Welcome",
    value: "welcome",
  }, {
    label: "Filler",
    value: "filler",
  },
]);

// Form validation schema
const botSchema = toTypedSchema(
  z.object({
    intent: z.string({ required_error: "Intent is required" }).min(1, "Intent is required"),
    welcomeAudio: z.any().optional(),
    fillerAudio: z.any().optional(),
    ambientNoiseAudio: z.any().optional(),
  })
);

// Form setup
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

// Set initial intent value
if (props.botDetails?.intent) setFieldValue("intent", props.botDetails?.intent)
else {
  setFieldValue("intent", 'welcome')
}

// Update page title
watchEffect(async () => {
  if (props.botDetails) {
    const userName = props.botDetails?.name ?? "Unknown Bot Name";
    useHead({
      title: `Voice Bot | ${userName} - Pre Recorded Audio`,
    });
  }
});

// File name tracking
const welcomeString = ref("");
const concludeString = ref("");
const fillerString = ref("");
const ambientNoiseString = ref("");
const forwardCallString = ref("");

// Watch for bot details and audio response data to set initial values
watch(() => props.botDetails, (newBotDetails) => {
  if (newBotDetails) {
    // Set initial intent
    const initialIntent = newBotDetails?.intent || 'welcome';
    setFieldValue("intent", initialIntent);
  }
}, { immediate: true });

// Watch for audio response data to capture initial state
watch(() => props.audioResponseData, (newAudioData) => {
  if (newAudioData) {
    nextTick(() => {
      originalValues.value = {
        intent: values.intent || 'welcome',
        welcomeAudio: values.welcomeAudio || '',
        concludeAudio: values.concludeAudio || '',
        fillerAudio: values.fillerAudio || '',
        ambientNoiseAudio: values.ambientNoiseAudio || '',
        forwardCallAudio: values.forwardCallAudio || '',
        ambientNoiseFiles: newAudioData.ambientNoise?.map(file => ({
          audio: file.audio,
          volume: file.volume,
          transcription: file.transcription
        })) || []
      };
    });
  }
}, { immediate: true, deep: true });

// File upload handler
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
  if (props.botDetails.id) {
    formData.append("bot_id", props.botDetails.id);
  }
  if (props.botDetails.organizationId) {
    formData.append("organization_id", props.botDetails.organizationId);
  }
  formData.append("language", props.botDetails.botDetails?.agentLanguage ?? "");

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

  audioUpload(formData, type);
};

// Delete file handler
const deleteFile = async (data, files, index) => {
  files.splice(index, 1);
  if (data?.audio) {
    deleteFileBucket.value.push(data?.audio);
    await audioDelete(props.botDetails);
    await props.audioDataRefresh();
  }
};

// Audio upload handler
const audioUpload = async (formData: any) => {
  isLoading.value = true;
  if (props.botDetails.botDetails && props.botDetails.botDetails?.agentLanguage) {
    try {
      await fetch(
        `${config.public.voiceBotBaseUrl}/prerecordedAudio`,
        {
          method: "POST",
          body: formData,
        },
      );
      await props.audioDataRefresh();
      toast.success("Audio uploaded successfully. Please submit the form.");
    } catch (error) {
      isLoading.value = false;
    } finally {
      isLoading.value = false;
      concludeFilesData.value = [];
      welcomeFilesData.value = [];
      fillerFilesData.value = [];
      ambientNoiseFilesData.value = [];
      forwardCallFilesData.value = [];
    }
  } else {
    isLoading.value = false;
    toast.error("Please Fill Bot Details.");
  }
};

// Ambient noise audio upload
const ambientNoiseAudioUpload = async () => {
  // Ensure we're not modifying the original array directly if not needed
  const modifiedFilesData = props.audioResponseData?.ambientNoise?.map((item: any) => {
    return {
      filename: `${item.audio}.wav`,
      volume: item.volume,
    };
  });

  const payload = {
    items: modifiedFilesData,
    botId: props.botDetails.id,
    organizationId: props.botDetails.organizationId,
  };

  try {
    await $fetch(
      `${config.public.voiceBotBaseUrl}/prerecordedAudio`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
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

// Audio delete handler
const audioDelete = async (data: any) => {
  try {
    const formData = new FormData();
    deleteFileBucket.value.forEach((item) => {
      formData.append('files', item);
    });
    formData.append('bot_id', data.id);
    formData.append('language', data.speechToTextConfig?.language ?? "en-US");
    formData.append('organization_id', data.organizationId);
    formData.append('intent', values.intent);

    await fetch(`${config.public.voiceBotBaseUrl}/prerecordedAudio`, {
      method: "DELETE",
      body: formData,
    });
  } catch (error) {
    console.error("Error:", error);
  } finally {
    toast.success("Audio deleted successfully. Please submit the form.");
  }
};

// Update ambient sound volume
const updateAmbientSound = (index, newVolume) => {
  if (props.audioResponseData?.ambientNoise?.length) {
    props.audioResponseData.ambientNoise[index].volume = newVolume;
  }
  if (index >= 0 && index < ambientNoiseFilesData.value.length) {
    ambientNoiseFilesData.value[index].volume = newVolume;
  } else {
    console.error("Invalid index for ambient noise file");
  }
};

const hasFormChanged = () => {
  // Skip comparison if no original values are set yet
  if (Object.keys(originalValues.value).length === 0) return false;

  // Check intent
  if (String(originalValues.value.intent) !== String(values.intent)) {
    return true;
  }

  // Check audio file name changes
  const audioFieldsToCheck = [
    'welcomeAudio',
    'concludeAudio',
    'fillerAudio',
    'ambientNoiseAudio',
    'forwardCallAudio'
  ];

  for (const field of audioFieldsToCheck) {
    if (String(originalValues.value[field] || '') !== String(values[field] || '')) {
      return true;
    }
  }

  // Check ambient noise files
  const currentAmbientNoiseFiles = props.audioResponseData?.ambientNoise || [];
  const originalAmbientNoiseFiles = originalValues.value.ambientNoiseFiles || [];

  // Compare number of files
  if (currentAmbientNoiseFiles.length !== originalAmbientNoiseFiles.length) {
    return true;
  }

  // Compare each ambient noise file details
  for (let i = 0; i < currentAmbientNoiseFiles.length; i++) {
    const currentFile = currentAmbientNoiseFiles[i];
    const originalFile = originalAmbientNoiseFiles[i];

    if (!originalFile) return true;

    // Compare audio filename, volume, and transcription
    if (
      currentFile.audio !== originalFile.audio ||
      currentFile.volume !== originalFile.volume ||
      (currentFile.transcription || '').trim() !== (originalFile.transcription || '').trim()
    ) {
      return true;
    }
  }

  return false;
};

const formHasChanged = computed(() => {
  return hasFormChanged();
});

const onSubmit = handleSubmit(async (value: any) => {
  // Only proceed if form has changed
  if (hasFormChanged()) {
    isLoading.value = true;
    await ambientNoiseAudioUpload();
    let payload = {
      intent: values.intent,
    };
    await updateLLMConfig(payload, props.botDetails.id, "Pre-recorded audio files updated successfully.");

    if (typeof props.refreshBot === 'function') {
      props.refreshBot();
    } else {
      console.error("refresh function is not available", props.refreshBot);
    }

    // Update original values after successful submission
    nextTick(() => {
      originalValues.value = {
        intent: values.intent,
        welcomeAudio: values.welcomeAudio || '',
        concludeAudio: values.concludeAudio || '',
        fillerAudio: values.fillerAudio || '',
        ambientNoiseAudio: values.ambientNoiseAudio || '',
        forwardCallAudio: values.forwardCallAudio || '',
        ambientNoiseFiles: props.audioResponseData?.ambientNoise?.map(file => ({
          audio: file.audio,
          volume: file.volume,
          transcription: file.transcription
        })) || []
      };
    });

    isLoading.value = false;
  } else {
    console.log("No changes detected, skipping API call");
  }
});
</script>