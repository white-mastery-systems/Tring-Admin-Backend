<template>
  <div class="flex flex-col justify-center items-center h-[100%] relative">
    <div class="absolute top-[20px] left-[30px]">
      <img src="assets\icons\tring_AI_logo.svg" width="80" height="80">
    </div>
    <div
      class="flex flex-col items-center justify-center p-5 field_shadow bg-[#FFFFFF] w-[60%] h-[60%]">
      <div class="flex items-center justify-center w-[80px] h-[80px] bg-[#424BD1] rounded-full">
        <PaymentSuccessIcon />
      </div>
      <div class="font-bold text-[#424BD1] text-[25px] pt-4">
        Thank You!
      </div>
      <div class="font-medium text-[16px]">
        Your payment is Successful
      </div>
      <p class="text-center text-[#8A8A8A] text-[14px] py-6 w-[40%]">
        You will be redirected to the Dashboard
        Please click continue
      </p>
      <UiButton class="bg-[#FFBC42] text-[#FFFFFF] px-5">
        Continue
      </UiButton>
    </div>
  </div>
</template>