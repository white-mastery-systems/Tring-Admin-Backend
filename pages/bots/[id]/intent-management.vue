<script setup lang="ts">
  import { createColumnHelper } from "@tanstack/vue-table";
  import { IntentActions } from "#components";

  const showIntentDialog = ref(false);

  const animationProps = {
    duration: 0,
  };
  const router = useRouter();
  const route = useRoute("bots-id-intent-management");

  const {
    status: intentLoadingStatus,
    refresh: intentRefresh,
    data: intentData,
  } = await useLazyFetch(() => `/api/bots/${route.params.id}/intents`, {
    server: false,
    default: () => [],
    transform: (intents) =>
      intents.map((intent) => ({
        ...intent,
        createdAt: formatDate(new Date(intent.createdAt), "dd.MM.yyyy"),
      })),
  });

  const isIntentLoading = computed(
    () => intentLoadingStatus.value === "pending",
  );

  const intentId = ref<(typeof intentData.value)[0] | undefined>(undefined);
  watch(showIntentDialog, (newStatus) => {
    if (!newStatus) intentId.value = undefined;
  });

  const deleteIntent = async (payload: any) => {
    const intent = await $fetch(
      `/api/bots/${route.params.id}/intents/${payload}`,
      { method: "DELETE" },
    );
    intentRefresh();
  };

  const columnHelper = createColumnHelper<(typeof intentData.value)[0]>();
  const columns = [
    columnHelper.accessor("intent", {
      header: "Intent Name",
    }),
    columnHelper.accessor("link", {
      header: "Link",
    }),
    columnHelper.accessor("createdAt", {
      header: "Date Created",
    }),
    columnHelper.display({
      header: "Actions",
      cell: ({ row }) => {
        return h(IntentActions, {
          id: row.original.id,
          onDelete: () => deleteIntent(row.original.id),
          onEdit: () => {},
        });
      },
    }),
  ];
</script>
<template>
  <Page title="Intent Management" :disableSelector="true">
    <div class="mb-4 flex items-center justify-end">
      <UiButton type="button" color="primary" @click="showIntentDialog = true"
        >Add Intents</UiButton
      >
    </div>
    <DataTable
      :columns="columns"
      :data="intentData"
      :page-size="8"
      :is-loading="isIntentLoading"
    />

    <LazyIntentCreateModal
      :details="intentId"
      v-model="showIntentDialog"
      @refresh="intentRefresh"
    />
  </Page>
</template>
