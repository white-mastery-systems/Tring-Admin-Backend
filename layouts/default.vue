<template>

  <div class="relavtive flex h-[100vh]">
    <div
      class="hidden md:hidden xl:felx lg:flex border-r border-[#8a8a8a1a] flex-col items-center gap-[20px] h-[100vh] overflow-auto w-[250px] overflow-x-hidden">
      <NavigationDrawer />
    </div>
    <!-- mt-2 -->
    <div class="lg:w-[86%] w-full xl:mt-0 lg:mt-0 md:mt-0 h-[100vh] overflow-y-scroll">

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