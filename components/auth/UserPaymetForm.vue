<script setup lang="ts">
import { useForm } from 'vee-validate';
import { formSchemaPayment } from '~/validationSchema/authValidation/paymentValidation';

const isLoading = ref(false);

const { defineField, handleSubmit, values, errors } = useForm({
  validationSchema: formSchemaPayment,
  initialValues: {
    cardHolderName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    country: '',
  },
});

const [cardNumber, cardNumberAttrs] = defineField('cardNumber');
const [cvv, cvvAttrs] = defineField('cvv');
const [expiry, expiryAttrs] = defineField('expiry');

const formatExpiry = (value: string): string => {
  let formattedValue = value.replace(/\D/g, ''); // Remove non-numeric characters

  // If first digit is between 2-9, prefix with '0'
  if (formattedValue.length === 1 && formattedValue[0] >= '2' && formattedValue[0] <= '9') {
    formattedValue = '0' + formattedValue;
  }

  // Ensure month is between 01-12
  if (formattedValue.length >= 2) {
    let month = parseInt(formattedValue.slice(0, 2), 10);
    if (month > 12) {
      formattedValue = '12';
    }
  }

  // Apply MM/YY format
  if (formattedValue.length > 2) {
    formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2, 4);
  }

  return formattedValue.slice(0, 5); // Restrict to MM/YY format (5 characters)
};

// ✅ Watch expiry & apply formatting correctly
watch(expiry, async (newValue, oldValue) => {
  if (newValue !== oldValue) {
    expiry.value = formatExpiry(newValue);
  }
});

const formatCVV = (value: string) => value.replace(/\D/g, '').slice(0, 4);
const formatCardNumber = (value: string) => value.replace(/\D/g, '').slice(0, 16);

const onSubmit = handleSubmit(async (values) => {
  isLoading.value = true;
  isLoading.value = false;
});
</script>

<template>
  <div class="grid gap-6">
    <form @submit="onSubmit">
      <div class="grid gap-3">
        <TextField type="text" name="cardHolderName" placeholder="Card Holder Name" />

        <TextField type="text" name="cardNumber" v-model="cardNumber"
          @input="cardNumber = formatCardNumber($event.target.value)" placeholder="Card Number" maxlength="16"
          v-bind="cardNumberAttrs" />
        <!-- <p v-if="errors.cardNumber" class="text-red-500 text-[13px] font-medium">
          {{ errors.cardNumber }}
        </p> -->

        <div class="grid grid-cols-2 gap-2">
          <div class="grid gap-1">
            <Label class="sr-only" for="expiry">MM/YY</Label>
            <UiInput id="expiry" v-model="expiry" @input="expiry = formatExpiry($event.target.value)"
              placeholder="MM/YY"
              :class="(errors.expiry !== null && errors.expiry !== undefined) ? 'border-red-500' : 'border-input'"
              type="text" :disabled="isLoading" maxlength="5" />
            <p v-if="errors.expiry" class="text-red-500 text-[13px] font-medium">
              {{ errors.expiry }}
            </p>
          </div>
          <div class="grid gap-1">
            <Label class="sr-only" for="cvv">CVV</Label>
            <UiInput id="cvv" name="cvv" v-model="cvv" placeholder="CVV" type="password" :disabled="isLoading"
              v-bind="cvvAttrs" @input="cvv = formatCVV($event.target.value)"
              :class="(errors.cvv !== null && errors.cvv !== undefined) ? 'border-red-500' : 'border-input'"
              maxlength="4" />
            <p v-if="errors.cvv" class="text-red-500 text-[13px] font-medium">
              {{ errors.cvv }}
            </p>
          </div>
        </div>

        <CountrySelectField name="country" :labelVisible="false" helperText="Enter your country" required />
        <p v-if="errors.country" class="text-red-500 text-sm">{{ errors.country }}</p>

        <UiButton :disabled="isLoading" :loading="isLoading" class="mt-3">
          Choose your plan
        </UiButton>
      </div>
    </form>
  </div>
</template>
