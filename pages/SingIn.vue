<template>
  <div class="singup-page">
    <div class="left-card-align">
      <SingInForm />
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
</style>