<!-- layouts\auth.vue -->
<template>
  <div class="flex p-[25px] justify-center h-[100vh] w-full overflow-hidden">
    <div class="flex flex-col justify-center items-center lg:w-[50%] md:w-[50%] w-full">
      <div class="absolute top-[20px] left-[30px]">
        <img class="hidden sm:hidden md:hidden lg:hidden xl:block" src="assets\icons\tring_AI_logo.svg" width="80" height="80">
        <div class="flex items-center font-bold text-[15px] gap-2">
        </div>
      </div>
      <slot />
    </div>
    <div class="right-card-align relative w-[50%] h-full overflow-hidden rounded-[10px] hidden sm:block">
      <img src="assets\icons\signupImages.svg" class="absolute  w-full h-full object-cover ring-[0px] z-0"></img>
      <div class="font-regular absolute bottom-[70px] left-[70px] text-[#ffff] w-[40%] z-2">
        Welcome to <span class="font-medium text-[16px]">Tring AI</span> your AI-powered telesales partner
      </div>
    </div>
    <!-- <img src="assets\icons\rectangle_singup.svg" width="600"></img> -->
  </div>
</template>
<script setup lang="ts">
const route = useRoute()
const paramId: any = route

</script>
<style scoped>
.right-card-align::after{
  content:"";
  position: absolute;
  inset: 0px;
  border: 2px solid rgb(255, 255, 255);
  margin:30px;
  border-radius: 10px;
}
</style>