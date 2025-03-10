<template>
  <div class="flex h-full w-full flex-col items-center justify-center">
    <div class="w-full px-0 pb-[20px] text-[20px] font-bold text-[#424bd1] lg:w-[80%] lg:px-6">
      <!-- <span> Log in to your account </span> -->
    </div>
    <div class="flex w-full flex-col px-0 lg:w-[80%] lg:px-6">

      <form class="space-y-2" @submit="onSubmit">
        <div class="flex flex-col gap-2">
          <!-- <TextField type="email" name="email" label="E-mail" placeholder="Enter Your Email" required /> -->
          <div class="relative">
            <TextField :type="passwordVisible ? 'text' : 'password'" name="password" label="Update Your Password"
              placeholder="Password" required>
              <template #endIcon>
                <div class="w-[30px] cursor-pointer mt-2" @click="togglePasswordVisibility" type="button">
                  <OpenEye v-if="passwordVisible" />
                  <CloseEyeIcon v-else />
                </div>
              </template>
            </TextField>

          </div>
          <UiButton type="submit" class="flex h-[45px] w-full justify-center bg-[#424bd1] hover:bg-[#424bd1]"
            :loading="isLoading"> Continue
          </UiButton>
        </div>
      </form>

      <!-- </div> -->
    </div>
  </div>
</template>
<script setup lang="ts">
import { useGtag } from 'vue-gtag-next';
import { useRoute } from 'vue-router';
// import { formSchema } from '~/validationSchema/authValidation/signInValidation';

const { event } = useGtag()

useHead({
  title: 'Password Updates In | Conversational AI for Businesses | Tring AI',
  meta: [
    { name: 'Description', content: 'Access your Tring AI account to explore AI Powered Solutions. Sign in now to continue your journey and enhance your business efficiency!' }
  ]
})


definePageMeta({
  layout: "auth",
  middleware: "guest-only",
});


const route = useRoute();
const hostedPageId = route.query?.hostedpage_id;

const passwordVisible = ref(false);
const animationProps = {
  duration: 500,
};
const isLoading = ref(false)
const userId = ref(null)

const updatePasswords = toTypedSchema(
  z.object({
    password: z
      .string({ required_error: "password is required" })
      .min(6, "Password must be at least 6 characters long."),
  }),
);
const {
  setFieldValue,
  handleSubmit,
  errors,
  values,
  defineField,
  resetForm,
} = useForm({
  validationSchema: updatePasswords,
  initialValues: {
    // name: "",
  },
});
const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value;
};

onMounted(async () => {
  try {
    const response = await $fetch(`/api/v2/onboarding/hostedPage?hostedpageId=${hostedPageId}`);
    userId.value = response?.userId
  } catch (error) {
    console.error("Error fetching hosted page details:", error);
  }
});


const onSubmit = handleSubmit(async (value: any) => {
  isLoading.value = true
  try {
    await $fetch(`/api/v2/user/updatePassword`, {
      method: 'POST',
      query: {
        userId: userId.value
      },
      body: value // Sending form values in the body
    })
    navigateTo("/auth/sign-in")
  } catch (error) {
    console.error('Error updating password:', error)
  } finally {
    isLoading.value = false
  }
})

</script>