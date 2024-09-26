<script setup lang="ts">
definePageMeta({
  middleware: "admin-only",
});

const formSchema = toTypedSchema(
  z.object({
    provider: z.string({ required_error: 'Name is required' }).min(1, 'Name is required'),
    number: z.string({ required_error: "Number must be provided." }).min(2, "Number must be provided."),
    calldirection: z.string({ required_error: 'Call direction is required' }).min(1, 'Call direction is required'),
  })
)

const {
  errors,
  setErrors,
  handleSubmit,
  setFieldValue,
  defineField,
  values,
  resetForm,
} = useForm({
  validationSchema: formSchema
})
const route = useRoute("bot-management-voice-bot-id-ivr-config");
const botDetails: any = await getVoiceBotDetails(route.params.id);

const roles = ['Customer Support', 'Receptionist']
const domainList = ['Admin', 'User', 'Editor', 'Viewer', 'Contributor', 'Manager'];


watchEffect(() => {
  if (botDetails) {
    const userName = botDetails?.name ?? 'Unknown Bot Name';
    useHead({
      title: `Voice Bot | ${userName} - IVR Config`,
    });
  }
});

const onSubmit = handleSubmit(async (value: any) => {
  await updateLLMConfig({ ivrConfig: value }, botDetails.id);
  return navigateTo({
    name: "bot-management-voice-bot-id",
    params: { id: botDetails.id },
  });
});
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
      <form @submit="onSubmit">
        <div class="flex grid gap-4 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
          <TextField name="provider" label="IVR Provider" placeholder="Enter Provider" helperText="" required>
          </TextField>
          <TextField name="number" label="Number" placeholder="Enter Number" helperText="" required>
          </TextField>
          <TextField name="calldirection" label="call direction" placeholder="Enter call direction" helperText=""
            required>
          </TextField>
        </div>
        <div class="flex justify-end w-full">
          <UiButton type="submit" class="bg-[#424bd1] hover:bg-[#424bd1] hover:brightness-110 w-[120px]" size="lg">
            Submit
          </UiButton>
        </div>
      </form>
    </div>
  </Page>
</template>
