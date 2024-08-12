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
      <div class="content-align font-bold">
        Subscription Details
      </div>
      <div class="content-align gap-3">
        <span class="font-medium">
          Current Plan
        </span>
        <span class="creator-chip font-medium rounded-xl text-[12px]">
          creator
        </span>
      </div>
      <div class="content-align font-medium gap-3">
        <span>
          Subscription status
        </span>
        <span class="active-chip rounded-xl text-[12px]">
          active
        </span>
      </div>
      <div class="content-align font-medium gap-3">
        <span>
          subscribed List
        </span>
      </div>
      <div class="content-align font-medium gap-3">
        <span>
          Total List
        </span>
      </div>
    </div>
  </div>
</template>
<style scoped>
.header-align {
  height: 70px;
  padding: 10px 0;
  border-bottom: 1px solid rgb(128, 128, 128, 0.5);
}

.details-card {
  margin-top: 30px;
  border: 1px solid rgb(128, 128, 128, 0.5);
}

.content-align {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(128, 128, 128, 0.5);
  padding: 10px;
}

.content-align:last-child {
  border-bottom: none;
}
.creator-chip {
  padding: 5px 8px;
  color: rgba(0, 0, 0, 0.5);
  background-color: #D9DBE6;
}

.active-chip {
  padding: 5px 8px;
  color: rgb(0, 128, 38);
  background: rgb(60, 179, 113, 0.3);
}
</style>