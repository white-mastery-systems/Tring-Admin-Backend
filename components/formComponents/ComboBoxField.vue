<!-- CountryCodeSelector.vue -->
<template>
    <UiFormField v-model="selectedCode" v-bind="fieldProps" :name="name" :class="fieldClass">
        <UiFormItem :class="itemClass">
            <UiFormLabel>
                {{ label }}
                <span v-if="required" class="text-sm text-red-500">*</span>
            </UiFormLabel>
            <UiPopover>
                <UiPopoverTrigger as-child>
                    <UiFormControl>
                        <UiButton variant="outline" role="combobox" :class="buttonClass">
                            {{ displayValue }}
                            <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </UiButton>
                    </UiFormControl>
                </UiPopoverTrigger>
                <UiPopoverContent class="w-[200px] p-0">
                    <UiCommand>
                        <UiCommandInput :placeholder="searchPlaceholder" v-model="searchCode" />
                        <UiCommandEmpty>{{ emptyMessage }}</UiCommandEmpty>
                        <UiCommandList>
                            <div v-bind="containerProps" class="max-h-52">
                                <div v-bind="wrapperProps">
                                    <UiCommandGroup>
                                        <UiCommandItem v-for="code in filteredCodes" :key="code.data" :value="code.data"
                                            @select="selectCode(code.data)" style="height: 32px">
                                            <UiCheck :class="checkClass(code.data)" />
                                            {{ code.data }}
                                        </UiCommandItem>
                                    </UiCommandGroup>
                                </div>
                            </div>
                        </UiCommandList>
                    </UiCommand>
                </UiPopoverContent>
            </UiPopover>
            <span v-if="error" class="mt-0 text-sm text-red-700">
                {{ error }}
            </span>
        </UiFormItem>
    </UiFormField>
</template>

<script setup>
import { ref, computed } from 'vue';
import { ChevronsUpDown, Check } from 'lucide-vue-next';

const props = defineProps({
    modelValue: String,
    name: String,
    label: String,
    required: Boolean,
    fieldProps: Object,
    fieldClass: String,
    itemClass: String,
    buttonClass: String,
    allCodes: Array,
    containerProps: Object,
    wrapperProps: Object,
    error: String,
    searchPlaceholder: {
        type: String,
        default: 'Search code...'
    },
    emptyMessage: {
        type: String,
        default: 'No codes found.'
    }
});

const emit = defineEmits(['update:modelValue']);

const selectedCode = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
});

const searchCode = ref('');

const filteredCodes = computed(() => {
    return props.allCodes.filter(code =>
        code.data.toLowerCase().includes(searchCode.value.toLowerCase())
    );
});

const displayValue = computed(() => {
    return selectedCode.value
        ? props.allCodes.find(code => code.data === selectedCode.value)?.data
        : 'Select code...';
});

const selectCode = (code) => {
    selectedCode.value = code;
};

const checkClass = (code) => {
    return {
        'mr-2 h-4 w-4': true,
    }
}        