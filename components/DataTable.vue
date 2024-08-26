<script setup lang="ts" generic="T extends object">
  import type { ColumnDef, SortingState } from "@tanstack/vue-table";
  import {
    FlexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useVueTable,
  } from "@tanstack/vue-table";

  const props = defineProps<{
    data: T[];
    columns: ColumnDef<T, any>[];
    footer?: boolean;
    pageSize?: number;
    isLoading?: boolean;
    height?: number;
    heightUnit?: string;
  }>();

  const sorting = ref<SortingState>([]);
  const pageSize = computed(() => props.pageSize || 10);

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
        pageSize: pageSize.value,
      },
    },
  });
</script>

<template>
  <div class="space-y-4">
    <div
      class="relative h-[63vh] overflow-auto rounded-lg border"
      :class="
        props.height ? `h-[${props.height}${props.heightUnit}]` : 'h-[63vh]'
      "
    >
      <UiTable class="text-left text-gray-500">
        <UiTableHeader class="sticky top-0 bg-gray-50 text-xs uppercase">
          <UiTableRow
            v-for="headerGroup in table.getHeaderGroups()"
            :key="headerGroup.id"
          >
            <UiTableHead
              v-for="header in headerGroup.headers"
              :key="header.id"
              class="text-md text-nowrap rounded-tl-lg rounded-tr-lg px-6 py-2 font-extrabold text-gray-700"
              scope="col"
              @click="header.column.getToggleSortingHandler()?.($event)"
            >
              <FlexRender
                v-if="!header.isPlaceholder"
                :render="header.column.columnDef.header"
                :props="header.getContext()"
              />
            </UiTableHead>
          </UiTableRow>
        </UiTableHeader>
        <UiTableBody>
          <tr v-if="isLoading" class="h-36">
            <td :colspan="columns.length">
              <div class="grid h-full place-items-center">
                <Icon
                  name="svg-spinners:90-ring-with-bg"
                  class="mx-auto h-8 w-8"
                />
              </div>
            </td>
          </tr>
          <template
            class="bg-black-400"
            v-else-if="table.getRowModel().rows?.length"
          >
            <UiTableRow
              v-for="row in table.getRowModel().rows"
              :key="row.id"
              class="cursor-pointer overflow-hidden p-1"
              @click="$emit('row-click', row)"
              :data-state="row.getIsSelected() && 'selected'"
            >
              <UiTableCell
                v-for="cell in row.getVisibleCells()"
                :key="cell.id"
                class="text-md px-6 py-4 font-semibold"
              >
                <FlexRender
                  :render="cell.column.columnDef.cell"
                  :props="cell.getContext()"
                />
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
          <UiTableRow
            v-for="footerGroup in table.getFooterGroups()"
            :key="footerGroup.id"
          >
            <UiTableHead
              v-for="footer_h in footerGroup.headers"
              :key="footer_h.id"
              class="mx-6 px-6 font-bold lg:text-lg"
              :colspan="footer_h.colSpan"
            >
              <FlexRender
                :render="footer_h.column.columnDef.footer"
                :props="footer_h.getContext()"
              />
            </UiTableHead>
          </UiTableRow>
        </UiTableFooter>
      </UiTable>
    </div>
    <div
      v-if="table.getFilteredRowModel().rows.length > pageSize"
      class="flex flex-col items-center justify-center space-y-2 sm:flex-row sm:justify-between sm:space-y-0"
    >
      <p>
        Page {{ table.getState().pagination.pageIndex + 1 }} of
        {{ table.getPageCount() }} -
        {{ table.getFilteredRowModel().rows.length }} results
      </p>
      <div class="flex space-x-4">
        <UiButton
          size="icon"
          @click="table.setPageIndex(0)"
          class="bg-[#424bd1] text-white hover:bg-[#424bd1] hover:brightness-90"
        >
          <Icon name="lucide:chevrons-left" class="h-6 w-6" />
        </UiButton>
        <UiButton
          size="icon"
          class="bg-[#424bd1] text-white hover:bg-[#424bd1] hover:brightness-90"
          :disabled="!table.getCanPreviousPage()"
          @click="table.previousPage()"
        >
          <Icon name="lucide:chevron-left" class="h-6 w-6" />
        </UiButton>
        <UiButton
          size="icon"
          :disabled="!table.getCanNextPage()"
          @click="table.nextPage()"
          class="bg-[#424bd1] text-white hover:bg-[#424bd1] hover:brightness-90"
        >
          <Icon name="lucide:chevron-right" class="h-6 w-6" />
        </UiButton>
        <UiButton
          size="icon"
          @click="table.setPageIndex(table.getPageCount() - 1)"
          class="bg-[#424bd1] text-white hover:bg-[#424bd1] hover:brightness-90"
        >
          <Icon name="lucide:chevrons-right" class="h-6 w-6" />
        </UiButton>
      </div>
    </div>
  </div>
</template>
