<template>
  <UiLabel :class="['capitalize flex items-center',errorMessage?'text-red-500':'']" v-if="label" :for="replacedId">{{ label }}
<span v-if="required" class="text-sm text-red-700">*
            </span>


  </UiLabel>
  <UiInput :placeholder="placeHolder" :id="replacedId" :class="errorMessage?'border-red-500':'border-input'" v-model="value" :type="type || 'text'" />
  <span :class="['text-xs text-gray-500',errorMessage?' text-red-500 font-medium':'']">{{ errorMessage??helperText }}</span>
</template>

<script setup lang="ts">
import { useField } from 'vee-validate';

const props = defineProps<{
  label?:string,
  name: string,
  type?: string,
  helperText?: string,
  placeHolder?:string,
  required?:boolean
}>();
const replacedId=ref(props.label??props.name)
const { value, errorMessage }:{value:any,errorMessage:any} = useField(() => props.name);

watch(errorMessage,(newErr)=>{
  console.log({newErr})
})
watch(value,(value)=>{
  console.log({value})
})

</script>
