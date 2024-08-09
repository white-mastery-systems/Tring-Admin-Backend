<script setup lang="ts">
  const route = useRoute();

  // if (route.name === "index") {
  //   await navigateTo({ name: "DashBoard" });
  // }

  const x = await listApiBots();
</script>

<template>
  <pre>{{ x }}</pre>
</template>
