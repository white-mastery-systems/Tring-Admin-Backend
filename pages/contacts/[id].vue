<template>
  <Page :title="getSingleDetails?.name" :disableSelector="true" :disable-elevation="true" :disable-back-button="false">
    <!-- {{ getSingleDetails }} -->
    <template #actionButtons>
      <div class="flex gap-4">
        <div class="flex gap-2">
          <UiButton color="primary" @click="() => {
            addBucketModalState.open = true
            addBucketModalState.id = null
          }">
            Add Contact
          </UiButton>
        </div>
      </div>
    </template>
    <DataTable :data="contactsList" :is-loading="isDataLoading" :columns="columns" :page-size="20" :height="15"
      height-unit="vh" />
    <BucketModal v-model="addBucketModalState" @confirm="() => {
      addBucketModalState.open = false
      integrationRefresh()
    }" />

    <ConfirmationModal v-model:open="deleteIntegrateNumber.open" title="Confirm Delete"
      description="Are you sure you want to delete ?" @confirm="() => {
  if (deleteIntegrateNumber?.id) {
            bucketNumber({
              queryId: queryId,
              id: deleteIntegrateNumber.id,
              onSuccess: () => {
                integrationRefresh();
              },
            });
            deleteIntegrateNumber.open = false;
          }
        }
        " />

  </Page>
</template>
<script setup lang="ts">
import { createColumnHelper } from "@tanstack/vue-table";
import { format } from "date-fns";
import { any } from "zod";
import { useRoute, useRouter } from "vue-router";
import { Icon, UiBadge, UiButton } from "#components";

definePageMeta({
  middleware: "admin-only",
});

const formSchema = toTypedSchema(
  z.object({
    newBotName: z.string().min(2, "Bot Name is requird."),
  }),
);
const addBucketModalState: any = ref({ open: false, id: null })
const deleteIntegrateNumber = ref({ open: false, id: null });

const searchBot = ref("");
const searchBotDebounce = refDebounced(searchBot, 500);
const router = useRouter();
const route = useRoute();
const queryId = ref(route.params.id)
const { data: getSingleDetails } = await useLazyFetch(
  `/api/org/contact-list/${route.params.id}`,
);
const activeStatus = ref("");
watch(activeStatus, async (newStatus, previousStatus) => { });
const selectedValue = ref("Today");
const { status, data: contactsList, refresh: integrationRefresh, } = await useLazyFetch(`/api/org/contact-list/${queryId.value}/contacts`, {
  server: false,
  // query: filters,
  default: () => [],
});
// const newBotName = ref("");
// const botList = await listApiBots();

// const { status, data: voiceBot } = await useLazyFetch("/api/voicebots", {
//   server: false,
//   default: () => [],
//   query: {
//     active: activeStatus,
//     q: searchBotDebounce,
//   },
//   headers: {
//     "time-zone": Intl.DateTimeFormat().resolvedOptions().timeZone,
//   },
//   transform: (voiceBot) =>
//     voiceBot.map((bot) => ({
//       id: bot.id,
//       name: bot.name,
//       status: bot.active,
//       createdAt: `${bot.createdAt}`,
//     })),
// });
const isDataLoading = computed(() => status.value === "pending");
const columnHelper = createColumnHelper<(typeof contactsList.value)[0]>();

const actionsComponent = (id: any) => h(
  "div",
  {
    class: "flex items-center gap-2",
  }, [
  h(
    UiButton,
    {
      onClick: (e: Event) => {
        // e.stopPropagation();
        // addBucketNameModalState.value.open = true;
        // addBucketNameModalState.value.id = id
        addBucketModalState.value.open = true
        addBucketModalState.value.id = id
      },
      color: "primary",
    },
    h(Icon, { name: "lucide:pen" }),
  ),
  h(
    UiButton,
    {
      class: "",
      variant: "destructive",
      onClick: (e: any) => {
        deleteIntegrateNumber.value.open = true
        deleteIntegrateNumber.value.id = id
      }, // Add delete functionality
    },
    h(Icon, { name: "lucide:trash-2" }),
  ),
  // h(
  //   UiButton,
  //   {
  //     onClick: () => {
  //       addBucketModalState.value.open = true
  //       addBucketModalState.value.id = id
  //       console.log("addBucketModalState")
  //     }, // Add delete functionality
  //     class: "bg-[#424bd1] hover:bg-[#424bd1] font-bold", // Different color for delete
  //   },
  //   [h({ name: "ph:trash-light", class: "h-4 w-4 mr-2" }), "Add"]
  // )
]
)
const columns = [
  columnHelper.accessor("firstName", {
    header: "First Name",
  }),
  columnHelper.accessor("lastName", {
    header: "Last Name",
  }),
  columnHelper.accessor("phone", {
    header: "Number",
  }),
  columnHelper.accessor("id", {
    header: "Action",
    cell: ({ row }) => {
      return actionsComponent(row.original.id)
    }
  }),
];


// const bucketNumber = as(id: any) => {
//   try {
//     const deleteIntegration = await $fetch<SelectChatBot>(
//       `/api/org/integrations/${integrationId}`,
//       {
//         method: "DELETE",
//       },
//     );

//     onSuccess();
//     toast.success("Integration removed successfully");

//     return deleteIntegration;
//   } catch (err: any) {
//     if (err.status === 500) {
//       toast.error("Cannot delete: Integration has connected bots");
//     }
//     toast.error(err.data.data[0].message);
//   }
// }
</script>

<style scoped></style>
