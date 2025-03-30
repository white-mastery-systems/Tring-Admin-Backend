<template>
  <div :class="cn('w-full', 'relative')">
    <UiLabel :class="[
        'flex items-center capitalize',
        errorMessage ? 'text-red-500' : '',
      ]" v-if="label" :for="replacedId">
      {{ label }}
      <span v-if="required" class="text-lg text-red-500">* </span>
    </UiLabel>
    <div v-if="isTextarea" class="flex flex-col gap-1">
      <UiTextarea
        class="mt-2  text-[10px] sm:text-[10px] md:text-[14px] textarea-resize-scroll focus:outline-none focus:ring-0 focus:border-transparent"
        @paste="
          (e: any) => {
            if (disableCharacters) {
              if (isNaN(Number(e.clipboardData.getData('text/plain')))) {
                e.preventDefault();
              }
            }
          }
        " @keypress="
          (e: any) => {
            if (disableCharacters) {
              if (e.key === 'Enter') {
                return;
              }
              if (isNaN(e.key)) {
                e.preventDefault();
              }
            }
            if (['{', '}'].includes(e.key)) emit('input', e.key);
          }
        " @keydown="
          ($event) => {
            if ($event.code == 'Backspace' || $event.code == 'Delete')
              emit('input', 'keydown');
          }
        " @input="emit('input', 'change')" :placeholder="placeholder" :disabled="disabled" :id="replacedId"
        :class="errorMessage ? 'border-red-500' : 'border-input'" v-model="value"
        :type="type === 'phone' ? 'text' : type || 'text'" :maxlength="textAreaMaxLength" />
      <span v-if="textAreaMaxLength" class="mt-2 text-right text-xs text-gray-400">
        {{value.length}}/{{textAreaMaxLength}}
      </span>
    </div>

    <div v-else class="flex flex-col">
      <!-- {{props.name}}
      {{props.validation}} -->
      <UiInput :class="
          cn(
            'mt-2',
            props.class,
            errorMessage !== null && errorMessage !== undefined ? 'border-red-500' : 'border-input',
          )
        " @paste="
          (e: any) => {
            if (disableCharacters) {
              if (isNaN(Number(e.clipboardData.getData('text/plain')))) {
                e.preventDefault();
              }
            }
          }
        " @keypress="
          (e: any) => {
            if (disableCharacters) {
              if (e.key === 'Enter') {
                return;
              }
              if (isNaN(e.key)) {
                e.preventDefault();
              }
            }
  
            if (disableSpecialCharacters) {
              const regex = /^[a-zA-Z0-9]$/;
  
              if (e.key === ' ') {
                return;
              }
              if (!regex.test(e.key)) {
                e.preventDefault();
              }
            }
          }
        " :disabled="disabled" :placeholder="placeholder" :id="replacedId" v-model="value" :type="type || 'text'"
        :accept="accept || ''" @input="emit('input', $event)" :maxlength="textFieldMaxLength" />
      <span v-if="textFieldMaxLength" class="mt-2 text-right text-xs text-gray-400">
        {{ value.length }}/{{ textFieldMaxLength }}
      </span>
    </div>

    <!-- :maxlength="props?.type === 'phone' ? 10 : ''" -->
    <div :class="
        cn(
          props?.endIcon
            ? 'absolute right-[10px] top-[38px] cursor-pointer'
            : 'absolute right-[10px] top-[38px]',
        )
      ">
      <slot name="endIcon"></slot>
    </div>
    <div :class="
        cn(
          props?.endSlot
            ? 'absolute right-[0px] top-[36px]'
            : 'absolute right-[0px] top-[36px]',
        )
      ">
      <slot name="endSlot"></slot>
    </div>
    <div class="flex justify-between items-center mt-1">
      <span :class="[
          'text-[11px] md:text-[13px]  text-gray-500',
          errorMessage ? 'font-medium text-red-500' : '',
        ]">{{ errorMessage ?? helperText }}</span>
      <div v-if="name === 'otp'" class=" text-[#FFBC42] text-[11px] md:text-[13px] underline self-end cursor-pointer"
        :class="{ 'cursor-not-allowed': isResendDisabled }" @click="resendOTP" :disabled="isResendDisabled">
        <span v-if="!isResendDisabled">Resend OTP</span>
        <span v-else>Resend available in {{ countdownTime }}</span>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
  import { useField } from "vee-validate";
  const emit = defineEmits(["input"]);
  const props = withDefaults(
    defineProps<{
      label?: string;
      name: string;
      type?: string;
      helperText?: string;
      placeholder?: string;
      required?: boolean;
      disableCharacters?: boolean;
      isTextarea?: boolean;
      disabled?: boolean;
      class?: string;
      endIcon?: any;
      endSlot?: any;
      validation: Boolean;
      disableSpecialCharacters?: boolean;
      accept?: string;
      textAreaMaxLength: number | null;
      textFieldMaxLength: number | null;
    }>(),
    {
      label: "",
      type: "text",
      helperText: "",
      placeholder: "",
      required: false,
      disableCharacters: false,
      isTextarea: false,
      disabled: false,
      class: "",
      validation: true,
      disableSpecialCharacters: false,
      accept: "",
      textAreaMaxLength: null,
      textFieldMaxLength: null,
    },
  );
  // const clearValue = () => {
  //   emit("update:modelValue", ""); // Clears the textarea content
  // };

  // Expose clear function to parent components
  // defineExpose({ clearValue });

  const isResendDisabled = ref(false)
  const userDetails = ref()
  const countdownTime = ref(0)

  const replacedId = ref(props.label ?? props.name);
  // errorMessage: ""
  const { value, errorMessage }: { value: any; errorMessage: any } =
    !props.validation
      ? { value: props.name }
      : useField(() => props.name);

  watch(errorMessage, (newErr) => {});
  watch(value, (data) => {
    if (props.disableSpecialCharacters) {
      setTimeout(() => {
        value.value = value.value.replace(/ /g, "_");
        value.value = value.value.replace(/[^\w\s]/gi, "");
      }, 0);
    }
    if (value.value.trim() === "") {
      value.value = "";
    }
    // if (props.name === 'apikey') {
    //   value.value = value.value.replace(/.(?=.{4})/g, "*")
    // }
  });
onMounted(() => {
  const storedDetails = localStorage.getItem('userDetails');
  // userDetails.value = null
  if (storedDetails) {
    try {
      userDetails.value = JSON.parse(storedDetails); // Parse string into object
    } catch (error) {
      console.error("Error parsing storedDetails", error);
    }
  }
});


const resendOTP = () => {
  if (isResendDisabled.value) return
  const getUserEmail = {
    email: userDetails.value?.email
  }

  if (!getUserEmail) {
    console.error("User email not found")
    return
  }
  authHandlers.resendOtpVerification(getUserEmail)
  if (value.value) value.value = ""
  countDownTimer()
  isResendDisabled.value = true
};

const countDownTimer = () => {
  countdownTime.value = 40
  const countdownInterval = setInterval(() => {
    countdownTime.value--;

    if (countdownTime.value < 0) {
      clearInterval(countdownInterval);
      isResendDisabled.value = false;
    }
  }, 1000)
} 
</script>
