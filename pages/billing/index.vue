<template>
  <div>
    <div class="billing-main-container h-full">
      <!-- <div class="header-align">
        <div class="flex items-center gap-2">
          <div class="flex items-center gap-2">
            <span class="text-[20px] font-bold">Billing</span>
          </div>
          <span class="text-[16px] text-lg font-bold"></span>
        </div>
        <div class="flex items-center space-x-4">
          <span :class="true ? 'select_btn' : 'btn_align'">
            <button>Monthly</button>
          </span>
          <span class="btn_align">
            <button class="font-medium text-black">Yearly</button>
          </span>
        </div>
      </div> -->
      <div>
        <SubscriptionManage />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">

definePageMeta({
  middleware: "admin-only",
});

const { user } = await useUser();
// const orgBilling = await $fetch("/api/org/usage");

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
  padding: 30px 40px 30px 40px;
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
