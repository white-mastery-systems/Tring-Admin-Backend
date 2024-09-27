<script setup lang="ts">
import {
    ArrowUpFromLine
} from 'lucide-vue-next';

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
watch(props.rows, (newValue) => {
    console.log({ newValue })
}, { deep: true })
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
                <DropdownMenuItem>
                    <span>Export as CSV</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <span>Export as Excel</span>
                </DropdownMenuItem>

            </DropdownMenuGroup>

        </DropdownMenuContent>
    </DropdownMenu>
</template>