<script setup lang="ts">
import countryData from '~/assets/country-codes.json'
const emit = defineEmits(["success", "submitted"]);
const channelModalState = defineModel<{ open: boolean }>({
  default: {
    open: false,
  },
});
const countryList = ref(countryData);
const countriesCode = ref()
const countries = ref()
watch(channelModalState, (newState) => { });
const handleConnect = async (values: any) => {
  console.log(values, "values");
  const payload = values
  await $fetch("/api/org/integrations/number-integration", { method: "POST", body: payload });
  // emit("success")
  emit('submitted')
};


// onMounted(async () => {
//   loadCountries()
// });
const phoneNumberPattern = /^\+?[1-9]\d{1,14}$/
const formSchema = toTypedSchema(
  z.object({
    provider: z.string().min(1, 'Provider is required'),
    exoPhone: z.string()
      .min(1, 'Phone Number is required')
      .regex(phoneNumberPattern, 'Invalid phone number'),
      countryCode: z.string().min(1, 'Country Code is required'),
  })
);

</script>

<template>
  <DialogWrapper v-model="channelModalState" title="Add New Number">
    <UiForm v-if="true" v-slot="{ values }" :validation-schema="formSchema" @submit="handleConnect" :keep-values="true"
      :validate-on-mount="false" class="space-y-2">
      <UiFormField v-slot="{ componentField }" name="provider">
        <UiFormItem class="w-full">
          <UiFormLabel>
            Provider <UiLabel class="text-lg text-red-500">*</UiLabel>
          </UiFormLabel>
          <UiFormControl>
            <UiSelect v-bind="componentField">
              <UiSelectTrigger>
                <UiSelectValue placeholder="Select a provider" />
              </UiSelectTrigger>
              <UiSelectContent>
                <UiSelectItem value="twilio">Twilio</UiSelectItem>
                <UiSelectItem value="exotel">Exotel</UiSelectItem>
                <UiSelectItem value="plivo">Plivo</UiSelectItem>
                <UiSelectItem value="doocti">Doocti</UiSelectItem>
              </UiSelectContent>
            </UiSelect>
          </UiFormControl>
          <UiFormMessage />
        </UiFormItem>
      </UiFormField>
      <!-- {{ countryList }} || sdf -->
      <div class="flex gap-2 items-center">
        <UiFormField class="max-w-[20%]" v-slot="{ componentField }" name="countryCode">
          <UiFormItem class="w-[30%]">
            <UiFormLabel class="text-[10px]">
              Country Code
              <UiLabel class="text-lg text-red-500">*</UiLabel>
            </UiFormLabel>
            <UiFormControl>
              <UiSelect v-bind="componentField" class="w-1/4">
                <UiSelectTrigger>
                  <UiSelectValue placeholder="Country Code" />
                </UiSelectTrigger>
                <UiSelectContent>
                  <!-- <div v-for="(list, index) in countryList">
                    <UiSelectItem :value="list.dial_code">{{ list.dial_code }}</UiSelectItem>
                  </div> -->
                  <UiSelectItem value="+91">+91</UiSelectItem>
                </UiSelectContent>
              </UiSelect>
            </UiFormControl>
            <!-- <UiFormMessage :error="errors.phone?.countryCode" /> -->
          </UiFormItem>
        </UiFormField>

        <!-- Phone Number Field -->
        <UiFormField class="w-[80%]" v-slot="{ componentField }" name="exoPhone">
          <UiFormItem class="w-full">
            <UiFormLabel>
              Phone Number <UiLabel class="text-lg text-red-500">*</UiLabel>
            </UiFormLabel>
            <UiFormControl>
              <UiInput v-bind="componentField" placeholder="Enter phone number" />
            </UiFormControl>
            <!-- <UiFormMessage :error="errors.phone?.number" /> -->
          </UiFormItem>
        </UiFormField>
      </div>
      <UiButton type="submit" class="mt-2" color="primary"> Submit </UiButton>
    </UiForm>
  </DialogWrapper>
</template>
<!-- https://accounts.zoho.in/oauth/v2/auth?response_type=code&client_id=1000.7ZU032OIFSMR5YX325O4W3BNSQXS1U&scope=ZohoBigin.settings.ALL,ZohoBigin.modules.ALL&redirect_uri=https://tring-admin.pripod.com/settings/integration/zoho-bigin&prompt=consent&access_type=offline -->
