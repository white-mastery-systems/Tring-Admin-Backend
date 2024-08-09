<script setup lang="ts">
  const route = useRoute();

  // if (route.name === "index") {
  //   await navigateTo({ name: "DashBoard" });
  // }

  const x = await listDocumentsByBotId("252d504e-9742-4394-84e5-c494f9272827");
</script>

<template>
  <!-- <pre>{{ x }}</pre> -->
</template>
