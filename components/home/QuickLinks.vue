<script setup lang="ts">
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const props = withDefaults(
  defineProps<{
    navigavtionList: Array<{ title: string; subtitle: string; url: string }>;
  }>(),
  {
    navigavtionList: () => [],
  }
);
</script>
<template>
  <div v-if="props.navigavtionList.length > 0"
    class="flex gap-5 flex-wrap justify-between w-full px-0 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
    <Card v-for="(item, index) in props.navigavtionList" :key="index"
      class="w-full flex flex-col items-center  pb-7 pt-7 gap-5 cursor-pointer">
      <NuxtLink :to="item.url">
        <CardHeader class="flex flex-col items-center gap-5 py-0">
          <component :is="item.icon" :stroke-width="1" :size="30" class="text-[#FFBC42]"></component>
          <div class="flex flex-col items-center gap-1">
            <CardTitle class="text-center font-bold text-[16px] sm:text-[16px] md:text-[22px] text-[#3D3D3D]">{{
              item.title }}
            </CardTitle>
            <CardDescription class="text-center text-[8px] sm:text-[8px] md:text-[13px] text-[#71717A]">
              {{ item.subtitle }}
            </CardDescription>
          </div>
        </CardHeader>
      </NuxtLink>
    </Card>
  </div>
</template>
