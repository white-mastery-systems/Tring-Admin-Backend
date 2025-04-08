<template>
  <div class="pb-7">
    <div class="my-5 flex items-center justify-between">
      <div class="text-xs sm:text-xs md:text-sm lg:text-lg font-bold">LLM Caching</div>
    </div>

    <div class="pb-2 sm:pb-0">
      <form @submit.prevent="onSubmit" class="flex flex-col gap-2 space-y-8">
        <div class="flex flex-col gap-5">
          <!-- LLM Caching Field -->
          <UiFormField v-slot="{ value, handleChange }" name="llmCaching">
            <UiFormItem class="w-[49%]">
              <div class="flex justify-between">
                <UiLabel class="text-xs sm:text-xs md:text-xs lg:text-sm font-medium">LLM Caching</UiLabel>
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
                <UiLabel class="text-xs sm:text-xs md:text-sm font-medium">Dynamic Caching</UiLabel>
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
        <UiButton color="primary" type="submit" class="w-[120px] self-end" size="lg" :loading="isLoading"
          :disabled="!formHasChanged">
          {{ formHasChanged ? 'Submit' : 'No Changes' }}
        </UiButton>
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
const originalValues = ref({
  llmCaching: false,
  dynamicCaching: false,
  distance: null as number | null
});


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

// Watch for bot details to set initial values
watch(() => props.botDetails, (newBotDetails) => {
  if (newBotDetails && newBotDetails.clientConfig) {
    // Set form values from bot details
    setFieldValue("llmCaching", newBotDetails.clientConfig.llmCaching ?? false);
    setFieldValue("dynamicCaching", newBotDetails.clientConfig.dynamicCaching ?? false);
    setFieldValue("distance", newBotDetails.clientConfig.distance ?? null);

    // Store original values
    nextTick(() => {
      originalValues.value = {
        llmCaching: newBotDetails.clientConfig.llmCaching ?? false,
        dynamicCaching: newBotDetails.clientConfig.dynamicCaching ?? false,
        distance: newBotDetails.clientConfig.distance ?? null
      };
    });
  }
}, { immediate: true, deep: true });


const hasFormChanged = () => {
  // Skip comparison if no original values are set yet
  if (Object.keys(originalValues.value).length === 0) return false;

  // Check LLM Caching
  if (values.llmCaching !== originalValues.value.llmCaching) {
    return true;
  }

  // Check Dynamic Caching
  if (values.dynamicCaching !== originalValues.value.dynamicCaching) {
    return true;
  }

  // Check Distance
  // Use parseFloat to handle potential type conversions
  const originalDistance = originalValues.value.distance;
  const currentDistance = values.distance;

  if (
    (originalDistance === null && currentDistance !== null) ||
    (originalDistance !== null && currentDistance === null) ||
    (originalDistance !== null && currentDistance !== null &&
      Math.abs(parseFloat(String(originalDistance)) - parseFloat(String(currentDistance))) > 0.001)
  ) {
    return true;
  }

  return false;
};

// Computed property for template binding
const formHasChanged = computed(() => {
  return hasFormChanged();
});


// Form submission handler
const onSubmit = handleSubmit(async (value: any) => {
  // Only proceed if form has changed
  if (hasFormChanged()) {
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

    // Update original values after successful submission
    nextTick(() => {
      originalValues.value = {
        llmCaching: value.llmCaching ?? false,
        dynamicCaching: value.dynamicCaching ?? false,
        distance: value.distance ?? null
      };
    });

    isLoading.value = false;

    return navigateTo({
      name: "voice-bot-id",
      params: { id: props.botDetails.id },
    });
  } else {
    console.log("No changes detected, skipping API call");
  }
});
</script>