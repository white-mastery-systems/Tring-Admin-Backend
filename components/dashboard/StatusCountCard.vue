<template>
  <div
    v-if="!props.loading"
    class="field_shadow flex items-center gap-6 rounded-[10px] bg-white px-2 py-3"
  >
    <div class="rounded-md bg-[#ffbc42] p-2">
      <!-- <ChatSession /> -->
      <component :is="props.icon"></component>
    </div>
    <div>
      <div
        class="mb-1 text-[10px] font-semibold text-gray-500 sm:text-[10px] md:text-[16px] lg:text-[16px] xl:text-[16px]"
      >
        {{ props.title }}
      </div>
      <div
        class="text-xl font-extrabold text-black sm:text-xl md:text-3xl lg:text-3xl xl:text-3xl"
      >
        {{ props.count ?? 0 }}
      </div>
    </div>
  </div>
  <div v-else class="flex flex-col space-y-3">
    <UiSkeleton
      class="h-[80px] w-[100%] rounded-xl sm:h-[80px] md:h-[110px] lg:h-[110px] xl:h-[110px]"
    />
  </div>
</template>
<script setup lang="ts">
  const props = defineProps<{
    title: string;
    count: string;
    icon: any;
    loading: boolean;
  }>();
</script>
