<template>
  <!-- mt-4 -->
  <div class="bot-manage-main-container">
    <div class="header-align">
      <span class="text-[20px] font-bold">Bot Management</span>
      <div class="flex gap-4">
        <UiDialog>
          <UiDialogTrigger as-child>
            <UiButton class="button-align bg-[#424bd1] text-[14px] font-medium hover:bg-[#424bd1] hover:brightness-95">
              Add Bot
            </UiButton>
          </UiDialogTrigger>
          <UiDialogContent>
            <UiDialogHeader>
              <UiDialogTitle>Add Bot</UiDialogTitle>
              <UiDialogDescription>
                Add a new bot for your organization.
              </UiDialogDescription>
            </UiDialogHeader>
            <div class="individual-form-align">
              <label for="frole" class="pb-2 font-medium">Name</label>
              <input type="text" id="frole" v-model="newBotName" name="fname" />
              <UiButton @click="addBot" class="ml-auto mt-2 w-1/2">Create</UiButton>
            </div>
          </UiDialogContent>
        </UiDialog>
        <span class="right-dropdown-align text-[15px]" style="color: rgba(138, 138, 138, 1)">Summary:
          <span class="font-bold text-black">
            <!-- <template> -->
            <UiSelect v-model="selectedValue" class="outline-none">
              <UiSelectTrigger class="ui-select-trigger w-[110px] outline-none">
                <UiSelectValue />
              </UiSelectTrigger>
              <UiSelectContent>
                <UiSelectGroup class="select_list_align">
                  <!-- <UiSelectLabel>Today</UiSelectLabel> -->
                  <UiSelectItem v-for="(list, index) in menuList" :key="index" class="content_align"
                    :value="list.content">
                    {{ list.content }}
                  </UiSelectItem>
                </UiSelectGroup>
              </UiSelectContent>
            </UiSelect>
            <!-- </template> -->
          </span></span>
      </div>
    </div>
    <div class="bot-main-align">
      <div class="list-header-align">
        <div class="header-content-align">
          <span class="content-align font-semibold">Bot Name</span>
          <span class="content-align font-semibold">Date Created</span>
          <span class="content-align font-semibold">Status</span>
        </div>
      </div>
      <div class="overflow_align">
        <div v-if="botList.length" class="list_align">
          <div class="bot-list-align text-[15px]" v-for="(list, index) in botList" :key="index"
            @click="botManagementDetails(list)">
            <span class="bot_name_align font-medium">{{ list.name }}</span>
            <span class="createAt_align font-medium text-black" :style="{
                'padding-inline-end': !list.status ? '110px' : '123px',
              }">{{ list.createdAt }}</span>
            <div v-if="list.status" class="acive_class font-medium">
              <div class="active-circle-align rounded-full"></div>
              <span>Active</span>
            </div>
            <div v-else class="deacive_class pl-2 font-medium">
              <div class="deactive-circle-align rounded-full"></div>
              <span>Inactive</span>
            </div>
            <!-- v-if="!list.arrowChange" -->
            <div class="pr-4">
              <!-- <img src="assets\icons\left_arrow.svg" width="30"> -->
              <LeftArrowIcon class="arrow-aling hover:text-[#ffbc42]" />
            </div>
            <!-- <div v-else>
              <img src="assets\icons\yellow_left_arrow.svg" width="30">
            </div> -->
          </div>
          <!-- <div>
          </div> -->
        </div>
        <div v-else class="flex items-center justify-center font-regular text-[#8A8A8A]">
          No bots created
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  definePageMeta({
    middleware: "admin-only",
  });

  const selectedValue = ref("Today");
  const newBotName = ref("");

  const menuList = ref([
    {
      content: "Today",
      value: "Today",
    },
    {
      content: "Weekly",
      value: "Weekly",
    },
    {
      content: "Monthly",
      value: "Monthly",
    },
    {
      content: "Quarterly",
      value: "Quarterly",
    },
    {
      content: "Halfyearly",
      value: "Halfyearly",
    },
    {
      content: "Yearly",
      value: "Yearly",
    },
  ]);
  const previousIndex = ref(0);
  const botList = await listApiBots();
  const addBot = async () => {
    const bot = await $fetch("/api/bots", {
      method: "POST",
      body: { name: newBotName.value },
      query: {
        organization_id: "4e606bb3-3264-410f-9a2d-4910f17685e3",
      },
    });
    return navigateTo({
      name: "BotManagementDetails-id",
      params: { id: bot.id },
    });
  };

  const botManagementDetails = async (list: any) => {
    return navigateTo({
      name: "BotManagementDetails-id",
      params: { id: list.id },
    });
  };
</script>

<style scoped>
  .individual-form-align {
    padding: 0 20px;
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: center;
    height: 150px;
  }

  .individual-form-align input {
    background-color: rgba(246, 246, 246, 1);
    width: 100%;
    height: 50px;
    outline: none;
    border-radius: 10px;
    padding: 0 20px;
    /* margin-top: 20px; */
  }

  .bot-manage-main-container {
    padding: 0 25px;
  }

  .right-dropdown-align {
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 1);
    padding: 0px 10px;
    width: 200px !important;
    box-shadow: 0px 2px 24px 0px rgba(0, 0, 0, 0.05) !important;
    border-radius: 10px;
  }

  .header-align {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: segoe UI Regular;
  }

  .bot-main-align {
    padding: 20px;
    margin-top: 30px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 2px 24px 0px rgba(0, 0, 0, 0.05);
    height: calc(100vh - 130px);
    /* overflow-y: scroll; */
  }

  .ui-select-trigger {
    font-weight: 500;
    /* color: rgba(138, 138, 138, 1); */
  }

  .focus\:ring-offset-2:focus {
    --tw-ring-offset-width: none;
  }

  .content-align {
    font-size: 16px;
    /* width: 100px !important; */
    margin-bottom: 5px;
    color: rgba(138, 138, 138, 1);
  }

  .list-header-align {
    padding: 10px 30px;
    display: flex;
    /* justify-content: space-between; */
    width: 100%;
    /* gap: 100px; */
    border-bottom: 0.5px solid rgba(181, 181, 181, 1);
  }

  .list_align {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    /* width: 100%; */
    /* background: rgba(255, 255, 255, 1); */
    /* padding: 30px 30px; */
    /* box-shadow: 0px 2px 24px 0px rgba(0, 0, 0, 0.05) !important; */
    border-radius: 10px;
    /* gap: 100px; */
    /* margin: 10px 0; */
  }

  .overflow_align {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 70vh;
    overflow-y: scroll;
    width: 100%;
  }

  .bot-list-align {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(255, 255, 255, 1);
    padding: 20px 0px;
    width: 100% !important;
    box-shadow: 0px 2px 24px 0px rgba(0, 0, 0, 0.05) !important;
    border-radius: 10px;
    margin: 20px 0 0 0;
    font-size: 15px;
  }

  .acive_class {
    display: flex;
    align-items: center;
    color: rgba(26, 187, 0, 1);
    gap: 5px;
    padding-inline-end: 213px;
  }

  .deacive_class {
    display: flex;
    align-items: center;
    gap: 5px;
    color: rgba(255, 0, 0, 1);
    padding-inline-end: 201px;
  }

  .active-circle-align {
    display: flex;
    align-items: center;
    background-color: rgba(26, 187, 0, 1);
    width: 5px;
    height: 5px;
  }

  .deactive-circle-align {
    display: flex;
    align-items: center;
    background-color: rgba(255, 0, 0, 1);
    width: 5px;
    height: 5px;
  }

  .header-content-align {
    display: flex;
    justify-content: space-between;
    width: 65%;
  }

  .bot_name_align {
    width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
    padding-inline-start: 30px;
  }

  .bot-list-align:hover {
    color: rgba(255, 188, 66, 1);
    background: rgba(255, 248, 235, 1) !important;
  }

  .arrow-aling {
    width: 30px;
  }

  /* .createAt_align {
  padding-inline-end: 114px;
} */
</style>
