<template>
  <div class="pb-7">
    <div class="my-5 flex items-center justify-between">
      <div class="text-[18px] font-bold">LLM Caching</div>
      <!-- <UiButton @click="
        () => {
          // Any additional action if needed
        }
      ">
        Refresh
      </UiButton> -->
    </div>

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
                  }" :style="{ background: value ? '#FFBC42' : '#8A8A8A' }" />
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
                  }" :style="{ background: value ? '#FFBC42' : '#8A8A8A' }" />
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
          <UiButton color="primary" type="submit" class="w-[120px] self-end"
            size="lg" :loading="isLoading">
            Submit
          </UiButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon, UiButton } from "#components";
import { LanguageList } from '~/composables/useLanguageList';

// Setup
definePageMeta({
  middleware: "admin-only",
});
const route = useRoute("voice-bot-id-identity-management");
// const botDetails(await getVoiceBotDetails(route.params.id));
const props = defineProps<{ botDetails: any; loading: boolean; refreshBot: () => void }>();
const config = useRuntimeConfig();

// Language and loading state
const { languageList } = LanguageList();
const isLoading = ref(false);

// Form validation schema
const botSchema = toTypedSchema(
  z.object({
    distance: z.number().optional(),
    llmCaching: z.boolean().optional(),
    dynamicCaching: z.boolean().optional(),
  }),
);

// Form setup
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

// Set initial values from bot details
setFieldValue("distance", props.botDetails.clientConfig.distance);
setFieldValue("llmCaching", props.botDetails.clientConfig.llmCaching);
setFieldValue("dynamicCaching", props.botDetails.clientConfig.dynamicCaching);

// Update page title
watchEffect(() => {
  if (props.botDetails) {
    const userName = props.botDetails?.name ?? "Unknown Bot Name";
    useHead({
      title: `Voice Bot | ${userName} - LLM Caching`,
    });
  }
});

// Form submission handler
const onSubmit = handleSubmit(async (value: any) => {
  isLoading.value = true;
  const payload = {
    clientConfig: value
  };

  await updateLLMConfig(payload, props.botDetails.id, "LLM Caching Updated Successfully.");
  if (typeof props.refreshBot === 'function') {
    props.refreshBot();
  } else {
    console.error("refresh function is not available", props.refreshBot);
  }
  isLoading.value = false;

  return navigateTo({
    name: "voice-bot-id",
    params: { id: props.botDetails.id },
  });
});
</script>