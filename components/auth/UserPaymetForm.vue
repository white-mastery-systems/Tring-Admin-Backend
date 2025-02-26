<script setup lang="ts">
import { useForm } from 'vee-validate';
import { useGtag } from 'vue-gtag-next';
import { formSchemaPayment } from '~/validationSchema/authValidation/paymentValidation';

const { event } = useGtag();

useHead({
  title: 'Payment Details | Tring AI',
  meta: [
    { name: 'Description', content: 'Enter your payment details securely to complete your transaction with Tring AI.' }
  ]
});

const isLoading = ref(false);

const {
  defineField,
  handleSubmit,
  errors,
  values,
} = useForm({
  validationSchema: formSchemaPayment,
  initialValues: {
    cardHolderName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    country: '',
  },
});

const [cardHolderName, cardHolderNameAttrs] = defineField('cardHolderName');
const [cardNumber, cardNumberAttrs] = defineField('cardNumber');
const [expiry, expiryAttrs] = defineField('expiry');
const [cvv, cvvAttrs] = defineField('cvv');
const [country, countryAttrs] = defineField('country');

const onSubmit = handleSubmit(async (value) => {
  isLoading.value = true;
  event('payment_submit', { event_category: 'transaction', event_label: 'payment_form' });
  await paymentHandler.processPayment(value);
  isLoading.value = false;
});
</script>

<template>
  <div :class="cn('grid gap-6', $attrs.class ?? '')">
    <form @submit="onSubmit">
      <div class="grid gap-3">
        <div class="grid gap-1">
          <Label class="sr-only" for="cardHolderName">Card Holder Full Name</Label>
          <UiInput id="cardHolderName" v-model="cardHolderName" v-bind="cardHolderNameAttrs" placeholder="Full Name"
            type="text" :disabled="isLoading" />
          <p v-if="errors.cardHolderName" class="text-red-500 text-sm">{{ errors.cardHolderName }}</p>
        </div>

        <div class="grid gap-1">
          <Label class="sr-only" for="cardNumber">Card Number</Label>
          <UiInput id="cardNumber" v-model="cardNumber" v-bind="cardNumberAttrs" placeholder="1234 5678 9012 3456"
            type="text" :disabled="isLoading" />
          <p v-if="errors.cardNumber" class="text-red-500 text-sm">{{ errors.cardNumber }}</p>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div class="grid gap-1">
            <Label class="sr-only" for="expiry">MM/YY</Label>
            <UiInput id="expiry" v-model="expiry" v-bind="expiryAttrs" placeholder="MM/YY" type="text"
              :disabled="isLoading" />
            <p v-if="errors.expiry" class="text-red-500 text-sm">{{ errors.expiry }}</p>
          </div>

          <div class="grid gap-1">
            <Label class="sr-only" for="cvv">CVV</Label>
            <UiInput id="cvv" v-model="cvv" v-bind="cvvAttrs" placeholder="CVV" type="password" :disabled="isLoading" />
            <p v-if="errors.cvv" class="text-red-500 text-sm">{{ errors.cvv }}</p>
          </div>
        </div>

        <div class="grid gap-1">
          <Label class="sr-only" for="country">Country</Label>
          <UiInput id="country" v-model="country" v-bind="countryAttrs" placeholder="Country" type="text"
            :disabled="isLoading" />
          <CountrySelectField name="country" label="country" helperText="Enter your country" required />
          <!-- <p v-if="errors.country" class="text-red-500 text-sm">{{ errors.country }}</p> -->
        </div>

        <UiButton :disabled="isLoading" :loading="isLoading">
          <LucideSpinner v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
          Continue to Payment
        </UiButton>
      </div>
    </form>
  </div>
</template>
