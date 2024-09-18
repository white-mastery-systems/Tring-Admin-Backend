<template>
  {{ console.log(orgBilling?.plan_code, "PLAN CODE") }}
  <div
    v-if="isPageLoading"
    class="grid h-[80vh] place-items-center text-[#424BD1]"
  >
    <Icon name="svg-spinners:90-ring-with-bg" class="h-20 w-20" />
  </div>
  <page
    v-else
    title="Billing"
    :description="true"
    :disableSelector="true"
    :customBackRouter="'/billing'"
  >
    <div
      class="xs:grid-cols-2 grid gap-4 px-2.5 py-0 md:grid-cols-2 lg:grid-cols-4"
    >
      <!-- @mouseover="planCard(index); previusIndex = index"
                @mouseout="planCardUnHover(index); previusIndex = index" -->
      <div
        :class="[
          'main_card_align field_shadow relative flex flex-col justify-between rounded-[13px] border-2 bg-[#ffffff] p-5 hover:border-yellow-500',
          orgBilling?.plan_code === list.plan_code
            ? 'border-2 border-yellow-500'
            : '',
          'w-full',
        ]"
        v-for="(list, index) in billingVariation"
        :key="index"
      >
        <div class="mb-[30px] text-[23px] font-bold text-[#424bd1]">
          {{ list.types }}
        </div>

        <div class="bill-content-align mb-[15px]">
          <div class="amount-align text-[23px] font-black">
            {{ list.amount }}
          </div>
          <div class="px-0 py-[2px] text-[15px] text-[#848199]">
            {{ list.status }}
          </div>
        </div>
        <div class="text-[30px] font-bold">
          {{ list.types }}
        </div>
        <div class="text-[15px] text-[#848199]">
          {{ list.benefitContent }}
        </div>
        <div class="flex min-h-[310px] flex-col items-start justify-start">
          <div
            class="flex items-center gap-2"
            v-for="(advancedList, ListIndex) in list.benefitList"
            :key="ListIndex"
          >
            <span class="flex items-start">
              <TicIcon v-if="advancedList.availableInPlan" />
              <CloseIcon v-else />
              <!-- <img v-if="!list.listBenefit" src="assets\icons\check-circle.svg" width="15" />
              <img v-else src="assets\icons\checked-circle.svg" width="15" /> -->
            </span>
            <span class="min-h-[26px] px-0 py-[2px] text-[15px] text-[#848199]">
              {{ advancedList.content }}
            </span>
          </div>
        </div>
        <button
          class="rounded-lg border border-indigo-700 bg-transparent px-4 py-2 font-semibold text-indigo-800 hover:border-transparent hover:bg-indigo-700 hover:text-white" :class="[(orgBilling?.plan_code === list.plan_code) ? 'bg-indigo-700 text-white' : '']"
          @click="choosePlan(list.plan_code)"
          :disabled="
            orgBilling?.plan_code === list.plan_code ||
            list.plan_code?.includes('chat_free')
          "
        >
          {{
            orgBilling?.plan_code === list.plan_code
              ? "Current Plan"
              : findPlanLevel({ list, current: orgBilling?.plan_code })
          }}
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
  const [firstName, lastName] = user.value?.username?.split(" ") || [];
  const billingVariation = ref([
    {
      _id: 1,
      amount: "Rs.0",
      status: "Per Month",
      types: "Free",
      benefitContent: "Unleash the power of automation.",
      listBenefit: false,
      benefitList: [
        {
          content: "50 Message Sessions",
          availableInPlan: true,
        },
        {
          content: "Lifetime Duration",
          availableInPlan: true,
        },
        {
          content: "Extra message cost",
          availableInPlan: false,
        },
        {
          content: "Extra message limit",
          availableInPlan: false,
        },
        {
          content: "Lead Gen",
          availableInPlan: false,
        },
        {
          content: "CRM Integration",
          availableInPlan: false,
        },
        {
          content: "Widget Customization",
          availableInPlan: false,
        },
        {
          content: "No Tring Branding",
          availableInPlan: false,
        },
      ],
      plan: "free_test",
      choosePlan: "Downgrade",
      currentPlan: "current plan",
      plan_code: "chat_free",
    },
    {
      _id: 2,
      amount: "Rs.1999",
      status: "Per Month",
      types: "Intelligence",
      listBenefit: false,
      benefitList: [
        {
          content: "60 Message Sessions",
          availableInPlan: true,
        },
        {
          content: "Duration-Month",
          availableInPlan: true,
        },
        {
          content: "Extra message cost-Rs.10",
          availableInPlan: true,
        },
        {
          content: "Extra message limit-200",
          availableInPlan: true,
        },
        {
          content: "Widget Customization",
          availableInPlan: true,
        },
        {
          content: "Lead Gen",
          availableInPlan: false,
        },
        {
          content: "CRM Integration",
          availableInPlan: false,
        },

        {
          content: "No Tring Branding",
          availableInPlan: false,
        },
      ],
      plan: `chat_intelligence`,
      plan_code: "chat_intelligence",

      choosePlan: "upgrade",
      currentPlan: "current plan",
    },
    {
      _id: 3,
      amount: "Rs.6999",
      status: "Per Month",
      types: "Super Intelligence",
      listBenefit: false,
      benefitList: [
        {
          content: "250 Message Sessions",
          availableInPlan: true,
        },
        {
          content: "Duration-Month",
          availableInPlan: true,
        },
        {
          content: "Extra message cost - Rs.8",
          availableInPlan: true,
        },
        {
          content: "1000 Extra message limit",
          availableInPlan: true,
        },
        {
          content: "Lead Gen",
          availableInPlan: true,
        },
        {
          content: "CRM Integration",
          availableInPlan: true,
        },

        {
          content: "No Tring Branding (Addon)",
          availableInPlan: true,
        },
      ],
      plan: "chat_super_intelligence",
      plan_code: "chat_super_intelligence",
      choosePlan: "upgrade",
      currentPlan: "current plan",
    },
    {
      _id: 4,
      amount: "Talk to sales",
      status: "",
      types: "Enterprise",
      plan_code: "chat_enterprise",
      // benefitContent: 'Automation plus enterprise-grade features.',
      listBenefit: false,
      benefitList: [
        {
          content: "1000+ Message Sessions",
          availableInPlan: true,
        },
        {
          content: "Duration-Month",
          availableInPlan: true,
        },
        {
          content: "Extra message cost-Talk to sales",
          availableInPlan: true,
        },
        {
          content: "Extra message limit-Unlimited",
          availableInPlan: true,
        },
        {
          content: "Lead Gen",
          availableInPlan: true,
        },
        {
          content: "CRM Integration",
          availableInPlan: true,
        },
        {
          content: "Widget Customization-Advance",
          availableInPlan: true,
        },
        {
          content: "No Tring Branding (Addon)",
          availableInPlan: true,
        },
      ],
      choosePlan: "contact us",
      availableInPlan: true,
    },
  ]);
  const findPlanLevel = ({ list, current }: { list: any; current: string }) => {
    if (list.plan_code === "chat_enterprise") {
      return "Contact sales";
    }
    const billInformation = billingVariation.value.find(
      (data: { plan_code: string }) => data.plan_code === list.plan_code,
    );
    console.log({ billInformation });
    const currentPlanInformation = billingVariation.value.find(
      (data: { plan_code: string }) => data.plan_code === current,
    );
    if (billInformation?._id > currentPlanInformation?._id) {
      return "Upgrade Plan";
    } else {
      return "Downgrade Plan";
    }
  };

  const { status, data: orgBilling } = await useLazyFetch("/api/org/usage", {
    server: false,
  });
  const isPageLoading = computed(() => status.value === "pending");

  const choosePlan = async (plan: any) => {
    if (plan === "chat_enterprise") {
      return navigateTo("https://tringlabs.ai/contact", {
        external: true,
        open: {
          target: "_blank",
        },
      });
    } else {
      //TODO fix this
      if (!user?.value?.mobile) {
        toast.error("Please update all the details to continue");
        return navigateTo({
          name: "account",
        });
      }
      const locationData = await $fetch<{
        ip_address: string;
        country: string;
        city: string;
        region: string;
      }>(`https://ipv4-check-perf.radar.cloudflare.com/api/info`);

      const hostedPageUrl = await $fetch<{ hostedpage: { url: string } }>(
        "/api/billing/subscription",
        {
          method: "POST",
          body: {
            plan: plan,
            locationData: locationData,
            redirectUrl: `${window.location.origin}/billing/billing-confirmation`,
          },
        },
      );

      navigateTo(hostedPageUrl?.hostedpage?.url, {
        external: true,
        open: {
          target: "_blank",
        },
      });
    }
  };
</script>
<style scoped>
  .main_card_align {
    transition:
      background 0.3s ease,
      color 0.3s ease;
  }
</style>
