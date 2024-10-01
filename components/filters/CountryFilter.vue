<script setup lang="ts">
import countryData from "~/assets/country-codes.json";
import { ChevronDown, Check } from "lucide-vue-next";

const searchField = ref('');
// const countryData = ref([]); // Provide the actual country data here

// Compute the filtered country list based on the search field
// const fieldValue = ref(null)
const allCountryCodes = computed(() =>
  countryData
    ?.filter((country: any) => country.code.toLowerCase().includes(searchField.value.toLowerCase()))
    ?.map((country) => country.code)
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
const selectedCountry: any = ref("all");

watch(selectedCountry, (newValue) => {
  console.log(selectedCountry.value, "selectedCountry")
  emit("changeCountry", newValue);
});

const handleSearchCountries = (e: string) => {
  searchField.value = e.toLowerCase()
}
</script>

<template>
  <!-- Country selection using UiSelect -->
  <div>
    <UiPopover>
      <UiPopoverTrigger v-if="true" as-child class="min-w-[70px] py-[8px] rounded-[6px]">
        <div class="flex items-center justify-between text-[14px] w-full" :class="cn(
          'w-full cursor-pointer p-2 border border-gray-300 rounded capitalize',
          !selectedCountry && ''
        )">
          {{
          selectedCountry
          ? selectedCountry
          : "Select Country"
          }}
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
                  <UiCommandItem value="all" class="cursor-pointer pl-2" @select="() => { selectedCountry = 'all' }">
                    <Check :class="cn(
                      'mr-2 h-4 w-4',
                      selectedCountry === 'all' ? 'opacity-100' : 'opacity-0'
                    )" />
                    All
                  </UiCommandItem>
                  <UiCommandItem v-for="country in countriesList" :key="country.data" :value="country.data"
                    @select="() => { selectedCountry = country.data }" style="height: 32px; cursor: pointer;">
                    <!-- Added cursor pointer -->
                    <Check :class="cn(
                      'mr-2 h-4 w-4',
                      country.data === selectedCountry ? 'opacity-100' : 'opacity-0'
                    )" />
                    {{ country.data }}
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
