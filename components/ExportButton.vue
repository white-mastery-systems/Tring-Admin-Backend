<script setup lang="ts">
  import { Upload } from "lucide-vue-next";
  import * as XLSX from "xlsx";

  import { Button } from "@/components/ui/button";
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
  const props = defineProps<{
    rows: any[];
    columns: any[];
    buttonContent:string;
  }>();
  const modalvalue = defineModel<{ status: boolean; type: string }>({
    default: {
      status: false,
      type: "csv",
    },
  });
  watch(
    () => modalvalue.value,
    (exportStatus: any) => {
      if (!exportStatus.status) {
        return;
      }
      if (exportStatus.type === "csv") {
        const csvRows = [];
        // Headers
        const headers = props.columns;
        csvRows.push(headers.join(","));

        // Rows
        props.rows.forEach((item) => {
          const values = Object.values(item).map((val) => `"${val}"`);
          csvRows.push(values.join(","));
        });

        // Create CSV Blob and trigger download
        const csvString = csvRows.join("\n");
        const blob = new Blob([csvString], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "data.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {

        // Capitalize headers with spaces
        const rowsWithFormattedHeaders = props.rows.map(row => {
          return Object.keys(row).reduce((acc, key) => {
            const formattedKey = key
              .replace(/([a-z])([A-Z])/g, '$1 $2')
              .replace(/_/g, ' ') 
              .replace(/\b\w/g, char => char.toUpperCase());

            acc[formattedKey] = row[key];
            return acc;
          }, {});
        });
        const ws = XLSX.utils.json_to_sheet(rowsWithFormattedHeaders);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        // Create Excel Blob and trigger download
        XLSX.writeFile(wb, "data.xlsx");
      }
    },
    { deep: true },
  );
  const emit = defineEmits<{ (e: "export"): void }>();

  function exportAsCSV() {
    if (modalvalue.value) {
      modalvalue.value.status = false;
      modalvalue.value.type = "csv";
    }

    emit("export");
  }
  const exportToExcel = () => {
    if (modalvalue.value) {
      modalvalue.value.status = false;
      modalvalue.value.type = "xlsx";
    }
    emit("export");
  };
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <UiButton color="primary">
        <Upload class="mr-2 h-4 w-4" />
        {{ props.buttonContent }}
      </UiButton>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-full">
      <DropdownMenuGroup>
        <!-- <DropdownMenuItem @click="exportAsCSV">
          <span>Export as CSV</span>
        </DropdownMenuItem> -->
        <DropdownMenuItem @click="exportToExcel">
          <span>Export as XLSX</span>
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
