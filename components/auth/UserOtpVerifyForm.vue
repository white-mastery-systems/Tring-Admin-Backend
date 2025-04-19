<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'
import { useOtpInput } from '~/composables/auth/useOtpInput'

const isLoading = ref(false)
const userDetails = ref()
const isResendDisabled = ref(false)
const countdownTime = ref(0)
const { otpDigits, inputRefs, handleInput, handleKeydown, handlePaste } = useOtpInput(4)

const otpVerifySchema = toTypedSchema(
  z.object({
    otp: z.string({ required_error: "OTP must be at least 4 characters long." })
      .length(4, "OTP must be exactly 4 characters long."),
  })
)

const {
  setFieldValue,
  handleSubmit,
  errors,
  values,
  defineField,
  resetForm,
} = useForm({
  validationSchema: otpVerifySchema,
})

// Define OTP field for better reactivity
const [otp, otpAttrs] = defineField("otp")

// Watch otpDigits and update form value
watch(otpDigits, (newValue) => {
  const combinedOtp = newValue.join('')
  setFieldValue('otp', combinedOtp)
}, { deep: true })

onMounted(() => {
  const storedDetails = localStorage.getItem('userDetails')
  if (storedDetails) {
    try {
      userDetails.value = JSON.parse(storedDetails)
    } catch (error) {
      console.error("Error parsing storedDetails", error)
    }
  }
})

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
  otpDigits.value = ['', '', '', '']
  countDownTimer()
  isResendDisabled.value = true
}

const countDownTimer = () => {
  countdownTime.value = 40
  const countdownInterval = setInterval(() => {
    countdownTime.value--

    if (countdownTime.value < 0) {
      clearInterval(countdownInterval)
      isResendDisabled.value = false
    }
  }, 1000)
}

const onSubmit = handleSubmit((value: any) => {
  if (!value.otp || !userDetails.value?.id) {
    toast.error("OTP or user details missing")
    return
  }

  const ottPayload = {
    userId: userDetails.value?.id,
    otp: value.otp
  }

  authHandlers.OtpVerification(ottPayload)
})
</script>

<template>
  <div :class="cn('grid gap-6', $attrs.class ?? '')">
    <form @submit="onSubmit">
      <div class="grid gap-2">
        <div class="grid gap-1">
          <Label class="sr-only" for="otp">Enter OTP</Label>
          <div class="flex justify-center">
            <template v-for="i in 4" :key="i">
              <input :ref="el => inputRefs[i - 1] = el" v-model="otpDigits[i - 1]" type="text" inputmode="numeric"
                maxlength="1" class="text-[14px]" :class="[
                  'w-10 h-10 border-2 text-center text-base font-semibold focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none disabled:opacity-50',
                  i === 1 ? 'rounded-l-md border-r-0' : '',
                  i === 4 ? 'rounded-r-md border-l-[1px]' : '',
                  i !== 1 && i !== 4 ? 'border-r-0 border-l-[1px]' : ''
                ]" :disabled="isLoading" @input="handleInput($event, i - 1)" @keydown="handleKeydown($event, i - 1)"
                @paste="handlePaste" />
            </template>
          </div>
          <p v-if="errors.otp" class="text-[#ef4444] text-[11px] text-center">{{ errors.otp }}</p>
        </div>

        <div class="flex justify-between gap-2 text-center text-[11px] text-gray-500">
          OTP has been sent to your mail ID
          <button v-if="isResendDisabled" type="button" disabled class="text-[#737373]">
            Resend available in {{ countdownTime }}s
          </button>
          <button v-else type="button" @click="resendOTP" class="hover:underline text-[#737373]">
            Resend OTP
          </button>
        </div>

        <UiButton color="primary" :disabled="isLoading" :loading="isLoading" class="text-[16px] mt-2">
          Continue
        </UiButton>
      </div>
    </form>
  </div>
</template>