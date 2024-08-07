<template>
  <div class="analytics_leads-main-container">
    <div class="header-align">
      <div class="flex items-center gap-2">
        <div class="flex items-center gap-2">
          <span>
            <img src="assets\icons\right_arrow.svg" width="20"></img>
          </span>
          <span class="font-bold text-lg">Yourstore Bot-1</span>
        </div>
        <span class="font-bold text-lg text-[16px]"></span>
      </div>
      <div class="flex items-center space-x-4">
        <span>
          <img src="assets\icons\export_btn.svg" width="120">
        </span>
      </div>
    </div>
  </div>
  <!-- <template> -->
  <UiTabs v-if="true" default-value="Client Info" class="w-[250px]">
    <UiTabsList class="grid w-full grid-cols-2 group-tap-align" default-value="Client Info">
      <UiTabsTrigger value="Client Info" class="tab-align text-[15px]">
        Client Info
      </UiTabsTrigger>
      <UiTabsTrigger value="Campaign info" class="tab-align text-[15px]">
        Campaign info
      </UiTabsTrigger>
    </UiTabsList>
    <UiTabsContent value="Client Info">
      <div class="client_info_align gap-2">
        <span class="font-medium">Os: <span class="font-bold">Linux</span></span>
        <span class="font-medium">Browser: <span class="font-bold">Chrome</span></span>
        <span class="font-medium">IP Address: <span class="font-bold">49.43.251.113</span></span>
        <span class="font-medium">Continent Code: <span class="font-bold">AS</span></span>
        <span class="font-medium">Continent Name: <span class="font-bold">Asia</span></span>
        <span class="font-medium">Country Code: <span class="font-bold">IN</span></span>
        <span class="font-medium">Country Name: <span class="font-bold">India</span></span>
        <span class="font-medium">State Prov: <span class="font-bold">Maharashtra</span></span>
        <span class="font-medium">City: <span class="font-bold">Navi Mumbai</span></span>
      </div>
    </UiTabsContent>
    <UiTabsContent value="Campaign info">
      content
    </UiTabsContent>
  </UiTabs>
  <UiTabs v-if="false" default-value="Client Info" class="w-[400px] TabsRoot">
    <UiTabsRoot class="TabsRoot" default-value="Client Info">
      <UiTabsList class="TabsList outline-none" aria-label="Manage your account">
        <!-- <UiTabsIndicator class="TagsIndicator ">
          <div style="width: 100%; height: 100%" class="bg-grass8 w-full h-full" />
        </UiTabsIndicator> -->
        <UiTabsTrigger class="TabsTrigger" value=" Client Info">
          Client Info
        </UiTabsTrigger>
        <UiTabsTrigger class="TabsTrigger" value="Campaign info">
          Campaign info
        </UiTabsTrigger>
      </UiTabsList>
      <UiTabsContent class="TabsContent" value=" Client Info">
        <div class="client_info_align gap-2">
          <span class="font-medium">Os: <span class="font-bold">Linux</span></span>
          <span class="font-medium">Browser: <span class="font-bold">Chrome</span></span>
          <span class="font-medium">IP Address: <span class="font-bold">49.43.251.113</span></span>
          <span class="font-medium">Continent Code: <span class="font-bold">AS</span></span>
          <span class="font-medium">Continent Name: <span class="font-bold">Asia</span></span>
          <span class="font-medium">Country Code: <span class="font-bold">IN</span></span>
          <span class="font-medium">Country Name: <span class="font-bold">India</span></span>
          <span class="font-medium">State Prov: <span class="font-bold">Maharashtra</span></span>
          <span class="font-medium">City: <span class="font-bold">Navi Mumbai</span></span>
        </div>
      </UiTabsContent>
      <UiTabsContent class="TabsContent" value="Campaign info">
        <div>afdsadasd</div>
      </UiTabsContent>
    </UiTabsRoot>
  </UiTabs>

  <!-- </template> -->
  <!-- </template> -->
</template>
<script setup lang="ts">
import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
</script>
<style scoped>

.analytics_leads-main-container {
  padding: 15px;
}

.header-align {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 20px;
  /* border-bottom: 0.5px solid rgba(181, 181, 181, 1); */
}
.client_info_align {
  display: flex;
  flex-direction: column;
  align-items: start;
}
.tab-align {
  padding: 0;
  color: rgba(138, 138, 138, 1);
  font-weight: 800;
  position: relative;
  display: inline-block;
  text-decoration: none;
  text-align: left;
}
.group-tap-align {
  background-color: white;
  color: rgba(66, 75, 209, 1);
}
.tab-align:active {
  color: rgba(66, 75, 209, 1);
  font-weight: 800;
  text-decoration: underline;
  text-underline-offset: 8px
}
.tab-align:focus {
  color: rgba(66, 75, 209, 1);
  font-weight: 800;
  text-decoration: underline;
  text-underline-offset: 8px
}
.tab-align::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -3px;
  /* Adjust based on your text-underline-offset */
  width: 100%;
  height: 0.5px;
  /* Adjust thickness of the underline */
  background-color: rgba(138, 138, 138, 0.5);
  /* Use the current text color */
  text-decoration: none;
  /* Ensure no additional decoration */
}
/* .custom-underline {
  position: relative;
  display: inline-block;
  text-decoration: none;
} */
</style>