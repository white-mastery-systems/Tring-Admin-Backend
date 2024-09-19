<script setup lang="ts">
definePageMeta({
  layout: "auth",
  middleware: "guest-only",
});
const formSchema = toTypedSchema(
  z.object({
    email: z.string({required_error:"Invalid email address."}).email("Invalid email address."),
  }));
const animationProps = {
  duration: 500,
}
  const {
    setFieldValue,
    handleSubmit,
    errors,
    values,
    defineField,
    resetForm,
  } = useForm({
    validationSchema: formSchema,
    initialValues: {
      // name: "",
    },
  });

   const onSubmit =   handleSubmit( async (value:any)=>{
    authHandlers.login(value)

    const  data = await $fetch('api/user/requestResetPassword',{
      method:'POST'
    })
  }) 
</script>
<template>
  <div class="flex flex-col items-center justify-center w-full h-full">
    <div class="font-bold text-[#424bd1] xl:w-[80%] lg:w-[90%] md:w-[80%] w-[90%] lg:px-6 px-0 pb-[20px]">
      <span> Let’s Get Started </span>
    </div>
    <div class="flex flex-col xl:w-[80%] lg:w-[90%] md:w-[80%] w-[90%] lg:px-6 px-0">
      <!-- <div> -->
      <!-- @submit="authHandlers.login" -->
      <form class="space-y-2" @submit="onSubmit">
        <div class="flex flex-col gap-2">
          <TextField
            type="email"
            name="email"
            label="E-mail"
            placeholder="Enter Your Email"
            required
          />
          <div class="relative">
         
          </div>
               

          <UiButton
          type="submit"
          class="flex h-[45px] w-full justify-center bg-[#424bd1] hover:bg-[#424bd1]"
          >Sign in
        </UiButton>
        </div>
      </form>
    </div>
  </div>
</template>