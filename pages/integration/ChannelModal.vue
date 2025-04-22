<template>
  <DialogWrapper v-model="channelModalState" :title="channelModalState.id ? 'Modify Channel' : 'Add New Channel'">
    <form @submit="handleConnect" class="space-y-2">
      <SelectField name="channel" label="Channel" placeholder="Select a channel" helperText=""
        :options="[{ value: 'whatsapp', label: 'Whatsapp' }]" required />
      <TextField name="name" label="Name" placeholder="Enter Your Channel Name" helperText="" required>
      </TextField>
      <TextField v-if="fbVerified" name="pin" label="2FA Pin" placeholder="Enter Your pin" helperText="" required>
      </TextField>

      <div class="flex items-center justify-end">
        <UiButton v-if="!fbVerified" color="primary" type="button" @click="launchWhatsAppSignup">Login with Facebook
        </UiButton>
        <UiButton v-else color="primary" type="submit" :loading="isLoading">Submit</UiButton>
      </div>
    </form>
  </DialogWrapper>
</template>

<script setup lang="ts">
  import { useRoute } from "vue-router";
  const emit = defineEmits(["success"]);
  const route = useRoute();
  const channelModalState = defineModel<{ open: boolean; id: any }>({
    default: {
      open: false,
      id: null,
    },
  });
  const isLoading = ref(false);
  const formSchema = toTypedSchema(
    z.object({
      name: z
        .string({ required_error: "Name is required." })
        .min(1, "Name is required."),
      channel: z
        .string({ required_error: "Channel is required." })
        .min(2, "Channel is required."),
      pid: z
        .string({ required_error: "Pid is required" })
        .min(2, "Pid is required"),
      code: z
        .string({ required_error: "code is required" })
        .min(2, "code is required"),
      wabaId: z
        .string({ required_error: "wabaId is required" })
        .min(2, "wabaId is required"),
      pin: z
        .string({ required_error: "2FA pin is required" })
        .min(2, "2FA pin is required"),
    }),
  );

  const {
    errors,
    setErrors,
    handleSubmit,
    setFieldValue,
    defineField,
    values,
    resetForm,
  } = useForm({
    validationSchema: formSchema,
  });

  watch(
    () => channelModalState.value.open,
    async (newState) => {
      if (channelModalState.value.id) {
        const channelSingleDetail: any = await $fetch(
          `/api/org/integrations/${channelModalState.value.id}`,
        );
        setFieldValue("name", channelSingleDetail.name);
        setFieldValue("channel", channelSingleDetail.crm);
        setFieldValue("pid", channelSingleDetail.metadata?.pid);
        setFieldValue("code", channelSingleDetail.metadata?.code);
      } else {
        resetForm();
        fbVerified.value = false;
      }
    },
  );

  onMounted(() => {
    window.fbAsyncInit = function () {
      FB.init({
        appId: "3404499776522072", // Your Facebook app ID
        autoLogAppEvents: true,
        xfbml: true,
        version: "v21.0",
      });
    };

    // Load the Facebook SDK
    const sdkScript = document.createElement("script");
    sdkScript.src = "https://connect.facebook.net/en_US/sdk.js";
    sdkScript.async = true;
    sdkScript.defer = true;
    sdkScript.crossorigin = "anonymous";
    document.body.appendChild(sdkScript);
  });
  const fbVerified = ref(false);
  const fbLoginCallback = (response: any) => {
    if (response.authResponse) {
      const code = response.authResponse.code;

      setFieldValue("code", code);
      fbVerified.value = true;
    }
  };

  const launchWhatsAppSignup = () => {
    FB.login(fbLoginCallback, {
      config_id: "899547945555154", // Your configuration ID
      response_type: "code",
      override_default_response_type: true,
      extras: {
        setup: {},
        featureType: "",
        sessionInfoVersion: "2",
      },
    });
  };
  window.addEventListener("message", (event) => {
    if (
      event.origin !== "https://www.facebook.com" &&
      event.origin !== "https://web.facebook.com"
    ) {
      return;
    }
    try {
      const data = JSON.parse(event.data);
      if (data.type === "WA_EMBEDDED_SIGNUP") {
        if (data.event === "FINISH") {
          const { phone_number_id, waba_id } = data.data;

          setFieldValue("pid", phone_number_id);
          setFieldValue("wabaId", waba_id);
        } else if (data.event === "CANCEL") {
          const { current_step } = data.data;
          console.warn("Cancel at:", current_step);
        } else if (data.event === "ERROR") {
          const { error_message } = data.data;
          console.error("Error:", error_message);
        }
      }
    } catch {}
  });

  const handleConnect = handleSubmit(async (values: any) => {
    isLoading.value = true;
    const payload = {
      name: values.name,
      crm: values.channel,
      metadata: {
        pid: values.pid,
        code: values.code,
        wabaId: values.wabaId,
        pin: values.pin,
      },
    };
    try {
      if (channelModalState.value.id) {
        await $fetch(`/api/org/integrations/${channelModalState.value.id}`, {
          method: "PUT",
          body: payload,
        });
        toast.success("Integration updated successfully");
      } else {
        try {
          await $fetch("/api/org/integrations", {
            method: "POST",
            body: payload,
          });
          toast.success("Integration added successfully");
        } catch (err) {
          toast.error(err.data.statusMessage);
        }
      }
      emit("success");
      fbVerified.value = false;
    } catch (error: any) {
      if (error.data.statusMessage) {
        toast.error(error.data.statusMessage);
      } else {
        toast.error(error?.data?.data[0].message);
      }
      isLoading.value = false;
    }
    isLoading.value = false;
  });
</script>
