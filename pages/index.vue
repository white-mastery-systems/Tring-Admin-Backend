<script setup lang="ts">
  const route = useRoute();

  // if (route.name === "index") {
  //   await navigateTo({ name: "DashBoard" });
  // }

  const x = await listApiBots();
</script>

<template>
  <h1>Hello</h1>
</template>
