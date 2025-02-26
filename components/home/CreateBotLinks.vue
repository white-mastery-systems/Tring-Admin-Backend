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
    class="flex gap-5 flex-wrap justify-between w-full px-0 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
    <Card v-for="(item, index) in props.navigavtionList" :key="index"
      class="w-full flex items-center justify-between p-6 box_shadow">
      <CardHeader class="flex items-center gap-5 p-0">
        <div class="flex items-center gap-5">
          <img src="/assets/icons/create_bot_link.svg" width="40" class="rounded-lg" />
          <div class="flex flex-col gap-1">
            <CardTitle class="text-left text-[14px] text-[#18181B] font-semibold">{{ item.title }}</CardTitle>
            <CardDescription class="text-let text-[13px] text-[#71717A]">
              {{ item.subtitle }}
            </CardDescription>

          </div>
        </div>
      </CardHeader>
      <CardFooter class="flex items-cnter p-0">
        <NuxtLink :to="item.url">
          <UiButton> Create </UiButton>
        </NuxtLink>
      </CardFooter>
    </Card>
  </div>
</template>
