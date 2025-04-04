import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';

export function useBillingVariation(userDetails: any, queryType: any) {
  const userLocationDetails = ref(null);
  const pending = ref(true);
  const error = ref(null);
  const route = useRoute();

  // Pre-define the billing variations with default values
  const chatBillingVariation = ref([
    {
      _id: 2,
      amount: "$29",
      status: "for support automation",
      types: "Intelligence",
      listBenefit: false,
      benefitList: [
        { content: "$0.60 per Chat Session", availableInPlan: true },
        { content: "2 Chatbots", availableInPlan: true },
        { content: "60 Free Chat Sessions", availableInPlan: true },
        { content: "Widget Customization", availableInPlan: true },
        { content: "Lead Gen", availableInPlan: false },
        { content: "CRM Integration", availableInPlan: false },
        { content: "Free 1 year data storage", availableInPlan: true },
      ],
      plan: `chat_intelligence`,
      plan_code: "chat_intelligence",
      choosePlan: "upgrade",
      currentPlan: "current plan",
    },
    {
      _id: 3,
      amount: "$99",
      status: "for lead generation",
      types: "Super Intelligence",
      listBenefit: false,
      benefitList: [
        { content: "$0.45 Per Chat Session", availableInPlan: true },
        { content: "10 Chatbots", availableInPlan: true },
        { content: "250 Free Chat Sessions", availableInPlan: true },
        { content: "Advanced Widget Customization", availableInPlan: true },
        { content: "Lead Gen", availableInPlan: true },
        { content: "CRM Integration", availableInPlan: true },
        { content: "Free 2 years data storage", availableInPlan: true },
      ],
      plan: "chat_super_intelligence",
      plan_code: "chat_super_intelligence",
      choosePlan: "upgrade",
      currentPlan: "current plan",
    },
    {
      _id: 4,
      amount: "Talk to sales",
      status: "for lead generation",
      types: "Enterprise",
      plan_code: "chat_enterprise",
      listBenefit: false,
      benefitList: [
        { content: "Talk to sales for Extra Chat Session", availableInPlan: true },
        { content: "Unlimited Chatbots", availableInPlan: true },
        { content: "1000+ Free Chat Sessions", availableInPlan: true },
        { content: "Advanced Widget Customization", availableInPlan: true },
        { content: "Lead Gen", availableInPlan: true },
        { content: "CRM Integration", availableInPlan: true },
      ],
      choosePlan: "contact us",
      availableInPlan: true,
    },
  ]);

  const voiceBillingVariation = ref([
    {
      _id: 1,
      amount: '$199',
      status: "",
      types: "Fluent",
      listBenefit: false,
      benefitList: [
        { content: "Lead Gen", availableInPlan: true },
        { content: "CRM Integration", availableInPlan: true },
        { content: "Real Time Booking", availableInPlan: true },
        { content: "1500 Mins", availableInPlan: true },
        { content: "$0.07 per Extra Minute", availableInPlan: true },
        { content: "Voice Customization", availableInPlan: true },
        { content: "Multi-lingual", availableInPlan: false },
      ],
      plan: "voice_fluent",
      choosePlan: "upgrade",
      currentPlan: "current plan",
      plan_code: "voice_fluent",
    },
    {
      _id: 2,
      amount: "$599",
      status: "",
      types: "Lucid",
      listBenefit: false,
      benefitList: [
        { content: "Lead Gen", availableInPlan: true },
        { content: "CRM Integration", availableInPlan: true },
        { content: "Real Time Booking", availableInPlan: true },
        { content: "5000 Mins", availableInPlan: true },
        { content: "$0.65 per Extra Minute", availableInPlan: true },
        { content: "Advanced Voice Customization", availableInPlan: true },
        { content: "Multi-lingual", availableInPlan: true },
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
      listBenefit: false,
      benefitList: [
        { content: "Lead Gen", availableInPlan: true },
        { content: "CRM Integration", availableInPlan: true },
        { content: "Real Time Booking", availableInPlan: true },
        { content: "10,000+ Mins", availableInPlan: true },
        { content: "Talk to Sales for Extra Mins Cost", availableInPlan: true },
        { content: "Advanced Voice Customization", availableInPlan: true },
        { content: "Multi-lingual", availableInPlan: true },
      ],
      choosePlan: "contact us",
      availableInPlan: true,
    },
  ]);

  // Computed property to determine the correct billing variation
  const billingVariation = computed(() => {
    return route.query.type === "voice" ? voiceBillingVariation.value : chatBillingVariation.value;
  });

  const fetchUserLocation = async () => {
    try {
      const response = await fetch('https://ipv4-check-perf.radar.cloudflare.com/api/info');
      if (!response.ok) throw new Error('Failed to fetch data');
      userLocationDetails.value = await response.json();
      // Now that we have the location data, update the pricing
      updatePricing();
    } catch (err) {
      // toast.error('Unable to fetch location details');
    } finally {
      pending.value = false;
    }
  };

  // Computed property for checking if user is from India
  const isIndianUser = computed(() => {
    return userDetails?.countryCode === "+91" || userLocationDetails.value?.country === "IN";
  });

  const isFreeUser = computed(() => {
    return userLocationDetails.value?.country;
  });

  // Function to update pricing based on user location
  function updatePricing() {
    if (!userLocationDetails.value) return;

    // Update Chat Billing Variation
    // Line removed: chatBillingVariation.value[0].amount = isIndianUser.value ? "₹0" : "$0";

    chatBillingVariation.value[0].amount = isIndianUser.value ? "₹1999" : "$29";
    chatBillingVariation.value[0].benefitList[0].content =
      `${isIndianUser.value ? '₹10' : '$0.60'} per Chat Session`;

    chatBillingVariation.value[1].amount = isIndianUser.value ? "₹6999" : "$99";
    chatBillingVariation.value[1].benefitList[0].content =
      `${isIndianUser.value ? '₹8' : '$0.45'} Per Chat Session`;

    // Update Voice Billing Variation
    voiceBillingVariation.value[0].amount = isIndianUser.value ? "₹14999" : "$199";
    voiceBillingVariation.value[0].benefitList[4].content =
      `${isIndianUser.value ? '₹6' : '$0.07'} per Extra Minute`;

    voiceBillingVariation.value[1].amount = isIndianUser.value ? "₹39999" : "$599";
    voiceBillingVariation.value[1].benefitList[4].content =
      `${isIndianUser.value ? '₹5' : '$0.65'} per Extra Minute`;

    console.log("Pricing updated based on user location.");
    console.log(billingVariation.value, "billingVariation after update");
  }

  // Update prices when user details change
  watch(userDetails, () => {
    updatePricing();
  }, { deep: true });

  // Call fetchUserLocation on component mount
  onMounted(fetchUserLocation);

  return { billingVariation, pending, isIndianUser, userLocationDetails, error };
}