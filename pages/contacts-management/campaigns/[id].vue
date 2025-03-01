<template>
  <!-- :bread-crumbs="[
  {
  label: ``,
  to: `/contacts-management/campaigns`,
  },
  {
  label: 'Campaigns',
  to: `/contacts-management/campaigns`,
  },
  ]" -->
  <Page title="Campaigns Details" :disable-back-button="false">
    <!-- {{ getCampaignsDetails.contactMethod === 'whatsapp' }} -->
    <div v-if="getCampaignsDetails.contactMethod === 'whatsapp'">
      <AddEditChatBotCampaigns />
    </div>
    <div v-else>
      <AddEditVoiceBotCampaigns />
    </div>
  </Page>
</template>
<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { createColumnHelper } from "@tanstack/vue-table";
import { Icon, UiBadge, UiButton } from "#components";
import { useState } from "#app";

const route = useRoute();
const router = useRouter();
const { id } = route.params;
const getCampaignsDetails = await getSingleCampaingsDetails(id)
// const getBucketDetails = await getBucketContactsDetails(id)
</script>