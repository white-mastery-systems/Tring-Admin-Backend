<template>
  <div class="w-full" v-if="breadCrumbs?.length > 0">
    <UiBreadcrumb>
      <UiBreadcrumbList>
        <UiBreadcrumbItem v-for="({ label, to }, index) in breadCrumbs" :key="index"
          :class="index === breadCrumbs.length - 1 ? 'text-[#64748B]' : ''">
          <UiBreadcrumbLink :href="to">{{ label }}</UiBreadcrumbLink>

          <UiBreadcrumbSeparator v-if="index < breadCrumbs.length - 1" />
        </UiBreadcrumbItem>
      </UiBreadcrumbList>
    </UiBreadcrumb>
  </div>
</template>
<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    breadCrumbs?: any;
  }>(),
  {
    breadCrumbs: [],
  },
);
</script>