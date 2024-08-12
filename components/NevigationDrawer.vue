<template>
  <div class="navigation-drawer-main">
    <div class="tring-log-top-align">
      <img src="assets\icons\tring_AI_logo.svg" width="80" height="80" />
    </div>
    <!-- <div> -->
    <div :class="[route.path === '/DashBoard' ? 'activeClass' : 'default-align']" @click="
        async () => {
          await navigateTo({ name: 'DashBoard' });
        }
      ">
      <span>
        <img v-if="route.path === '/DashBoard'" src="assets\icons\activeHome.svg" width="22" height="22" />
        <img v-else src="assets\icons\deactiveHome.svg" width="22" height="22" />
      </span>
      <span class="content-align">Dashboard</span>
    </div>
    <div class="analytics-main-container">
      <div class="rounded-t-lg" :class="[
          route.path === '/AnalyticsOverView' ||
          route.path === '/AnalyticsLeads'
            ? 'analytic_activeClass'
            : 'default-align',
        ]" @click="
          async () => {
            await navigateTo({ name: 'AnalyticsOverView' });
          }
        ">
        <div class="flex items-center gap-3">
          <span>
            <img v-if="
                route.path === '/AnalyticsOverView' ||
                route.path === '/AnalyticsLeads'
              " src="assets\icons\analytics_active.svg" width="22" height="22" />
            <img v-else src="assets\icons\analytics_deactive.svg" width="22" height="22" />
          </span>
          <span class="content-align">Analytics</span>
        </div>
        <!-- <span>
          <img src="assets\icons\chevron_right.svg" alt=""></img>
        </span> -->
      </div>
      <div v-if="
          route.path === '/AnalyticsOverView' ||
          route.path === '/AnalyticsLeads'
        " class="analytics_sub_details_align rounded-b-lg">
        <div :class="[
            route.path === '/AnalyticsOverView'
              ? 'active_analytics_sub_details_align'
              : 'deactive_analytics_sub_details_align',
          ]" @click="
            async () => {
              await navigateTo({ name: 'AnalyticsOverView' });
            }
          ">
          Overview
        </div>
        <div class="pt-4" :class="[
            route.path === '/AnalyticsLeads'
              ? 'active_analytics_sub_details_align'
              : 'deactive_analytics_sub_details_align',
          ]" @click="
            async () => {
              await navigateTo({ name: 'AnalyticsLeads' });
            }
          ">
          Leads
        </div>
      </div>
    </div>
    <div :class="[route.path === '/Billing' ? 'activeClass' : 'default-align']" @click="
        async () => {
          await navigateTo({ name: 'Billing' });
        }
      ">
      <span>
        <img v-if="route.path === '/Billing'" src="assets\icons\payments_active.svg" width="22" height="22" />
        <img v-else src="assets\icons\payments_deactive.svg" width="22" height="22" />
      </span>
      <span class="content-align">Billing</span>
    </div>
    <div :class="[
        route.path === '/BotManagement' ? 'activeClass' : 'default-align',
      ]" @click="
        async () => {
          await navigateTo({ name: 'BotManagement' });
        }
      ">
      <span>
        <img v-if="route.path === '/BotManagement'" src="assets\icons\bot_man_active.svg" width="22" height="22" />
        <img v-else src="assets\icons\bot_man_deactive.svg" width="19" height="22" />
      </span>
      <span class="content-align">Bot Management</span>
    </div>
    <div :class="[
        route.path === `/customisation` ? 'activeClass' : 'default-align',
      ]">
      <span>
        <img v-if="route.path === '/customisation'" src="assets\icons\payments_active.svg" width="22" height="22" />
        <img v-else src="assets\icons\customisation_deactive.svg" width="22" height="22" />
      </span>
      <span class="content-align">Customisation</span>
    </div>
    <div :class="[route.path === '/settings' ? 'activeClass' : 'default-align']" @click="
        async () => {
          // await navigateTo(name: 'UiCustomization-id')
        }
      ">
      <span>
        <img v-if="route.path === '/settings'" src="assets\icons\payments_active.svg" width="22" height="22" />
        <img v-else src="assets\icons\settings_deactive.svg" width="22" height="22" />
      </span>
      <span class="content-align">Settings</span>
    </div>
    <UiButton @click="authHandlers.logout"
      class="mb-8 mt-auto w-3/4 bg-red-500 font-bold text-white hover:bg-red-500 hover:text-white hover:brightness-110"
      variant="outline">Logout</UiButton>
    <!-- </div> -->
  </div>
</template>
<script setup lang="ts">
  import { onMounted } from "vue";

  const route = useRoute();

  onMounted(async () => {
    console.log(route.path, "route");
    // if (route.path === '/') {
    //   // await navigateTo('/dashBoard')
    // }
  });
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
    padding: 18px 18px;
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
