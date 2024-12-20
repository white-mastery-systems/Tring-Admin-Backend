<template>
  <div v-if="isPageLoading" class="grid h-[80vh] place-items-center text-[#424BD1]">
    <Icon name="svg-spinners:90-ring-with-bg" class="h-20 w-20" />
  </div>
  <page v-else title="Billing" :description="true" :disableSelector="true" :customBackRouter="'/billing'">
    <div :class="[
        'grid gap-4 px-2.5 py-0',
        route.query.type === 'voice'
          ? 'xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-3'
          : 'xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-4',
      ]">
      <!-- @mouseover="planCard(index); previusIndex = index"
                @mouseout="planCardUnHover(index); previusIndex = index" -->
      <div :class="[
          'main_card_align field_shadow relative flex flex-col justify-between rounded-[13px] border-2 bg-[#ffffff] p-5 hover:border-yellow-500',
          orgBilling?.plan_code === list.plan_code
            ? 'border-2 border-yellow-500'
            : '',
          'w-full',
        ]" v-for="(list, index) in billingVariation" :key="index">
        <div class="mb-[30px] text-[23px] font-bold text-[#424bd1]">
          {{ list.types }}
        </div>

        <div class="bill-content-align mb-[15px]">
          <div class="amount-align text-[30px] font-black">
            {{ list.amount }}
          </div>
          <div class="px-0 py-[2px] text-[15px] text-[#848199]">
            {{ list.status }}
          </div>
        </div>
        <!-- <div class="text-[30px] font-bold">
          {{ list.types }}
        </div> -->
        <div class="text-[15px] text-[#848199]">
          {{ list.benefitContent }}
        </div>
        <div class="flex min-h-[310px] flex-col items-start justify-start">
          <div class="flex items-center gap-2" v-for="(advancedList, ListIndex) in list.benefitList" :key="ListIndex">
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
        <UiButton variant="outline"
          class="rounded-lg border border-indigo-700 px-4 py-2 font-semibold text-indigo-800 hover:border-transparent hover:bg-indigo-700 hover:text-white"
          :class="[
            orgBilling?.plan_code === list.plan_code
              ? 'bg-indigo-700 text-white'
              : '',
          ]" @click="choosePlan(list.plan_code)" :disabled="list.plan_code?.includes('chat_free')">
          {{
          orgBilling?.plan_code === list.plan_code
          ? "Current Plan"
          : findPlanLevel({ list, current: orgBilling?.plan_code })
          }}
        </UiButton>
      </div>
    </div>
  </page>
</template>
<script setup lang="ts">
  import { useRoute, useRouter } from "vue-router";

  definePageMeta({
    middleware: "admin-only",
  });

  const router = useRouter();
  const route = useRoute();
  const storedUser = localStorage.getItem('user');
  const userDetails = ref(storedUser ? JSON.parse(storedUser) : null);
  const userLocationDetails = ref(await getLocationDetail())
  
  const chatBillingVariation = ref([
    { 
      _id: 1,
      amount: ((userDetails.value.address.country === "India") && (userLocationDetails.value?.country === "IN")) ? "₹0" : '$0',
      status: "Lifetime",
      types: "Free",
      // benefitContent: "Unleash the power of automation.",
      listBenefit: false,
      benefitList: [
        {
          content: "Extra Chat Session",
          availableInPlan: false,
        },
        {
          content: "1 Chatbot",
          availableInPlan: true,
        },
        {
          content: "50 Free Chat Sessions",
          availableInPlan: true,
        },
        {
          content: "Widget Customization",
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
      ],
      plan: "free_test",
      choosePlan: "Downgrade",
      currentPlan: "current plan",
      plan_code: "chat_free",
    },
    {
      _id: 2,
      amount: ((userDetails.value.address.country === "India") && (userLocationDetails.value?.country === "IN")) ? "₹1999" : "$29",
      status: "Per Month",
      types: "Intelligence",
      listBenefit: false,
      benefitList: [
        {
          // content: "60 Message Sessions",
          content: `${((userDetails.value.address.country === 'India') && (userLocationDetails.value?.country === "IN")) ? '₹10' : '$0.60'} per Chat Session`,
          availableInPlan: true,
        },
        {
          content: "2 Chatbots",
          availableInPlan: true,
        },
        {
          content: "60 Free Chat Sessions", // Extra message cost-Rs.10
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
          content: "Free 1 year data storage",
          availableInPlan: true,
        },
      ],
      plan: `chat_intelligence`,
      plan_code: "chat_intelligence",

      choosePlan: "upgrade",
      currentPlan: "current plan",
    },
    {
      _id: 3,
      amount: ((userDetails.value.address.country === "India") && (userLocationDetails.value?.country === "IN")) ? "₹6999" : "$99",
      status: "Per Month",
      types: "Super Intelligence",
      listBenefit: false,
      benefitList: [
        {
          content: `${((userDetails.value.address.country === 'India') && (userLocationDetails?.value.country === "IN")) ? '₹8' : '$0.45'} Per Chat Session`,
          availableInPlan: true,
        },
        {
          content: "10 Chatbots",
          availableInPlan: true,
        },
        {
          content: "250 Free Chat Sessions",
          availableInPlan: true,
        },
        {
          content: "Advanced Widget Customization",
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
          content: "Free 2 years data storage",
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
          content: "Talk to sales for Extra Chat Session",
          availableInPlan: true,
        },
        {
          content: "Unlimited Chatbots",
          availableInPlan: true,
        },
        {
          content: "1000+ Free Chat Sessions",
          availableInPlan: true,
        },
        {
          content: "Advanced Widget Customization",
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
      ],
      choosePlan: "contact us",
      availableInPlan: true,
    },
  ]);

  const voiceBillingVariation = ref([
    {
      _id: 1,
      amount: ((userDetails.value.address.country === "India") && (userLocationDetails.value?.country === "IN")) ? "₹14999" : '$199',
      status: "Per Month",
      types: "Fluent",
      // benefitContent: "Unleash the power of automation.",
      listBenefit: false,
      benefitList: [
        {
          content: "Lead Gen",
          availableInPlan: true,
        },
        {
          content: "CRM Integration",
          availableInPlan: true,
        },
        {
          content: "Real Time Booking",
          availableInPlan: true,
        },
        {
          content: "1500 Mins",
          availableInPlan: true,
        },
        {
          content: `${((userDetails.value.address.country === 'India') && (userLocationDetails.value?.country === "IN")) ? '₹6' : '$0.07'} per Extra Minute`,
          availableInPlan: true,
        },
        {
          content: "Voice Customization",
          availableInPlan: true,
        },
        {
          content: "Multi-lingual",
          availableInPlan: false,
        },
      ],
      plan: "voice_fluent",
      choosePlan: "upgrade",
      currentPlan: "current plan",
      plan_code: "voice_fluent",
    },
    {
      _id: 2,
      amount: ((userDetails.value.address.country === "India") && (userLocationDetails.value?.country === "IN")) ? "₹39999" : "$599",
      status: "Per Month",
      types: "Lucid",
      listBenefit: false,
      benefitList: [
        {
          content: "Lead Gen",
          availableInPlan: true,
        },
        {
          content: "CRM Integration",
          availableInPlan: true,
        },
        {
          content: "Real Time Booking",
          availableInPlan: true,
        },
        {
          content: "5000 Mins",
          availableInPlan: true,
        },
        {
          content: `${((userDetails.value.address.country === 'India') && (userLocationDetails.value?.country === "IN")) ? '₹5' : '$0.65'} per Extra Minute`,
          availableInPlan: true,
        },
        {
          content: "Advanced Voice Customization",
          availableInPlan: true,
        },
        {
          content: "Multi-lingual",
          availableInPlan: true,
        },
      ],
      plan: `voice_lucid`,
      plan_code: "voice_lucid",

      choosePlan: "upgrade",
      currentPlan: "current plan",
    },
    {
      _id: 4,
      amount: "Talk to sales",
      status: "",
      types: "Eloquent (Enterprise)",
      plan_code: "chat_enterprise",
      // benefitContent: 'Automation plus enterprise-grade features.',
      listBenefit: false,
      benefitList: [
        {
          content: "Lead Gen",
          availableInPlan: true,
        },
        {
          content: "CRM Integration",
          availableInPlan: true,
        },
        {
          content: "Real Time Booking",
          availableInPlan: true,
        },
        {
          content: "10,000+ Mins",
          availableInPlan: true,
        },
        {
          content: "Talk to Sales for Extra Mins Cost",
          availableInPlan: true,
        },
        {
          content: "Advanced Voice Customization",
          availableInPlan: true,
        },
        {
          content: "Multi-lingual",
          availableInPlan: true,
        },
      ],
      choosePlan: "contact us",
      availableInPlan: true,
    },
  ]);

  const filters = computed(() => ({
    type: route.query?.type ?? 'chat',
  }));
  

  const billingVariation = computed(() => {
    return route.query.type === "voice"
      ? voiceBillingVariation.value
      : chatBillingVariation.value;
  });
  const findPlanLevel = ({ list, current }: { list: any; current: string }) => {
    if (list.plan_code === "chat_enterprise") {
      return "Contact sales";
    }
    const billInformation = billingVariation.value.find(
      (data: { plan_code: string }) => data.plan_code === list.plan_code,
    );
    const currentPlanInformation = billingVariation.value.find(
      (data: { plan_code: string }) => data.plan_code === current,
    );
    if (billInformation?._id > currentPlanInformation?._id || (current === "unAvailable")) {
      return "Upgrade Plan";
    } else {
      return "Downgrade Plan";
    }
  };

  const { status, data: orgBilling } = await useLazyFetch("/api/org/usage", {
    server: false,
    query: filters,
  });
  const isPageLoading = computed(() => status.value === "pending");

  const choosePlan = async (plan: any) => {
    if (plan === "chat_enterprise") {
      return navigateTo("https://tringlabs.ai/contact-us/", {
        external: true,
        open: {
          target: "_blank",
        },
      });
    } else {
      //TODO fix this
      if (!userDetails?.value?.mobile) {
        toast.error("Please update all the details to continue");
        return navigateTo({
          name: "account",
        });
      }
      //TODO add org details in api endpoint
      if (!orgBilling.value?.gst) {
        toast.error("Please update GST information to continue");
        return navigateTo({
          name: "account",
          query: { tab: "company-details" },
        });
      }
      const locationData = await $fetch<{
        ip_address: string;
        country: string;
        city: string;
        region: string;
      }>(`https://ipv4-check-perf.radar.cloudflare.com/api/info`);

      try {
        const hostedPageUrl = await $fetch<{ hostedpage: { url: string } }>(
          `/api/billing/subscription?type=${filters.value.type}`,
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
      } catch (err) {
        toast.error("ERROR: " + err.data.statusMessage);
        if (err.data.statusMessage?.includes("gst_no")) {
          navigateTo({
            name: "account",
            query: { tab: "company-details" },
          });
        }
      }
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
