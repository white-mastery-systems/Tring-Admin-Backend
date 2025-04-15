<template>
    <UiFormField v-model="country" :name="props.name" class="mt-1">
        <UiFormItem class="mt-1 flex flex-col gap-1 ">
            <UiFormLabel v-if="labelVisible">Country
                <span class="text-sm text-red-500">*</span>
            </UiFormLabel>
            <UiPopover ref="popoverRef">
                <UiPopoverTrigger as-child>
                    <UiFormControl>
                        <UiButton variant="outline" role="combobox" class="font-normal text-sm px-3" :class="cn(
                            'min-w-[139.5px] md:min-w-[257.5px] justify-between relative overflow-hidden',
                            !fieldValue && 'text-muted-foreground',
                        )
                            ">
                            <div class="flex items-center gap-1">
                                <!-- {{ selectedCountry }} -->
                                <img v-if="selectedCountry" class="h-[20px] w-[20px]"
                                    :src="`https://country-code-au6g.vercel.app/${selectedCountry.code}.svg`"
                                    :alt="selectedCountry.name" />
                                {{
                                fieldValue
                                ? allCountryNames.find(
                                (country: any) =>
                                country === fieldValue,
                                )
                                : "Country Name"
                                }}
                            </div>
                            <component :is="ChevronDown" class="ml-2 h-4 w-4 shrink-0 opacity-50">
                            </component>
                        </UiButton>
                    </UiFormControl>
                </UiPopoverTrigger>
                <UiPopoverContent class="w-[200px] p-0">
                    <UiCommand @update:searchTerm="handleSearchCountries">
                        <UiCommandInput placeholder="Search country..." />
                        <UiCommandEmpty>No countries found.</UiCommandEmpty>
                        <UiCommandList>
                            <div v-bind="containerPropsForCountry" class="max-h-52">
                                <div v-bind="wrapperPropsForCountry">
                                    <UiCommandGroup>
                                        <UiCommandItem v-for="country in countriesList" :key="country.data"
                                            :value="country.data" @select="() => {
                                                handleChange(country.data);
                                            }
                                            " :class="getItemHeight(country.data)">
                                            <Check :class="cn(
                                                'mr-2 h-4 w-4',
                                                country.data === fieldValue
                                                    ? 'opacity-100'
                                                    : 'opacity-0',
                                            )
                                                " />
                                            <span class="text-left w-[80%]">
                                                {{ country.data }}
                                            </span>
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
import { Check } from 'lucide-vue-next';
import { ChevronDown } from "lucide-vue-next";
import countryData from "~/assets/country-codes.json";
import { useCountryData } from '~/composables/useCountryMatchData';

const searchField = ref('')
const popoverRef = ref(null)
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
    labelVisible: {
        type: Boolean,
        default: true
    }
});

const countryHeightMap = ref(new Map())
const allCountryNames = computed(() =>
    countryData?.filter((country: any) => country.name.toLowerCase().includes(searchField.value) || country.code.toLowerCase().includes(searchField.value) || country.dial_code.toLowerCase().includes(searchField.value))?.map((country) => country.name),
);
const {
    list: countriesList,
    containerProps: containerPropsForCountry,
    wrapperProps: wrapperPropsForCountry,
} = useVirtualList(allCountryNames, {
    // Keep `itemHeight` in sync with the item's row.
    itemHeight: 32,
});
const { value: fieldValue, errorMessage, meta, handleChange } = useField(() => props.name);
// const country = ref(fieldValue.value);
const { country } = useCountryData(fieldValue);

const selectedCountry = computed(() =>
    countryData.find((country: any) => country.name === fieldValue.value)
);

watch(() => countryData, (newValue) => {
    const selectedCountry = newValue.find((country: any) => country.name)
}, { deep: true, immediate: true });

watch(() => countryDetails.value, (newValue) => {
    fieldValue.value = newValue;
}, { deep: true, immediate: true });
watch(country, (newValue) => {
    fieldValue.value = newValue;
});
// , { deep: true, immediate: true }
const handleSearchCountries = (e: string) => {
    searchField.value = e.toLowerCase()
}
const handleClickOutside = (event: MouseEvent) => {
    const popoverElement = popoverRef.value?.$el || popoverRef.value; // Get the real DOM element

    if (popoverElement && !popoverElement.contains(event.target as Node)) {
        searchField.value = ''; // Clear search field
    }
};

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
const getItemHeight = (countryName) => {
    // If we already calculated this country's height, return from cache
    if (countryHeightMap.value.has(countryName)) {
        return countryHeightMap.value.get(countryName);
    }

    // Default class with min-height
    const heightClass = "min-h-8";

    // Add additional classes if the name is likely to wrap
    if (countryName.length > 20) { // Simple heuristic
        return heightClass + " py-2";
    }

    return heightClass;
};

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
    setTimeout(() => {
        updateCountryHeights();
    }, 500);
});

watch(() => allCountryNames.value, () => {
    // Allow time for DOM to update
    nextTick(() => {
        setTimeout(updateCountryHeights, 100);
    });
});

const updateCountryHeights = () => {
    const listContainer = document.querySelector('.UiCommandList') || document;
    const availableWidth = listContainer.clientWidth - 40; // Account for padding and check icon

    allCountryNames.value.forEach(countryName => {
        const needsExtraHeight = willTextWrap(countryName, availableWidth);
        countryHeightMap.value.set(
            countryName,
            needsExtraHeight ? "min-h-8 h-auto py-2" : "min-h-8"
        );
    });
};

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
})
</script>