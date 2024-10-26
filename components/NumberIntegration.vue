<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { createColumnHelper } from "@tanstack/vue-table";
import { useCount } from '@/composables/useRefresh';
import { Icon, UiBadge, UiButton } from "#components";
definePageMeta({
  middleware: "admin-only",
});
// const props = withDefaults(defineProps<Props>(), {
//   title: "",
//   description: "",
// });
const props: any = withDefaults(defineProps<{
  integrateResponse: Array<any>; // Define the type according to your data structure
  totalPageCount: number;
  totalCount: number;
  filters: {
    page: any;
    limit: string;
  };
}>(), {
  totalPageCount: 0,
  totalCount: 0,
  filters: {
    page: '1',
    limit: '10',
  },
});

  const router = useRouter();
  const route = useRoute();
  // const filters = reactive
  const numberModalState: any = defineModel<{ open: boolean, id: any }>({
  default: {
    open: false,
    id: null,
  },
});
const emit = defineEmits<{ 
  (e: "action", id: any, modelControl: string): void; 
  (e: 'pagenation', page: number): void;
  (e: 'limitChange', limit: string): void; // Emit limit change event
 }>();
// const message = inject('message')
  // provide('message', 'testing')
  watch(route, (newValue) => {});
  // const q=ref('')
  
const actionsComponent = (id: any) => h(
  "div",
  {
    class: "flex items-center gap-2",
  }, [
    h(UiButton, {
      color: "primary",
      onClick: () => {
        // numberModalState.value.id = id
        emit("action", id, 'edit')
        console.log(numberModalState.value.open, "numberModalState")
      },
      class: "bg-[#f44336] hover:bg-[#f44336] font-bold",
    },
    h(Icon, { name: "lucide:pen" }),
  ), 
    h(
      UiButton,
      {
        variant: "destructive",
        onClick: () => {
          emit("action", id, 'delete')
          // deleteCampaigntate.value.open = true
          // deleteCampaigntate.value.id = id
        }, // Add delete functionality
      },
      h(Icon, { name: "lucide:trash-2" })
    )
  ]
)
  const columnHelper = createColumnHelper<any>();
  const NumberColumns = [
    columnHelper.accessor("provider", {
      header: "Provider",
    }),
    columnHelper.accessor("exoPhone", {
      header: "Number",
    }),
    columnHelper.accessor("id", {
    header: "Action",
    cell: ({ row }) => {
      return actionsComponent(row.original.id)
    }
  }),
];
const Pagination = async ($event: any) => {
  emit('pagenation', $event)
};
const changeLimit = ($event: any) => {
  emit('limitChange', $event); // Emit limit change event
};
</script>

<template>
  <DataTable
    @pagination="Pagination"
    @limit="changeLimit"
    :totalPageCount="props.totalPageCount"
    :page="parseInt(props.filters.page)"
    :totalCount="props.totalCount"
    :columns="NumberColumns"
    :data="integrateResponse"
    :page-size="8"
    :is-loading="false"
    :height="17"
    :heightUnit="'vh'"
  />
</template>
