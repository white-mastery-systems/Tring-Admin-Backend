<template>
  <page title="Wallet" :description="true" :disableSelector="true" :customBackRouter="correctedUrl">
    <div class="xs:grid-cols-2 grid gap-4 px-2.5 py-0 md:grid-cols-2 lg:grid-cols-3">
      <!-- @mouseover="planCard(index); previusIndex = index"
                @mouseout="planCardUnHover(index); previusIndex = index" -->
      <div :class="[
        'main_card_align field_shadow relative flex flex-col justify-between rounded-[13px] border-2 bg-[#ffffff] p-5 hover:border-yellow-500',

        'w-full',
      ]" v-for="(list, index) in billingVariation" :key="index">
        <div class="text-[23px] font-bold text-[#424bd1]">
          {{ list.title }}
        </div>
        <div class="text-[14px]" v-if="!isVoiceBilling">
          {{
            Number(data?.planDetails?.extraSessionCost) !== 0
              ? Math.floor(
                Number(list.amount) /
                Number(data?.planDetails?.extraSessionCost),
              )
              : 0
          }}
          {{ isVoiceBilling ? "extra minutes" : "extra sessions" }}
          <!-- extra sessions -->
        </div>

        <div class="bill-content-align mb-[15px]">
          <div class="amount-align text-[23px] font-black">
            Rs.{{ list.amount }}
          </div>
        </div>

        <UiButton @click="handlePurchaseWallet(list.plan_code)"
          class="rounded-lg border border-indigo-700 bg-transparent px-4 py-2 font-semibold text-indigo-800 hover:border-transparent hover:bg-indigo-700 hover:text-white">
          Buy now
        </UiButton>
      </div>
    </div>
  </page>
</template>
<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { useBreadcrumbStore } from "~/store/breadcrumbs"; // Import the store

const router = useRouter();
definePageMeta({
  middleware: "admin-only",
});

const breadcrumbStore = useBreadcrumbStore();
const route = useRoute();
const correctedUrl = ref('');
const filters = computed(() => ({
  type: route?.query?.type ?? 'chat',
}));
breadcrumbStore.setBreadcrumbs([
  {
    label: "Wallet", // Dynamic name
    to: `/view-all/view-wallet?type=${route?.query?.type ?? 'chat'}`,
  }
]);
const { data } = await useLazyFetch("/api/org", {
  server: false,
  query: filters,
});
//   const [firstName, lastName] = user.value?.username?.split(" ") || [];

const chatBillingVariation = ref([
  {
    _id: 1,
    title: "Basic",
    plan_code: "chat_basic",
    amount: "200",
  },
  {
    _id: 2,
    title: "Pro",
    plan_code: "chat_pro",
    amount: "500",
  },
  {
    _id: 3,
    title: "Max",
    plan_code: "chat_max",
    amount: "1000",
  },
]);
// const voiceBillingVariation = ref([
//   {
//     _id: 1,
//     title: "Basic",
//     plan_code: "voice_basic",
//     amount: "5000",
//   },
//   {
//     _id: 2,
//     title: "Pro",
//     plan_code: "voice_pro",
//     amount: "10000",
//   },
//   {
//     _id: 3,
//     title: "Max",
//     plan_code: "voice_max",
//     amount: "15000",
//   },
// ]);
const voiceBillingVariation = ref([
  {
    _id: 1,
    title: "Basic",
    plan_code: "voice_basic",
    amount: 5000
  },
  {
    _id: 2,
    title: "Pro",
    plan_code: "voice_pro",
    amount: 10000
  },
  {
    _id: 3,
    title: "Max",
    plan_code: "voice_max",
    amount: 20000
  },
  {
    _id: 4,
    title: "Ultra",
    plan_code: "voice_ultra",
    amount: 30000
  },
  {
    _id: 5,
    title: "Supreme",
    plan_code: "voice_supreme",
    amount: 50000
  }
])
const billingVariation = computed(() => {
  if (route.query.type === "voice") {
    return voiceBillingVariation.value;
  } else {
    return chatBillingVariation.value;
  }
  // return [];
});

const isVoiceBilling = computed(() => {
  // Assuming you have access to the current route
  return route.query?.type === "voice";
});

onMounted(() => {
  if (!route.query.type) { // If `type` is not present in the query
    router.push({ query: { type: 'chat' } });
  }
  const currentUrl = router.options.history.state.back || 'billing/view-wallet';
  if (!currentUrl.includes('?type=chat') && !currentUrl.includes('?type=voice')) {
    correctedUrl.value = `/billing?type=chat`;
  } else if (currentUrl.includes('?type=voice')) {
    correctedUrl.value = `/billing?type=voice`;
  } else if (currentUrl.includes('?type=chat')) {
    correctedUrl.value = `/billing?type=chat`;
  }
});
const handlePurchaseWallet = async (plan: string) => {
  const hostedPageResponse = await $fetch(
    `/api/v2/billing/wallet?type=${filters.value.type ?? 'chat'}`,
    {
      method: "POST",
      body: {
        plan: plan,
        redirectUrl: `${window.location.origin}/billing/wallet/wallet-confirmation?type=${filters.value.type ?? 'chat'}`,
      },
    },
  );
  await navigateTo(hostedPageResponse?.hostedpage?.url, {
    open: {
      target: "_blank",
    },
  });
};
</script>
