<template>
  <Page title="My Account" :disable-back-button="true">
    <UiTabs :default-value="tabValue" class="w-full self-start">
      <UiTabsList
        class="grid w-full max-w-[100%] sm:max-w-[100%] md:max-w-[50%] lg:max-w-[50%] xl:max-w-[50%] grid-cols-2">
        <UiTabsTrigger value="PersonalDetails" @click="selectedChannel('PersonalDetails')">
          <!-- <span class="sm:hidden">profile</span> -->
          <span>Profile</span>
          <!-- Personal Details -->
        </UiTabsTrigger>
        <!-- <UiTabsTrigger value="companyDetails" @click="selectedChannel('companyDetails')">
          <span class="sm:hidden">Company</span>
          <span class="hidden sm:inline">Company Details</span>
        </UiTabsTrigger> -->
        <UiTabsTrigger value="security" @click="selectedChannel('security')">
          Security
        </UiTabsTrigger>
      </UiTabsList>
      <UiTabsContent value="PersonalDetails">
        <PersonalDetails />
      </UiTabsContent>
      <!-- <UiTabsContent value="companyDetails">
        <CompanyDetails />
      </UiTabsContent> -->
      <UiTabsContent value="security">
        <PrivacyDetails />
      </UiTabsContent>
    </UiTabs>
    <template #actionButtons>
      <div>
        <UiButton @click="confirmModel"
          class="items-start justify-around bg-[#ffffff] pr-12 font-bold text-[#ff0000] hover:bg-gray-300/30 hover:text-[#ff0000] hover:brightness-110"
          variant="ghost">
          <Icon name="ic:round-logout" class="h-6 w-6" />
          <p class="text-base">Logout</p>
        </UiButton>
      </div>
    </template>
    <ConfirmationModal v-model:open="logoutModal" title="Confirm Logout"
      description="Are you sure you want to log out ?" @confirm="handleLogout" />
  </Page>
</template>
<script setup lang="ts">
definePageMeta({
  middleware: "user",
});
  useHead({
    title: "Account",
  });

  const logoutModal = ref(false);
  const route = useRoute();
  const router = useRouter();
  const tabValue = ref("PersonalDetails");
  if (route?.query?.tab === "company-details") {
    tabValue.value = "companyDetails";
  } else if (route?.query?.tab === "security") {
    tabValue.value = "security";
  } else if (route?.query?.tab === "personal-details") {
    tabValue.value = "PersonalDetails";
  }


  const confirmModel = () => {
    logoutModal.value = true;
    localStorage.clear();
  };

  const handleLogout = async () => {
    authHandlers.logout();
    logoutModal.value = false;
    navigateTo({ name: "auth-sign-in" });
  };

  const isUpdating = ref(false);

  const tab = ref("personalDetails");
  companyDetails();
  const selectedChannel = (value: any) => {
    tab.value = value;
    let queryValue ;
    if (value === "companyDetails") {
      queryValue = "company-details";
    } else if (value === "security") {
      queryValue = "security";         
    }else if (value === "PersonalDetails") {
      queryValue = "personal-details";
    }
    router.push({ query: { tab: queryValue } });
  };
</script>
