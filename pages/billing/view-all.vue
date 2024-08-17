<template>
  <div class="main-containter grid h-[100vh] place-content-center">
    <div class="header-align mb-2">
      <div class="flex items-center gap-2">
        <UiButton variant="ghost" size="icon" @click="router.back()">
          <Icon name="ic:round-arrow-back-ios-new" class="h-5 w-5" />
        </UiButton>
        <span class="text-[20px] font-bold">Billing </span>
        <span class="text-[16px] text-lg font-bold"></span>
      </div>
      <div class="flex items-center space-x-4">
        <!-- <span :class="true ? 'select_btn' : 'btn_align'">
          <button>Monthly</button>
        </span> -->
      </div>
    </div>
    <div class="xs:grid-cols-2 billing-details-card-align my-4 grid max-h-[90vh] gap-4 md:grid-cols-2 lg:grid-cols-4">
      <!-- @mouseover="planCard(index); previusIndex = index"
                @mouseout="planCardUnHover(index); previusIndex = index" -->
      <div
        :class="['main_card_align relative border-2 hover:border-yellow-500', orgBilling?.plan_code === list.plan_code ? 'border-2 border-yellow-500' : '', ' w-full']"
        v-for="(list, index) in billingVariation" :key="index">
        <div v-if="orgBilling?.plan_code === list.plan_code"
          class="absolute top-2 right-2 bg-yellow-400 text-white px-3 py-1 rounded-md">
          Current Plan
        </div>
        <div class="type-color text-[23px] font-bold">
          {{ list.types }}
        </div>
        <div class="bill-content-align">
          <div class="amount-align text-[23px] font-black">
            {{ list.amount }}
          </div>
          <div class="content_color_align">{{ list.status }}</div>
        </div>
        <div class="text-[30px] font-bold">
          {{ list.types }}
        </div>
        <div class="benefit_content_align">
          {{ list.benefitContent }}
        </div>
        <div class="benefit_inside_list">
          <div class="flex items-center gap-2" v-for="(advancedList, ListIndex) in list.benefitList" :key="ListIndex">
            <span class="flex items-start">
              <TicIcon v-if="!advancedList.content?.includes('-NA')" />
              <CloseIcon v-else />
              <!-- <img v-if="!list.listBenefit" src="assets\icons\check-circle.svg" width="15" />
              <img v-else src="assets\icons\checked-circle.svg" width="15" /> -->
            </span>
            <span class="content_color_align">
              {{ advancedList.content }}
            </span>
          </div>
        </div>
        <button
          class="bg-transparent hover:bg-indigo-700 text-indigo-800 font-semibold hover:text-white py-2 px-4 border border-indigo-700 hover:border-transparent rounded-lg"
          @click="choosePlan(list.plan)">
          {{
            orgBilling?.plan_code === list.plan_code
              ? list.currentPlan
              : list.choosePlan
          }}
          <!-- {{ list.choosePlan }} -->
        </button>
      </div>
    </div>
  </div>
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
        content: "Message Sessions-50",
      },
      {
        content: "Duration-Lifetime",
      },
      {
        content: "Extra message cost-NA",
      },
      {
        content: "Extra message limit-NA",
      },
      {
        content: "Lead Gen-NA",
      },
      {
        content: "CRM Integration-NA",
      },
      {
        content: "Widget Customization-NA",
      },
      {
        content: "No Tring Branding-NA",
      },
    ],
    plan: "free_test",
    choosePlan: "down grade",
    currentPlan: "current plan",
    plan_code: "FREE",
  },
  {
    _id: 2,
    amount: "Rs.1999",
    status: "Per Month",
    types: "Intelligence",
    // benefitContent: 'Advanced tools to take your work to the next level.',
    listBenefit: false,
    benefitList: [
      {
        content: "Message Sessions-60",
      },
      {
        content: "Duration-Month",
      },
      {
        content: "Extra message cost-Rs.10",
      },
      {
        content: "Extra message limit-200",
      },
      {
        content: "Widget Customization-Yes",
      },
      {
        content: "Lead Gen-NA",
      },
      {
        content: "CRM Integration-NA",
      },

      {
        content: "No Tring Branding-NA",
      },
    ],
    plan: `chat_intelligence`,
    choosePlan: "upgrade",
    currentPlan: "current plan",
  },
  {
    _id: 3,
    amount: "Rs.6999",
    status: "Per Month",
    types: "Super Intelligence",
    // benefitContent: 'Automation plus enterprise-grade features.',
    listBenefit: false,
    benefitList: [
      {
        content: "Message Sessions-250",
      },
      {
        content: "Duration-Month",
      },
      {
        content: "Extra message cost-8",
      },
      {
        content: "Extra message limit-1000",
      },
      {
        content: "Lead Gen-Yes",
      },
      {
        content: "CRM Integration-Yes",
      },
      {
        content: "CRM Integration-Yes",
      },
      {
        content: "No Tring Branding-Paid",
      },
    ],
    plan: "chat_super_intelligence",
    choosePlan: "upgrade",
    currentPlan: "current plan",
  },
  {
    _id: 4,
    amount: "Talk to sales",
    status: "",
    types: "Enterprise",
    // benefitContent: 'Automation plus enterprise-grade features.',
    listBenefit: false,
    benefitList: [
      {
        content: "Message Sessions-1000+",
      },
      {
        content: "Duration-Month",
      },
      {
        content: "Extra message cost-Talk to sales",
      },
      {
        content: "Extra message limit-Unlimited",
      },
      {
        content: "Lead Gen-Yes",
      },
      {
        content: "CRM Integration-Yes",
      },
      {
        content: "Widget Customization-Advance",
      },
      {
        content: "No Tring Branding-Yes",
      },
    ],
    choosePlan: "contact us",
  },
]);
const orgBilling = await $fetch("/api/org/usage");

const choosePlan = async (plan: any) => {
  if (!plan) {
    return navigateTo("https://tring-web.pripod.com/contact", {
      external: true,
      open: {
        target: "_blank",
      },
    });
  }
  const planTemplate = `https://subscriptions.zoho.in/subscribe/3e6d980e80caa44a598af9541ebfccd72b13dd3565a5ef6adbde1ccf1c7a189d/${plan}?cf_user_id=${user.value?.id}&email=${user.value?.email}&first_name=${firstName}`;

  navigateTo(planTemplate, {
    external: true,
    open: {
      target: "_blank",
    },
  });
  // await navigateTo('https://subscriptions.zoho.in/subscribe/3e6d980e80caa44a598af9541ebfccd72b13dd3565a5ef6adbde1ccf1c7a189d/chat_plan_5')
};
</script>
<style scoped>
.analytics_leads-main-container {
  padding: 15px;
}

.header-align {
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* padding-bottom: 20px; */
  padding: 20px 25px 10px 0px;
  /* padding: 0 35px 20px 25px; */
  /* padding-top: 20px; */
  border-bottom: 0.5px solid rgba(181, 181, 181, 1);
}

.btn_align {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 110px;
  height: 40px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 24px 0px rgba(0, 0, 0, 0.05);
  /* background: rgba(255, 188, 66, 1); */
  border-radius: 10px;
}

.select_btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 110px;
  height: 40px;
  background: rgba(255, 188, 66, 1);
  color: white;
  border-radius: 10px;
}

.selected-plan {
  background: rgba(66, 75, 209, 1);
}

.main_card_align {
  padding: 20px 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 24px 0px rgba(0, 0, 0, 0.05);
  border-radius: 13px;
  transition:
    background 0.3s ease,
    color 0.3s ease;
}

.choose_btn_align {
  /* width: 300px; */
  height: 40px;
  border-radius: 10px;
  background: rgba(255, 248, 235, 1);
  color: rgba(255, 188, 66, 1);
  /* margin-top: 30px; */
}

.overall_billing_align {
  display: flex;
  align-items: top;
  justify-content: space-between;
  margin-top: 30px;
  padding: 0 30px;
}

.benefit_inside_list {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  min-height: 310px;
}

.popular_plan_align {
  color: rgba(66, 75, 209, 1);
}

.plan_select_btn {
  width: 180px;
  height: 50px;
  padding: 3px 10px;
  background-color: white;
  box-shadow: 0px 2px 24px 0px rgba(0, 0, 0, 0.05);
  color: rgba(66, 75, 209, 1);
  border-radius: 8px;
  font-weight: 800;
}

.plan_unselected_btn {
  width: 180px;
  height: 50px;
  padding: 3px 10px;
  background-color: rgba(66, 75, 209, 1);
  box-shadow: 0px 2px 24px 0px rgba(0, 0, 0, 0.05);
  color: white;
  border-radius: 8px;
  font-weight: 800;
}

.popular_content_align {
  display: flex;
  justify-content: end;
}

.benefit_content_align {
  color: rgba(132, 129, 153, 1);
  font-size: 15px;
  /* min-height: 200px; */
  margin-bottom: 15px;
}

.main_card_align:hover {
  /* background: rgba(66, 75, 209, 1); */
  /* color: white; */
}

.type-color {
  color: rgba(66, 75, 209, 1);
  margin-bottom: 30px;
}

.main_card_align:hover .type-color {
  /* color: rgba(255, 188, 66, 1); */
}

.content_color_align {
  color: rgba(132, 129, 153, 1);
  font-size: 15px;
  padding: 2px 0;
  min-height: 26px;
  /* height: 30px; */
}

/* .main_card_align:hover .content_color_align {
  color: white;
}

.main_card_align:hover .benefit_content_align {
  color: white;
}

.main_card_align:hover .choose_btn_align {
  background: rgba(255, 188, 66, 1);
  color: rgba(255, 248, 235, 1);
} */

.bill-content-align {
  margin-bottom: 15px;
}

.billing-details-card-align {
  padding: 0 10px;
}

.main-containter {
  padding-top: 10px;
  padding-bottom: 10px;
}

/* .yearly_btn_align {
  display: flex;
  alig-tems: center;
  justify-content: center;
  width: 110px;
  height: 40px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 24px 0px rgba(0, 0, 0, 0.05);
  border-radius: 10px;
} */
</style>
