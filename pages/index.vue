<script setup lang="ts">
  const route = useRoute();

  const file = ref<FileList>();

  const upload = async () => {
    await createDocument("252d504e-9742-4394-84e5-c494f9272827", {
      name: "Capetown UI",
      files: file.value![0],
    });
  };

  // if (route.name === "index") {
  //   await navigateTo({ name: "DashBoard" });
  // }
</script>

<template>
  <!-- <pre>{{ x }}</pre> -->
  <!-- @vue-ignore -->
  <FileUpload accept="image/*" />
</template>
