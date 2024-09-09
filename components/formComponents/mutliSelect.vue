<script setup lang="ts">
  const { options, maxCount = null } = defineProps<{
    options: any;
    maxCount?: number;
  }>();

  const selectedValues = ref<{ [key: string]: string }>();
  const handleSelection = (option: { value: string; label: string }) => {
    if (selectedValues?.value && selectedValues.value[option.value]) {
      delete selectedValues.value[option.value];
      selectedValues.value = { ...selectedValues.value };
    } else {
      selectedValues.value = {
        ...selectedValues.value,
        [option.value]: option.label,
      };
    }

    value.value = Object.entries(selectedValues.value).map(([key, value]) => {
      return key;
    });
    // if (selectedValues?.value) {
    //   if (maxCount) {
    //     if (Object.keys(selectedValues.value).length >= maxCount) {
    //       return;
    //     }
    //   }
    // }
  };
  const displayLabels = ref<string[]>([]);
  const value = defineModel<any>("value");
  if (value.value) {
    const initialValues: any = {};
    value.value?.map((val: any) => {
      const findedOption = options?.find(
        ({ value }: { value: string }) => value === val,
      );

      displayLabels.value.push(findedOption.label);
      selectedValues.value = {
        ...selectedValues.value,
        [findedOption.value]: findedOption.label,
      };
    });
  }
  watch(selectedValues, (newValues) => {
    const data: string[] = [];
    Object.entries(newValues as Object).map(([key, value]) => {
      data.push(value);
    });

    displayLabels.value = data;
  });
</script>

<template>
  <UiPopover>
    <UiPopoverTrigger as-child>
      <div
        class="width-full flex h-10 w-full min-w-[200px] max-w-xs overflow-hidden text-ellipsis rounded-md border border-gray-300 border-input bg-background px-3 py-2 text-sm outline-lime-500 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {{ displayLabels?.join(",") }}
      </div>
    </UiPopoverTrigger>
    <UiPopoverContent class="w-80">
      <div class="flex flex-col gap-2">
        <div v-for="option in options">
          <div
            class="flex items-center gap-2 rounded-md p-2 transition-all hover:bg-gray-100"
          >
            <UiCheckbox
              :id="option.value"
              @update:checked="() => handleSelection(option)"
            />
            <label
              :for="option.value"
              class="text-md w-full font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {{ option.label }}
            </label>
          </div>
        </div>
      </div>
    </UiPopoverContent>
  </UiPopover>
</template>
