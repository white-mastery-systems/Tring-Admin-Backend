<template>
    <UiFormField v-model="state" :name="props.name" class="mt-1">
        <UiFormItem class="mt-1 flex flex-col gap-1 ">
            <UiFormLabel>State
                <span class="text-sm text-red-500">*</span>
            </UiFormLabel>
            <UiPopover ref="popoverRef">
                <UiPopoverTrigger as-child>
                    <UiFormControl>
                        <UiButton class="text-sm font-normal" variant="outline" role="combobox" :class="cn(
                            'w-full justify-between text-sm relative overflow-hidden',
                            !fieldValue && 'text-muted-foreground',
                        )
                            ">
                            {{
                            fieldValue
                            ? statesList.find((state: any) =>
                            state === fieldValue,
                            )
                            : "State name"
                            }}
                            <component :is="ChevronDown" class="absolute right-3 ml-2 h-4 w-4 shrink-0 opacity-50">
                            </component>
                        </UiButton>
                    </UiFormControl>
                </UiPopoverTrigger>
                <UiPopoverContent class="w-[200px] p-0">
                    <UiCommand @update:searchTerm="handleSearchCountries">
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
                                                " class="text-left" :class="getItemHeight(state.data)">
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
            <span v-if="errorMessage" class="mt-0 text-[11px] sm:text-[11px] md:text-[13px] text-red-500">
                {{ errorMessage }}
            </span>
        </UiFormItem>
    </UiFormField>
</template>
<script setup lang="ts">
import stateData from "~/assets/state.json";
import { ChevronDown } from "lucide-vue-next";
import countryData from "~/assets/country-codes.json";
import { Check } from 'lucide-vue-next';

const searchField = ref('')
const popoverRef = ref(null)

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
const stateHeightMap = ref(new Map());

// const statesList: any = computed(() => {
//     return stateData
//         ?.filter(({ country_name }) => {
//             return country_name === country.value
//         })?.filter(({ name }) => name.toLowerCase().includes(searchField.value))
//         .map((item) => item.name);
// });

const statesList = computed(() => {
    // First, find the country object and its code based on country.value (which is the country name)
    const countryObject = countryData.find(c => c.name === country.value);
    const countryCode = countryObject ? countryObject.code : null;

    // If no matching country code found, return empty array
    if (!countryCode) return [];

    // Now filter states by the country code
    return stateData
        ?.filter(item => item.country_code === countryCode)
        ?.filter(({ name }) => name.toLowerCase().includes(searchField.value.toLowerCase()))
        .map(item => item.name);
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

const willTextWrap = (text, maxWidth) => {
    // Create a temporary span element to measure text width
    const tempSpan = document.createElement('span');
    tempSpan.style.visibility = 'hidden';
    tempSpan.style.position = 'absolute';
    tempSpan.style.fontSize = '14px'; // Match your text size
    tempSpan.style.fontFamily = 'inherit';
    tempSpan.innerText = text;
    document.body.appendChild(tempSpan);

    const width = tempSpan.offsetWidth;
    document.body.removeChild(tempSpan);

    return width > maxWidth;
};

const getItemHeight = (stateName) => {
    // If we already calculated this state's height, return from cache
    if (stateHeightMap.value.has(stateName)) {
        return stateHeightMap.value.get(stateName);
    }

    // Default class with min-height
    const heightClass = "min-h-8";

    // Add additional classes if the name is likely to wrap
    if (stateName.length > 20) { // Simple heuristic
        return heightClass + " py-2";
    }

    return heightClass;
};

const updateStateHeights = () => {
    const listContainer = document.querySelector('.UiCommandList') || document;
    const availableWidth = listContainer.clientWidth - 40; // Account for padding and check icon

    statesList.value.forEach(stateName => {
        const needsExtraHeight = willTextWrap(stateName, availableWidth);
        stateHeightMap.value.set(
            stateName,
            needsExtraHeight ? "min-h-8 h-auto py-2" : "min-h-8"
        );
    });
};


watch(state, (newValue) => {
    fieldValue.value = newValue;
});
watch(() => country.value, (newCountry) => {
    state.value = '';
    // Reset height cache when country changes
    stateHeightMap.value.clear();
    // Allow time for DOM to update
    nextTick(() => {
        setTimeout(updateStateHeights, 100);
    });
},{deep: true})

watch(() => statesList.value, () => {
    // Allow time for DOM to update
    nextTick(() => {
        setTimeout(updateStateHeights, 100);
    });
});

const handleSearchCountries = (e: string) => {
    searchField.value = e.toLowerCase()
}
const handleClickOutside = (event: MouseEvent) => {
    const popoverElement = popoverRef.value?.$el || popoverRef.value; // Get the real DOM element

    if (popoverElement && !popoverElement.contains(event.target as Node)) {
        searchField.value = ''; // Clear search field
    }
};
onMounted(() => {
    document.addEventListener('click', handleClickOutside);
    setTimeout(() => {
        updateStateHeights();
    }, 500);
});
onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
})
</script>