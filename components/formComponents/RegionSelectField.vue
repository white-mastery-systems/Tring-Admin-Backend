<template>
    <UiFormField v-model="state" :name="props.name" class="mt-1">
        <UiFormItem class="mt-1 flex flex-col gap-1 ">
            <UiFormLabel>state
                <span class="text-sm text-red-500">*</span>
            </UiFormLabel>
            <UiPopover>
                <UiPopoverTrigger as-child>
                    <UiFormControl>
                        <UiButton variant="outline" role="combobox" :class="cn(
                            'w-full justify-between overflow-hidden',
                            !fieldValue && 'text-muted-foreground',
                        )
                            ">
                            {{
                                fieldValue
                                    ? statesList.find((state: any) =>
                                        state === fieldValue,
                                    )
                                    : "state name"
                            }}
                            <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </UiButton>
                    </UiFormControl>
                </UiPopoverTrigger>
                <UiPopoverContent class="w-[200px] p-0">
                    <UiCommand>
                        <UiCommandInput placeholder="Search state..." />
                        <UiCommandEmpty>No states found.</UiCommandEmpty>
                        <UiCommandList>
                            <div v-bind="containerPropsForState" class="max-h-52">
                                <div v-bind="wrapperPropsForState">
                                    <UiCommandGroup>
                                        <UiCommandItem v-for="state in stateRenderList" :key="state.data"
                                            :value="state.data" @select="() => {
                                                handleChange(state.data);
                                            }
                                                " style="height: 32px">
                                            <Check :class="cn(
                                                'mr-2 h-4 w-4',
                                                state.data === fieldValue
                                                    ? 'opacity-100'
                                                    : 'opacity-0',
                                            )
                                                " />
                                            {{ state.data }}
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
</template>
<script setup lang="ts">
import stateData from "~/assets/state.json";
const country = defineModel('country')
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


});
// watch(country, (newCountry) => {
//     console.log({ newCountry })
// })

const statesList: any = computed(() => {
    // console.log({ stateData })
    return stateData
        ?.filter(({ country_name }) => {
            return country_name === country.value
        })
        .map((item) => item.name);
});
const {
    list: stateRenderList,
    containerProps: containerPropsForState,
    wrapperProps: wrapperPropsForState,
} = useVirtualList(statesList, {
    itemHeight: 32,
});
const { value: fieldValue, errorMessage, meta, handleChange } = useField(() => props.name);
const state = ref(fieldValue.value);

watch(state, (newValue) => {
    fieldValue.value = newValue;
});
</script>