<template>
  <!-- :bread-crumbs="[
    { label: `${botDetails.name}`, to: `/bot-management/chat-bot/${botDetails.id}` },
    {
      label: 'Intent Management',
      to: `/bot-management/chat-bot/${botDetails.id}/intent-management`,
    },
  ]"  -->
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
      <form @submit="onSubmit" class="flex flex-col gap-2">
        <div class="flex grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-3">
          <!-- <TextField name="intent" label="Intent " required placeholder="Enter Intent " /> -->
          <SelectField name="intent" :options="intentList" label="Intent" placeholder="Select Intent"
            helperText="Select your intent."></SelectField>
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
            <div v-for="(welcomeFile, welcomeFileIndex) in formattedUploadAudioFile?.welcome">
              <div class="flex gap-3">
                <span>
                  {{ `${welcomeFile.audio}.wav` }}
                </span>
                <span>
                  {{ welcomeFile.transcription }}
                </span>
              </div>

              <UiButton type="button" size="icon" color="primary" style="min-width: 80px !important" @click="
                  deleteFile(welcomeFile, formattedUploadAudioFile?.welcome, welcomeFileIndex)
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

            <div v-for="(concludeFile, concludeFileIndex) in formattedUploadAudioFile?.conclude" class="grid gap-2">
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
  deleteFile(concludeFile, formattedUploadAudioFile?.conclude, concludeFileIndex)
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
import { useLanguageList } from '~/composables/voiceBotLanguageList';
const config = useRuntimeConfig()
definePageMeta({
  middleware: "admin-only",
});
const route = useRoute("bot-management-voice-bot-id-identity-management");
const botDetails: any = await getVoiceBotDetails(route.params.id);
const welcomeFilesData = ref([]);
const concludeFilesData = ref([]);
const deleteFileBucket = ref([]);
const uploadedAudio = ref();
const formattedUploadAudioFile = ref({
  welcome: [],
  conclude: [],
})
// if (botDetails?.audioFiles?.welcome?.length) {
//   console.log('jbafsakfb --- sfashfbsd')
//   welcomeFilesData.value = botDetails?.audioFiles?.welcome.map(
//     (welcomeValue: any) => ({ ...welcomeValue, type: welcomeValue.filetype }),
//   );
// }

// if (botDetails?.audioFiles?.conclude?.length) {
//   concludeFilesData.value = botDetails?.audioFiles?.conclude.map(
//     (conclude: any) => ({ ...conclude, type: conclude.filetype }),
//   );
// }

// setFieldValue('intent', botDetails?.preRecordedAudios.intent)

const roles = [
  {
    value: "Customer Support",
    label: "Customer Support",
    helperText: "Assist customers with their questions and issues.",
  },
  {
    value: "Receptionist",
    label: "Receptionist",
    helperText: "Handles visitor interactions and phone calls.",
  },
];

const { languageList } = useLanguageList();
const domainList = [
  { value: "Customer Support", label: "Customer Support" },
  { value: "Sales Assistant", label: "Sales Assistant" },
  { value: "Technical Support", label: "Technical Support" },
  { value: "Lead Generation", label: "Lead Generation" },
  {
    value: "Survey Taker",
    label: "Survey Taker",
    helperText: "Can contribute content but with limited permissions",
  },
  { value: "Appointment Scheduler", label: "Appointment Scheduler" },
  { value: "FAQ Bot", label: "FAQ Bot" },
  { value: "Others", label: "Others" },
];

const intentList = ref([
  {
    label: "Welcome",
    value: "welcome",
  }, {
    label: "Conclude",
    value: "conclude",
  },
])
const isLoading = ref(false);

// const botSchema = toTypedSchema(
//   z.object({
//     welcomeFile: z.any(),
//     concludeFile: z.any(),
//   }),
// );
// const botSchema = toTypedSchema(
//   z.object({
//     intent: z.string().min(1, "Intent is required"),
//     welcomeAudio: z.any().refine(value => value !== undefined && value.length > 0, {
//       message: "Welcome file is required",
//     }),
//     concludeAudio: z.any().refine(value => value !== undefined && value.length > 0, {
//       message: "Conclude file is required",
//     }),
//   })
// );
const botSchema = toTypedSchema(
  z.object({
    intent: z.string({ required_error: "Intent is required" }).min(1, "Intent is required"),
    welcomeAudio: z.any().optional(),
    concludeAudio: z.any().optional(),
  })
    .superRefine((data, ctx) => {
      // Conditional validation for 'welcome' intent
      if (
        data.intent === "welcome" &&
        (!data.welcomeAudio || data.welcomeAudio.length === 0)
      ) {
        ctx.addIssue({
          path: ["welcomeAudio"],
          message: "Welcome file is required for the 'welcome' intent.",
        });
      }

      // Conditional validation for 'conclude' intent
      if (
        data.intent === "conclude" &&
        (!data.concludeAudio || data.concludeAudio.length === 0)
      ) {
        ctx.addIssue({
          path: ["concludeAudio"],
          message: "Conclude file is required for the 'conclude' intent.",
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

Object.entries(botDetails.preRecordedAudios ?? {}).forEach(([key, value]: any) => {
  if (botDetails?.intent) setFieldValue("intent", botDetails?.intent);
  if (key === 'welcomeAudio') {
    if (botDetails.preRecordedAudios?.welcomeAudio.length) {
      const welcomeFilePaths = botDetails.preRecordedAudios?.welcomeAudio.map((item: any) => item)
      welcomeFilePaths?.map((item: object) => {
        // welcomeFilesData.value.push(item)
        console.log(item, "item")
        formattedUploadAudioFile.value.welcome.push(item)
      })
      // welcomeFile.type
      setFieldValue("welcomeAudio", welcomeFilePaths.join(","));
    }
  }
  if (key === 'concludeAudio') {
    if (botDetails.preRecordedAudios?.concludeAudio.length) {
      const concludeAudioFilePaths: any = botDetails.preRecordedAudios?.concludeAudio?.map((item: any) => item);
      concludeAudioFilePaths?.map((item: object) => {
        // concludeFilesData.value.push(item)
        formattedUploadAudioFile.value.conclude.push(item)
      })
      setFieldValue("concludeAudio", concludeAudioFilePaths.join(","));
    }
  }
});
watchEffect(async () => {
  if (botDetails) {
    const userName = botDetails?.name ?? "Unknown Bot Name";
    useHead({
      title: `Voice Bot | ${userName} - Identity Management`,
    });
    // await handleApiResponse(botDetails)
  }
});

watch(() => values.intent, (newValue) => {
  // console.log(newValue, "newValue", formattedUploadAudioFile.value); // For debugging purposes
  // if (botDetails?.intent) setFieldValue("intent", botDetails?.intent);
  if (formattedUploadAudioFile.value.welcome.length) {
    const welcomeFilePaths = formattedUploadAudioFile.value.welcome.map((item: any) => item)
    // welcomeFilePaths.map((item: any) => {
    //   welcomeFilesData.value.push(item)
    // })
    // welcomeFile.type
    setFieldValue("welcomeAudio", welcomeFilePaths.join(","));
  } 
  // else {
  //   if (values.intent != 'welcome') {
  //     welcomeFilesData.value = []
  //   }
  // }
  console.log(concludeFilesData.value, "concludeFilesData -- concludeFilesData")
  if (formattedUploadAudioFile.value.conclude.length) {
    const concludeAudioFilePaths = formattedUploadAudioFile.value.conclude.map((item: any) => item)
    setFieldValue("concludeAudio", concludeAudioFilePaths.join(","));
  } 
});
// watch(botDetails, () => {
//   resetForm()
//   console.log(botDetails.intent, "botDetails.preRecordedAudios?.intent -- botDetails.preRecordedAudios?.intent")
//   if (botDetails.intent) setFieldValue("intent", botDetails.intent)
//   // Check and process welcome audio
//   if (botDetails.preRecordedAudios?.welcome && botDetails.preRecordedAudios.welcome.length) {
//     // console.log(
//     //   botDetails.preRecordedAudios.welcome,
//     //   "botDetails.preRecordedAudios.welcome -- botDetails.preRecordedAudios.welcome"
//     // );

//     const welcomeFilePaths = botDetails.preRecordedAudios.welcomeAudio.map((item: any) => item.audio)
//     setFieldValue("welcomeAudio", welcomeFilePaths.join(","));
//   }

//   // Check and process conclude audio
//   if (botDetails.preRecordedAudios?.conclude && botDetails.preRecordedAudios.conclude.length) {
//     console.log(
//       botDetails.preRecordedAudios.conclude,
//       "botDetails.preRecordedAudios.conclude -- botDetails.preRecordedAudios.conclude"
//     );

//     const concludeFilePaths = botDetails.preRecordedAudios.conclude.map((audio: string) => {
//       const [filePath] = audio.split("|"); // Extract file path before "|FIX ME"
//       return filePath;
//     });
//     console.log(concludeFilePaths, "concludeFilePaths")
//     setFieldValue("concludeAudio", concludeFilePaths.join(","));
//   }
// }, {deep: true})

// setTimeout(() => {
//   console.log(botDetails.preRecordedAudios, "botDetails -- botDetails")
// }, 2000);

const welcomeString = ref("");
const concludeString = ref("");

const uploadFile = (
  files: any,
  type = "welcome",
  fieldName = "welcomeFile",
) => {
  // let webmStatus =  Array.from(files).some((file:any) => file.type !== "video/wav" && file.type !== "video/raw");
  // if(webmStatus){
  // toast.error("file must mbe in webm format");
  // }
  try {
    let newFiles: any = [];
    let lastFileIndex = getLastFileNumber(fieldName);
    Array.from(files).forEach((file: any, fileIndex: any) => {
      let fileType: any = file.type.split("/").pop();
      let index = fileIndex + 1 + lastFileIndex;
      console.log(file);
      var blob = file.slice(0, file.size, file.type);
      file = new File([blob], `${type + index}.${fileType}`, {
        type: file.type,
      });
      newFiles.push(file);
      if (fieldName === "welcomeFile") {
        console.log(file, "file -- file")
        welcomeFilesData.value.push(file);
      } else if (fieldName === "concludeFile") {
        concludeFilesData.value.push(file);
      }
    });

    let fileNames = newFiles?.map((file) => file.name).join(",");
    if (fieldName === "welcomeFile") {
      welcomeString.value +=
        welcomeString.value.length > 0 ? "," + fileNames : fileNames;
      setFieldValue('welcomeAudio', welcomeString.value);
    } else {
      concludeString.value +=
        concludeString.value.length > 0 ? "," + fileNames : fileNames;
      setFieldValue('concludeAudio', concludeString.value);
    }

  } catch (error) {
    console.log(error);
  } finally {
    console.log("finally");
  }
  let formData = new FormData();
  if (botDetails.id) {
    formData.append("bot_id", botDetails.id);
  }
  if (botDetails.organizationId) {
    formData.append("organization_id", botDetails.organizationId);
  }
  // if (botDetails.speechToTextConfig?.language) {
  formData.append("language", botDetails.speechToTextConfig?.language ?? "en-US");
  // }


  // Append intent
  if (values.intent) {
    formData.append("intent", values.intent);
  }
  // Append files from welcome and conclude data
  [...welcomeFilesData.value, ...concludeFilesData.value].forEach((file: any) => {
    if (file instanceof File) {
      formData.append("files", file);
    }
  });

  audioUpload(formData, type)
};

// const handleApiResponse = (response: any) => {
//   console.log("first")
//   try {
//     if (response.intent) {
//       console.log(response.intent, "bottom")
//       setFieldValue("intent", response.intent);
//     }
//     if (response.welcomeAudio && response.welcomeAudio.length) {
//       const welcomeFilePaths = response.welcomeAudio.map((audio: any) => audio.filename).join(",");
//       setFieldValue("welcomeAudio", welcomeFilePaths);
//     }

//     if (response.concludeAudio && response.concludeAudio.length) {
//       const concludeFilePaths = response.concludeAudio.map((audio: any) => audio.filename).join(",");
//       setFieldValue("concludeAudio", concludeFilePaths);
//     }
//   } catch (error) {
//     console.error("Error processing API response:", error);
//   }
// };

const deleteFile = (data, files, index) => {
  files.splice(index, 1);
  // console.log(data.audio)
  if (data?.audio) {
    deleteFileBucket.value.push(data?.audio);
    // console.log(deleteFileBucket.value, "deleteFileBucket.value -- deleteFileBucket.value")
  }
};

const audioUpload = async (formData: any, type) => {
  formattedUploadAudioFile.value.welcome = [];
  formattedUploadAudioFile.value.conclude = [];
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
    uploadedAudio.value = {
      preRecordedAudios: {
        welcomeAudio: formattedUploadAudioFile.value.welcome,
        concludeAudio: formattedUploadAudioFile.value.conclude,
      }
    }
    // return response;
  } catch (error) {
    isLoading.value = false;
    console.error("Error:", error);
  } finally {
    isLoading.value = false;
    console.log("finally");
    concludeFilesData.value = []
    welcomeFilesData.value = []
  }
};
const audioDelete = async (data: any) => {
  try {
    const formData = new FormData();
    deleteFileBucket.value.forEach((item) =>{
      formData.append('files', item);
    })
    formData.append('bot_id', data.id);
    formData.append('language', data.speechToTextConfig?.language ?? "en-US");
    formData.append('organization_id', data.organizationId);
    formData.append('intent', values.intent);


    const deleteResponse = await fetch(`${config.public.voiceBotUrl}/prerecordedAudio/`, {
      method: "DELETE",
      body: formData,
    });
    const formattedResponse = await deleteResponse.json()
  } catch (error) {
    console.error("Error:", error);
  } finally {
    toast.success("Audio deleted successfully.")
    console.log("finally");
  }
};

const getLastFileNumber = (fileNames: string, maxNumber = 10000): number => {
  const files = fileNames === "welcomeFile"
    ? welcomeFilesData.value
    : concludeFilesData.value;

  // Extract existing numbers from file names
  const usedNumbers = new Set(
    files.map((file: any) => {
      const match = file.name.match(/\d+/);
      return match ? parseInt(match[0], 10) : 0;
    })
  );

  let randomNumber;
  let attempts = 0;

  // Generate a random number not already in use
  do {
    randomNumber = Math.floor(Math.random() * maxNumber) + 1; // Random number between 1 and maxNumber
    attempts++;
    if (attempts > maxNumber) throw new Error("Failed to generate a unique number");
  } while (usedNumbers.has(randomNumber));

  return randomNumber;
};


const onSubmit = handleSubmit(async (value: any) => {
  // updateLLMConfig()
  isLoading.value = true;
  // let formatObj = {
  //   welcomeAudio: uploadedAudio.value?.welcome
  //   concludeAudio: uploadedAudio.value?.conclude
  // };
  let payload = {
    intent: values.intent,
    ...uploadedAudio.value
  };
  if (deleteFileBucket.value.length) {
    await audioDelete(botDetails);
    payload = {
      ...payload,
      intent: values.intent,
      preRecordedAudios: {
        welcomeAudio: formattedUploadAudioFile.value?.welcome,
        concludeAudio: formattedUploadAudioFile.value?.conclude,
      },
    };
  }
  // console.log(payload, "payload");
  const toster = "Audio files updated successfully";
  await updateLLMConfig(payload, botDetails.id, "Pre-recorded audio files updated successfully.");
  isLoading.value = false;

  return navigateTo({
    name: "bot-management-voice-bot-id",
    params: { id: botDetails.id },
  });
});
</script>
