<script setup lang="ts">
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ActivityIcon } from "lucide-vue-next"
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
import { DonutChart } from '@/components/ui/chart-donut'

// Define props to match your API response structure
const props = withDefaults(defineProps<{
  title: string;
  count: any; // This will accept the API response object structure
  icon: any;
  loading: boolean;
  botType: string;
}>(), {
  loading: true,
});

const valueFormatter = (tick: number | Date) => typeof tick === 'number' ? `${new Intl.NumberFormat('us').format(tick).toString()}` : ''

// Transform data for the chart if count is an array
const chartData = computed(() => {
  if (Array.isArray(props.count)) {
    return props.count.map(item => ({
      name: item.date,
      chat: item.count,
    }));
  }
  return [];
});

// Transform the API response into chart data for lead composition
const leadCompositionData = computed(() => {
  if (props.title === 'leadComposition' && props.count && typeof props.count === 'object' && !Array.isArray(props.count)) {
    return [
      { name: 'Warm Leads', total: props.count.warmLeads || 0 },
      { name: 'Hot Leads', total: props.count.hotLeads || 0 },
      { name: 'Cold Leads', total: props.count.coldLeads || 0 },
      { name: 'Junk Leads', total: props.count.junkLeads || 0 }
    ].filter(item => item.total > 0);
  }
  return [];
});

// Check if lead composition data is empty
const isLeadDataEmpty = computed(() => {
  return leadCompositionData.value.length === 0;
});
</script>

<template>
  <div class="flex gap-5 px-0 rounded-lg w-full h-full"
    v-if="props.title === 'totalConversation' || props.title === 'leadComposition'">
    <!-- Card with width based on chart type -->
    <Card class="p-4 w-full">
      <CardHeader class="flex flex-row items-center justify-between p-0">
        <CardTitle class="text-[14px] font-normal text-[#8A8A8A]">
          {{ (props.title === "totalConversation")? 'Total Conversations' : 'Lead Composition' }}
        </CardTitle>
      </CardHeader>

      <!-- Bar chart for totalConversation -->
      <div v-if="props.title === 'totalConversation'">
        <BarChart :data="chartData" index="name" :categories="[props.botType]" :y-formatter="(tick, i) => {
          return typeof tick === 'number'
            ? ``
            : ''
        }" :colors="['#FFBC42', '#36B37E']" />
      </div>

      <!-- Donut chart for leadComposition -->
      <div v-if="props.title === 'leadComposition'" class="flex flex-col justify-center items-center">
        <!-- Empty state for lead composition -->
        <div v-if="isLeadDataEmpty" class="h-[164px] w-[164px] flex items-center justify-center rounded-full"
          style="background-color: #FFF8EB;">
          <p class="text-sm text-gray-500">No lead data</p>
        </div>

        <!-- Chart when data exists -->
        <div v-else class="h-[164px] w-[164px]"> <!-- Adjust the values as needed -->
          <DonutChart index="name" :category="'total'" :data="leadCompositionData" :value-formatter="valueFormatter"
            :colors="['#36B37E', '#FF5630', '#0052CC', '#6554C0']" />
        </div>
      </div>
    </Card>
  </div>
</template>