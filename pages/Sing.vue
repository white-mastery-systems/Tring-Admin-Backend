<template>
  <div class="singup-page">
    <div class="left-card-align">
      <div class="tring-log-top-align">
        <img src="assets\icons\tring_AI_logo.svg" width="80" height="80">
      </div>
      <SignInForm />
       <!-- <SignupForm/> -->
    </div>
    <div class="right-card-align">
      <img src="assets\icons\singupImages.svg" width="600"></img>
      <img src="assets\icons\rectangle_singup.svg" width="580"></img>
    </div>
  </div>
</template>
<style scoped>
.singup-page {
  display: flex;
  /* align-items: center; */
  justify-content: center;
  height: 100vh;
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
  top: 50px;
  left: 100px;
  /* width: 100%;
  padding-top: 50px; */
}
.right-card-align {
  position: relative;
  width: 50%;
  /* width: 600px; */
  /* Set width to the width of the larger image */
  /* height: 600px; */
  /* Adjust height if needed */
}

.right-card-align img:nth-child(1) {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}

.right-card-align img:nth-child(2) {
  position: absolute;
  top: 6px;
  left: 10px;
  bottom: 10px;
  right: 10px;
  z-index: 2;
}
</style>