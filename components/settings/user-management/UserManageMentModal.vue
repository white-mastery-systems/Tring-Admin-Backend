<script setup lang="ts">
import { DateFormatter } from '@internationalized/date';
import { userMangementSchema } from '~/validationSchema/settings/userMangementValidation';

definePageMeta({
  middleware: "admin-only",
});
const emit = defineEmits<{ (e: "confirm"): void }>();
const userModalState = defineModel<{ open: boolean, id: any }>({
  default: {
    open: false,
    id: null,
  },
});

const { status, data: userDataList, refresh: contactsRefresh, } = await useLazyFetch("/api/org/contact-list", {
  server: false,
  default: () => [],
});

const campaignListWithLabels = computed(() => {
  if (userModalState) {
    return userDataList.value?.map((item: any) => {
      return {
        value: item.id,
        label: item.id ? item.name : '' // Change label based on id value
      };
    })
  }
})

const df = new DateFormatter('en-US', {
  dateStyle: 'long',
})
const placeholder = ref()
const phoneNumberPattern = /^\+?[1-9]\d{1,14}$/



const {
  errors,
  setErrors,
  setFieldValue,
  handleSubmit,
  defineField,
  values,
  resetForm,
} = useForm({
  validationSchema: userMangementSchema,
});
const {
  status: integrationLoadingStatus,
  data: integrationsData,
  refresh: integrationRefresh,
} = await useLazyFetch("/api/org/integrations?q=channel", {
  server: false,
  default: () => [],
});
const templates = ref<any>([])
const phoneNumbers = ref<any>([])

watch(() => values, async (newValue) => {
  console.log({ newValue })
  if (newValue) {
    if (newValue.integrationId) {

      const data = await $fetch("/api/org/integrations/wa-template", {
        method: "POST",
        body: {
          integrationId: newValue.integrationId
        }
      })
      templates.value = data?.templateResponse?.data?.map((dat: { name: string }) => dat.name)
      phoneNumbers.value = data?.phoneNumberRespone?.data?.map((phone: any) => ({ label: phone.display_phone_number, value: phone.id }))

    }
  }
}, { deep: true })

const [timeField, timeFieldAttrs] = defineField("appt");

watch(() => userModalState.value.open, async (newState) => {
  console.log(userModalState.value, "userModalState")
  resetForm()
  if (userModalState.value.id) {
    const getSingleDetails: any = await $fetch(`/api/org/campaign/${userModalState.value.id}`)
    // setFieldValue("date", new Date(getSingleDetails.campaignDate).toISOString().slice(0, 10));
    // setFieldValue("countryCode", getSingleDetails.countryCode);
    // setFieldValue("exoPhone", getSingleDetails.phoneNumber);
    // setFieldValue("audienceBucket", getSingleDetails.contactListId);
    // setFieldValue("type", getSingleDetails?.type);
    // const time = getSingleDetails.campaignTime.match(/\d{2}:\d{2}/)[0]
    // setFieldValue("appt", time);

  }
});


const handleConnect = handleSubmit(async (values: any) => {
  try {
    if (userModalState.value.id) {
      await $fetch(`/api/org/campaign/${userModalState.value.id}`, { method: "PUT", body: values });
      toast.success("Updated successfully")
    } else {
      await $fetch("/api/org/campaign", { method: "POST", body: values });
      toast.success("Created successfully")
    }
    emit("confirm")
  } catch (error: any) {
    toast.error(error.data)
  }

});
  const passwordVisible = ref(false);
  const confirmPasswordVisible = ref(false);

  const togglePasswordVisibility = () => {
    passwordVisible.value = !passwordVisible.value;
  };
  const toggleConfirmPasswordVisibility = () => {
    confirmPasswordVisible.value = !confirmPasswordVisible.value;
  };
</script>
<template>
  <DialogWrapper v-model="userModalState" :title="(userModalState.id) ? 'Modify User' : 'Add User'">

     <form class="space-y-2" @submit="handleConnect">
             <!-- copy paste the class  below-->
            <!-- class="h-[50px] rounded-lg bg-[#f6f6f6] font-medium" -->

        <div class="grid  gap-4">
          <TextField
            type="email"
            name="email"
            label="E-mail"
            placeholder="Enter Your Email"
            required
          />
          <div class="relative">
          <TextField
            :type="passwordVisible ? 'text' : 'password'"
            name="password"
            label="Password"
            placeholder="Password"
            required
          >
            <template #endIcon>
              <div
                class="w-[30px] cursor-pointer"
                @click="togglePasswordVisibility"
                type="button"
              >
                <OpenEye v-if="passwordVisible" />
                <CloseEyeIcon v-else />
              </div>
            </template>
          </TextField>
        </div>
  <div class="relative">
          <TextField
            :type="confirmPasswordVisible ? 'text' : 'password'"
            name="confirmPassword"
            label="Confirm Password"
            placeholder="Confirm Your Password"
            required
          >
            <template #endIcon>
              <div
                class="w-[30px] cursor-pointer"
                @click="toggleConfirmPasswordVisibility"
                type="button"
              >
                <OpenEye v-if="confirmPasswordVisible" />
                <CloseEyeIcon v-else />
              </div> </template></TextField>
              </div>
   
        </div>
              <div class="flex justify-end w-full">
        <UiButton type="submit" class="mt-2" color="primary"> Submit </UiButton>
      </div>
      </form>
  </DialogWrapper>
</template>