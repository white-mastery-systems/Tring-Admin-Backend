<script setup lang="ts">
  const route = useRoute();
  if (route.name === "index") {
    await navigateTo({ name: "DashBoard" });
  }
</script>
