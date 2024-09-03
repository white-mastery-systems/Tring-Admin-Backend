<script setup lang="ts">
import { Badge } from '@/components/ui/badge'

const channelList = ref(['All', 'Whats app', 'Website'])
</script>

<template>
  <template v-for="(list,index) in channelList" :key="index">
    <UiBadge class="bg-[#424BD1] gap-2 hover:bg-[#424BD1]">{{ list }}</UiBadge>
  </template>
</template>