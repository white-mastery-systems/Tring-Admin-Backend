<template>
  <div class="flex items-center mx-5 mt-2">
    <button @click="router.back()">
          <img src="assets\icons\right_arrow.svg" width="20"></img>
        </button>
    <UiLabel class="ml-1 text-[20px] font-bold">UI Customisation</UiLabel>
  </div>
  <div class="flex flex-row">
    <div class="form-align pl-10">
      <!-- {{ botDetails }} -->
      <div class="h-[600px] w-[480px] items-center rounded-md shadow-lg">
        <div class="individual-form-align mt-1 flex flex-col">
          <UiLabel class="pl-2 pb-1 text-lg font-bold">Logo</UiLabel>
          <FileUpload accept="image/*" v-model="logo" class="pr-56" />
        </div>
        <div class="space-y-1 mt-3">
          <UiLabel class="ml-10 text-lg font-bold">Colours</UiLabel>
          <div class="color-picker-align mx-10 h-14 w-[400px] gap-8 rounded-lg bg-white px-5 shadow">
            <div class="flex gap-52">
              <label for="color" class="py-auto content-center text-base font-medium">Primary Colour</label>
              <div class="h-8 w-8 overflow-hidden rounded-full">
                <input v-model="pickColor" type="color" id="colorId" name="color"
                  class="h-20 w-20 -translate-x-1/3 -translate-y-1/3" />
              </div>
            </div>
          </div>
        </div>
        <div class="space-y-2 py-4">
          <UiLabel class="ml-10 text-lg font-bold">Widget Sound</UiLabel>
          <UiSelect v-model="widgetSound">
            <UiSelectTrigger class="hover:focus:none hover:focus-visible:none mx-10 h-12 w-[400px] shadow">
              <UiSelectValue />
            </UiSelectTrigger>
            <UiSelectContent>
              <UiSelectGroup>
                <UiSelectItem value="Yes"> Yes </UiSelectItem>
                <UiSelectItem value="No"> No </UiSelectItem>
              </UiSelectGroup>
            </UiSelectContent>
          </UiSelect>
        </div>
        <div class="space-y-2">
          <UiLabel class="ml-10 text-lg font-bold">Widget Position</UiLabel>
          <UiSelect v-model="widgetPosition">
            <UiSelectTrigger class="hover:focus-visible:none hover:focus:none mx-10 h-12 w-[400px] shadow">
              <UiSelectValue />
            </UiSelectTrigger>
            <UiSelectContent>
              <UiSelectGroup>
                <UiSelectItem value="Left"> Left </UiSelectItem>
                <UiSelectItem value="Right"> Right </UiSelectItem>
              </UiSelectGroup>
            </UiSelectContent>
          </UiSelect>
        </div>
        <div class="space-y-4 py-4">
          <div class="mx-10 flex flex-row justify-between">
            <UiLabel class="text-base font-bold">Open By Default</UiLabel>
            <UiSwitch id="open-by-default" v-model:checked="defaultSelect" class="text-[#424bd1]" />
          </div>
          <div class="mx-10 flex flex-row justify-between">
            <UiLabel class="text-base font-bold">Online Status</UiLabel>
            <UiSwitch id="online-status" v-model:checked="onlineStatus" />
          </div>
        </div>
        <div class="submit-btn-align my-auto">
          <button class="my-auto text-base font-semibold" type="submit" @click="uiUpdate">
            Submit
          </button>
        </div>
      </div>
    </div>
    <!-- <div class="pl-2 pr-10 pt-10">
      <UiLabel class="content-center items-center">Preview Widget</UiLabel>
    </div> -->
  </div>
</template>
<script setup lang="ts">
  definePageMeta({
    middleware: "admin-only",
  });
  const route = useRoute();
  const router = useRouter();
  const paramId: any = route;
  const botDetails: any = await getBotDetails(paramId.params.id);
  const pickColor = ref<string | null>(null);
  const defaultSelect = ref(true);
  const onlineStatus = ref(false);
  const widgetSound = ref("");
  const widgetPosition = ref("");
  const logo = ref<FileList | null>(null);

  onMounted(() => {
    if (Object.entries(botDetails.metadata.ui).length) {
      pickColor.value = hslToHex(botDetails.metadata.ui.color);
      defaultSelect.value = botDetails.metadata.ui.defaultSelect;
      onlineStatus.value = botDetails.metadata.ui.onlineStatus;
    }
  });

  const uiUpdate = async () => {
    console.log(botDetails, "botDetails");
    const payload: any = {
      // name: botDetails.name,
      id: botDetails.id,
      metadata: {
        ...botDetails.metadata,
        ui: {
          color: hexToHSL(pickColor.value),
          defaultSelect: defaultSelect.value,
          onlineStatus: onlineStatus.value,
        },
      },
    };
    await updateBotDetails(payload);

    logo.value && (await uploadLogo(botDetails.id, logo.value![0]));
    // console.log(botDetails.name, "botDetails.name")
    // console.log(pickColor.value, "pickColor.value")
    // console.log(defualtSelect.value, "pickColor.value")
  };
</script>
<style scoped>
  .form-align {
    display: flex;
    /* flex-direction: column; */
    padding-top: 50px;
  }

  form {
    width: 100%;
    display: flex;
    flex-direction: column;
    /* flex-wrap: wrap; */
  }

  .individual-form-align {
    width: 100%;
    padding-left: 40px;
    height: 120px;
  }

  .individual-form-align input {
    background-color: rgba(246, 246, 246, 1);
    width: 100%;
    height: 50px;
    outline: none;
    border-radius: 10px;
    padding: 0 20px;
    margin-top: 20px;
  }

  textarea {
    background-color: rgba(246, 246, 246, 1);
    border-radius: 10px;
    width: 100%;
  }

  .text-area-align {
    display: flex;
    flex-direction: column;
    width: 50%;
    padding: 0 20px;
  }

  .text-area-label {
    margin-bottom: 20px;
  }

  .submit-btn-align {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .submit-btn-align input {
    width: 130px;
    height: 50px;
    border-radius: 10px;
    padding: 0 20px;
    background-color: rgba(246, 246, 246, 1);
    margin-top: 20px;
    margin-right: 170px;
  }

  .color-picker-align {
    display: flex;
    align-items: center;
  }

  .individual-form-align {
    position: relative;
  }

  .input-container {
    position: relative;
    display: flex;
    align-items: center;
  }

  input[type="password"] {
    padding-right: 2.5rem;
    width: 100%;
  }

  .eye-icon {
    position: absolute;
    right: 0.5rem;
    cursor: pointer;
    font-size: 1rem;
  }

  .eye-icon i {
    display: inline-block;
  }
  .submit-btn-align button {
    width: 40%;
    height: 40px;
    border-radius: 10px;
    padding: 0 20px;
    background: #424bd1;
    color: #ffffff;
    /* margin-top: 20px; */
    /* margin-right: 170px; */
  }
</style>
