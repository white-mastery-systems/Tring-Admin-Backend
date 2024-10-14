<template>
  <Page title="My Account" :disable-back-button="true">
    <UiTabs :default-value="tabValue" class="w-full self-start">
      <UiTabsList class="grid w-full max-w-[50%] grid-cols-3">
        <UiTabsTrigger
          value="PersonalDetails"
          @click="selectedChannel('PersonalDetails')"
        >
          <span class="sm:hidden">Personal</span>
          <span class="hidden sm:inline">Personal Details</span>
          <!-- Personal Details -->
        </UiTabsTrigger>
        <UiTabsTrigger value="privacy" @click="selectedChannel('privacy')">
          Privacy
        </UiTabsTrigger>
        <UiTabsTrigger
          value="companyDetails"
          @click="selectedChannel('companyDetails')"
        >
          <span class="sm:hidden">Company</span>
          <span class="hidden sm:inline">Company Details</span>
        </UiTabsTrigger>
      </UiTabsList>
      <UiTabsContent value="PersonalDetails">
        <PersonalDetails />
      </UiTabsContent>
      <UiTabsContent value="privacy">
        <PrivacyDetails />
      </UiTabsContent>
      <UiTabsContent value="companyDetails">
        <CompanyDetails />
      </UiTabsContent>
    </UiTabs>
    <template #actionButtons>
      <div>
        <UiButton
          @click="confirmModel"
          class="items-start justify-around bg-[#ffffff] pr-12 font-bold text-[#ff0000] hover:bg-gray-300/30 hover:text-[#ff0000] hover:brightness-110"
          variant="ghost"
        >
          <Icon name="ic:round-logout" class="h-6 w-6" />
          <p class="text-base">Logout</p>
        </UiButton>
      </div>
    </template>
    <ConfirmationModal
      v-model:open="logoutModal"
      title="Confirm Logout"
      description="Are you sure you want to log out ?"
      @confirm="handleLogout"
    />
  </Page>
</template>
<script setup lang="ts">
  useHead({
    title: "Account",
  });

  const logoutModal = ref(false);
  const route = useRoute();
  const tabValue = ref("PersonalDetails");
  if (route?.query?.tab === "company-details") {
    tabValue.value = "companyDetails";
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
  };
</script>
