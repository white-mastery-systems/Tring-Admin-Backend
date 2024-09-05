<template>
  <div class="flex justify-center items-center h-[100vh]">
    <div class="flex flex-col justify-center items-center field_shadow w-[80%] h-[80%] gap-5 rounded-[18px]">
      <div class="text-9xl font-bold text-[#424bd1]">404</div>
      <div class="self-center">
        <div class="text-[20px] font-medium text-center">Looks like this page doesn't exist!</div>
        <div class="text-[16px] text-[#9f9fa1] px-6">Go back to home and continue exploring.</div>
      </div>
      <NuxtLink to="/">
        <UiButton class="bg-[#424bd1] rounded-xl hover:bg-[#424bd1] hover:brightness-90">Back to Home</UiButton>
      </NuxtLink>
    </div>
  </div>
</template>