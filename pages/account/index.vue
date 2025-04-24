<template>
  <Page title="My Account" :disable-back-button="true">
    <UiTabs v-model="tabValue" :default-value="tabValue" class="w-full self-start">
      <UiTabsList
        class="grid w-full max-w-[100%] sm:max-w-[100%] md:max-w-[50%] lg:max-w-[50%] xl:max-w-[50%] grid-cols-2">
        <UiTabsTrigger value="personal-details" @click="selectedChannel('personal-details')">
          <span>Profile</span>
        </UiTabsTrigger>
        <UiTabsTrigger value="security" @click="selectedChannel('security')">
          Security
        </UiTabsTrigger>
      </UiTabsList>
      <UiTabsContent value="personal-details">
        <PersonalDetails :personalControl="true" />
      </UiTabsContent>
      <UiTabsContent value="security">
        <PrivacyDetails />
      </UiTabsContent>
    </UiTabs>
  </Page>
</template>
<script setup lang="ts">
import { useBreadcrumbStore } from "~/store/breadcrumbs"; // Import the store

definePageMeta({
  middleware: "user",
});
useHead({
  title: "Account",
});

const breadcrumbStore = useBreadcrumbStore();
const route = useRoute();
const router = useRouter();
const tabValue = ref("personal-details");

// Initialize breadcrumbs on page load
onMounted(() => {
  // Get the current tab from query or use default
  const currentTab = route.query.tab || "personal-details";

  // Set breadcrumbs on initial load
  breadcrumbStore.setBreadcrumbs([
    {
      label: "My Account",
      to: `/account?tab=${currentTab}`,
    }
  ]);

  // Make sure tab value matches query
  tabValue.value = currentTab as string;
});

watch(() => route.query.tab, (newType) => {
  breadcrumbStore.setBreadcrumbs([
    {
      label: "My Account", // Dynamic name
      to: `/account?tab=${newType}`,
    }
  ]);
}, { deep:true, immediate: true })

watch(() => route?.query?.tab, (newTab) => {
  tabValue.value = newTab
})
const tab = ref("personal-details");

companyDetails();
const selectedChannel = (value: any) => {
  tab.value = value;
  let queryValue;
  if (value === "security") {
    queryValue = "security";
  } else if (value === "personal-details") {
    queryValue = "personal-details";
  }
  router.push({ query: { tab: queryValue } });
};
onUnmounted(() => {
  localStorage.removeItem('cameFromBilling');
  localStorage.removeItem('billingType');
});
</script>
