<template>
  <!-- :bread-crumbs="[
    { label: `${botDetailsList.name}`, to: `/bot-management/chat-bot/${botDetailsList.id}` },
    {
      label: 'Intent Management',
      to: `/bot-management/chat-bot/${botDetailsList.id}/intent-management`,
    },
  ]"  -->
  <Page title="Add tools" :bread-crumbs="[
    {
      label: `${botDetailsList.name}`,
      to: `/bot-management/voice-bot/${botDetailsList.id}`,
    },
    {
      label: 'Add tools',
      to: `/bot-management/voice-bot/${botDetailsList.id}/tools`,
    },
  ]" :disableSelector="true" :disable-back-button="false" :disableElevation="false">
    <div class="pb-2 sm:pb-0">
      <form @submit.prevent="onSubmit" class="flex flex-col gap-2">
        <div class="flex grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-3">
          <TextField name="toolName" label="Tool Name" required placeholder="Enter Tool Name" />
          <TextField name="toolDescription" label="Tool Description" required placeholder="Enter Tool Description" />
          <TextField isTextarea="true" name="description" label="Description" placeholder="enter description" />
          <div class="flex flex-col justify-center gap-5">
            <!-- LLM Caching Field -->
            <UiFormField v-slot="{ value, handleChange }" name="currentDate">
              <UiFormItem class="w-[49%]">
                <div class="flex justify-between">
                  <UiLabel class="text-[14px] font-medium">Current Date</UiLabel>
                  <UiFormControl>
                    <UiSwitch id="currentDate" :checked="value" @update:checked="(checked) => {
                        handleChange(checked);
                      }" :style="{ background: value ? '#424BD1' : '#8A8A8A' }" />
                  </UiFormControl>
                  <UiFormMessage />
                </div>
              </UiFormItem>
            </UiFormField>

            <!-- Dynamic Caching Field -->
            <UiFormField v-slot="{ value, handleChange }" name="concludeCall">
              <UiFormItem class="w-[49%]">
                <div class="flex justify-between">
                  <UiLabel class="text-[14px] font-medium">Conclude Call</UiLabel>
                  <UiFormControl>
                    <UiSwitch id="concludeCall" :checked="value" @update:checked="(checked) => {
                        handleChange(checked);
                      }" :style="{ background: value ? '#424BD1' : '#8A8A8A' }" />
                  </UiFormControl>
                  <UiFormMessage />
                </div>
              </UiFormItem>
            </UiFormField>
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
import { useLanguageList } from '~/composables/useLanguageList';
const config = useRuntimeConfig()
definePageMeta({
  middleware: "admin-only",
});
const route = useRoute("bot-management-voice-bot-id-identity-management");
const botDetailsList: any = await getVoiceBotDetails(route.params.id);


const { languageList } = useLanguageList();
const isLoading = ref(false);

const botSchema = toTypedSchema(
  z.object({
    toolName: z.string({ required_error: 'Tool Name is required.' }).min(1,'Tool Name is required.'),
    toolDescription: z.string({ required_error: 'Tool Description is required.' }).min(1, 'Tool Description is required.'),
    description: z.string().optional(),
    currentDate: z.boolean().optional(),
    concludeCall: z.boolean().optional(),
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

Object.entries(botDetailsList.tools ?? {}).forEach(([key, value]: any) => {
  if (values.hasOwnProperty(key)) {
    console.log(key, "key -- key", value, "value -- value")
    setFieldValue(key, value);
  }
});
// setFieldValue("distance", botDetailsList.clientConfig.distance);
// setFieldValue("llmCaching", botDetailsList.clientConfig.llmCaching);
// setFieldValue("dynamicCaching", botDetailsList.clientConfig.dynamicCaching);


watchEffect(() => {
  if (botDetailsList) {
    const userName = botDetailsList?.name ?? "Unknown Bot Name";
    useHead({
      title: `Voice Bot | ${userName} - Identity Management`,
    });
  }
});
// watch(botDetailsList, () => {
//   console.log(botDetailsList.value.clientConfig, "botDetailsList.value.clientConfig -- botDetailsList.value.clientConfig")
//   setFieldValue("llmCaching", botDetailsList.value.clientConfig)
// })

const onSubmit = handleSubmit(async (value: any) => {
  console.log(value, 'value -- value')
  // updateLLMConfig()
  isLoading.value = true;
  const payload = {
    tools: value
  }
  await updateLLMConfig(payload, botDetailsList.id);
  isLoading.value = false;

  return navigateTo({
    name: "bot-management-voice-bot-id",
    params: { id: botDetailsList.id },
  });
});
</script>
