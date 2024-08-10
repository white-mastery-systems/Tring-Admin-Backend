<!-- layouts\auth.vue -->
<template>
  <div class="signup-page">
    <div class="left-card-align">
      <div class="tring-log-top-align">
        <img src="assets\icons\tring_AI_logo.svg" width="80" height="80">
        <div class="flex items-center font-bold text-[15px] gap-2">
          <!-- <RightArrow/>
          <span>Back</span> -->
        </div>
      </div>
      <slot />
    </div>
    <div class="right-card-align">
      <img src="assets\icons\signupImages.svg"></img>
      <div class="font-regular">
        Welcome to <span class="font-medium text-[16px]">Tring Ai</span> your Ai-powered telesales partner
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
.signup-page {
  display: flex;
  padding: 25px;
  /* align-items: center; */
  justify-content: center;
  height: 100vh;
  overflow: hidden;
}
.inside-card-align {
  display: flex;
  align-items: center;
}
.left-card-align {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 50%;
}
.tring-log-top-align {
  position: absolute;
  top: 20px;
  left: 30px;
  /* width: 100%;
  padding-top: 50px; */
}
.right-card-align {
  /* padding-bottom: 30px; */
  position: relative;
  width: 50%;
  height: 100%;
  overflow: hidden;
  border-radius: 10px;
  /* width: 600px; */
  /* Set width to the width of the larger image */
  /* height: 600px; */
  /* Adjust height if needed */
}

.right-card-align::after{
  content:"";
  position: absolute;
  inset: 0px;
  border: 2px solid rgb(255, 255, 255);
  margin:30px;
  border-radius: 10px;
}

/* .right-card-align img:nth-child(1) {
  height: 100%;
  width: 100%;
  object-fit: cover;
} */

.right-card-align img {
  height: 100%;
  width: 100%;
  object-fit: cover;
  position: absolute;
  /* Position the image absolutely */
  inset: 0px;
  /* Cover the container */
  z-index: 0;
  /* Place the image below the content */
}

.right-card-align>div {
  position: absolute;
  bottom: 70px;
  left: 70px;
  color: white;
  width: 40%;
  /* Ensure the content is positioned relative */
  z-index: 2;
  /* Place the content above the image and the ::after pseudo-element */
}
/* .right-card-align img:nth-child(2) {
  position: absolute;
  padding: 10px;
  top: 12px;
  left: 10px;
  bottom: 10px;
  right: 10px;
  z-index: 2;
  width: 80%
} */
</style>