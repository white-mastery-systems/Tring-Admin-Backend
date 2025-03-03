<script setup>
defineProps(['values', 'errors']);
</script>

<template>
  <div>
    <SelectField name="buisnessName" label="Business Type" :options="[
      { label: 'Business With GST', value: 'businessWithGst' },
      { label: 'Business Without GST', value: 'businessWithoutGst' }
    ]" v-model="values.buisnessName" />
    <span class="text-red-500">{{ errors.buisnessName }}</span>

    <TextField type="text" name="gst" label="GST" placeholder="Enter Your GST" v-model="values.gst" />
    <span class="text-red-500">{{ errors.gst }}</span>
  </div>
</template>