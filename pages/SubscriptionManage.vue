<template>
  <div class="flex flex-col justify-center">
    <div class="header-align">
      <div class="font-bold text-[16px]">
        Subscription
      </div>
      <div class="text-[12px]">
        Manage your subscription and billing information
      </div>
    </div>
    <div class="details-card rounded-lg">
      <div class="content-align">
        Subscription Details
      </div>
      <div class="content-align ga-10">
        <span>
          Current Plan
        </span>
        <span class="creator-chip rounded-xl text-[12px]">
          creator
        </span>
      </div>
      <div class="content-align ga-10">
        <span>
          Subscription status
        </span>
        <span class="active-chip rounded-xl text-[12px]">
          active
        </span>
      </div>
    </div>
  </div>
</template>
<style scoped>
.header-align {
  height: 70px;
  padding: 10px 0;
  border-bottom: 1px solid gray;
}

.details-card {
  margin-top: 10px;
  border: 1px solid gray;
  border-bottom: none !important;
}

.content-align {
  display: flex;
  align-items: center;
  border-bottom: 1px solid gray;
}

.creator-chip {
  padding: 5px 8px;
  color: rgba(0, 0, 0, 0.5);
  background-color: #D9DBE6;
}

.active-chip {
  padding: 5px 8px;
  color: rgba(0, 0, 0, 0.5);
  background-color: #D9DBE6;
}
</style>