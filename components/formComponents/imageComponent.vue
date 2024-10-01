<template>
        <div>
          <label
            class="dark:hover:bg-bray-800 flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 bg-contain bg-center bg-no-repeat hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600">
            Upload file
            <input class="hidden" type="file" @change="handleFileChange" :multiple="multiple" :accept="accept" />
          </label>
          <span class="text-sm text-red-700" v-if="errors.file">
            {{ errors.file }}
          </span>
        </div>

</template>


<script  scoped lang="ts">
const props =  withDefaults(
  defineProps<{
    name: string;
    multiple:Boolean,
    accept?: string
  }>(),
  {
    multiple:false,
    accept:''
  }
)

const emit = defineEmits(['updateValue'])
const handleFileChange =  ($event:any) => {
emit('updateValue',$event.target.files)
}
</script>
