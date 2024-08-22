<template>
  <div class="relavtive default-main-container">
    <div
      class="lg:flex md:flex border-r border-[#8a8a8a1a] flex-col items-center gap-[20px] overflow-auto w-[270px] hidden">
      <NavigationDrawer />
    </div>
    <div>
      <navigationSheet />
    </div>
    <!-- :style="{ width: (['Sign'].includes(routeName)) ? '100%' : '86%' }" -->
    <div class="main-router-align lg:w-[86%] w-full mt-2 xl:mt-0 lg:mt-0 md:mt-0">
      <slot />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const route = useRoute()
const routeName = ref(route.name)

onMounted( async () => {
  console.log(routeName, "routeName")
})

</script>
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
  border-right: 2px solid #8a8a8a1a;
}
.main-router-align {
  padding: 30px 10px;
  /* padding: 0 0 15px 0; */
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
  /* position: fixed; */
  /* top: 100px; */
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