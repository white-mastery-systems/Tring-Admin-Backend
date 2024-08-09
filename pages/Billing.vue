<template>
  <div>
    <div class="billing-main-container">
      <div class="header-align">
        <div class="flex items-center gap-2">
          <div class="flex items-center gap-2">
            <span class="font-bold text-[20px]">Billing</span>
          </div>
          <span class="font-bold text-lg text-[16px]"></span>
        </div>
        <div class="flex items-center space-x-4">
          <span :class="(true) ? 'select_btn' : 'btn_align'">
            <button>Monthly</button>
          </span>
          <span class="btn_align">
            <button class="text-black font-medium">Yearly</button>
          </span>
        </div>
      </div>
      <div class="overall_billing_align">
        <!-- @mouseover="planCard(index); previusIndex = index" @mouseout="planCardUnHover(index); previusIndex = index" -->
        <div class="main_card_align" v-for="(list, index) in billingVariation" :key="index">
          <div class="font-bold text-[24px] type-color">
            {{ list.types }}
          </div>
          <div class="bill-content-align">
            <div class="font-black text-[24px] amount-align">{{ list.amount }}</div>
            <div class="content_color_align">{{ list.status }}</div>
          </div>
          <!-- <div class="font-bold text-[30px]">
            {{ list.types }}
          </div> -->
          <!-- <div class="benefit_content_align">
            {{ list.benefitContent }}
          </div> -->
          <div class="benefit_inside_list">
            <div class="gap-2 flex items-center" v-for="(advancedList, ListIndex) in list.benefitList" :key="ListIndex">
              <span class="flex items-center">
                <img v-if="!list.listBenefit" src="assets\icons\check-circle.svg" width="15">
                <img v-else src="assets\icons\checked-circle.svg" width="15">
              </span>
              <span class="content_color_align">
                {{ advancedList.content }}
              </span>
            </div>
          </div>
          <button class="choose_btn_align">Choose plan</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const billingVariation = ref([
  {
    _id: 1,
    amount: '$0',
    status: 'Per Month',
    types: 'Free',
    benefitContent: 'Unleash the power of automation.',
    listBenefit: false,
    benefitList: [
      {
        content: 'Message Sessions-50'
      }, {
        content: 'Duration-Lifetime'
      }, {
        content: 'Extra message cost-NA'
      }, {
        content: 'Extra message limit-NA'
      }, {
        content: 'Lead Gen-NA'
      }, {
        content: 'CRM Integration-NA'
      }, {
        content: 'Widget Customization-NA'
      }, {
        content: 'No Tring Branding-NA'
      },
    ]
  }, {
    _id: 2,
    amount: '$29',
    status: 'Per Month',
    types: 'Intelligence',
    // benefitContent: 'Advanced tools to take your work to the next level.',
    listBenefit: false,
    benefitList: [
      {
        content: 'Message Sessions-60'
      }, {
        content: 'Duration-Month'
      }, {
        content: 'Extra message cost-0.6$'
      }, {
        content: 'Extra message limit-200'
      }, {
        content: 'Lead Gen-NA'
      }, {
        content: 'CRM Integration-NA'
      }, {
        content: 'Widget Customization-Yes'
      }, {
        content: 'No Tring Branding-NA'
      }, 
    ]
  }, {
    _id: 3,
    amount: '$99',
    status: 'Per Month',
    types: 'Super Intelligence',
    // benefitContent: 'Automation plus enterprise-grade features.',
    listBenefit: false,
    benefitList: [
      {
        content: 'Message Sessions-250'
      }, {
        content: 'Duration-Month'
      }, {
        content: 'Extra message cost-0.45$'
      }, {
        content: 'Extra message limit-1000'
      }, {
        content: 'Lead Gen-Yes'
      }, {
        content: 'CRM Integration-Yes'
      }, {
        content: 'CRM Integration-Yes'
      }, {
        content: 'No Tring Branding-Paid'
      },
    ]
  }, {
    _id: 4,
    amount: 'Talk to sales',
    status: '',
    types: 'Enterprise',
    // benefitContent: 'Automation plus enterprise-grade features.',
    listBenefit: false,
    benefitList: [
      {
        content: 'Message Sessions-1000+'
      }, {
        content: 'Duration-Month'
      }, {
        content: 'Extra message cost-Talk to sales'
      }, {
        content: 'Extra message limit-Unlimited'
      }, {
        content: 'Lead Gen-Yes'
      }, {
        content: 'CRM Integration-Yes'
      }, {
        content: 'Widget Customization-Advance'
      }, {
        content: 'No Tring Branding-Yes'
      },
    ]
  },
])
const previusIndex: any = ref(false)
const mostPopularPlan = ref(false)
</script>
<style scoped>
.analytics_leads-main-container {
  padding: 15px;
}
.header-align {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 20px;
  padding: 0 35px 20px 25px;
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
.main_card_align {
  padding: 30px  40px  30px 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 24%;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 24px 0px rgba(0, 0, 0, 0.05);
  border-radius: 13px;
  transition: background 0.3s ease, color 0.3s ease;
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
  background: rgba(66, 75, 209, 1);
  color: white;
}
.type-color {
  color: rgba(66, 75, 209, 1);
  margin-bottom: 30px;
}
.main_card_align:hover .type-color {
  color: rgba(255, 188, 66, 1);
}
.content_color_align {
  color: rgba(132, 129, 153, 1);
  font-size: 15px;
  padding: 2px 0;
  min-height: 26px;
  /* height: 30px; */
}
.main_card_align:hover .content_color_align {
 color: white;
} 
.main_card_align:hover .benefit_content_align {
  color: white;
}
.main_card_align:hover .choose_btn_align {
  background: rgba(255, 188, 66, 1);
  color: rgba(255, 248, 235, 1);
}
.bill-content-align {
  margin-bottom: 15px;
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