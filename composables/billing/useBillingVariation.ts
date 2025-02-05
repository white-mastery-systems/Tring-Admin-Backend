import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';

export function useBillingVariation(userDetails: any) {
  const userLocationDetails = ref(null);
  const pending = ref(true);
  const error = ref(null);
  const route = useRoute();

  const fetchUserLocation = async () => {
    try {
      const response = await fetch('https://ipv4-check-perf.radar.cloudflare.com/api/info');
      if (!response.ok) throw new Error('Failed to fetch data');
      userLocationDetails.value = await response.json();
    } catch (err) {
      toast.error('Unable to fetch location details');
    } finally {
      pending.value = false;
    }
  };
  onMounted(fetchUserLocation);

  const isIndianUser = computed(() => {
    return userDetails?.countryCode === "+91" && userLocationDetails.value?.country === "IN";
  });

  const chatBillingVariation = ref([
    {
      _id: 1,
      amount: isIndianUser ? "₹0" : '$0',
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
      amount: isIndianUser ? "₹1999" : "$29",
      status: "Per Month",
      types: "Intelligence",
      listBenefit: false,
      benefitList: [
        {
          // content: "60 Message Sessions",
          content: `${isIndianUser ? '₹10' : '$0.60'} per Chat Session`,
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
      amount: isIndianUser ? "₹6999" : "$99",
      status: "Per Month",
      types: "Super Intelligence",
      listBenefit: false,
      benefitList: [
        {
          content: `${isIndianUser ? '₹8' : '$0.45'} Per Chat Session`,
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
      amount: isIndianUser ? "₹14999" : '$199',
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
          content: `${isIndianUser ? '₹6' : '$0.07'} per Extra Minute`,
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
      amount: isIndianUser ? "₹39999" : "$599",
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
          content: `${isIndianUser ? '₹5' : '$0.65'} per Extra Minute`,
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
  const billingVariation = computed(() => {
    return route?.query?.type === "voice" ? voiceBillingVariation.value : chatBillingVariation.value;
  });

  return { billingVariation, pending, userLocationDetails, error };
}