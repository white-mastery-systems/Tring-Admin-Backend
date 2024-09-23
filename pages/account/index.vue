<template>
  <Page title="My Account" :disable-back-button="true">
    <UiTabs default-value="PersonalDetails" class="w-full self-start">
      <UiTabsList class="grid w-full grid-cols-3">
        <UiTabsTrigger value="PersonalDetails" @click="selectedChannel('PersonalDetails')">
          Personal Details
        </UiTabsTrigger>
        <UiTabsTrigger value="privacy" @click="selectedChannel('privacy')">
          Privacy
        </UiTabsTrigger>
        <UiTabsTrigger value="companyDetails" @click="selectedChannel('companyDetails')">
          Company Details
        </UiTabsTrigger>
      </UiTabsList>
      <UiTabsContent value="PersonalDetails">
       <PersonalDetailsComponent/>
      </UiTabsContent>
      <UiTabsContent value="privacy">
      <PrivacyComponent/>
      </UiTabsContent>
      <UiTabsContent value="companyDetails">
          <CompanyDetails/>
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





const logoutModal = ref(false);

const confirmModel = () => {
  logoutModal.value = true;
  localStorage.clear();
};

const handleLogout = () => {
  authHandlers.logout();
  logoutModal.value = false;
};

const isUpdating = ref(false);
// const handleAccountUpdate = handleSubmit(async (values: any) => {
//   try {
//     isUpdating.value = true;

//     if (tab.value === "companyDetails") {
//       await $fetch("/api/org", {
//         method: "PUT",
//         body: values,
//       });
//       toast.success("Company Details updated successfully");
//     } else {
//       await $fetch("/api/user", { method: "PUT", body: values });
//       refreshUser();
//       toast.success("Account updated successfully");
//       if (tab.value === "privacy") {
//         resetForm();
//       }
//     }
//   } catch (e) {
//     console.error(e);
//     toast.error("Failed to update account, please try again");
//   } finally {
//     isUpdating.value = false;
//   }
// });

const tab = ref("personalDetails");
companyDetails()
const selectedChannel = (value: any) => {
  tab.value = value;
};


</script>
