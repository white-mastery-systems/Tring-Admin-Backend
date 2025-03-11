<!-- CountryCodeSelector.vue -->
<template>
  <UiFormField v-model="selectedValue" :name="name" :class="fieldClass">
    <UiFormItem :class="itemClass">
      <UiFormLabel>
        {{ label }}
        <span v-if="required" class="text-sm text-red-500">*</span>
      </UiFormLabel>
      <UiPopover>
        <UiPopoverTrigger as-child>
          <UiFormControl>
            <UiButton variant="outline" role="combobox" :class="buttonClass">
              select an option
              <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </UiButton>
          </UiFormControl>
        </UiPopoverTrigger>
        <UiPopoverContent class="w-[200px] p-0">
          <UiCommand>
            <UiCommandInput
              :placeholder="searchPlaceholder"
              v-model="searchCode"
            />
            <UiCommandEmpty>{{ emptyMessage }}</UiCommandEmpty>
            <UiCommandList>
              <UiCommandGroup>
                <UiCommandItem
                  v-for="code in filteredCodes"
                  :key="code.value"
                  :value="code.value"
                  @select="
                    () => {
                      handleChange(code.value);
                    }
                  "
                >
                  <UiCheck :class="checkClass(code.value)" />
                  {{ code.label }}
                </UiCommandItem>
              </UiCommandGroup>
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
  import { ChevronsUpDown } from "lucide-vue-next";
  import { ref } from "vue";

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
      default: "Search code...",
    },
    emptyMessage: {
      type: String,
      default: "No codes found.",
    },
  });
  const {
    value: fieldValue,
    errorMessage,
    meta,
    errors,
    handleChange,
  } = useField(() => props.name);

  const selectedValue = ref < any > fieldValue.value;

  const searchCode = ref("");
  const filteredCodes = [
    { label: "hi", value: "hi" },
    { label: "djj", value: "djj" },
    { label: "asdf", value: "asdf" },
  ];
  const selectCode = (code) => {
    // selectedCode.value = code;
  };

  const checkClass = (code) => {
    return {
      "mr-2 h-4 w-4": true,
    };
  };
</script>
