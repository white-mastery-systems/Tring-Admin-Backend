<script setup lang="ts">
// import countryData from '~/assets/country-codes.json'

definePageMeta({
  middleware: "admin-only",
});


const headerOptions = [
 {label:'None',value:'none'},
 {label:'Text',value:'text'},
 {label:'Image',value:'image'},
 {label:'Video',value:'video'},
 {label:'Document',value:'document'},
 {label:'Location',value:'Location'},
]

const emit = defineEmits<{ (e: "confirm"): void }>();
const addBucketNameModalState = defineModel<{ open: boolean, id: any }>({
  default: {
    open: false,
    id: "",
  },
});

watch(addBucketNameModalState,(newValue) => {
  console.log({newValue});
  
})

const formSchema = toTypedSchema(
  z.object({
    name: z.string({ required_error: 'name is required' }).optional(),
    header: z.string({ required_error: 'header is required' }).optional(),
    headerText: z.string({ required_error: 'header is required' }).optional(),
    headerImage: z.string({ required_error: 'header is required' }).optional(),
    headerVideo: z.string({ required_error: 'header is required' }).optional(),
    headerDocument: z.string({ required_error: 'header is required' }).optional(),
    headerLocation: z.string({ required_error: 'header is required' }).optional(),
    // lastName: z.string().min(1, 'LastName is required'),
  })
);
watch(() => addBucketNameModalState.value.open, async(newState) => {
  if (addBucketNameModalState.value.id) {
    const getSingleDetails: any = await $fetch(`/api/org/contact-list/${addBucketNameModalState.value.id}`)
    setFieldValue("name", getSingleDetails.name)
  } else {
    resetForm()
  }
});


const {
  errors,
  setErrors,
  setFieldValue,
  handleSubmit,
  defineField,
  values,
  resetForm,
} = useForm({
  validationSchema: formSchema,
});


const [nameField, nameFieldProps] = defineField("name")

// const allCoutryDialCode = computed(() =>
//   countryData?.map((country) => country.dial_code),
// );
// const {
//   list: countyDialCodes,
//   containerProps,
//   wrapperProps,
// } = useVirtualList(allCoutryDialCode, {
//   itemHeight: 32,
// });
watch(addBucketNameModalState, (newState) => { });


// const addVoiceBot = async (value: any) => {
//   try {
//     const bot = await $fetch("/api/voicebots", {
//       method: "POST",
//       body: { name: value.newBotName },
//     });
//     return navigateTo({
//       name: "bot-management-voice-bot-id",
//       params: { id: bot.id },
//     });
//   } catch (err: any) {
//     toast.error(err.data.data[0].message);
//   }
// };


const handleConnect = handleSubmit(async (values: any) => {
  try {
    if (addBucketNameModalState.value.id) {
     $fetch("/api/org/contact-list/"+addBucketNameModalState.value.id, { method: "PUT", body: values })
      
      // const getUpdateValues = await $fetch(`api/org/contact-list/${addBucketNameModalState.value.id}`, { method: "PUT", body: values });
      toast.success("Updated successfully")
    } else {
      
      await $fetch("/api/org/contact-list", { method: "POST", body: values });
      toast.success("Created successfully")
    }
    emit('confirm')
  } catch(error: any) {
    toast.error(error.data.statusMessage)
  }
});
</script>
<template>
  <DialogWrapper v-model="addBucketNameModalState"
    :title="(addBucketNameModalState.id) ?  'Modify Template' : 'Add Template'" class="rounded-lg">
    <form @submit="handleConnect"
      class="space-y-2">
      <div class="grid grid-cols-1 gap-4">
        <TextField :disableSpecialCharacters="true" name="name" label="Name  Of Template" placeholder="Enter name" required>
        </TextField>
        <div>
        <div class="pt-4">
        <SelectField  name="header" :options="headerOptions" label="Header" placeholder="Enter type" required/>
        </div>
        </div>

        <TextField v-if="values.header === 'text'" type="text" name="headerText"  placeholder="Enter Value" required>
        </TextField>
      
         <div v-if="values.header === 'image'">
        <span class="pt-4 text-sm semibold"> Header Content  </span>
            <TextField type='file' name="headerImage" accept="image/png, image/jpeg"/>
         </div>
         <div v-else-if="values.header === 'document'">
        <span class="pt-4 text-sm semibold"> Header Content  </span>
            <TextField type='file' name="headerDocument" accept="*.pdf"/>
         </div>
         <div v-else-if="values.header === 'video'">
         <span class="pt-4 text-sm semibold"> Header Content  </span>
            <TextField type='file' name="headerVideo" accept="*.mp4"/>
         </div>

      </div>
      <div class="flex items-center justify-end">
        <UiButton type="submit" class="mt-2" color="primary"> Submit </UiButton>
      </div>
    </form>
  </DialogWrapper>
</template>