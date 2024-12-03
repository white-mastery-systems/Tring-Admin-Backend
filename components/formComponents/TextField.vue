<template>
  <div :class="cn('w-full', 'relative')">
    <UiLabel :class="[
        'flex items-center capitalize',
        errorMessage ? 'text-red-500' : '',
      ]" v-if="label" :for="replacedId">
      {{ label }}
      <span v-if="required" class="text-lg text-red-500">* </span>
    </UiLabel>
    <UiTextarea v-if="isTextarea" class="mt-2 textarea-resize-scroll" @paste="
        (e: any) => {
          if (disableCharacters) {
            if (isNaN(Number(e.clipboardData.getData('text/plain')))) {
              e.preventDefault();
            }
          }
        }
      " @keypress="
        (e: any) => {
          if (disableCharacters) {
            if (e.key === 'Enter') {
              return;
            }
            if (isNaN(e.key)) {
              e.preventDefault();
            }
          }
          if (['{', '}'].includes(e.key)) emit('input', e.key);
        }
      " @keydown="
        ($event) => {
          if ($event.code == 'Backspace' || $event.code == 'Delete')
            emit('input', 'keydown');
        }
      " @input="emit('input', 'change')" :placeholder="placeholder" :id="replacedId"
      :class="errorMessage ? 'border-red-500' : 'border-input'" v-model="value"
      :type="type === 'phone' ? 'text' : type || 'text'" />

    <UiInput v-else :class="
        cn(
          'mt-2',
          props.class,
          errorMessage ? 'border-red-500' : 'border-input',
        )
      " @paste="
        (e: any) => {
          if (disableCharacters) {
            if (isNaN(Number(e.clipboardData.getData('text/plain')))) {
              e.preventDefault();
            }
          }
        }
      " @keypress="
        (e: any) => {
          if (disableCharacters) {
            if (e.key === 'Enter') {
              return;
            }
            if (isNaN(e.key)) {
              e.preventDefault();
            }
          }

          if (disableSpecialCharacters) {
            const regex = /^[a-zA-Z0-9]$/;

            if (e.key === ' ') {
              return;
            }
            if (!regex.test(e.key)) {
              e.preventDefault();
            }
          }
        }
      " :disabled="disabled" :placeholder="placeholder" :id="replacedId" v-model="value" :type="type || 'text'"
      :accept="accept || ''" @input="emit('input', $event)" />

    <div></div>
    <!-- :maxlength="props?.type === 'phone' ? 10 : ''" -->
    <div :class="
        cn(
          props?.endIcon
            ? 'absolute right-[10px] top-[38px] cursor-pointer'
            : 'absolute right-[10px] top-[38px]',
        )
      ">
      <slot name="endIcon"></slot>
    </div>
    <div :class="
        cn(
          props?.endSlot
            ? 'absolute right-[0px] top-[36px]'
            : 'absolute right-[0px] top-[36px]',
        )
      ">
      <slot name="endSlot"></slot>
    </div>

    <span :class="[
        'text-xs text-gray-500',
        errorMessage ? 'font-medium text-red-500' : '',
      ]">{{ errorMessage ?? helperText }}</span>
  </div>
</template>

<script setup lang="ts">
  import { useField } from "vee-validate";
  const emit = defineEmits(["input"]);
  const props = withDefaults(
    defineProps<{
      label?: string;
      name: string;
      type?: string;
      helperText?: string;
      placeholder?: string;
      required?: boolean;
      disableCharacters?: boolean;
      isTextarea?: boolean;
      disabled?: boolean;
      class?: string;
      endIcon?: any;
      endSlot?: any;
      validation: Boolean;
      disableSpecialCharacters?: boolean;
      accept?: string;
    }>(),
    {
      label: "",
      type: "text",
      helperText: "",
      placeholder: "",
      required: false,
      disableCharacters: false,
      isTextarea: false,
      disabled: false,
      class: "",
      validation: true,
      disableSpecialCharacters: false,
      accept: "",
    },
  );

  const replacedId = ref(props.label ?? props.name);
  const { value, errorMessage }: { value: any; errorMessage: any } =
    !props.validation
      ? { value: props.name, errorMessage: "" }
      : useField(() => props.name);

  watch(errorMessage, (newErr) => {});
  watch(value, (data) => {
    if (props.disableSpecialCharacters) {
      setTimeout(() => {
        value.value = value.value.replace(/ /g, "_");
        value.value = value.value.replace(/[^\w\s]/gi, "");
      }, 0);
    }
    if (value.value.trim() === "") {
      value.value = "";
    }
    // if (props.name === 'apikey') {
    //   value.value = value.value.replace(/.(?=.{4})/g, "*")
    // }
  });
</script>
