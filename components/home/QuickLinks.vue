<script setup lang="ts">
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button as UiButton } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    class="flex gap-5 flex-wrap justify-between w-full px-0 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
    <Card v-for="(item, index) in props.navigavtionList" :key="index"
      class="w-full flex flex-col items-center box_shadow py-2 gap-5">
      <CardHeader class="flex flex-col items-center gap-5 py-0">
        <!-- <div> -->
          <img src="/assets/icons/Chat_Bubble.svg" width="50" class="rounded-lg" />
        <!-- </div> -->
        <div class="flex flex-col items-center gap-3">
          <CardTitle class="text-center font-bold">{{ item.title }}</CardTitle>
          <CardDescription class="text-center text-[13px] text-[#71717A]">
            {{ item.subtitle }}
          </CardDescription>
        </div>
      </CardHeader>
      <CardFooter class="flex px-6 pb-2">
        <NuxtLink :to="item.url">
          <UiButton> View </UiButton>
        </NuxtLink>
      </CardFooter>
    </Card>
  </div>
</template>
