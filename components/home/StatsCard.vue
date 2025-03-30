<script setup lang="ts">
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CircleDollarSign, Users, Hourglass, RefreshCcw, ArrowBigDown,UserRoundX } from "lucide-vue-next"
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
import { BarChart } from '@/components/ui/chart-bar'
import { computed } from 'vue'
// import CustomChartTooltip from './CustomChartTooltip.vue'

// const data = [
//   { name: 'Jan', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500 },
//   { name: 'Feb', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500 },
//   { name: 'Mar', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500 },
//   { name: 'Apr', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500 },
//   { name: 'May', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500 },
//   { name: 'Jun', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500 },
//   { name: 'Jul', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500 },
// ]

// Updated props definition to handle array type for count
const props = withDefaults(defineProps<{
  title: string;
  count: string | Array<{ date: string; count: number }>;
  loading: boolean;
}>(), {
  loading: true,  // default value for loading
});

// Transform data for the chart if count is an array
// const chartData = computed(() => {
//   if (Array.isArray(props.count)) {
//     return props.count.map(item => ({
//       name: item.date,
//       chat: item.count,
//     }));
//   }
//   return data;
// });
</script>

<template>
  <div class="flex gap-5 px-0 rounded-lg">
    <!-- {{ props }} -->
    <Card class="w-full">
      <!-- Standard card header for non-chart cards -->
      <!-- v-if="props.title !== 'totalConversation' && props.title !== 'leadComposition'" -->
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <!-- <CardTitle class="text-[14px] font-medium text-[#8A8A8A]">
          {{ props.title.charAt(0).toUpperCase() + props.title.slice(1) }}
        </CardTitle> -->
        <CardTitle class="text-[14px] font-normal text-[#8A8A8A]">
          {{(() => { const formattedTitle = props.title.replace(/([A-Z])/g, ' $1').trim();
          return formattedTitle.charAt(0).toUpperCase() + formattedTitle.slice(1);
          })()}}
        </CardTitle>
        <!-- statistics.name === 'conversionRate' || props.title === 'uniqueVisitors' || props.title ===
        'averageSessionDuration'" -->
        <!-- props.title === 'reEngagementRate' || props.title === 'dropOffRate' || props.title ===
        'leadQualificationAccuracy'" -->
        <CircleDollarSign v-if="props.title === 'conversionRate'" class="h-4 w-4 text-[#FFBC42]" />
        <Users v-if="props.title === 'uniqueVisitors'" class="h-4 w-4 text-[#FFBC42]" />
        <Hourglass v-if="props.title === 'averageSessionDuration'" class="h-4 w-4 text-[#FFBC42]" />
        <RefreshCcw v-if="props.title === 'reEngagementRate'" class="h-4 w-4 text-[#FFBC42]" />
        <UserRoundX v-if="props.title === 'dropOffRate'" class="h-4 w-4 text-[#FFBC42]" />
        <ArrowBigDown v-if="props.title === 'leadQualificationAccuracy'" class="h-4 w-4 text-[#FFBC42]" />

        <!-- <ActivityIcon class="h-4 w-4 text-[#71717A]" /> -->
      </CardHeader>
      <!-- v-if="props.title !== 'totalConversation' && props.title !== 'leadComposition'" -->
      <!-- Card content for standard cards -->
      <CardContent>
        <div class="text-[24px] font-bold text-[#3D3D3D]">
          {{ typeof props.count === 'string' ? props.count : (props.title === 'averageSessionDuration') ? props.count +
          ' ' + 'Mins' : props.count }}
        </div>
      </CardContent>

      <!-- Bar chart for totalConversation -->
      <!-- <div v-if="props.title === 'totalConversation'" class="w-[400px]">
        <BarChart :data="chartData" index="name" :categories="['chat']" :y-formatter="(tick, i) => {
            return typeof tick === 'number'
              ? ``
              : ''
          }" :colors="['#FFBC42', '#36B37E']" />
      </div> -->
    </Card>
  </div>
</template>