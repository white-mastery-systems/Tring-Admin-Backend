<template>
  <!-- <header>
    <div class="flex items-center gap-2">
      <UiButton variant="ghost" size="icon" @click="router.back()">
        <Icon name="ic:round-arrow-back-ios-new" class="h-5 w-5" />
      </UiButton>
      <span class="text-[20px] font-bold">CRM Configuration</span>
    </div>
  </header> -->
  <Page
    title="CRM Configuration"
    :disableSelector="true"
    :actionButtons="[h(ConfigurationModal)]"
  >
    <div class="mb-2 flex w-full justify-end">
      <ConfigurationModal />
    </div>
    <DataTable
      :columns="columns"
      :data="integrations"
      :page-size="8"
      :is-loading="false"
    />
  </Page>
</template>
<script setup lang="ts">
  import { createColumnHelper } from "@tanstack/vue-table";
  import ConfigurationModal from "./ConfigIntegrationModal.vue";
  const router = useRouter();
  const columnHelper = createColumnHelper<any>();
 
  const columns = [
    columnHelper.accessor("integration", {
      header: "Integration Name",
    }),

    columnHelper.accessor("project", {
      header: "project",
    }),
    columnHelper.accessor("actions", {
      header: "actions",
    }),
  ];

  const integrations = [
    { integration: "Zoho CRM", project: "XYZ project" },
    { integration: "Zoho Bigin", project: "XYZ project" },
    { integration: "Sell Do", project: "XYZ project" },
  ];
</script>
