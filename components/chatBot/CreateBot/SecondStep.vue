<script setup>
defineProps(['values', 'errors']);
</script>

<template>
  <div>
    <SelectField name="industry" label="Industry" placeholder="Select Industry" :options="[
      { label: 'Tech', value: 'Tech' },
      { label: 'Finance', value: 'Finance' },
      { label: 'Other', value: 'Other' }
    ]" v-model="values.industry" />
    <span class="text-red-500">{{ errors.industry }}</span>

    <TextField v-if="values.industry === 'Other'" type="text" name="otherRole" label="Other Industry"
      v-model="values.otherRole" />
  </div>
</template>
