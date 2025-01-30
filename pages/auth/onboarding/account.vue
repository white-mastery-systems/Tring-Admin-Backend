<template>
  <Page title="" :disable-back-button="true">
    <PersonalDetails :personalControl="false" />
  </Page>
</template>
<script setup lang="ts">
definePageMeta({
  layout: "sign-up-success",
  // middleware: "guest-only",
});
const { user, refreshUser } = await useUser();

onMounted(() => {
  refreshUser()
})
</script>