<script setup lang="ts">
  import { useRoute, useRouter } from "vue-router";
  import { createColumnHelper } from "@tanstack/vue-table";
  import { useCount } from "@/composables/useRefresh";
  definePageMeta({
    middleware: "admin-only",
  });

  const router = useRouter();
  const route = useRoute();
  const filters = reactive<{
    q: string;
    page: string;
    limit: string;
  }>({
    q: "",
    page: "1",
    limit: "10",
  });
  let page = ref(0);
  let totalPageCount = ref(0);
  let totalCount = ref(0);
  const {
    data: integrationsData,
    status,
    refresh: integrationRefresh,
  } = await useLazyFetch("/api/org/integrations/number-integration", {
    server: false,
    default: () => [],
    query: filters,
    transform: (number: any) => {
      page.value = number.page;
      totalPageCount.value = number.totalPageCount;
      totalCount.value = number.totalCount;
      return number.data;
    },
  });
  // const message = inject('message')
  // provide('message', 'testing')
  watch(route, (newValue) => {});
  // const q=ref('')
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
  const Pagination = async ($evnt) => {
    filters.page = $evnt;
  };
</script>

<template>
  <DataTable
    @pagination="Pagination"
    @limit="
      ($event) => {
        (filters.page = '1'), (filters.limit = $event);
      }
    "
    :totalPageCount="totalPageCount"
    :page="page"
    :totalCount="totalCount"
    :columns="NumberColumns"
    :data="integrationsData"
    :page-size="8"
    :is-loading="false"
    :height="13"
    :heightUnit="'vh'"
  />
</template>
