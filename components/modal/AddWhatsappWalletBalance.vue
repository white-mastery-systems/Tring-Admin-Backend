<template>
  <DialogWrapper v-model="walletBalanceModalState" title="Add WhatsApp Credit Balance">
    <div class="text-[15px] font-semibold">
      Current Credits :
      <span>
        {{ props.usageDetails.whatsappWalletBalance }}
      </span>
    </div>
    <form @submit="handleConnect" class="space-y-3">
      <SelectField name="plan" label="Credits" placeholder="Select Credits Top-Up" helperText=""
        :options="walletDetails" required />
      <div class="flex justify-end">
        <UiButton color="primary" type="submit" :loading="isLoading">
          Submit
        </UiButton>
      </div>
    </form>
  </DialogWrapper>
</template>
<script setup lang="ts">
const props = defineProps({
  usageDetails: Object, // Adjust type as needed
});
const emit = defineEmits(["success"]);
const walletBalanceModalState = defineModel<{ open: boolean }>({
  default: {
    open: false,
  },
});
const isLoading = ref(false);
const formSchema = toTypedSchema(
  z.object({
    plan: z.string({ required_error: "Credit is required." }).min(2, "Wallet is required."),
  })
)

const {
  errors,
  setErrors,
  handleSubmit,
  setFieldValue,
  defineField,
  values,
  resetForm,
} = useForm({
  validationSchema: formSchema,
});

const walletDetails = [
  {
    value: "wallet_credits_super",
    label: '₹1000',
  },
  {
    value: "wallet_credits_pro",
    label: '₹5000',
  },
  {
    value: "wallet_credits_ultra",
    label: '₹10000',
  },
  {
    value: "wallet_credits_supreme",
    label: '₹20000',
  },
  {
    value: "wallet_credits_max",
    label: '₹50000',
  },
]
const handleConnect = handleSubmit(async (values: any) => {
  const hostedPageResponse = await $fetch(
    `/api/v2/billing/wallet?type=chat`,
    {
      method: "POST",
      body: {
        plan: values.plan,
        redirectUrl: `${window.location.origin}/billing/wallet/whatsapp-wallet-confirmation?type=chat`,
      },
    },
  );
  await navigateTo(hostedPageResponse?.hostedpage?.url, {
    open: {
      target: "_blank",
    },
  });
  emit("success")
})
</script>