<template>
  <page title="UI Customization" :bread-crumbs="[
      {
        label: `${botDetails.name}`,
        to: `/bot-management/chat-bot/${botDetails.id}`,
      },
      {
        label: 'UI Customization',
        to: `/bot-management/chat-bot/${botDetails.id}/ui-customization`,
      },
    ]" :disableSelector="true" :disable-back-button="false" :disable-elevation="false">
    <div>
      <form @submit.prevent="uiUpdate" class="space-y-6">
        <div
          class="form-align ml-0 flex w-full flex-col gap-[13px] p-5 sm:ml-0 sm:w-full md:ml-0 md:w-full lg:ml-11 lg:w-[60%] xl:ml-11 xl:w-[60%] overflow-scroll">
          <UiFormField v-slot="{ handleChange, handleBlur, value }" name="logo">
            <UiFormItem v-auto-animate="animationProps" class="flex w-full flex-col items-start">
              <UiLabel class="pb-2 text-lg font-medium">Logo</UiLabel>
              <div>
                <ImageUpload accept="image/*" @change="handleChange" @blur="handleBlur" :initial-file="value"
                  class="flex justify-start" />
              </div>
              <!-- <UiFormControl>
              </UiFormControl> -->
              <UiFormMessage />
              <span class="text-xs text-gray-500">Logo for chat bubble and avatar</span>
            </UiFormItem>
          </UiFormField>

          <div class="flex items-center gap-4">
            <UiFormField v-slot="{ componentField }" name="color">
              <UiFormItem v-auto-animate="animationProps" class="w-full">
                <!-- <UiLabel class="text-lg font-medium">Color</UiLabel> -->
                <UiFormControl>
                  <div class="field_shadow flex h-14 items-center gap-8 rounded-lg bg-white px-5">
                    <div class="flex w-full justify-between">
                      <label for="color" class="py-auto content-center text-base font-medium">Primary Color</label>
                      <div class="h-8 w-8 overflow-hidden rounded-full">
                        <UiInput v-bind="componentField" type="color"
                          class="h-20 w-20 -translate-x-1/3 -translate-y-1/3" />
                        <!-- <input v-bind="componentField" type="color" id="colorId" name="color"
                        class="h-20 w-20 -translate-x-1/3 -translate-y-1/3" /> -->
                      </div>
                    </div>
                  </div>
                </UiFormControl>
                <UiFormMessage />
                <span class="text-xs text-gray-500">color used for Messages,Widget Bubble</span>
              </UiFormItem>
            </UiFormField>
            <UiFormField v-slot="{ componentField }" name="secondaryColor">
              <UiFormItem v-auto-animate="animationProps" class="w-full">
                <!-- <UiLabel class="text-lg font-medium">Color</UiLabel> -->
                <UiFormControl>
                  <div class="field_shadow flex h-14 items-center gap-8 rounded-lg bg-white px-5">
                    <div class="flex w-full justify-between">
                      <label for="color" class="py-auto content-center text-base font-medium">Secondary Color</label>
                      <div class="h-8 w-8 overflow-hidden rounded-full">
                        <UiInput v-bind="componentField" type="color"
                          class="h-20 w-20 -translate-x-1/3 -translate-y-1/3" />
                      </div>
                    </div>
                  </div>
                </UiFormControl>
                <UiFormMessage />
                <span class="text-xs text-gray-500">color used for chat buttons</span>
              </UiFormItem>
            </UiFormField>
          </div>
          <div class="flex w-full items-center gap-3">
            <SelectField name="widgetSound" label="Widget Sound" placeholder="Select Widget Sound" :options="[
              {
                value: 'Yes',
                label: 'Yes',
              }, {
                value: 'No',
                label: 'No',
              },
            ]" required />
            <SelectField name="widgetPosition" label="Widget Position" placeholder="Select Widget Sound" :options="[
              {
                value: 'Left',
                label: 'Left',
              }, {
                value: 'Right',
                label: 'Right',
              },
            ]" required />
          </div>
          <div class="flex w-full items-center gap-5">
            <SelectField name="fontFamily" label="Font Famliy" placeholder="Select Font" :options="[
            {
              value: 'Kanit',
              label: 'Kanit',
            }, {
              value: 'Gilroy',
              label: 'Gilroy',
            }, {
              value: 'Jost',
              label: 'Jost',
            }, {
              value: 'Lexend deca',
              label: 'Lexend deca',
            },
          ]" required />
            <UiFormField v-slot="{ value, handleChange }" name="generateLead">
              <UiFormItem v-auto-animate="animationProps" class="flex w-full items-center justify-between">
                <!-- <div class="flex items-center justify-between"> -->
                <UiLabel class="text-base font-medium">Generate Leads</UiLabel>
                <UiFormControl>
                  <UiSwitch id="generateLead" :checked="value" @update:checked="handleChange"
                    :style="{ background: value ? '#424BD1' : '#8A8A8A' }" />
                </UiFormControl>
                <!-- </div> -->
                <UiFormMessage />
              </UiFormItem>
            </UiFormField>
          </div>
          <div class="flex w-full items-center gap-5">
            <UiFormField v-slot="{ value, handleChange }" name="defaultSelect">
              <UiFormItem v-auto-animate="animationProps" class="w-full">
                <div class="flex justify-between">
                  <UiLabel class="text-base font-medium">Open By Default</UiLabel>
                  <UiFormControl>
                    <UiSwitch id="defaultSelect" :checked="value" @update:checked="handleChange"
                      :style="{ background: value ? '#424BD1' : '#8A8A8A' }" />
                  </UiFormControl>
                  <UiFormMessage />
                </div>
                <span class="text-xs text-gray-500">Open chat window by default</span>
              </UiFormItem>
            </UiFormField>
  
            <UiFormField v-slot="{ value, handleChange }" name="onlineStatus">
              <UiFormItem v-auto-animate="animationProps" class="w-full">
                <div class="flex items-center justify-between">
                  <UiLabel class="text-base font-medium">Online Status</UiLabel>
                  <UiFormControl>
                    <UiSwitch id="online-status" :checked="value" :style="{ background: value ? '#424BD1' : '#8A8A8A' }"
                      @update:checked="handleChange" />
                  </UiFormControl>
                  <UiFormMessage />
                </div>
                <span class="text-xs text-gray-500">Live tag status of chat window</span>
              </UiFormItem>
            </UiFormField>
          </div>

          <div class="my-auto flex w-full justify-end pb-2">
            <UiButton type="submit" color="primary" size="lg" :loading="isLoading">
              Submit
            </UiButton>
          </div>
        </div>
      </form>
    </div>
  </page>
  <!-- </div> -->
  <!-- <div class="pl-2 pr-10 pt-10">
      <UiLabel class="content-center items-center">Preview Widget</UiLabel>
    </div> -->
  <!-- </div> -->
</template>
<script setup lang="ts">
  definePageMeta({
    middleware: "admin-only",
  });

  const logoAsObject = z.object({}).nonstrict();
  const logoAsString = z.string().min(1, "Logo is required");
  const isLoading = ref(false)


  const uiCustomizationValidation = toTypedSchema(
    z.object({
      logo: z.union([logoAsString, logoAsObject]),
      color: z.string().min(1, "Primary color is required"),
      secondaryColor: z.string().min(1, "Secondary color is required"),
      widgetSound: z.string().min(1, "Widget sound must be selected"),
      widgetPosition: z.string().min(1, "Widget position must be selected"),
      fontFamily: z.string().min(1, "Font family color is required"),
      defaultSelect: z.boolean().optional(),
      generateLead: z.boolean().optional(),
      onlineStatus: z.boolean().optional(),
    }),
  );
  const animationProps = {
    duration: 500,
  };

  const route = useRoute("bot-management-chat-bot-id-ui-customization");
  const router = useRouter();
  const paramId: any = route;
  const botDetails: any = await getBotDetails(paramId.params.id);
const {
  errors,
  setErrors,
  setFieldValue,
  handleSubmit,
  defineField,
  values,
  resetForm,
} = useForm({
  validationSchema: uiCustomizationValidation,
});
setFieldValue("logo", (botDetails.metadata.ui.logo ?? ""))
setFieldValue("color", (hslToHex(botDetails.metadata.ui.color ?? "236, 61%, 54%, 1")))
setFieldValue("secondaryColor", (hslToHex(
  botDetails.metadata.ui.secondaryColor ?? "236, 61%, 74%",
)))    
setFieldValue("widgetSound", (botDetails.metadata.ui.widgetSound ?? "Yes"))
setFieldValue("widgetPosition", (botDetails.metadata.ui.widgetPosition ?? "Left"))
setFieldValue("defaultSelect", (botDetails.metadata.ui.defaultSelect ?? true))
setFieldValue("onlineStatus", (botDetails.metadata.ui.onlineStatus ?? false))
setFieldValue("generateLead", (botDetails.metadata.prompt.INTENTS !== "-other"))
setFieldValue("fontFamily", (botDetails.metadata?.ui.fontFamily ?? "Kanit"))

watchEffect(() => {
  if (botDetails) {
    const userName = botDetails?.name ?? 'Unknown Bot Name';
    useHead({
      title: `Chat Bot | ${userName} - UI Customization`,
    });
  }
});

const uiUpdate = handleSubmit(async (value: any) => {
    isLoading.value = true
    const payload: any = {
      id: botDetails.id,
      metadata: {
        ...botDetails.metadata,
        ui: {
          logo: value.logo,
          color: hexToHSL(value.color),
          secondaryColor: hexToHSL(value.secondaryColor),
          defaultSelect: value.defaultSelect,
          onlineStatus: value.onlineStatus,
          widgetPosition: value.widgetPosition,
          widgetSound: value.widgetSound,
          fontFamily: value.fontFamily,
        },
        prompt: {
          ...botDetails.metadata.prompt,
          INTENTS: value.generateLead ? "-details\n-other" : "-other",
        },
      },
    };
    await updateBotDetails(payload);

    if (value.logo?.length > 0 && typeof value.logo === "object") {
      await uploadLogo(botDetails.id, value.logo![0]);
    }
    isLoading.value = false
    return navigateTo({
      name: "bot-management-chat-bot-id",
      params: { id: paramId.params.id },
    });
    // console.log(botDetails.name, "botDetails.name")
    // console.log(pickColor.value, "pickColor.value")
    // console.log(defualtSelect.value, "pickColor.value")
  });
</script>
<style scoped>
  .form-align {
    height: calc(100vh - 120px);
  }
</style>
