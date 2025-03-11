<template>
  <div :class="cn('w-full', props?.class)">
    <UiFormField v-model="countryCode" :name="props.name" class="mt-1">
      <UiFormItem :class="[(!fieldHeader) ? 'mt-1' : 'mt-0', 'flex flex-col']">
        <UiFormLabel v-if="!fieldHeader" class="mb-1">Country Code<span class="text-sm text-red-500">*</span>
        </UiFormLabel>
        <UiPopover class="mt-0">
          <UiPopoverTrigger as-child class="mt-0">
            <UiFormControl class="mt-0">
              <UiButton variant="outline" class="font-normal text-sm" role="combobox" :class="
                  cn(
                    'mt-0 min-w-[110px] w-full justify-between overflow-hidden px-3',
                    !fieldValue && 'text-muted-foreground',
                    'mt-0 space-y-0',
                  )
                ">
                <div class="flex items-center gap-1">
                  <img v-if="
                      countryData.find(
                        (country: any) => country.dial_code === fieldValue,
                      )?.dial_code
                    " class="h-[20px] w-[20px]"
                    :src="`https://country-code-au6g.vercel.app/${countryData.find((country: any) => country.dial_code === fieldValue)?.code}.svg`" />
                  {{
                  fieldValue
                  ? countryData.find(
                  (country: any) => country.dial_code === fieldValue,
                  )?.dial_code
                  : "Country Code"
                  }}
                </div>
                <component :is="ChevronDown" class="h-4 w-4 shrink-0 opacity-50"></component>
              </UiButton>
            </UiFormControl>
          </UiPopoverTrigger>
          <UiPopoverContent class="w-[200px] p-0">
            <UiCommand @update:searchTerm="handleSearchCountries">
              <UiCommandInput placeholder="Search Code..." @update:modelValue="handleChange" />
              <UiCommandEmpty>No codes found.</UiCommandEmpty>
              <UiCommandList>
                <div v-bind="containerProps" class="max-h-52">
                  <div v-bind="wrapperProps">
                    <UiCommandGroup>
                      <UiCommandItem class="flex items-center gap-2" v-for="dialCode in countyDialCodes"
                        :key="dialCode.data.dialCode" :value="dialCode.data" @select="
                          () => {
                            handleChange(dialCode.data.dialCode);
                          }
                        " style="height: 32px">
                        <Check :class="
                            cn(
                              'mr-2 h-4 w-4',
                              dialCode.data.dialCode === fieldValue
                                ? 'opacity-100'
                                : 'opacity-0',
                            )
                          " />
                        <img class="h-[20px] w-[20px]" loading="lazy"
                          :src="`https://country-code-au6g.vercel.app/${dialCode.data?.codeName}.svg`" />
                        {{ dialCode.data.dialCode }}
                      </UiCommandItem>
                    </UiCommandGroup>
                  </div>
                </div>
              </UiCommandList>
            </UiCommand>
          </UiPopoverContent>
        </UiPopover>
        <UiFormMessage class="text-xs text-red-500" />
        <span v-if="errorMessage" class="mt-0 text-sm text-red-700">
          {{ errorMessage }}
        </span>
      </UiFormItem>
    </UiFormField>
  </div>
</template>
<script setup lang="ts">
  import { Check } from "lucide-vue-next";
  import countryData from "~/assets/country-codes.json";
  import { ChevronDown } from "lucide-vue-next";
  import { useCountryData } from '~/composables/useCountryData'

  const props = defineProps({
    name: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      default: "Select an option",
    },
    required: {
      type: Boolean,
      default: false,
    },
    helperText: {
      type: String,
    },
    class: {
      type: String,
    },
    fieldHeader: {
      type: Boolean,
      required: false,
    }
  });
  const searchField = ref("");
  const { fetchLocation, countryDetails } = useCountryData()

  const allCoutryDialCode = computed(() =>
    countryData
      ?.filter(
        (country: any) =>
          country.name.toLowerCase().includes(searchField.value) ||
          country.code.toLowerCase().includes(searchField.value) ||
          country.dial_code.toLowerCase().includes(searchField.value),
      )
      ?.map((country) => ({
        dialCode: country.dial_code,
        codeName: country.code,
        name: country.name,
      })),
  );
  const {
    list: countyDialCodes,
    containerProps,
    wrapperProps,
  } = useVirtualList(allCoutryDialCode, {
    itemHeight: 32,
  });
  const {
    value: fieldValue,
    errorMessage,
    meta,
    handleChange,
  } = useField(() => props.name);
  
  const countryCode = ref(fieldValue.value);

  watch(countryCode, (newValue) => {
    fieldValue.value = newValue;
  });
  const handleSearchCountries = (e: string) => {
    searchField.value = e.toLowerCase();
  };

onMounted(async () => {
  await fetchLocation();
  if (countryDetails.value?.dial_code && !countryCode.value) {
    countryCode.value = countryDetails.value.dial_code;
  }
});
</script>
