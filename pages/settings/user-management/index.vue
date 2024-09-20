<template>
  <Page title="User Details" :disable-back-button="true">
    <template #actionButtons>
      <div class="flex gap-2">
        <UiButton v-if="channel=== 'user'" color="primary" @click="() => {
            userPopupState = true
          }">
          Add User
        </UiButton>
        <UiButton v-else color="primary" @click="() => {
            rolePopupState = true
          }">
          Add Role
        </UiButton>
      </div>
    </template>

    <UiTabs default-value="user" class="w-full self-start">
      <UiTabsList class="grid w-full grid-cols-2">
        <UiTabsTrigger
          value="user"
          @click="selectedChannel('user')"
        >
          User Details
        </UiTabsTrigger>
        <UiTabsTrigger value="role" @click="selectedChannel('role')">
          Role
        </UiTabsTrigger>

      </UiTabsList>
      <UiTabsContent value="user">
        <UserAddEdit :popupState="userPopupState" @PopupState="userPopupState = $event"/>
      </UiTabsContent>
      <UiTabsContent value="role">
      <RoleAddEdit :popupState="rolePopupState" @PopupState="rolePopupState = $event"/>
      </UiTabsContent>
 
    </UiTabs>


  </Page>
</template>
<script setup lang="ts">
import UserAddEdit from './UserAddEdit.vue';
import RoleAddEdit from './RoleAddEdit.vue';

const channel =  ref("user")
const  rolePopupState =  ref(false)
const  userPopupState =  ref(false)


const selectedChannel = (value:any)=>{
  channel.value =value
  if(rolePopupState.value) rolePopupState.value  = false
  if(userPopupState.value) userPopupState.value  = false
}
</script>
