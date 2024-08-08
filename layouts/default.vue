<template>
  <div class="default-main-container">
    <div class="navigation-drawer">
      <NevigationDrawer />
    </div>
    <div class="main-router-align">
      <div class="main-container-top-align">
        <div class="flex items-center gap-4 px-6">
          <span>
            <img src="assets\icons\mail.svg" width="25"></img>
          </span>
          <span>
            <img src="assets\icons\bell.svg" width="25"></img>
          </span>
          <span class="bar-align"></span>
          <span class="profile-align rounded-full"></span>
          <div>
            <div class="font-bold text-[16px]">Name</div>
            <div class="grey_color font-regular text-[13px]">Admin</div>
          </div>
        </div>
      </div>
      <slot />
    </div>
  </div>
</template>
<style scoped>
.default-main-container {
  display: flex;
  height: 100vh;
}
.navigation-drawer {
  width: 270px;
  /* padding-right: 20px; */
  /* height: 100vh; */
  background: rgba(255, 255, 255, 1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  overflow-y: scroll;
  /* background: rgba(138, 138, 138, 1); */
  border-right: 2px solid rgba(138, 138, 138, 0.1);
}
.main-router-align {
  padding: 0 0 15px 0;
  width: 86%;
  height: 100vh;
  overflow-y: scroll;
}
.main-container-top-align {
  width: 100%;
  height: 70px;
  background: rgba(240, 246, 255, 1);
  display: flex;
  align-items: center;
  justify-content: end;
  margin-bottom: 20px;
}
.bar-align {
  width: 1px;
  height: 40px;
  background-color: rgba(66, 75, 209, 1);
  /* padding: 5px 0; */
  /* border: 0.1px solid rgba(66, 75, 209, 1) */
}
.profile-align {
 width: 50px;
 height: 50px;
 background: rgba(255, 255, 255, 1);
 box-shadow: 0px 2px 24px 0px rgba(0, 0, 0, 0.05) !important;
}

</style>