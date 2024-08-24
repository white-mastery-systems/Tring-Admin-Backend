<script setup lang="ts">
  interface Props {
    details?: Record<string, string>;
  }
  interface Emits {
    (e: "refresh"): void;
    (e: "close"): void;
  }

  const props = defineProps<Props>();
  const emit = defineEmits<Emits>();
  const route = useRoute("bots-id-intent-management");

  const showIntentDialog = defineModel<boolean>({
    default: false,
    required: true,
  });

  const isEditing = computed(() => (props.details ? true : false));

  const botDetails: any = await getBotDetails(route.params.id);

  const initialValues = reactive({
    intent: "",
    link: "",
  });

  const handleIntents = (values: any) => {
    isEditing.value ? editIntent(values) : addIntent(values);
  };

  const addIntent = async (values: any) => {
    const intentDetails: any = {
      id: botDetails.id,
      ...values,
    };
    await createBotIntents({
      intentDetails,
      onSuccess: () => {
        showIntentDialog.value = false;
        toast.success("Intent added successfully");
        emit("refresh");
      },
    });
  };

  const editIntent = (values: any) => {};

  const title = computed(() =>
    isEditing.value ? "Edit Intent" : "Add Intent",
  );

  watch(isEditing, async (newValue) => {
    if (newValue) {
      const intent = await $fetch(
        `/api/bots/${props.details?.botId}/intents/${props.details?.id}`,
      );

      initialValues.intent = intent.intent;
      initialValues.link = intent.link;
    }
  });
</script>

<template>
  <UiDialog v-model:open="showIntentDialog" @close="$emit('close')">
    <UiDialogContent class="sm:max-w-[425px]">
      <UiForm
        class="flex flex-col gap-2"
        @submit="handleIntents"
        :initial-values="initialValues"
      >
        <UiDialogHeader>
          <UiDialogTitle class="text-indigo-600">{{ title }}</UiDialogTitle>
        </UiDialogHeader>
        <UiFormField v-slot="{ componentField }" name="intent">
          <UiFormItem class="w-full">
            <UiFormLabel
              >Actions<UiLabel class="text-lg text-red-500">*</UiLabel>
            </UiFormLabel>
            <UiFormControl>
              <UiSelect v-bind="componentField">
                <UiSelectTrigger>
                  <UiSelectValue placeholder="Select Intent" />
                </UiSelectTrigger>
                <UiSelectContent>
                  <UiSelectItem value="location">Location</UiSelectItem>
                  <UiSelectItem value="virtual_tour">Virtual Tour</UiSelectItem>
                  <UiSelectItem value="schedule_call"
                    >Schedule Call</UiSelectItem
                  >
                  <UiSelectItem value="site_visit"
                    >Schedule Site Visit</UiSelectItem
                  >
                </UiSelectContent>
              </UiSelect>
              <UiFormField
                v-if="componentField.modelValue === 'Other'"
                v-slot="{ componentField }"
                name="link"
              >
                <UiFormItem class="w-full">
                  <UiFormControl>
                    <UiInput v-bind="componentField" type="text" />
                  </UiFormControl>
                  <UiFormMessage />
                </UiFormItem>
              </UiFormField>
            </UiFormControl>
            <UiFormMessage />
            <span class="text-xs text-gray-500">Select your intent.</span>
          </UiFormItem>
        </UiFormField>
        <UiFormField v-slot="{ componentField }" name="link">
          <UiFormItem class="w-full">
            <UiFormLabel
              >Add Link <UiLabel class="text-lg text-red-500">*</UiLabel>
            </UiFormLabel>
            <UiFormControl>
              <UiInput
                v-bind="componentField"
                type="text"
                placeholder="Eg: enter your preferred value"
              />
            </UiFormControl>
            <span class="text-xs text-gray-500">Enter intent link</span>
            <UiFormMessage />
          </UiFormItem>
        </UiFormField>

        <UiDialogFooter>
          <UiButton
            color="primary"
            class="bg-[#424bd1] hover:bg-[#424bd1] hover:brightness-110"
            type="submit"
          >
            Save changes
          </UiButton>
        </UiDialogFooter>
      </UiForm>
    </UiDialogContent>
  </UiDialog>
</template>
