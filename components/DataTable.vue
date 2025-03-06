<script setup lang="ts" generic="T extends object">
  import type { ColumnDef, SortingState } from "@tanstack/vue-table";
  import {
    FlexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useVueTable,
  } from "@tanstack/vue-table";

  import { ArrowUpNarrowWide } from "lucide-vue-next";

const props = withDefaults(
  defineProps<{
    data: T[];
    columns: ColumnDef<T, any>[];
    footer?: boolean;
    pageSize?: number;
    isLoading?: boolean;
    limit: number;
    page: number | string;
    totalCount: number;
    totalPageCount: number;
    height?: number;
    heightUnit?: string;
    paginationControl: boolean;
  }>(),
  {
    footer: false,
    pageSize: 10,
    isLoading: false,
    height: 500,
    heightUnit: "px",
    paginationControl: true,
  }
);

  const emits = defineEmits(["pagination", "limit"]);

  const sorting = ref<SortingState>([]);
  const pageLimit = ref(10);
  const table = useVueTable<T>({
    get data() {
      return props.data; // Using a getter for reactivity
    },
    columns: props.columns,
    getCoreRowModel: getCoreRowModel<T>(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel<T>(),
    onSortingChange: (updaterOrValue) => valueUpdater(updaterOrValue, sorting),
    state: {
      get sorting() {
        return sorting.value;
      },
    },
    initialState: {
      pagination: {
        pageSize: pageLimit.value,
      },
    },
  });
  watch(pageLimit, (NewValue) => {
    table.setState((prev) => ({
      ...prev,
      pagination: {
        ...prev.pagination,
        pageSize: NewValue,
      },
    }));
  });
</script>

<template>
  <div class="space-y-4">
    <div :class="[
        'relative overflow-auto rounded-lg border table-scroll',
        props.height ? `h-screen-minus-${props.height}` : '',
      ]">
      <UiTable class="text-left text-gray-500">
        <UiTableHeader class="sticky top-0 bg-gray-50 text-xs uppercase">
          <UiTableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <UiTableHead v-for="(header, index) in headerGroup.headers" :key="header.id"
              class="text-md text-nowrap px-6 py-2 font-extrabold text-gray-700" scope="col">
              <div v-if="index === 0">
                <div style="display: flex; align-items: center">
                  <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header"
                    :props="header.getContext()" />
                  <div @click="header.column.getToggleSortingHandler()?.($event)" style="cursor: pointer">
                    <ArrowUpNarrowWide size="16" class="ml-2" />
                  </div>
                </div>
              </div>
              <div v-else>
                <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header"
                  :props="header.getContext()" />
              </div>
            </UiTableHead>
          </UiTableRow>
        </UiTableHeader>
        <UiTableBody>
          <tr v-if="isLoading" class="h-36">
            <td :colspan="columns.length">
              <div class="grid h-full place-items-center text-[#424BD1]">
                <Icon name="svg-spinners:90-ring-with-bg" class="mx-auto h-8 w-8" />
              </div>
            </td>
          </tr>
          <template class="bg-black-400" v-else-if="table.getRowModel().rows?.length">
            <UiTableRow v-for="row in table.getRowModel().rows" :key="row.id" class="cursor-pointer overflow-hidden p-1"
              @click="$emit('row-click', row)" :data-state="row.getIsSelected() && 'selected'">
              <UiTableCell v-for="cell in row.getVisibleCells()" :key="cell.id" class="text-md px-6 py-4 font-semibold">
                <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
              </UiTableCell>
            </UiTableRow>
          </template>
          <template v-else>
            <UiTableRow>
              <UiTableCell col-span="{columns.length}" class="h-24 text-center">
                No results.
              </UiTableCell>
            </UiTableRow>
          </template>
        </UiTableBody>
        <UiTableFooter v-if="footer">
          <UiTableRow v-for="footerGroup in table.getFooterGroups()" :key="footerGroup.id">
            <UiTableHead v-for="footer_h in footerGroup.headers" :key="footer_h.id"
              class="mx-6 px-6 font-bold lg:text-lg" :colspan="footer_h.colSpan">
              <FlexRender :render="footer_h.column.columnDef.footer" :props="footer_h.getContext()" />
            </UiTableHead>
          </UiTableRow>
        </UiTableFooter>
      </UiTable>
    </div>
    <div v-if="paginationControl"
      class="flex w-full flex-col pb-2 sm:pb-2 items-center justify-center space-y-2 overflow-x-scroll sm:flex-row sm:justify-between sm:space-y-0 md:pb-4 lg:pb-0 xl:pb-0">
      <span class="hidden w-[10%] text-xs text-gray-500 sm:hidden md:flex lg:flex xl:flex">Page {{ page }} of {{
        totalPageCount }}</span>
      <div class="flex w-full justify-end space-x-4 overflow-x-scroll">
        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-600">showing</span>
          <PageLimitFilter @changeAction="
              ($event) => {
                pageLimit = +$event;

                emits('limit', $event);
              }
            " />
          <span class="text-sm text-gray-500">of {{ totalCount }} records</span>
        </div>
        <!-- class="bg-[#424bd1] text-white hover:bg-[#424bd1] hover:brightness-90" -->
        <UiButton size="icon" @click="emits('pagination', 1)" :disabled="page === 1">
          <Icon name="lucide:chevrons-left" class="h-6 w-6" />
        </UiButton>
        <!-- class="bg-[#424bd1] text-white hover:bg-[#424bd1] hover:brightness-90" -->
        <UiButton size="icon" :disabled="page === 1" @click="emits('pagination', page - 1)">
          <Icon name="lucide:chevron-left" class="h-6 w-6" />
        </UiButton>
        <!-- class="bg-[#424bd1] text-white hover:bg-[#424bd1] hover:brightness-90" -->
        <UiButton size="icon" :disabled="totalPageCount === page" @click="
            () => {
              emits('pagination', page + 1);
            }
          ">
          <Icon name="lucide:chevron-right" class="h-6 w-6" />
        </UiButton>
        <!-- class="bg-[#424bd1] text-white hover:bg-[#424bd1] hover:brightness-90" -->
        <UiButton size="icon" @click="emits('pagination', totalPageCount)" :disabled="totalPageCount === page">
          <Icon name="lucide:chevrons-right" class="h-6 w-6" />
        </UiButton>
      </div>
    </div>
  </div>
</template>