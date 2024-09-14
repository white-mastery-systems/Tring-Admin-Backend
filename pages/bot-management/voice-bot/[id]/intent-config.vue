<script setup lang="ts">
import { h } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

// import { Button } from '@/components/ui/button'
// import {
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from '@/components/ui/form'
// import { Checkbox } from '@/components/ui/checkbox'
// import { toast } from '@/components/ui/toast'

const items = reactive([
  {
    id: 'greeting',
    label: 'Greeting',
  },
  {
    id: 'audio_check',
    label: 'Audio Check',
  },
  {
    id: 'agent_name',
    label: 'Agent Name',
  },
  {
    id: 'conclude',
    label: 'Conclude',
  },
])

const route = useRoute("bot-management-voice-bot-id-intent-config");
const botDetails: any = await getVoiceBotDetails(route.params.id);

const formSchema = toTypedSchema(z.object({
  items: z.array(z.string()).refine(value => value.some(item => item), {
    message: 'You have to select at least one item.',
  }),
}))

const initialValues = ref<any[]>([])

onMounted(async () => {
  const getUpdates: any = await $fetch(`/api/voicebots/${route.params.id}`)
  if (getUpdates.intents?.length) initialValues.value.push(...getUpdates.intents) 
  else {
    initialValues.value.push(['greeting', 'audio_check', 'agent_name', 'conclude'])
  }
})

const onSubmit = async (value: any) => {
  await updateLLMConfig({ intents: value.items }, botDetails.id)
  return navigateTo({
    name: "bot-management-voice-bot-id",
    params: { id: botDetails.id }
  })
}
</script>
<template>
  <page title="Default Intents" :bread-crumbs="[
    { label: `${botDetails.name}`, to: `/bot-management/voice-bot/${botDetails.id}` },
    {
      label: 'Default Intents',
      to: `/bot-management/voice-bot/${botDetails.id}/intent-config`,
    },
  ]" :disableSelector="true" :disable-back-button="false">
    <!-- <template> -->
    <UiForm :validation-schema="formSchema" @submit="onSubmit">
      <UiFormField name="items">
        <UiFormItem>

          <UiFormField v-for="item in items" v-slot="{ value, handleChange }" :key="item.id" type="checkbox"
            v-model="initialValues" :value="item.id" :unchecked-value="false" name="items">
            <UiFormItem class="flex flex-row items-center space-x-3 space-y-3">
              <UiFormControl class="mt-[11px]">
                <UiCheckbox :checked="value?.includes(item.id)" class="border-zinc-800"
                  :style="{ background: (value?.includes(item.id)) ? '#43D371' : '#80808078', 'border-color': '#80808078' }"
                  @update:checked="handleChange" />
              </UiFormControl>
              <UiFormLabel class="font-medium text-[15px]">
                {{ item.label }}
              </UiFormLabel>
            </UiFormItem>
          </UiFormField>
          <UiFormMessage />
        </UiFormItem>
      </UiFormField>

      <div class="flex justify-end mt-4">
        <UiButton type="submit" class="bg-[#424bd1] hover:bg-[#424bd1] hover:brightness-110">
          Submit
        </UiButton>
      </div>
    </UiForm>
    <!-- </template> -->
  </page>
</template>