<script setup lang="ts">
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { ChevronDownIcon, Subtitles } from "lucide-vue-next"; // Import Lucide icons

const defaultValue = 'item-1'


// const defaultValue = "item1";
const accordionItems = [
  { value: "item1", title: "UI Customization", content: "Setup the way your chat looks", icon: "Home", subtitle: "Setup the way your chat looks" },
  { value: "item2", title: "Bot Configuration", content: "Setup the way you bot works", icon: "Settings", subtitle: "Setup the way you bot works" },
];
</script>

<template>
  <!-- <Accordion type="single" class="w-full" collapsible :default-value="defaultValue">
    <AccordionItem v-for="item in accordionItems" :key="item.value" :value="item.value">
      <AccordionTrigger>{{ item.title }}</AccordionTrigger>
      <AccordionContent>
        {{ item.content }}
      </AccordionContent>
    </AccordionItem>
  </Accordion> -->
  <Accordion type="single" class="w-full" collapsible :default-value="defaultValue">
    <AccordionItem v-for="item in accordionItems" :key="item.value" :value="item.value"
      class="mb-3 border-none px-6 rounded-lg box_shadow">
      <AccordionTrigger class="flex items-center gap-2 font-medium">
        <!-- Left Icon -->
        <div class="flex items-center justify-between gap-2 w-full">
          <div class="flex items-center gap-2">
            <img src="/assets/icons/create_bot_link.svg" width="30" class="rounded-lg" />
            <!-- <LucideIcon :name="item.icon" class="w-5 h-5 text-blue-500" /> -->
            <div class="flex flex-col items-start gap-1 pl-6">
              <span>
                {{ item.title }}
              </span>
              <span class="text-[10px] text-[#71717A]">
                {{ item.subtitle }}
              </span>
            </div>
          </div>
          <div class="flex items-center gap-2 pr-4">
            <div class="w-2 h-2 bg-[#000000] rounded-full">

            </div>
            <span class="font-semibold">
              incomplete
            </span>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent class="text-gray-700">
        {{ item.content }}
      </AccordionContent>
    </AccordionItem>
  </Accordion>
</template>