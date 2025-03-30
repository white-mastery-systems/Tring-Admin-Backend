<template>
  <!-- Country selection using UiSelect -->
  <div class="min-w-[130px] max-w-[130px] truncate">
    <UiPopover>
      <UiPopoverTrigger as-child class="w-full py-[8px] rounded-[6px]">
        <div class="flex items-center justify-between text-[14px] w-full" :class="cn(
          'w-full cursor-pointer p-2 border border-gray-300 rounded capitalize truncate',
          !selectedCountry && ''
        )">
          <span class="w-[80%] truncate">
            {{
            selectedCountry.name ? selectedCountry.name : selectedCountry
            ? selectedCountry.name ? selectedCountry.name : selectedCountry
            : "Select Country"
            }}
          </span>
          <component :is="ChevronDown" class="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </div>
      </UiPopoverTrigger>

      <UiPopoverContent class="w-[200px] p-0">
        <UiCommand @update:searchTerm="handleSearchCountries">
          <UiCommandInput placeholder="Search country..." />
          <UiCommandEmpty>No countries found.</UiCommandEmpty>
          <UiCommandList>
            <div v-bind="containerPropsForCountry" class="max-h-52 overflow-y-auto"> <!-- Added overflow -->
              <div v-bind="wrapperPropsForCountry">
                <UiCommandGroup>
                  <UiCommandItem value="all" class="cursor-pointer pl-2" @select="() => {
                    selectedCountry = {
                      name: 'All',
                      code: 'all'
                    }
                  }">
                    <Check :class="cn(
                      'mr-2 h-4 w-4',
                      selectedCountry === 'all' ? 'opacity-100' : 'opacity-0'
                    )" />
                    All
                  </UiCommandItem>
                  <UiCommandItem v-for="country in countriesList" :key="country.data.code" :value="country.data.code"
                    @select="() => { selectedCountry = country.data }" style="height: 32px; cursor: pointer;">
                    <Check :class="cn(
                      'mr-2 h-4 w-4',
                      country.data.code === selectedCountry.code ? 'opacity-100' : 'opacity-0'
                    )" />
                    {{ country.data.name }}
                  </UiCommandItem>
                </UiCommandGroup>
              </div>
            </div>
          </UiCommandList>
        </UiCommand>
      </UiPopoverContent>
    </UiPopover>
  </div>
</template>
<script setup lang="ts">
import countryData from "~/assets/country-codes.json";
import { ChevronDown, Check } from "lucide-vue-next";
const props = defineProps({
  modelValue: {
    type: String,
    default: "all",
  },
});

const searchField = ref('');
const allCountryCodes = computed(() =>
  countryData
    ?.filter((country: any) => country.name.toLowerCase().includes(searchField.value.toLowerCase()) || country.code.toLowerCase().includes(searchField.value.toLowerCase()))
    ?.map((country: any) => ({
      name: country.name,
      code: country.code,
    }))
);

// Virtual list setup
const { list: countriesList, containerProps: containerPropsForCountry, wrapperProps: wrapperPropsForCountry } = useVirtualList(allCountryCodes, {
  itemHeight: 32,
});

// Field and selection management

const emit = defineEmits(["update:modelValue"]);
const selectedCountry = ref(
  countryData.find((country: any) => country.code === props.modelValue) || { name: "All", code: "all" }
);

watchEffect(() => {
  selectedCountry.value = countryData.find((country: any) => country.code === props.modelValue) || { name: "All", code: "all" };
});

watch(selectedCountry, (newValue) => {
  selectedCountry.value = newValue;
  emit("update:modelValue", newValue.code); // Emit the new value
}, { deep: true, immediate: true });

const handleSearchCountries = (e: string) => {
  searchField.value = e.toLowerCase()
}
</script>