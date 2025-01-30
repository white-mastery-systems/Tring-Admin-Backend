<template>
  <div class="field_shadow px-4 py-2 my-2 rounded-lg">
    <PersonalDetails :personalControl="false" />
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  layout: "billing-account",
  // middleware: "guest-only",
});
const { user, refreshUser } = await useUser();

onMounted(() => {
  refreshUser()
})
</script>