<script setup lang="ts">
import countryData from "~/assets/country-codes.json";
import { ChevronDown, Check } from "lucide-vue-next";

const searchField = ref('');
// const countryData = ref([]); // Provide the actual country data here

// Compute the filtered country list based on the search field
// const fieldValue = ref(null)
const allCountryCodes = computed(() =>
  countryData
    ?.filter((country: any) => country.name.toLowerCase().includes(searchField.value.toLowerCase())  || country.code.toLowerCase().includes(searchField.value.toLowerCase()))
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

// watch(country, (newValue) => {
//   fieldValue.value = newValue;
// });


const emit = defineEmits(["changeCountry"]);
const selectedCountry: any = ref({
  name: "All",
  code: "all",
});

watch(selectedCountry, (newValue) => {
  emit("changeCountry", newValue.code);
});

const handleSearchCountries = (e: string) => {
  searchField.value = e.toLowerCase()
}
</script>

<template>
  <!-- Country selection using UiSelect -->
  <div class="w-[180px] truncate">
    <UiPopover>
      <UiPopoverTrigger v-if="true" as-child class="w-full py-[8px] rounded-[6px]">
        <div class="flex items-center justify-between text-[14px] w-full" :class="cn(
          'w-full cursor-pointer p-2 border border-gray-300 rounded capitalize truncate',
          !selectedCountry && ''
        )">
          <span class="w-[80%] truncate">
            {{
            selectedCountry.name
            ? selectedCountry.name
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
                  <UiCommandItem value="all" class="cursor-pointer pl-2" @select="() => { selectedCountry = {
                    name: 'All',
                    code: 'all'
                  } }">
                    <Check :class="cn(
                      'mr-2 h-4 w-4',
                      selectedCountry.code === 'all' ? 'opacity-100' : 'opacity-0'
                    )" />
                    All
                  </UiCommandItem>
                  <UiCommandItem v-for="country in countriesList" :key="country.data.code" :value="country.data.code"
                    @select="() => { selectedCountry = country.data }" style="height: 32px; cursor: pointer;">
                    <!-- Added cursor pointer -->
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
