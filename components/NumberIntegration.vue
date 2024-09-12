
<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { createColumnHelper } from "@tanstack/vue-table";
import { useCount } from '@/composables/useRefresh';
definePageMeta({
  middleware: "admin-only",
});

const router = useRouter();
const route = useRoute();
const { integrationsData, status, refresh } = useCount(); 
// const message = inject('message')
// provide('message', 'testing')
watch(route, (newValue) => { });
// const q=ref('')
const filters = computed(() => ({
  q: route.query?.q,
}));
// const { status, data: integrationsData, refresh } = await useLazyAsyncData('refresh', () => $fetch('/api/org/integrations/number-integration'));
const columnHelper = createColumnHelper<any>();
const NumberColumns = [
  columnHelper.accessor("provider", {
    header: "Provider",
  }),
  columnHelper.accessor("exoPhone", {
    header: "Number",
  }),
];

</script>

<template>
  <DataTable :columns="NumberColumns" :data="integrationsData" :page-size="8" :is-loading="false" :height="13"
    :heightUnit="'vh'" />
</template>