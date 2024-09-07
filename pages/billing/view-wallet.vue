<template>
  <page title="Billing" :description="true" :disableSelector="true">
    <div
      class="xs:grid-cols-2 grid gap-4 px-2.5 py-0 md:grid-cols-2 lg:grid-cols-3"
    >
      <!-- @mouseover="planCard(index); previusIndex = index"
                @mouseout="planCardUnHover(index); previusIndex = index" -->
      <div
        :class="[
          'main_card_align field_shadow relative flex flex-col justify-between rounded-[13px] border-2 bg-[#ffffff] p-5 hover:border-yellow-500',

          'w-full',
        ]"
        v-for="(list, index) in billingVariation"
        :key="index"
      >
        <div class="text-[23px] font-bold text-[#424bd1]">
          {{ list.title }}
        </div>
        <div class="text-[14px]">
          {{
            Math.floor(
              Number(list.amount) / Number(data?.planDetails?.extraSessionCost),
            )
          }}
          extra sessions
        </div>

        <div class="bill-content-align mb-[15px]">
          <div class="amount-align text-[23px] font-black">
            Rs.{{ list.amount }}
          </div>
        </div>

        <button
          class="rounded-lg border border-indigo-700 bg-transparent px-4 py-2 font-semibold text-indigo-800 hover:border-transparent hover:bg-indigo-700 hover:text-white"
        >
          Buy now
        </button>
      </div>
    </div>
  </page>
</template>
<script setup lang="ts">
  const router = useRouter();
  definePageMeta({
    middleware: "admin-only",
  });

  const { user } = await useUser();
  const { data } = await useLazyFetch("/api/org", { server: false });
  console.log({ data: data.value });
  //   const [firstName, lastName] = user.value?.username?.split(" ") || [];
  console.log(user.value, "USER");
  const billingVariation = ref([
    {
      _id: 1,
      title: "Basic",
      amount: "200",
    },
    {
      _id: 2,
      title: "Pro",
      amount: "500",
    },
    {
      _id: 3,
      title: "Max",
      amount: "1000",
    },
  ]);
</script>
