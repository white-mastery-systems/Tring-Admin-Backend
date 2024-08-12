<script setup lang="ts">
  const route = useRoute();
  // if (route.name === "index") {
  //   await navigateTo({ name: "DashBoard" });
  // }

  const x = await getLeadTranscript("b9040226-585e-471b-b34a-425e87d76a94");
</script>

<template>
  <pre>{{ x }}</pre>
</template>
