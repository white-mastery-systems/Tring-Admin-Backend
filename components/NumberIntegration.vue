
<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { createColumnHelper } from "@tanstack/vue-table";
import { useCount } from '@/composables/useRefresh';
import { Icon, UiBadge, UiButton } from "#components";
definePageMeta({
  middleware: "admin-only",
});

const router = useRouter();
const route = useRoute();
const { integrationsData, status, refresh } = useCount(); 
const numberModalState: any = defineModel<{ open: boolean, id: any }>({
  default: {
    open: false,
    id: null,
  },
});
const emit = defineEmits<{ (e: "action", id: any, modelControl: string): void }>();
// const message = inject('message')
// provide('message', 'testing')
watch(route, (newValue) => { });
// const q=ref('')
const filters = computed(() => ({
  q: route.query?.q,
}));


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
// const { status, data: integrationsData, refresh } = await useLazyAsyncData('refresh', () => $fetch('/api/org/integrations/number-integration'));
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

</script>

<template>
  <DataTable :columns="NumberColumns" :data="integrationsData" :page-size="8" :is-loading="false" :height="13"
    :heightUnit="'vh'" />
</template>