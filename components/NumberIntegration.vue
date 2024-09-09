
<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { createColumnHelper } from "@tanstack/vue-table";

definePageMeta({
  middleware: "admin-only",
});
const router = useRouter();
const route = useRoute();
// const message = inject('message')
// provide('message', 'testing')
watch(route, (newValue) => { });
// const q=ref('')
const filters = computed(() => ({
  q: route.query?.q,
}));
const { data: integrationsData, refresh: integrationRefresh } = await useLazyFetch("/api/org/integrations/number-integration");
const columnHelper = createColumnHelper<any>();
const NumberColumns = [
  columnHelper.accessor("provider", {
    header: "Provider",
  }),
  columnHelper.accessor("exoPhone", {
    header: "Number",
  }),
];


const refreshApi = async () => {
  if (integrationRefresh) {
    await integrationRefresh(); // Call the refresh function to refresh the API
    console.log('API refreshed!');
  }
};

defineExpose({
  refreshApi,
});
</script>

<template>
  <DataTable :columns="NumberColumns" :data="integrationsData" :page-size="8" :is-loading="false" :height="13"
    :heightUnit="'vh'" />
</template>