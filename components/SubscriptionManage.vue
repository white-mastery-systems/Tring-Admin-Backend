<script setup lang="ts">
const orgBilling = await $fetch("/api/org/usage");
</script>
<template>
  <div class="flex flex-col justify-center">
    <div class="header-align px-2">
      <div class="text-[20px] font-bold">Billing</div>
      <div class="text-[12px]">
        Manage your subscription and billing information
      </div>
    </div>
    <div class="details-card rounded-lg">
      <div
        class="flex items-center justify-between text-[18px] content-align font-bold rounded-t-xl billing-table-header-align">
        <span>
          Subscription Details
        </span>
        <UiButton class="font-medium bg-[#FFBC42] hover:bg-[#FFBC42] hover:brighten-50 text-[#FFFFFF]">
          <NuxtLink to="/billing/view-all" class="align_border">Change Plan</NuxtLink>
        </UiButton>
      </div>
      <div class="flex items-center justify-between list-content-align gap-3">
        <span class="font-medium"> Current Plan </span>
        <span class="creator-chip rounded-[11px] text-[12px] font-medium lowercase">
          {{ orgBilling?.plan_code }}
        </span>
      </div>
      <div class="flex items-center justify-between list-content-align gap-3 font-medium">
        <span> Subscription status </span>
        <span class="active-chip rounded-[11px] text-[12px]"> active </span>
      </div>
      <div class="flex items-center justify-between list-content-align gap-3 font-medium">
        <span> subscribed quota </span>
        <span class="rounded-xl text-[15px]">
          {{ orgBilling?.max_quota }}
        </span>
      </div>
      <div class="flex items-center justify-between list-content-align gap-3 font-medium rounded-b-lg">
        <span> Available quota </span>
        <span class="rounded-xl text-[15px]">
          {{ orgBilling?.available_quota }}
        </span>
      </div>
    </div>
  </div>
</template>
<style scoped>
.header-align {
  height: 70px;
  padding: 4px 25px;
  border-bottom: 1px solid rgb(128, 128, 128, 0.21);
}

.billing-table-header-align {
  border-bottom: 1px solid rgb(128, 128, 128, 0.21);
}

.details-card {
  margin-top: 30px;
  /* border: 1px solid rgb(128, 128, 128, 0.5); */
  background-color: white;
  box-shadow: 0px 2px 24px 0px #0000000D;
  width: 97%;
  align-self: center;
}

.content-align {
  /* border-bottom: 1px solid rgb(128, 128, 128, 0.5); */
  padding: 20px 30px;
}

.list-content-align {
  padding: 20px 40px;
}

.content-align:last-child {
  border-bottom: none;
}

.creator-chip {
  padding: 3px 10px;
  color: rgba(0, 0, 0, 0.5);
  background-color: #d9dbe6;
}

.active-chip {
  padding: 3px 10px;
  color: rgb(0, 128, 38, 0.73);
  background: rgb(60, 179, 113, 0.3);
}
</style>
