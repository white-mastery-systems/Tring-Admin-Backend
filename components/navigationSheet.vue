<template>
  <UiSheet>
    <UiSheetTrigger as-child>
      <div class="absolute top-2 left-2 sm:flex lg:hidden md:hidden mb-4">
        <MenuIcon :size="32" />
      </div>
    </UiSheetTrigger>
    <UiSheetContent side="left" class="px-0 flex items-center self-center">
      <div
        class="lg:flex md:flex border-r border-[#8a8a8a1a] flex-col items-center justify-center gap-[20px] overflow-auto w-[270px] ">
        <NavigationDrawer />
      </div>
    </UiSheetContent>
  </UiSheet>
</template>
<script setup lang="ts">
import { MenuIcon } from "lucide-vue-next";
</script>