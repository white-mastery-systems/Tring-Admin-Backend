<template>
  <UiDropdownMenu>
    <UiDropdownMenuTrigger as-child>
      <img src="assets/icons/more_horiz.svg" width="30" />
    </UiDropdownMenuTrigger>
    <UiDropdownMenuContent class="w-36">
      <UiDropdownMenuGroup class="flex flex-col items-center justify-center">
        <UiDropdownMenuItem @click="handleAction('download')">
          <div class="menu-align rounded-sm text-center">Download</div>
        </UiDropdownMenuItem>
        <UiDropdownMenuItem v-if="row.id !== documents?.documentId" @click="deleteDocumentModelOpen[row.id] = true">
          <div class="menu-align rounded-sm text-center">Delete</div>
        </UiDropdownMenuItem>
      </UiDropdownMenuGroup>
    </UiDropdownMenuContent>
  </UiDropdownMenu>
  <ConfirmationModal v-model:open="deleteDocumentModelOpen[row.id]" title="Confirm Delete"
    description="Are you sure you want to delete ?" @confirm="() => {
        handleAction('delete');
        deleteDocumentModelOpen[row.id] = false;
      }
      " />
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

// Define props for receiving row and documents
const props:any = defineProps({
  row: Object, // Expecting the row data as an object
  documents: Object, // Expecting document data
});
const deleteDocumentModelOpen: any = reactive({});
// Define emit for handling delete and download actions
const emit = defineEmits(["delete", "download"]);

// Handle actions like download and delete
const handleAction = (action: any) => {
  switch (action) {
    case "download":
      handleDownload();
      break;
    case "delete":
      handleDelete();
      break;
  }
};

// Handle the download action
const handleDownload = () => {
  emit("download",props.row); // Emit download event with row id
};

// Handle the delete action
const handleDelete = () => {
  emit("delete",props.row); // Emit delete event with row id
};
</script>