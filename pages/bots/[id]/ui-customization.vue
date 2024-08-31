<template>
  <page
    title="UI Customization"
    :bread-crumbs="[
      { label: `${botDetails.name}`, to: `/bots/${botDetails.id}` },
      {
        label: 'UI Customization',
        to: `/bots/${botDetails.id}/ui-customization`,
      },
    ]"
    :disableSelector="true"
    :disable-back-button="false"
    :disable-elevation="true"
  >
    <div>
      <UiForm
        :validation-schema="formSchema"
        :keep-values="true"
        :initial-values="defaultFormValues"
        :validate-on-mount="false"
        @submit="uiUpdate"
        class="space-y-5"
      >
        <div
          class="form-align field_shadow ml-0 flex w-full flex-col gap-[13px] overflow-y-auto p-5 sm:ml-0 sm:w-full md:ml-0 md:w-full lg:ml-11 lg:w-[60%] xl:ml-11 xl:w-[60%]"
        >
          <UiFormField v-slot="{ handleChange, handleBlur, value }" name="logo">
            <UiFormItem
              v-auto-animate="animationProps"
              class="flex w-full flex-col items-start"
            >
              <UiLabel class="pb-2 text-lg font-medium">Logo</UiLabel>
              <div>
                <ImageUpload
                  accept="image/*"
                  @change="handleChange"
                  @blur="handleBlur"
                  :initial-file="value"
                  class="flex justify-start"
                />
              </div>
              <!-- <UiFormControl>
              </UiFormControl> -->
              <UiFormMessage />
              <span class="text-xs text-gray-500"
                >Logo for chat bubble and avatar</span
              >
            </UiFormItem>
          </UiFormField>

          <div class="flex items-center gap-2">
            <UiFormField v-slot="{ componentField }" name="color">
              <UiFormItem v-auto-animate="animationProps" class="w-full">
                <!-- <UiLabel class="text-lg font-medium">Color</UiLabel> -->
                <UiFormControl>
                  <div
                    class="field_shadow flex h-14 items-center gap-8 rounded-lg bg-white px-5"
                  >
                    <div class="flex w-full justify-between">
                      <label
                        for="color"
                        class="py-auto content-center text-base font-medium"
                        >Primary Color</label
                      >
                      <div class="h-8 w-8 overflow-hidden rounded-full">
                        <UiInput
                          v-bind="componentField"
                          type="color"
                          class="h-20 w-20 -translate-x-1/3 -translate-y-1/3"
                        />
                        <!-- <input v-bind="componentField" type="color" id="colorId" name="color"
                        class="h-20 w-20 -translate-x-1/3 -translate-y-1/3" /> -->
                      </div>
                    </div>
                  </div>
                </UiFormControl>
                <UiFormMessage />
                <span class="text-xs text-gray-500"
                  >This color will be used for Messages,Widget Bubble</span
                >
              </UiFormItem>
            </UiFormField>
            <UiFormField v-slot="{ componentField }" name="secondaryColor">
              <UiFormItem v-auto-animate="animationProps" class="w-full">
                <!-- <UiLabel class="text-lg font-medium">Color</UiLabel> -->
                <UiFormControl>
                  <div
                    class="field_shadow flex h-14 items-center gap-8 rounded-lg bg-white px-5"
                  >
                    <div class="flex w-full justify-between">
                      <label
                        for="color"
                        class="py-auto content-center text-base font-medium"
                        >Secondary Color</label
                      >
                      <div class="h-8 w-8 overflow-hidden rounded-full">
                        <UiInput
                          v-bind="componentField"
                          type="color"
                          class="h-20 w-20 -translate-x-1/3 -translate-y-1/3"
                        />
                      </div>
                    </div>
                  </div>
                </UiFormControl>
                <UiFormMessage />
                <span class="text-xs text-gray-500"
                  >This color will be used for chat buttons</span
                >
              </UiFormItem>
            </UiFormField>
          </div>
          <div class="flex w-full items-center justify-between">
            <div class="w-[50%]">
              <UiFormField v-slot="{ componentField }" name="widgetSound">
                <UiFormItem v-auto-animate="animationProps">
                  <UiLabel class="text-lg font-medium">Widget Sound</UiLabel>
                  <UiFormControl>
                    <UiSelect v-bind="componentField">
                      <UiSelectTrigger
                        class="hover:focus:none hover:focus-visible:none field_shadow h-12 w-[60%] bg-[#ffffff]"
                      >
                        <UiSelectValue placeholder="Select Widget Sound" />
                      </UiSelectTrigger>
                      <UiSelectContent>
                        <UiSelectItem value="Yes"> Yes </UiSelectItem>
                        <UiSelectItem value="No"> No </UiSelectItem>
                      </UiSelectContent>
                    </UiSelect>
                  </UiFormControl>
                  <UiFormMessage />
                  <span
                    class="text-[9px] text-gray-500 sm:text-[6px] md:text-[8px] lg:text-xs xl:text-xs"
                    >Notification sound for chat window</span
                  >
                </UiFormItem>
              </UiFormField>
            </div>
            <div class="w-[50%]">
              <UiFormField v-slot="{ componentField }" name="widgetPosition">
                <UiFormItem
                  v-auto-animate="animationProps"
                  class="flex flex-col items-end justify-center"
                >
                  <UiLabel class="text-lg font-medium">Widget Position</UiLabel>
                  <UiFormControl>
                    <UiSelect v-bind="componentField">
                      <UiSelectTrigger
                        class="hover:focus-visible:none hover:focus:none field_shadow h-12 w-[60%] bg-[#ffffff]"
                      >
                        <UiSelectValue placeholder="Select Widget Position" />
                      </UiSelectTrigger>
                      <UiSelectContent>
                        <UiSelectItem value="Left"> Left </UiSelectItem>
                        <UiSelectItem value="Right"> Right </UiSelectItem>
                      </UiSelectContent>
                    </UiSelect>
                  </UiFormControl>
                  <UiFormMessage />
                  <span
                    class="text-[9px] text-gray-500 sm:text-[6px] md:text-[8px] lg:text-xs xl:text-xs"
                    >Position for chat bubble</span
                  >
                </UiFormItem>
              </UiFormField>
            </div>
          </div>

          <UiFormField v-slot="{ value, handleChange }" name="defaultSelect">
            <UiFormItem v-auto-animate="animationProps" class="w-full">
              <div class="flex justify-between">
                <UiLabel class="text-base font-medium">Open By Default</UiLabel>
                <UiFormControl>
                  <UiSwitch
                    id="defaultSelect"
                    :checked="value"
                    @update:checked="handleChange"
                    :style="{ background: value ? '#424BD1' : '#8A8A8A' }"
                  />
                </UiFormControl>
                <UiFormMessage />
              </div>
              <span class="text-xs text-gray-500"
                >Open chat window by default</span
              >
            </UiFormItem>
          </UiFormField>

          <UiFormField v-slot="{ value, handleChange }" name="generateLead">
            <UiFormItem
              v-auto-animate="animationProps"
              class="flex w-full items-center justify-between"
            >
              <!-- <div class="flex items-center justify-between"> -->
              <UiLabel class="text-base font-medium">Generate Leads</UiLabel>
              <UiFormControl>
                <UiSwitch
                  id="generateLead"
                  :checked="value"
                  @update:checked="handleChange"
                  :style="{ background: value ? '#424BD1' : '#8A8A8A' }"
                />
              </UiFormControl>
              <!-- </div> -->
              <UiFormMessage />
            </UiFormItem>
          </UiFormField>

          <UiFormField v-slot="{ value, handleChange }" name="onlineStatus">
            <UiFormItem v-auto-animate="animationProps" class="w-full">
              <div class="flex items-center justify-between">
                <UiLabel class="text-base font-medium">Online Status</UiLabel>
                <UiFormControl>
                  <UiSwitch
                    id="online-status"
                    :checked="value"
                    :style="{ background: value ? '#424BD1' : '#8A8A8A' }"
                    @update:checked="handleChange"
                  />
                </UiFormControl>
                <UiFormMessage />
              </div>
              <span class="text-xs text-gray-500"
                >Live tag status of chat window</span
              >
            </UiFormItem>
          </UiFormField>

          <div class="my-auto flex w-full justify-center">
            <UiButton
              type="submit"
              class="my-auto h-[40px] w-[40%] rounded-[10px] bg-[#424bd1] text-base font-semibold text-[#ffffff] hover:bg-[#424bd1]"
            >
              Submit
            </UiButton>
          </div>
        </div>
      </UiForm>
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

  const formSchema = toTypedSchema(
    z.object({
      logo: z.union([logoAsString, logoAsObject]),
      color: z.string().min(1, "Primary color is required"),
      secondaryColor: z.string().min(1, "Secondary color is required"),
      widgetSound: z.string().min(1, "Widget sound must be selected"),
      widgetPosition: z.string().min(1, "Widget position must be selected"),

      defaultSelect: z.boolean().optional(),
      generateLead: z.boolean().optional(),
      onlineStatus: z.boolean().optional(),
    }),
  );
  const animationProps = {
    duration: 500,
  };

  const route = useRoute();
  const router = useRouter();
  const paramId: any = route;
  const botDetails: any = await getBotDetails(paramId.params.id);
  const defaultFormValues = reactive({
    logo: botDetails.metadata.ui.logo ?? "",
    color: hslToHex(botDetails.metadata.ui.color ?? "236, 61%, 54%, 1"),
    secondaryColor: hslToHex(
      botDetails.metadata.ui.secondaryColor ?? "236, 61%, 74%",
    ),
    defaultSelect: botDetails.metadata.ui.defaultSelect ?? true,
    widgetSound: botDetails.metadata.ui.widgetSound ?? "Yes",
    widgetPosition: botDetails.metadata.ui.widgetPosition ?? "Left",
    onlineStatus: botDetails.metadata.ui.onlineStatus ?? false,
    generateLead: botDetails.metadata.prompt.INTENTS !== "-other",
  });
  // const { handleSubmit }: any = useForm({
  //   validationSchema: formSchema,
  //   initialValues: defaultFormValues,
  // })

  const uiUpdate = async (value: any) => {
    console.log(JSON.stringify(value, null, 2));
    // console.log(ges, "value -- value");
    const payload: any = {
      // name: botDetails.name,
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
        },
        prompt: {
          ...botDetails.metadata.prompt,
          INTENTS: value.generateLead ? "-details\n-other" : "-other",
        },
      },
    };
    await updateBotDetails(payload);

    value.logo && (await uploadLogo(botDetails.id, value.logo![0]));

    return navigateTo({
      name: "bots-id",
      params: { id: paramId.params.id },
    });
    // console.log(botDetails.name, "botDetails.name")
    // console.log(pickColor.value, "pickColor.value")
    // console.log(defualtSelect.value, "pickColor.value")
  };
</script>
<style scoped>
  .form-align {
    height: calc(100vh - 120px);
  }
</style>
