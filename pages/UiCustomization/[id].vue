<template>
  <div class="form-align">
    <!-- {{ botDetails }} -->
    <div>
      <div class="individual-form-align">
        <label for="frole" class="font-[10px] font-medium">LOGO</label>
        <FileUpload accept="image/*" v-model="logo"/>
      </div>
      <div class="color-picker-align gap-8 px-5">
        <div class="flex gap-3">
          <label for="color" class="font-medium">Primary Color</label>
          <input v-model="pickColor" type="color" id="colorId" name="color" />
        </div>
        <!-- <label class="inline-flex cursor-pointer items-center">
          <input v-model="defaultSelect" type="checkbox" class="peer sr-only" />
          <!-- <div
            class="peer relative h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800 rtl:peer-checked:after:-translate-x-full"
          ></div>
          <span
            class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300"
            >OPEN BY DEFAULT</span
          > 
        </label> -->
      </div>
      <div class="py-4">
        <UiSelect v-model="widgetSound" >
          <UiLabel class="font-[10px] pb-3 font-medium">Widget Sound</UiLabel>
          <UiSelectTrigger class="w-72">
            <UiSelectValue/>
          </UiSelectTrigger>
          <UiSelectContent>
            <UiSelectGroup>
              <UiSelectItem value="Yes"> Yes </UiSelectItem>
              <UiSelectItem value="No"> No </UiSelectItem>
            </UiSelectGroup>
          </UiSelectContent>
        </UiSelect>
      </div>
      <div class="py-4">
        <UiSelect v-model="widgetPosition">
          <UiLabel class="font-[10px] pb-3 font-medium">Widget Position</UiLabel>
          <UiSelectTrigger class="w-72">
            <UiSelectValue/>
          </UiSelectTrigger>
          <UiSelectContent>
            <UiSelectGroup>
              <UiSelectItem value="Left"> Left </UiSelectItem>
              <UiSelectItem value="Right"> Right </UiSelectItem>
            </UiSelectGroup>
          </UiSelectContent>
        </UiSelect>
      </div>
      <div class="py-3 space-y-4">
          <div class="flex flex-row gap-4">
            <UiLabel>Open By Default</UiLabel>
            <UiSwitch id="open-by-default" v-model:checked="defaultSelect"</UiSwitch>
          </div>
          <div class="flex flex-row gap-4">
            <UiLabel>Online Status</UiLabel>
            <UiSwitch id="online-status" v-model:checked="onlineStatus"</UiSwitch>
          </div>
          
        
      </div>
      <div class="submit-btn-align">
        <button class="text-[14px] font-bold" type="submit" @click="uiUpdate">
          Submit
        </button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">


  const route = useRoute();
  const router = useRouter();
  const paramId: any = route;
  const botDetails: any = await getBotDetails(paramId.params.id);
  const pickColor = ref(null);
  const defaultSelect = ref(true);
  const onlineStatus = ref(false)
  const widgetSound = ref("");
  const widgetPosition = ref("");
  const logo = ref<FileList | null>(null);

onMounted(() => {
  if (botDetails.metadata.ui.length) {
    pickColor.value = botDetails.metadata.ui.color
    defaultSelect.value = botDetails.metadata.ui.defualtSelect
  }
})

const uiUpdate = async () => {
  console.log(botDetails, "botDetails")
  const payload: any = {
    // name: botDetails.name,
    ...botDetails,
    id: botDetails.id,
    metadata: {
      ...botDetails.metadata,
      ui: {
        color: pickColor.value,
        defaultSelect: defaultSelect.value,
        onlineStatus: onlineStatus.value,
      }
    }
  }
  await updateBotDetails(payload)
 
  logo.value && await uploadLogo(botDetails.id, logo.value![0])
  // console.log(botDetails.name, "botDetails.name")
  // console.log(pickColor.value, "pickColor.value")
  // console.log(defualtSelect.value, "pickColor.value")
}
</script>
<style scoped>
  .form-align {
    display: flex;
    /* flex-direction: column; */
    padding: 100px 25px;
  }

  form {
    width: 100%;
    display: flex;
    flex-direction: column;
    /* flex-wrap: wrap; */
  }

  .individual-form-align {
    width: 100%;
    padding: 0 20px;
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
    justify-content: end;
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
    margin-top: 20px;
    /* margin-right: 170px; */
  }
</style>
