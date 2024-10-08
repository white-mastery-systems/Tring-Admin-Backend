<script setup lang="ts">
import {
    ArrowUpFromLine
} from 'lucide-vue-next';
import * as XLSX from 'xlsx';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
const props = defineProps<{
    rows: any[],
    columns: any[]
}>()
const emit = defineEmits<{ (e: "export"): void }>();

watch(() => props.rows, (newValue) => {
    console.log({ newValue })
}, { deep: true, immediate: true })
function exportAsCSV() {
    emit('export')
    const csvRows = [];
    // Headers
    const headers = props.columns
    csvRows.push(headers.join(','));

    // Rows
    props.rows.forEach(item => {
        const values = Object.values(item).map(val => `"${val}"`);
        csvRows.push(values.join(','));
    });

    // Create CSV Blob and trigger download
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
const exportToExcel = () => {
    emit('export')
    const ws = XLSX.utils.json_to_sheet(props.rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    // Create Excel Blob and trigger download
    XLSX.writeFile(wb, 'data.xlsx');

    // const headers = props.columns

    // // // Map data to match the custom headers
    // const mappedData = props.rows.map(item => ({
    //     "Full Name": item.name,
    //     "Age": item.age,
    //     "Email Address": item.email,
    // }));

    // // Create worksheet with custom headers
    // const ws = XLSX.utils.json_to_sheet(mappedData, { header: headers });
    // const wb = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(wb, ws, 'CustomSheet');

    // // Write file
    // XLSX.writeFile(wb, 'custom_data.xlsx');

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