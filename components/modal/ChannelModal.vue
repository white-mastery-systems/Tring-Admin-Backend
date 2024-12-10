
<template>
  <DialogWrapper
    v-model="channelModalState"
    :title="channelModalState.id ? 'Modify Channel' : 'Add New Channel'"
  >
    <form @submit="handleConnect" class="space-y-2">
      <SelectField
        name="channel"
        label="Channel"
        placeholder="Select a channel"
        helperText=""
        :options="[{ value: 'whatsapp', label: 'Whatsapp' }]"
        required
      />
      <TextField
        name="name"
        label="Name"
        placeholder="Enter Your Channel Name"
        helperText=""
        required
      >
      </TextField>
      <TextField
        v-if="fbVerified"
        name="pin"
        label="2FA Pin"
        placeholder="Enter Your pin"
        helperText="Enter your 2FA pin if enabled for this number"
      >
      </TextField>

      <!-- <TextField name="pid" label="pid" placeholder="Enter" helperText="" required>
      </TextField> -->
      <!-- <TextField name="token" label="Token" placeholder="Enter Token" helperText="" required>
      </TextField> -->
      <div class="flex items-center justify-end">
        <UiButton
          v-if="!fbVerified"
          color="primary"
          type="button"
          @click="launchWhatsAppSignup"
          >Login with Facebook
        </UiButton>
        <UiButton v-else color="primary" type="submit" :loading="isLoading">
          Submit
        </UiButton>
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
      pin: z.string({ required_error: "2FA pin is required" }).optional(),
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

  // const handleSubmssion = async () => {
  //   console.log(values, "values")
  //   const payload = {
  //     name: values.name,
  //     crm: values.channel,
  //     metadata: {
  //       pid: values.pid,
  //       code: values.code,
  //       wabaId: values.wabaId
  //     },
  //   };
  //   try {
  //     if (channelModalState.value.id) {
  //       await $fetch(`/api/org/integrations/${channelModalState.value.id}`, { method: "PUT", body: payload });
  //       toast.success("Integration update successfully");
  //     }

  //     else {

  //       await $fetch("/api/org/integrations", { method: "POST", body: payload });
  //       toast.success("Integration added successfully");
  //     }
  //     emit("success");
  //   } catch (error: any) {
  //     toast.error(error?.data?.data[0].message);
  //   }
  // }
  const fbVerified = ref(false);
  const fbLoginCallback = (response: any) => {
    if (response.authResponse) {
      const code = response.authResponse.code;

      setFieldValue("code", code);
      fbVerified.value = true;
      // handleSubmssion()

      // Send code to your backend for further processing.
    }
    // document.getElementById("sdk-response").textContent = JSON.stringify(response, null, 2);
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
          console.log({ data: JSON.stringify(data) });
          console.log({ newData: data });
          const { phone_number_id, waba_id } = data.data;

          setFieldValue("pid", phone_number_id);
          setFieldValue("wabaId", waba_id);
          // setFieldValue("token", channelSingleDetail.metadata?.token);
        } else if (data.event === "CANCEL") {
          const { current_step } = data.data;
          console.warn("Cancel at:", current_step);
        } else if (data.event === "ERROR") {
          const { error_message } = data.data;
          console.error("Error:", error_message);
        }
      }
      // document.getElementById("session-info-response").textContent = JSON.stringify(data, null, 2);
    } catch {}
  });
  const handleConnectButtonClick = () => {
    // window?.fbAsyncInit = function () {
    //   FB.init({
    //     appId: '3404499776522072',
    //     autoLogAppEvents: true,
    //     xfbml: true,
    //     version: 'v20.0'
    //   });
    // };
  };

  const handleConnect = handleSubmit(async (values: any) => {
    isLoading.value = true;
    console.log({ values });
    const payload = {
      name: values.name,
      crm: values.channel,
      type: "whatsapp",

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
        toast.success("Integration update successfully");
      } else {
        await $fetch("/api/org/integrations", {
          method: "POST",
          body: payload,
        });
        toast.success("Integration added successfully");
      }
      emit("success");
    } catch (error: any) {
      isLoading.value = false;
      toast.error(error?.data?.data[0].message);
    }
    isLoading.value = false;
  });
</script>
<!-- https://accounts.zoho.in/oauth/v2/auth?response_type=code&client_id=1000.7ZU032OIFSMR5YX325O4W3BNSQXS1U&scope=ZohoBigin.settings.ALL,ZohoBigin.modules.ALL&redirect_uri=https://tring-admin.pripod.com/settings/integration/zoho-bigin&prompt=consent&access_type=offline -->

<!-- 
<script setup lang="ts">
import { onMounted } from 'vue';

// Your form setup, validations, and modal state code (same as before)
// ...

const launchWhatsAppSignup = () => {
  // FB.login(fbLoginCallback, {
  //   config_id: '', // Your configuration ID
  //   response_type: 'code',
  //   override_default_response_type: true,
  //   extras: {
  //     setup: {},
  //     featureType: '',
  //     sessionInfoVersion: '2',
  //   }
  // });
};

const fbLoginCallback = (response: any) => {
  if (response.authResponse) {
    const code = response.authResponse.code;
    
    // Send code to your backend for further processing.
  }
  // document.getElementById("sdk-response").textContent = JSON.stringify(response, null, 2);
};

// Initialize the Facebook SDK
onMounted(() => {
  // window.fbAsyncInit = function () {
  //   FB.init({
  //     appId: '', // Your Facebook app ID
  //     autoLogAppEvents: true,
  //     xfbml: true,
  //     version: 'v20.0',
  //   });
  // };

  // // Load the Facebook SDK
  // const sdkScript = document.createElement('script');
  // sdkScript.src = "https://connect.facebook.net/en_US/sdk.js";
  // sdkScript.async = true;
  // sdkScript.defer = true;
  // sdkScript.crossorigin = "anonymous";
  // document.body.appendChild(sdkScript);
});

// Handle messages from the Facebook embedded signup
window.addEventListener('message', (event) => {
  if (event.origin !== "https://www.facebook.com" && event.origin !== "https://web.facebook.com") {
    return;
  }
  try {
    const data = JSON.parse(event.data);
    if (data.type === 'WA_EMBEDDED_SIGNUP') {
      if (data.event === 'FINISH') {
        const { phone_number_id, waba_id } = data.data;
        
      } else if (data.event === 'CANCEL') {
        const { current_step } = data.data;
        console.warn("Cancel at:", current_step);
      } else if (data.event === 'ERROR') {
        const { error_message } = data.data;
        console.error("Error:", error_message);
      }
    }
    // document.getElementById("session-info-response").textContent = JSON.stringify(data, null, 2);
  } catch {
    
  }
});
</script>
<template>
  <DialogWrapper v-model="channelModalState" :title="channelModalState.id ? 'Modify Channel' : 'Add New Channel'">
    <form @submit="handleConnect" class="space-y-2">
      <TextField name="name" label="Name" placeholder="Enter Your Channel Name" helperText="" required />
      <SelectField name="channel" label="Channel" placeholder="Select a channel" helperText="" :options="[
        { value: 'whatsapp', label: 'WhatsApp' },
      ]" required />
      <TextField name="pid" label="pid" placeholder="Enter" helperText="" required />
      <TextField name="token" label="Token" placeholder="Enter Token" helperText="" required />

      <div class="flex items-center justify-end">
        <UiButton type="submit" class="mt-2" color="primary"> Submit </UiButton>
      </div>

      <UiButton @click="launchWhatsAppSignup" color="primary" type="button">Login With Facebook</UiButton>

      <p>Session info response:</p>
      <pre id="session-info-response"></pre>

      <p>SDK response:</p>
      <pre id="sdk-response"></pre>
    </form>
  </DialogWrapper>
</template> -->
