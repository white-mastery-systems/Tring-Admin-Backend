<template>
    <div :class="cn('w-full', props?.class)">
        <UiFormField v-model="countryCode" :name="props.name" class="mt-1">
            <UiFormItem class="mt-1 flex flex-col  mt-0">
                <UiFormLabel>Country code
                    <span class="text-sm text-red-500">*</span>
                </UiFormLabel>
                <UiPopover class="mt-0">
                    <UiPopoverTrigger as-child class="mt-0">
                        <UiFormControl class="mt-0">
                            <UiButton variant="outline" role="combobox" :class="cn(
                                'w-[100px] justify-between overflow-hidden mt-0',
                                !fieldValue && 'text-muted-foreground',
                                'mt-0 space-y-0'
                            )
                                ">
                                {{
                                    fieldValue
                                        ? allCoutryDialCode.find(
                                            (dialCode: any) =>
                                                dialCode === fieldValue,
                                        )
                                        : "dial code"
                                }}
                                <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </UiButton>
                        </UiFormControl>
                    </UiPopoverTrigger>
                    <UiPopoverContent class="w-[200px] p-0">
                        <UiCommand>
                            <UiCommandInput placeholder="Search code..." />
                            <UiCommandEmpty>No codes found.</UiCommandEmpty>
                            <UiCommandList>
                                <div v-bind="containerProps" class="max-h-52">
                                    <div v-bind="wrapperProps">
                                        <UiCommandGroup>
                                            <UiCommandItem v-for="dialCode in countyDialCodes" :key="dialCode.data"
                                                :value="dialCode.data" @select="() => {
                                                    handleChange(dialCode.data);
                                                }
                                                    " style="height: 32px">
                                                <UiCheck :class="cn(
                                                    'mr-2 h-4 w-4',
                                                    dialCode.data === fieldvalue
                                                        ? 'opacity-100'
                                                        : 'opacity-0',
                                                )
                                                    " />
                                                {{ dialCode.data }}
                                            </UiCommandItem>
                                        </UiCommandGroup>
                                    </div>
                                </div>
                            </UiCommandList>
                        </UiCommand>
                    </UiPopoverContent>
                </UiPopover>
                <UiFormMessage class="text-xs text-red-500 " />
                <span v-if="errorMessage" class="mt-0 text-sm text-red-700">
                    {{ errorMessage }}
                </span>
            </UiFormItem>
        </UiFormField>
    </div>
</template>
<script setup lang="ts">
import countryData from "~/assets/country-codes.json";

const props = defineProps({
    name: {
        type: String,
        required: true
    },
    label: {
        type: String,
        required: true
    },
    placeholder: {
        type: String,
        default: 'Select an option'
    },
    required: {
        type: Boolean,
        default: false
    },
    helperText: {
        type: String
    },
    class: {
        type: String
    }

});
const allCoutryDialCode = computed(() =>
    countryData?.map((country) => country.dial_code),
);
const {
    list: countyDialCodes,
    containerProps,
    wrapperProps,
} = useVirtualList(allCoutryDialCode, {
    itemHeight: 32,
});
const { value: fieldValue, errorMessage, meta, handleChange } = useField(() => props.name);
const countryCode = ref(fieldValue.value);

watch(countryCode, (newValue) => {
    fieldValue.value = newValue;
});
</script>