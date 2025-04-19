<script setup lang="ts">
import { Download } from "lucide-vue-next";

const props = defineProps<{
  columns: string[]; // Expecting columns to be an array of strings
  rows: any[];
}>();

const exportAsCSV = () => {
  const csvRows = [];

  // Headers
  const headers = props.columns;
  csvRows.push(headers.join(",")); // Join headers with commas

  props.rows.forEach((item) => {
    const values = Object.values(item).map((val) => val);
    csvRows.push(values.join(","));
  });
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

