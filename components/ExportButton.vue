<script setup lang="ts">
  import { ArrowUpFromLine } from "lucide-vue-next";
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
      console.log(exportStatus, "EXPORT STATUS");
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
        const ws = XLSX.utils.json_to_sheet(props.rows);
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
      console.log("sss");
      modalvalue.value.status = false;
      modalvalue.value.type = "xlsx";
    }
    emit("export");
  };
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="outline">
        <ArrowUpFromLine class="mr-2 h-4 w-4" />
        Export Data
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-full">
      <DropdownMenuGroup>
        <DropdownMenuItem @click="exportAsCSV">
          <span>Export as CSV</span>
        </DropdownMenuItem>
        <DropdownMenuItem @click="exportToExcel">
          <span>Export as XLSX</span>
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
