<template>
  <div class="navigation-drawer-main">
    <div class="tring-log-top-align">
      <img src="assets\icons\tring_AI_logo.svg" width="80" height="80" />
    </div>
    <!-- <div> -->
    <NuxtLink to="/" :class="[route.path === '/' ? 'activeClass' : 'default-align']">
      <span>
        <img v-if="route.path === '/'" src=" assets\icons\activeHome.svg" width="22" height="22" />
        <img v-else src="assets\icons\deactiveHome.svg" width="22" height="22" />
      </span>
      <span class="content-align">Dashboard</span>
    </NuxtLink>
    <NuxtLink to="/leads" :class="[
      route.path?.includes('/leads') ? 'activeClass' : 'default-align',
    ]">
      <span>
        <img v-if="route.path?.includes('/leads')" src="
      assets\icons\analytics_active.svg" width="22" height="22" />
        <img v-else src="assets\icons\analytics_deactive.svg" width="22" height="22" />
      </span>
      <span class="content-align">Leads</span>
    </NuxtLink>
    <NuxtLink to="/bots" :class="[
      route.path?.includes('/bots') ? 'activeClass' : 'default-align',
    ]">
      <span>
        <img v-if="route.path?.includes('/bots')" src=" assets\icons\bot_man_active.svg" width="22" height="22" />
        <img v-else src="assets\icons\bot_man_deactive.svg" width="19" height="22" />
      </span>
      <span class="content-align">Bot Management</span>
    </NuxtLink>
    <NuxtLink to='/billing' :class="[route.path?.includes('/billing') ? 'activeClass' : 'default-align']">
      <span>
        <img v-if="route.path?.includes('/billing')" src=" assets\icons\payments_active.svg" width="22" height="22" />
        <img v-else src="assets\icons\payments_deactive.svg" width="22" height="22" />
      </span>
      <span class="content-align">Billing</span>
    </NuxtLink>

    <UiButton @click="confirmModel"
      class="mb-8 mt-auto w-3/4 justify-around bg-[#ffffff] pr-12 font-bold text-[#ff0000] hover:bg-gray-300/30 hover:text-[#ff0000] hover:brightness-110 items-start"
      variant="ghost">
      <Icon name="ic:round-logout" class="h-6 w-6" />
      <p class="text-base">Logout</p>
    </UiButton>
    <ConfirmationModal v-model:open="modalOpen" title="Confirm Logout" description="Are you sure you want to log out ?"
      @confirm="handleLogout" />
    <!-- </div> -->
  </div>
</template>
<script setup lang="ts">
const route = useRoute();
const modalOpen = ref(false);
onMounted(async () => {
  console.log(route.path, "route");
  // if (route.path === '/') {
  //   // await navigateTo('/dashBoard')
  // }
});

const confirmModel = () => {
  modalOpen.value = true;
};

const handleLogout = () => {
  authHandlers.logout();
  modalOpen.value = false;
};
</script>
<style scoped>
.navigation-drawer-main {
  width: 250px;
  height: 100vh;
  background: rgba(255, 255, 255, 1);
  display: flex;
  flex-direction: column;
  align-items: center;
  /* justify-content: center; */
  gap: 20px;
  /* border-right: 2px solid rgba(138, 138, 138, 0.1); */
  /* padding-right: 40px; */
}

.tring-log-top-align {
  display: flex;
  height: 20vh;
  /* align-items: center; */
}

.default-align {
  display: flex;
  align-items: center;
  gap: 13px;
  /* justify-content: space-between; */
  background-color: rgba(255, 255, 255, 1);
  color: rgba(0, 0, 0, 1);
  width: 90%;
  padding: 15px 18px;
  border-radius: 10px;
  font-weight: 600;
  box-shadow: 0px 2px 24px 0px rgba(0, 0, 0, 0.05) !important;
  font-size: 10px;
  cursor: pointer;
}

.content-align {
  font-size: 14px;
}

.activeClass {
  display: flex;
  align-items: center;
  gap: 13px;
  /* justify-content: space-between; */
  background: rgba(66, 75, 209, 1);
  color: rgba(255, 255, 255, 1);
  width: 90%;
  padding: 15px 18px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  /* background: rgba(0, 0, 0, 0.05); */
}

.analytic_activeClass {
  display: flex;
  align-items: center;
  gap: 13px;
  /* justify-content: space-between; */
  background: rgba(66, 75, 209, 1);
  color: rgba(255, 255, 255, 1);
  width: 90%;
  padding: 18px 18px;
  /* border-radius: 10px; */
  font-weight: 600;
  cursor: pointer;
}

.analytics_sub_details_align {
  padding: 15px 53px;
  width: 90%;
  min-height: 80px;
  background: rgba(240, 246, 255, 1);
  /* border-radius: 10px; */
}

.deactive_analytics_sub_details_align {
  color: black;
  cursor: pointer;
}

.active_analytics_sub_details_align {
  /* padding: 10px 30px;
  width: 90%;
  min-height: 80px; */
  color: rgba(66, 75, 209, 1);
  font-weight: 700;
  cursor: pointer;
  /* border-radius: 10px; */
  /* background: rgba(240, 246, 255, 1); */
}

.analytics-main-container {
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
}
</style>
