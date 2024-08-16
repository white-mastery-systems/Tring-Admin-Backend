<template>
  <div>
    <div class="mx-5 mb-5 mt-2 flex items-center gap-2">
      <UiButton variant="ghost" size="icon" @click="router.back()">
        <Icon name="ic:round-arrow-back-ios-new" class="h-5 w-5" />
      </UiButton>
      <UiLabel class="ml-1 text-[20px] font-bold">UI Customization</UiLabel>
    </div>
    <!-- <div class="flex flex-row"> -->
    <div class="form-align shadow-align ml-11">
      <!-- {{ botDetails }} -->
      <!-- <div class="card-align items-center rounded-md shadow-lg pa-2"> -->
      <div class="individual-form-align mt-1 flex flex-col items-start">
        <UiLabel class="pb-2 text-lg font-medium">Logo</UiLabel>
        <div class="space-y-4">
          <div>
            <ImageUpload accept="image/*" v-model="logo" />
          </div>
          <span class="text-xs text-gray-500">Logo for chat bubble and avatar</span>
        </div>
      </div>
      <div class="mt-6 space-y-1">
        <UiLabel class="mb-10 text-lg font-medium">Colours</UiLabel>
        <div
          class="color-picker-align shadow-align h-14 gap-8 rounded-lg bg-white px-5"
        >
          <div class="colour-page-align flex justify-between">
            <label
              for="color"
              class="py-auto content-center text-base font-medium"
              >Primary Colour</label
            >
            <div class="h-8 w-8 overflow-hidden rounded-full">
              <input
                v-model="pickColor"
                type="color"
                id="colorId"
                name="color"
                class="h-20 w-20 -translate-x-1/3 -translate-y-1/3"
              />
            </div>
          </div>
        </div>
        <span class="text-xs text-gray-500">Select color for chat window</span>
      </div>
      <div class="flex flex-row justify-between py-2">
        <div class="flex flex-col space-y-2">
          <UiLabel class="text-lg font-medium">Widget Sound</UiLabel>
          <UiSelect v-model="widgetSound">
            <UiSelectTrigger
              class="hover:focus:none hover:focus-visible:none shadow-align h-12 w-52"
            >
              <UiSelectValue placeholder="Select Widget Sound" />
            </UiSelectTrigger>
            <UiSelectContent>
              <UiSelectGroup>
                <UiSelectItem value="Yes"> Yes </UiSelectItem>
                <UiSelectItem value="No"> No </UiSelectItem>
              </UiSelectGroup>
            </UiSelectContent>
          </UiSelect>
          <span class="text-xs text-gray-500"
            >Notification sound for chat window</span
          >
        </div>
        <div class="flex flex-col space-y-2">
          <UiLabel class="text-lg font-medium">Widget Position</UiLabel>
          <UiSelect v-model="widgetPosition">
            <UiSelectTrigger
              class="hover:focus-visible:none hover:focus:none shadow-align h-12 w-52"
            >
              <UiSelectValue placeholder="Select Widget Position" />
            </UiSelectTrigger>
            <UiSelectContent>
              <UiSelectGroup>
                <UiSelectItem value="Left"> Left </UiSelectItem>
                <UiSelectItem value="Right"> Right </UiSelectItem>
              </UiSelectGroup>
            </UiSelectContent>
          </UiSelect>
          <span class="text-xs text-gray-500"
            >Position for chat bubble</span
          >
        </div>
      </div>
      <div class="space-y-4 py-5">
        <div class="flex flex-row justify-between">
          <UiLabel class="text-base font-medium">Open By Default</UiLabel>
          <!-- class="text-[#424bd1]" -->
          <UiSwitch
            id="open-by-default"
            v-model:checked="defaultSelect"
            :style="{ background: defaultSelect ? '#424BD1' : '#8A8A8A' }"
          />
        </div>
        <span class="text-xs text-gray-500">Open chat window by default</span>
        <div class="flex flex-row justify-between">
          <UiLabel class="text-base font-medium">Online Status</UiLabel>
          <UiSwitch
            id="online-status"
            v-model:checked="onlineStatus"
            :style="{ background: onlineStatus ? '#424BD1' : '#8A8A8A' }"
          />
        </div>
        <span class="text-xs text-gray-500"
          >Live tag status of chat window</span
        >
      </div>
      <div class="submit-btn-align my-auto">
        <button
          class="my-auto text-base font-semibold"
          type="submit"
          @click="uiUpdate"
        >
          Submit
        </button>
      </div>
    </div>
  </div>
  <!-- </div> -->
  <!-- <div class="pl-2 pr-10 pt-10">
      <UiLabel class="content-center items-center">Preview Widget</UiLabel>
    </div> -->
  <!-- </div> -->
</template>
<script setup lang="ts">
  import type { background } from "@unovis/ts/components/timeline/style";

  definePageMeta({
    middleware: "admin-only",
  });
  const route = useRoute();
  const router = useRouter();
  const paramId: any = route;
  const botDetails: any = await getBotDetails(paramId.params.id);
  const pickColor = ref<string | null>("#424bd1");
  const defaultSelect = ref(true);
  const onlineStatus = ref(true);
  const widgetSound = ref("Yes");
  const widgetPosition = ref("Left");
  const logo = ref<FileList | null>(null);

  onMounted(() => {
    if (Object.entries(botDetails.metadata.ui).length) {
      pickColor.value = hslToHex(botDetails.metadata.ui.color);
      defaultSelect.value = botDetails.metadata.ui.defaultSelect;
      widgetSound.value = botDetails.metadata.ui.widgetSound;
      widgetPosition.value = botDetails.metadata.ui.widgetPosition;
      onlineStatus.value = botDetails.metadata.ui.onlineStatus;
      logo.value = botDetails.metadata.ui.logo;
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
          logo: logo.value,
          color: hexToHSL(pickColor.value),
          defaultSelect: defaultSelect.value,
          onlineStatus: onlineStatus.value,
          widgetPosition: widgetPosition.value,
          widgetSound: widgetSound.value,
        },
      },
    };
    await updateBotDetails(payload);

    logo.value && (await uploadLogo(botDetails.id, logo.value![0]));

    return navigateTo({
      name: "BotManagementDetails-id",
      params: { id: paramId.params.id },
    });
    // console.log(botDetails.name, "botDetails.name")
    // console.log(pickColor.value, "pickColor.value")
    // console.log(defualtSelect.value, "pickColor.value")
  };
</script>
<style scoped>
  .form-align {
    display: flex;
    flex-direction: column;
    padding: 20px;
    width: 40%;
    height: calc(100vh - 120px);
    overflow-y: scroll;
  }

  form {
    width: 100%;
    display: flex;
    flex-direction: column;
    /* flex-wrap: wrap; */
  }

  .individual-form-align {
    width: 100%;
    /* padding-left: 30px; */
    height: 120px;
    margin-bottom: 15px;
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

  .shadow-align {
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 2px 24px 0px rgba(0, 0, 0, 0.05) !important;
  }

  .colour-page-align {
    width: 100%;
  }

  /* #open-by-default[aria-checked='true'] {
    background-color: red !;
  } */
</style>
