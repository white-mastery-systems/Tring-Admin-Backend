<template>
  <div class="navigation-drawer-main">
    <div class="tring-log-top-align">
      <img src="assets\icons\tring_AI_logo.svg" width="80" height="80">
    </div>
    <!-- <div> -->
    <div :class="[(route.path === '/dashboard') ? 'activeClass' : 'default-align']" @click="async () => {
      await navigateTo('dashboard')
    }">
      <span>
        <img v-if="(route.path === '/dashboard')" src="assets\icons\activeHome.svg" width="22" height="22">
        <img v-else src="assets\icons\deactiveHome.svg" width="22" height="22">
      </span>
      <span class="content-align">Dashboard</span>
    </div>
    <div
      :class="[((route.path === '/analyticsoverview') || (route.path === '/analyticsLeads')) ? 'activeClass' : 'default-align']"
      @click="async () => {
      await navigateTo('analyticsoverview')
    }">
      <span>
        <img v-if="((route.path === '/analyticsoverview') || (route.path === '/analyticsLeads'))"
          src="assets\icons\analytics_active.svg" width="22" height="22">
        <img v-else src="assets\icons\analytics_deactive.svg" width="22" height="22">
      </span>
      <span class="content-align">Analytics</span>
    </div>
    <div v-if="(route.path === '/analyticsoverview') || (route.path === '/analyticsLeads')"
      class="analytics_sub_details_align">
      <div
        :class="[(route.path === '/analyticsoverview') ? 'active_analytics_sub_details_align' : 'deactive_analytics_sub_details_align']"
        @click="async () => {
          await navigateTo('analyticsoverview')
        }">
        Overview
      </div>
      <div class="pt-3"
        :class="[(route.path === '/analyticsLeads') ? 'active_analytics_sub_details_align' : 'deactive_analytics_sub_details_align']"
        @click="async () => {
          await navigateTo('analyticsLeads')
        }">
        Leads</div>
    </div>
    <div :class="[(route.path === '/billing') ? 'activeClass' : 'default-align']" @click="async () => {
        await navigateTo('billing')
    }">
      <span>
        <img v-if="(route.path === '/billing')" src="assets\icons\payments_active.svg" width="22" height="22">
        <img v-else src="assets\icons\payments_deactive.svg" width="22" height="22">
      </span>
      <span class="content-align">Billing</span>
    </div>
    <div :class="[(route.path === '/botmanagement') ? 'activeClass' : 'default-align']" @click="async () => {
      await navigateTo('botmanagement')
    }">
      <span>
        <img v-if="(route.path === '/botmanagement')" src="assets\icons\bot_man_active.svg" width="22" height="22">
        <img v-else src="assets\icons\bot_man_deactive.svg" width="19" height="22">
      </span>
      <span class="content-align">Bot Management</span>
    </div>
    <div :class="[(route.path === `/customisation`) ? 'activeClass' : 'default-align']">
      <span>
        <img v-if="(route.path === '/customisation')" src="assets\icons\payments_active.svg" width="22" height="22">
        <img v-else src="assets\icons\customisation_deactive.svg" width="22" height="22">
      </span>
      <span class="content-align">Customisation</span>
    </div>
    <div :class="[(route.path === '/settings') ? 'activeClass' : 'default-align']" @click="async () => {
     await navigateTo('/dashboard')
    }">
      <span>
        <img v-if="(route.path === '/settings')" src="assets\icons\payments_active.svg" width="22" height="22">
        <img v-else src="assets\icons\settings_deactive.svg" width="22" height="22">
      </span>
      <span class="content-align">Settings</span>
    </div>
    <!-- </div> -->
  </div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue'

const route = useRoute()

onMounted(async () => {
  console.log(route.path,'route')
  // if (route.path === '/') {
  //   // await navigateTo('/dashBoard')
  // }
})

</script>
<style scoped>
.navigation-drawer-main {
  width: 100%;
  height: 100vh;
  background: rgba(255, 255, 255, 1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  border-right: 0.5px solid rgba(138, 138, 138, 0.20);
;
}
.tring-log-top-align {
  height: 20vh;
  display: flex;
  align-items: center;
}
.default-align {
  display: flex;
  align-items: center;
  gap: 13px;
  /* justify-content: space-between; */
  background-color: rgba(255, 255, 255, 1);
  color: rgba(0, 0, 0, 1);;
  width: 90%;
  padding: 15px 18px;
  border-radius: 10px;
  font-weight: 600;
  box-shadow: 0px 2px 24px 0px rgba(0, 0, 0, 0.05) !important;
  font-size: 10px;
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
  padding: 18px 18px;
  border-radius: 10px;
  font-weight: 600;
    /* background: rgba(0, 0, 0, 0.05); */
}
.analytics_sub_details_align {
  padding: 10px 30px;
  width: 90%;
  min-height: 80px;
  background: rgba(240, 246, 255, 1);
  border-radius: 10px;
}
.deactive_analytics_sub_details_align {
  color: black;
}
.active_analytics_sub_details_align {
  /* padding: 10px 30px;
  width: 90%;
  min-height: 80px; */
  color: rgba(66, 75, 209, 1);
  font-weight: 700;
  /* border-radius: 10px; */
  /* background: rgba(240, 246, 255, 1); */
}
</style>