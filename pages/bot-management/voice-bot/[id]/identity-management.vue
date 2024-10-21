<template>
  <!-- :bread-crumbs="[
    { label: `${botDetails.name}`, to: `/bot-management/chat-bot/${botDetails.id}` },
    {
      label: 'Intent Management',
      to: `/bot-management/chat-bot/${botDetails.id}/intent-management`,
    },
  ]"  -->
  <Page
    title="Bot Details"
    :bread-crumbs="[
      {
        label: `${botDetails.name}`,
        to: `/bot-management/voice-bot/${botDetails.id}`,
      },
      {
        label: 'Bot Details',
        to: `/bot-management/voice-bot/${botDetails.id}/identity-management`,
      },
    ]"
    :disableSelector="true"
    :disable-back-button="false"
    :disableElevation="false"
  >
    <div class="pb-2 sm:pb-0">
      <form @submit="onSubmit" class="flex flex-col gap-2">
        <div class="flex grid grid-cols-2 gap-3">
          <span>
            <TextField
              name="name"
              label="Name"
              required
              placeholder="Enter name"
            />
          </span>
          <span>
            <!-- <SelectField
              name="role"
              label="Role"
              placeholder="Select a Role"
              :options="roles"
              required
            /> -->
          </span>
        </div>
        <!-- <SelectField
          name="domain"
          label="Domain"
          placeholder="Select Domain"
          :options="domainList"
          required
        /> -->
        <div v-if="values.domain === 'Others'">
          <TextField
            name="name"
            label="Other Domain Name"
            placeholder="Enter name"
            required
          >
          </TextField>
        </div>
        <!-- <SelectField
          name="language"
          label="Language"
          placeholder="Select Language"
          :options="languageList"
          required
        /> -->
        <div class="w-full gap-3 pt-2">
          <div style="align-self: center">Welcome Audio</div>

          <!-- <Audio name="welcomeAudio"></Audio> -->
          <div>
            <imageField
              name="welcomeFile"
              @change="
                ($event) => {
                  console.log('data');
                  uploadFile($event, 'welcome');
                }
              "
              :fileName="values.welcomeFile"
              :showFilename="false"
              :multiple="true"
              :accept="'audio/*'"
            />
          </div>
          <div v-for="(welcomeFile, welcomeFileIndex) in welcomeFilesData">
            <div>
              {{
                `welcome${welcomeFileIndex + 1}.${welcomeFile.type.split("/").pop()}`
              }}
            </div>

            <UiButton
              type="button"
              size="icon"
              color="primary"
              style="min-width: 80px !important"
              @click="
                deleteFile(welcomeFile, welcomeFilesData, welcomeFileIndex)
              "
            >
              remove
            </UiButton>
          </div>
        </div>
        <div class="w-full gap-3 pt-2">
          <div style="align-self: center">Conclude Audio</div>
          <div>
            <imageField
              name="concludeFile"
              @change="
                ($event) => {
                  console.log('data');
                  uploadFile($event, 'conclude', 'concludeFile');
                }
              "
              :fileName="values.welcomeFile"
              :showFilename="false"
              :multiple="true"
              :accept="'audio/*'"
            />
          </div>

          <div
            v-for="(concludeFile, concludeFileIndex) in concludeFilesData"
            class="grid gap-2"
          >
            <div>
              {{
                `conclude${concludeFileIndex + 1}.${concludeFile.type.split("/").pop()}`
              }}
            </div>

            <UiButton
              @click="
                deleteFile(concludeFile, concludeFilesData, concludeFileIndex)
              "
              size="icon"
              color="primary"
              type="button"
              style="min-width: 80px !important"
            >
              remove
            </UiButton>
          </div>
        </div>
        <div class="flex w-full justify-end">
          <UiButton
            type="submit"
            class="w-[120px] self-end bg-[#424bd1] hover:bg-[#424bd1] hover:brightness-110"
            size="lg"
            :loading="isLoading"
          >
            Submit
          </UiButton>
        </div>
      </form>
    </div>
  </Page>
</template>

<script setup lang="ts">
import { useLanguageList } from '~/composables/useLanguageList';
 const config=useRuntimeConfig()
  definePageMeta({
    middleware: "admin-only",
  });
  const route = useRoute("bot-management-voice-bot-id-identity-management");
  const botDetails: any = await getVoiceBotDetails(route.params.id);
  const welcomeFilesData = ref([]);
  const concludeFilesData = ref([]);
  const deleteFileBucket = ref([ ]);

  if (botDetails?.audioFiles?.welcome?.length) {
    welcomeFilesData.value = botDetails?.audioFiles?.welcome.map(
      (welcomeValue: any) => ({ ...welcomeValue, type: welcomeValue.filetype }),
    );
  }

  if (botDetails?.audioFiles?.conclude?.length) {
    concludeFilesData.value = botDetails?.audioFiles?.conclude.map(
      (conclude: any) => ({ ...conclude, type: conclude.filetype }),
    );
    console.log(concludeFilesData.value);
  }

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
  const isLoading = ref(false);

  const botSchema = toTypedSchema(
    z.object({
      name: z
        .string({ required_error: "Name is required" })
        .min(1, { message: "Name is required" }),
      role: z
        .string({ required_error: "Select A Role" })
        .min(1, { message: "Select A Role" })
        .optional(),
      domain: z
        .string({ required_error: "Select  A Domain" })
        .min(1, { message: "Select  A Domain" })
        .optional(),
      other: z.string().optional(),
      welcomeFile: z.any(),
      concludeFile: z.any(),
      language: z.string()
        .optional(),
      headerFile: z.object({}).optional(),
    }),
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

  watchEffect(() => {
    if (botDetails) {
      const userName = botDetails?.name ?? "Unknown Bot Name";
      useHead({
        title: `Voice Bot | ${userName} - Identity Management`,
      });
    }
  });

  const onSubmit = handleSubmit(async (value: any) => {
    // updateLLMConfig()
    isLoading.value = true;
    let formData = new FormData();
    [...welcomeFilesData.value, ...concludeFilesData.value].forEach(
      (value: any) => {
        if (value instanceof File) {
          formData.append("files", value);
        }
      },
    );
    let payload = {
      identityManagement: value,
    };
    if (deleteFileBucket.value.length) {
      await audioDelete(botDetails);
      payload = {
        ...payload,
        audioFiles: {
          welcome: welcomeFilesData.value.filter(
            (welcomeFile: any) =>
              !deleteFileBucket.value.includes(welcomeFile) &&
              (!welcomeFile) instanceof File,
          ),
          conclude: concludeFilesData.value.filter(
            (concludeFile: any) =>
              !deleteFileBucket.value.includes(concludeFile) &&
              (!concludeFile) instanceof File,
          ),
        },
      };
    }
    if (formData.getAll("files").length) {
      formData.append("bot_id", botDetails.id);
      formData.append("organization_id", botDetails.organizationId);
      formData.append("ivr", botDetails.ivrConfigDetail.provider);
      formData.append("language", botDetails.speechToTextConfig.language);
      const resData = await audioUpload(formData, "");
      const data = await resData?.json();
      payload = {
        ...payload,
        audioFiles: {
          welcome: [
            ...welcomeFilesData.value.filter(
              (welcomeFile) =>
                !deleteFileBucket.value.includes(welcomeFile) &&
                (!welcomeFile) instanceof File,
            ),
            ...data.welcome,
          ],
          conclude: [
            ...concludeFilesData.value.filter(
              (concludeFile) =>
                !deleteFileBucket.value.includes(concludeFile) &&
                (!concludeFile) instanceof File,
            ),
            ...data.conclude,
          ],
        },
      };
      console.log(data);
    }

    await updateLLMConfig(payload, botDetails.id);
    isLoading.value = false;

    return navigateTo({
      name: "bot-management-voice-bot-id",
      params: { id: botDetails.id },
    });
  });

  if (botDetails.identityManagement) {
    setFieldValue("name", botDetails.identityManagement?.name);
    setFieldValue("role", botDetails.identityManagement?.role);
    setFieldValue("domain", botDetails.identityManagement?.domain);
    setFieldValue("other", botDetails.identityManagement?.other);
    setFieldValue("language", botDetails.identityManagement?.language);
  }

  const [name, nameFieldAttrs] = defineField("name");
  const [role, roleFieldAttrs] = defineField("role");
  const [domain, domainFieldAttrs] = defineField("domain");
  const [other, otherFieldAttrs] = defineField("other");

  const handleDomainSelection = (data: any) => {};
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
          welcomeFilesData.value.push(file);
        } else if (fieldName === "concludeFile") {
          concludeFilesData.value.push(file);
        }
      });

      let fileNames = newFiles?.map((file) => file.name).join(",");
      if (fieldName === "welcomeFile") {
        welcomeString.value +=
          welcomeString.value.length > 0 ? "," + fileNames : fileNames;
        setFieldValue(fieldName, welcomeString.value);
      } else {
        concludeString.value +=
          concludeString.value.length > 0 ? "," + fileNames : fileNames;
        setFieldValue(fieldName, concludeString.value);
      }

      console.log(concludeFilesData.value);
    } catch (error) {
      console.log(error);
    } finally {
      console.log("finally");
    }
    // formData.append("bot_id", botDetails.id);
    // formData.append("organization_id", botDetails.organizationId);
    // formData.append("ivr", botDetails?.ivrConfig?.provider);

    // audioUpload(formData,type)
  };

  const deleteFile = (data, files, index) => {
    files.splice(index, 1);
    if (data?.path) {
      deleteFileBucket.value.push(data.path);
    }
  };

  const audioUpload = async (formData, type) => {
    try {
      const response = await fetch(
        `${config.public.voiceBotUrl}/audio-upload/`,
        {
          method: "POST",
          body: formData,
          redirect: "manual",
        },
      );
      return response;
    } catch (error) {
      console.error("Error:", error);
    } finally {
      console.log("finally");
    }
  };
  const audioDelete = async (data) => {
    console.log(welcomeFilesData.value);

    try {
      await fetch(`${config.public.voiceBotUrl}/audio-upload/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json", // Specify the type of data you're sending
        },
        body: JSON.stringify({
          files: deleteFileBucket.value, // ensure this is serializable (possibly a file path or metadata, not a File object)
          bot_id: data.id,
          organization_id: data.organizationId,
          ivr: data.ivrConfigDetail.provider,
        }),
      });
      return console.log("deleted");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      console.log("finally");
    }
  };

  const getLastFileNumber = (fileNames: string) => {
    return fileNames === "welcomeFile"
      ? welcomeFilesData.value.length
      : concludeFilesData.value.length;
    // let fileName =
    //   fileNames === "welcomeFile" ? welcomeString.value : concludeString.value;
    // let fileNameArray = fileName.split(",").map((file: string) => file.trim());
    // let lastFileName = fileNameArray[fileNameArray.length - 1];
    // let lastNumber = lastFileName.match(/\d+/g)?.pop();
    // return +lastNumber || 0;
  };
</script>
