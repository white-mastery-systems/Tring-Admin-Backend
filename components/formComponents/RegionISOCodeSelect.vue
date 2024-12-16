<template>
  <UiFormField v-model="country" :name="props.name" class="mt-1">
    <UiFormItem class="mt-1 flex flex-col gap-1 ">
      <UiFormLabel>Region
        <span class="text-sm text-red-500">*</span>
      </UiFormLabel>
      <UiPopover>
        <UiPopoverTrigger as-child>
          <UiFormControl>
            <UiButton variant="outline" role="combobox" class="font-normal text-sm" :class="cn(
              'w-full justify-between overflow-hidden',
              !fieldValue && 'text-muted-foreground',
            )
              ">
              <!-- {{
                fieldValue
                  ? allCoutryNames.find(
                    (country: any) =>
                      country === fieldValue,
                  )
                  : "Country name"
              }} -->
              <!-- {{ allCoutryNames }} -->
              <!-- {{ allCoutryNames.find((country: any) => country === fieldValue)}} -->
              {{ fieldValue ? fieldValue : "Region name" }}
              <component :is="ChevronDown" class="ml-2 h-4 w-4 shrink-0 opacity-50"></component>
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
                    <UiCommandItem v-for="country in countriesList" :key="country.data" :value="country.data" @select="() => {
                      handleChange(country.data.code);
                    }
                      " style="height: 32px">
                      <Check :class="cn(
                        'mr-2 h-4 w-4',
                            (country.data.code === fieldValue)
                          ? 'opacity-100'
                          : 'opacity-0',
                      )
                        " />
                        <!-- {{ checkboxControl }}
                        {{ country.data.name}} -->
                      {{ `${country.data.name} - ${country.data.code}` }}
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
const searchField = ref('')
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

// const allCountryNames = computed(() =>
//   countryData
//     ?.filter((country: any) =>
//       country.name.toLowerCase().includes(searchField.value.toLowerCase()) ||
//       country.code.toLowerCase().includes(searchField.value.toLowerCase()) ||
//       country.dial_code.toLowerCase().includes(searchField.value.toLowerCase())
//     )
//     ?.map((country) => `${country.name} ${country.code}`)
// );
const allCountryNames = computed(() =>
  countryData
    ?.filter((country: any) =>
      country.name.toLowerCase().includes(searchField.value.toLowerCase()) ||
      country.code.toLowerCase().includes(searchField.value.toLowerCase()) ||
      country.dial_code.toLowerCase().includes(searchField.value.toLowerCase())
    )
    ?.map((country) => ({ name: country.name, code: country.code })) // Fixed map syntax
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
const country = ref(fieldValue.value);

watch(country, (newValue) => {
  if (newValue) {
    fieldValue.value = newValue; // Assign directly, no need for JSON.parse/stringify
  }
});
const handleSearchCountries = (e: string) => {
  searchField.value = e.toLowerCase()
}
</script>