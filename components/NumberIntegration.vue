
<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { createColumnHelper } from "@tanstack/vue-table";

definePageMeta({
  middleware: "admin-only",
});

const router = useRouter();
const route = useRoute();

watch(route, (newValue) => { });
// const q=ref('')
const filters = computed(() => ({
  q: route.query?.q,
}));
const { data: integrationsData } = await useLazyFetch("/api/org/integrations/number-integration");
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
  <DataTable :columns="NumberColumns" :data="integrationsData" :page-size="8" :is-loading="false" :height="10"
    :heightUnit="'vh'" />
</template>