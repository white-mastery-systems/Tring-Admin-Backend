<script setup lang="ts">
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CircleDollarSign, Users, Hourglass, RefreshCcw, ArrowBigDown,UserRoundX } from "lucide-vue-next"


// Updated props definition to handle array type for count
const props = withDefaults(defineProps<{
  title: string;
  count: string | Array<{ date: string; count: number }>;
  loading: boolean;
}>(), {
  loading: true,  // default value for loading
});
</script>

<template>
  <div class="flex gap-5 px-0 rounded-lg">
    <Card class="w-full">
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-[14px] font-normal text-[#8A8A8A]">
          {{(() => { const formattedTitle = props.title.replace(/([A-Z])/g, ' $1').trim();
          return formattedTitle.charAt(0).toUpperCase() + formattedTitle.slice(1);
          })()}}
        </CardTitle>
        <CircleDollarSign v-if="props.title === 'conversionRate'" class="h-5 w-5 text-[#FFBC42]" />
        <Users v-if="props.title === 'uniqueVisitors'" class="h-5 w-5 text-[#FFBC52]" />
        <Hourglass v-if="props.title === 'averageSessionDuration'" class="h-5 w-5 text-[#FFBC52]" />
        <RefreshCcw v-if="props.title === 'reEngagementRate'" class="h-5 w-5 text-[#FFBC52]" />
        <UserRoundX v-if="props.title === 'dropOffRate'" class="h-5 w-5 text-[#FFBC52]" />
        <ArrowBigDown v-if="props.title === 'leadQualificationAccuracy'" class="h-5 w-5 text-[#FFBC42]" />
      </CardHeader>
      <CardContent>
        <div class="text-[24px] font-bold text-[#3D3D3D]">
          {{ typeof props.count === 'string' ? props.count : (props.title === 'averageSessionDuration') ? props.count +
          ' ' + 'Mins' : props.count }}
        </div>
      </CardContent>
    </Card>
  </div>
</template>