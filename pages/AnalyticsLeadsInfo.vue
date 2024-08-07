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
  <UiTabs default-value="account" class="w-[400px]">
    <UiTabsList class="grid w-full grid-cols-2">
      <UiTabsTrigger value="Client Info" class="tab-align">
        Client Info
      </UiTabsTrigger>
      <UiTabsTrigger value="Campaign info" class="tab-align">
        Campaign info
      </UiTabsTrigger>
    </UiTabsList>
    <UiTabsContent value="account">
      <div class="client_info_align gap-2">
        <span class="font-bold">Os: <span class="font-black">Linux</span></span>
        <span class="font-bold">Browser: <span class="font-black">Chrome</span></span>
        <span class="font-bold">IP Address: <span class="font-black">49.43.251.113</span></span>
        <span class="font-bold">Continent Code: <span class="font-black">AS</span></span>
        <span class="font-bold">Continent Name: <span class="font-black">Asia</span></span>
        <span class="font-bold">Country Code: <span class="font-black">IN</span></span>
        <span class="font-bold">Country Name: <span class="font-black">India</span></span>
        <span class="font-bold">State Prov: <span class="font-black">Maharashtra</span></span>
        <span class="font-bold">City: <span class="font-black">Navi Mumbai</span></span>
      </div>
    </UiTabsContent>
    <UiTabsContent value="password">
      content
    </UiTabsContent>
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
  color: rgba(138, 138, 138, 1);
  font-weight: 800;
}
.tab-align:active {
  color: rgba(66, 75, 209, 1);
  font-weight: 800;
}
</style>