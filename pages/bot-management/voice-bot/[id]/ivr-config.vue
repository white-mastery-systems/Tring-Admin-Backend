<script setup lang="ts">
definePageMeta({
  middleware: "admin-only",
});

const animationProps = {
  duration: 500,
};
const formSchema = toTypedSchema(
  z.object({
    provider: z.string().min(1, 'Name is required'),
    number: z.string().min(2, "Number must be provided."),
    calldirection: z.string().min(1, 'Call direction is required'),
  })
)
const route = useRoute("bot-management-voice-bot-id-ivr-config");
const botDetails: any = await getVoiceBotDetails(route.params.id);

const roles = ['Customer Support', 'Receptionist']
const domainList = ['Admin', 'User', 'Editor', 'Viewer', 'Contributor', 'Manager'];
const onSubmit = async (value: any) => {
  console.log(value, "value")
  await updateLLMConfig({ ivrConfig: value }, botDetails.id);
  return navigateTo({
    name: "bot-management-voice-bot-id",
    params: { id: botDetails.id },
  });
};
</script>
<template>
  <Page title="IVR Configuration" :bread-crumbs="[
    { label: `${botDetails.name}`, to: `/bot-management/voice-bot/${botDetails.id}` },
    {
      label: 'IVR Configuration',
      to: `/bot-management/voice-bot/${botDetails.id}/ivr-config`,
    },
  ]" :disableSelector="true" :disable-back-button="false" :disableElevation="false">
    <div>
      <UiForm :validation-schema="formSchema" :keep-values="true" :validate-on-mount="false" @submit="onSubmit"
        class="space-y-4">
        <div class="flex grid gap-4 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
          <UiFormField v-slot="{ componentField }" name="provider">
            <UiFormItem v-auto-animate="animationProps" class="w-full">
              <UiFormLabel class="font-bold"> IVR Provider <UiLabel class="text-red-500 text-lg">*</UiLabel>
              </UiFormLabel>
              <UiFormControl>
                <UiInput v-bind="componentField" type="text" placeholder="Enter Provider" class="h-10 font-regular" />
              </UiFormControl>
              <UiFormMessage />
            </UiFormItem>
          </UiFormField>
          <!-- <div class="flex gap-4 mb-4"> -->
          <UiFormField v-slot="{ componentField }" name="number">
            <UiFormItem v-auto-animate="animationProps" class="w-full">
              <UiFormLabel class="font-bold"> Number <UiLabel class="text-red-500 text-lg">*</UiLabel>
              </UiFormLabel>
              <UiFormControl>
                <UiInput v-bind="componentField" type="text" placeholder="Enter Number" class="h-10 font-regular" />
              </UiFormControl>
              <UiFormMessage />
            </UiFormItem>
          </UiFormField>
          <UiFormField v-slot="{ componentField }" name="calldirection">
            <UiFormItem v-auto-animate="animationProps" class="w-full">
              <UiFormLabel class="font-bold"> Call Direction <UiLabel class="text-red-500 text-lg">*</UiLabel>
              </UiFormLabel>
              <UiFormControl>
                <UiInput v-bind="componentField" type="text" placeholder="Enter call direction" class="h-10 font-regular" />
              </UiFormControl>
              <UiFormMessage />
            </UiFormItem>
          </UiFormField>
        </div>
        <!-- </div> -->
        <div class="flex justify-end w-full">
          <UiButton type="submit" class="bg-[#424bd1] hover:bg-[#424bd1] hover:brightness-110 w-[120px]" size="lg">
            Submit
          </UiButton>
        </div>
      </UiForm>
    </div>
  </Page>
</template>
