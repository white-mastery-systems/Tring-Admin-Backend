<template>
  <!-- :bread-crumbs="[
    { label: `${botDetailsList.name}`, to: `/bot-management/chat-bot/${botDetailsList.id}` },
    {
      label: 'Intent Management',
      to: `/bot-management/chat-bot/${botDetailsList.id}/intent-management`,
    },
  ]"  -->
  <Page title="LLM Caching" :bread-crumbs="[
    
  ]" :disableSelector="true" :disable-back-button="false" :disableElevation="false">
    <div class="pb-2 sm:pb-0">
      <form @submit.prevent="onSubmit" class="flex flex-col gap-2 space-y-8">
        <div class="flex flex-col gap-5">
          <!-- LLM Caching Field -->
          <UiFormField v-slot="{ value, handleChange }" name="llmCaching">
            <UiFormItem class="w-[49%]">
              <div class="flex justify-between">
                <UiLabel class="text-[14px] font-medium">LLM Caching</UiLabel>
                <UiFormControl>
                  <UiSwitch id="llmCaching" :checked="value" @update:checked="(checked) => {
                    handleChange(checked);
                    if (!checked) {
                      values.dynamicCaching = false; // Reset dependent fields
                      values.distance = null;
                    }
                  }" :style="{ background: value ? '#424BD1' : '#8A8A8A' }" />
                </UiFormControl>
                <UiFormMessage />
              </div>
            </UiFormItem>
          </UiFormField>

          <!-- Dynamic Caching Field -->
          <UiFormField v-if="values.llmCaching" v-slot="{ value, handleChange }" name="dynamicCaching">
            <UiFormItem class="w-[49%]">
              <div class="flex justify-between">
                <UiLabel class="text-[14px] font-medium">Dynamic Caching</UiLabel>
                <UiFormControl>
                  <UiSwitch id="dynamicCaching" :checked="value" @update:checked="(checked) => {
                    handleChange(checked);
                    if (!checked) {
                      values.distance = null; // Reset dependent fields
                    }
                  }" :style="{ background: value ? '#424BD1' : '#8A8A8A' }" />
                </UiFormControl>
                <UiFormMessage />
              </div>
            </UiFormItem>
          </UiFormField>

          <!-- Distance Field -->
          <RangeSlider v-if="values.llmCaching" :step="0.05" :name="parseFloat(values.distance)" label="Distance"
            @update="($event) => setFieldValue('distance', $event)" required placeholder="Enter distance" min="0"
            max="1" />
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
import { LanguageList } from '~/composables/useLanguageList';
import { useBreadcrumbStore } from "~/store/breadcrumbs"; // Import the store

const config = useRuntimeConfig()
definePageMeta({
  middleware: "admin-only",
});
const route = useRoute("voice-bot-id-identity-management");
const botDetailsList: any = await getVoiceBotDetails(route.params.id);
const breadcrumbStore = useBreadcrumbStore();
breadcrumbStore.setBreadcrumbs([
  {
    label: 'LLM Caching',
    to: `/voice-bot/${botDetailsList?.id}`,
  },
  {
    label: `${botDetailsList?.name}`,
    to: `/voice-bot/${botDetailsList?.id}/llm-caching`,
  },
]);

const { languageList } = LanguageList();
const isLoading = ref(false);

const botSchema = toTypedSchema(
  z.object({
    distance: z.number().optional(),
    llmCaching: z.boolean().optional(),
    dynamicCaching: z.boolean().optional(),
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

setFieldValue("distance", botDetailsList.clientConfig.distance);
setFieldValue("llmCaching", botDetailsList.clientConfig.llmCaching);
setFieldValue("dynamicCaching", botDetailsList.clientConfig.dynamicCaching);


watchEffect(() => {
  if (botDetailsList) {
    const userName = botDetailsList?.name ?? "Unknown Bot Name";
    useHead({
      title: `Voice Bot | ${userName} - Identity Management`,
    });
  }
});

const onSubmit = handleSubmit(async (value: any) => {
  // updateLLMConfig()
  isLoading.value = true;
  const payload = {
    clientConfig: value
  }
  await updateLLMConfig(payload, botDetailsList.id, "LLM Caching Updated Successfully.");
  isLoading.value = false;

  return navigateTo({
    name: "voice-bot-id",
    params: { id: botDetailsList.id },
  });
});
</script>
