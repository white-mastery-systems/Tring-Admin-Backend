<template>
  <header>
    <div class="flex items-center gap-2">
      <UiButton variant="ghost" size="icon" @click="router.back()">
        <Icon name="ic:round-arrow-back-ios-new" class="h-5 w-5" />
      </UiButton>
      <span class="text-[20px] font-bold">CRM Configuration</span>
    </div>
  </header>
</template>
<script setup lang="ts">
  const router = useRouter();
</script>
