<script setup lang="ts">
  const route = useRoute();
  // if (route.name === "index") {
  //   await navigateTo({ name: "DashBoard" });
  // }

  const x = await listLeads();
</script>

<template>
  <pre>{{ x[0] }}</pre>
</template>
