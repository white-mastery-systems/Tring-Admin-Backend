<template>
  <div class="default-main-container">
    <div class="navigation-drawer">
      <NevigationDrawer />
    </div>
    <div class="main-router-align">
      <slot />
    </div>
  </div>
</template>
<style scoped>
.default-main-container {
  display: flex;
}
.navigation-drawer {
  width: 20%;
  height: 100vh;
  background: rgba(255, 255, 255, 1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}
.main-router-align {
  padding: 15px;
  width: 80%;
}
</style>