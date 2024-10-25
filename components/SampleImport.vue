<!-- <script setup lang="ts">
import { Download  } from "lucide-vue-next";
import { Button as UiButton } from "@/components/ui/button";

const props = defineProps<{
  columns: string[]; // Expecting columns to be an array of strings
}>();

// const emit = defineEmits<{ (e: "export"): void }>();

function exportAsCSV() {
  const csvRows = [];

  // Headers
  const headers = props.columns;
  csvRows.push(headers.join(",")); // Join headers with commas

  // Create CSV Blob and trigger download
  const csvString = csvRows.join("\n");
  const blob = new Blob([csvString], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "sample_import.csv"); // Change file name to indicate sample
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
</script>

<template>
  <div>
    <UiButton color="primary" @click="exportAsCSV">
      <Download  class="mr-2 h-4 w-4" />
      Sample Contacts Import
    </UiButton>
  </div>
</template> -->

<script setup lang="ts">
import { Download } from "lucide-vue-next";

const props = defineProps<{
  columns: string[]; // Expecting columns to be an array of strings
}>();

function exportAsCSV() {
  const csvRows = [];

  // Headers
  const headers = props.columns;
  csvRows.push(headers.join(",")); // Join headers with commas

  // Create CSV Blob and trigger download
  const csvString = csvRows.join("\n");
  const blob = new Blob([csvString], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);

  // Return the URL for the link
  return url;
}
</script>

<template>
  <div class="min-w-[190px]">
    <!-- Use an anchor tag styled like a regular link -->
    <a :href="exportAsCSV()" download="sample_import.csv"
      class="text-[#424bd1] hover:underline inline-flex items-center text-[14px] w-full font-medium">
      <Download class="mr-2 h-4 w-4" />
      Sample Contacts Import
    </a>
  </div>
</template>

