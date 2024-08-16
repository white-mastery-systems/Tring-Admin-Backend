<template>
  <div class="bot-manage-main-container">
    <div class="header-align">
      <div class="flex items-center">
        <span class="text-[20px] font-bold">Leads</span>
      </div>
      <div
        v-if="false"
        class="flex items-center space-x-4"
        style="width: 350px"
      >
        <span class="calender-align">
          <img src="assets\icons\calendar_month.svg" width="20" />
        </span>
        <span class="right-dropdown-align" style="color: rgba(138, 138, 138, 1)"
          >Filter:
          <span class="text-[14px] font-bold text-black">
            <UiSelect v-model="selectedValue">
              <UiSelectTrigger class="ui-select-trigger w-[110px]">
                <UiSelectValue placeholder="Select a fruit" />
              </UiSelectTrigger>
              <UiSelectContent>
                <UiSelectGroup>
                  <!-- <UiSelectLabel>Today</UiSelectLabel> -->
                  <UiSelectItem value="Today"> Today </UiSelectItem>
                  <UiSelectItem value="Weekly"> Weekly </UiSelectItem>
                  <UiSelectItem value="Monthly"> Monthly </UiSelectItem>
                  <UiSelectItem value="Quarterly"> Quarterly </UiSelectItem>
                  <UiSelectItem value="Halfyearly"> Halfyearly </UiSelectItem>
                  <UiSelectItem value="Yearly"> Yearly </UiSelectItem>
                </UiSelectGroup>
              </UiSelectContent>
            </UiSelect>
          </span></span
        >
        <span>
          <img src="assets\icons\export_btn.svg" width="110" />
        </span>
      </div>
    </div>
    <div class="document-align gap-4">
      <div class="count-align gap-3">
        <span class="font-bold">
          Total Chats:
          <span style="color: rgba(66, 75, 209, 1)">{{
            analyticsData?.chats
          }}</span>
        </span>
        <span class="font-bold">
          Total Leads:
          <span style="color: rgba(66, 75, 209, 1)">{{
            analyticsData?.leads
          }}</span>
        </span>
      </div>
      <!-- <span>
        <img src="assets\icons\pdf_upload_document.svg" width="100" />
      </span>
      <div class="flex items-center gap-2">
        <span class="upload-document-align font-bold"> Upload Document </span>
        <span class="only-content-align"> (Only Pdf) </span>
      </div> -->
    </div>
    <div class="bot-main-align">
      <div class="list-header-align">
        <div class="header-content-align px-[13px]">
          <span class="content-align font-semibold">Lead Name</span>
          <span class="content-align font-semibold">Bot Name</span>
          <span class="content-align font-semibold">Date Created</span>
          <span class="content-align font-semibold">Actions</span>
        </div>
      </div>
      <div class="content-scroll-align cursor-pointer">
        <!-- {{ rep }} || asda -->
        <div style="height: 100%" v-if="ListLeads.length" class="px-[15px]">
          <div
            class="bot-list-align"
            v-for="(list, index) in ListLeads"
            :key="index"
            @click="
              async () => {
                await navigateTo({
                  name: 'AnalyticsLeadsInfo-id',
                  params: { id: list.chatId },
                });
              }
            "
          >
            <div class="list_align">
              <span class="user_name_align font-medium">{{
                list.botUser.name
              }}</span>
              <span class="bot_name_align font-medium">{{
                list.bot.name
              }}</span>
              <span class="create_at-align font-medium">{{
                formatDateStringToDate(list.createdAt)
              }}</span>
              <!-- <div v-if="list.status" class="acive_class font-medium">
                <div class="rounded-full active-circle-align"></div>
                <span>Active</span>
              </div> -->
              <span class="view_align" @click="viewBot(list.chatId)">
                <img src="assets\icons\Edit_view.svg" width="70" />
              </span>
              <!-- <div v-else-if="list.Processing" class="process_class font-medium">
                <div class="rounded-full process-circle-align"></div>
                <span>Processing</span>
              </div>
              <div v-else class="deacive_class font-medium">
                <div class="rounded-full deactive-circle-align"></div>
                <span>Inactive</span>
              </div> -->
              <!-- <span>
                <img src="assets\icons\more_horiz.svg" width="30">
              </span> -->
            </div>
            <!-- <div>
              <img src="assets\icons\left_arrow.svg" width="30">
            </div> -->
          </div>
        </div>
        <div
          v-else
          class="font-regular flex items-center justify-center text-[#8A8A8A]"
        >
          No leads generated
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  definePageMeta({
    middleware: "admin-only",
  });
  import { ref } from "vue";

  const selectedValue = ref("Today");
  const loading = ref(true);
  const error: any = ref(null);
  // const ListLeads = ref()
  const ListLeads = await listLeads();

  const analyticsData = ref();

  onMounted(async () => {
    analyticsData.value = await getAnalyticsData();
  });

  // const rep = await defineEventHandler()

  // onMounted(async() => {
  //   ListLeads.value = await listLeads()
  //   console.log(ListLeads.value, "ListLeads.value")
  // })

  const viewBot = async (chatId: any) => {
    await navigateTo({
      name: "AnalyticsLeadsInfo-id",
      params: { id: chatId },
    });
  };
</script>

<style scoped>
  .focus\:ring-offset-2:focus {
    --tw-ring-offset-width: none;
  }

  .bot-manage-main-container {
    padding: 0 25px 0 25px;
  }

  .header-align {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: segoe UI Regular;
    padding-bottom: 20px;
    border-bottom: 0.5px solid rgba(181, 181, 181, 1);
  }

  .bot-main-align {
    padding: 20px;
    margin-top: 30px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 2px 24px 0px rgba(0, 0, 0, 0.05) !important;
    /* overflow-y: scroll; */
  }

  .content-align {
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
    align-items: center;
    justify-content: space-between;
    width: 100%;
    /* background: rgba(255, 255, 255, 1); */
    /* padding: 30px 30px; */
    /* box-shadow: 0px 2px 24px 0px rgba(0, 0, 0, 0.05) !important; */
    border-radius: 10px;
    /* gap: 100px; */
    /* margin: 10px 0; */
  }

  .bot-list-align {
    display: flex;
    align-items: center;
    justify-content: space-between;
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 1);
    padding: 20px 0px;
    width: 100% !important;
    /* height: calc(100vh - 260px); */
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
    padding-inline-end: 93px;
  }

  .deacive_class {
    display: flex;
    align-items: center;
    gap: 5px;
    color: rgba(255, 0, 0, 1);
    padding-right: 77px;
  }

  .process_class {
    display: flex;
    align-items: center;
    color: rgba(238, 186, 1, 1);
    gap: 5px;
    padding-inline-end: 65px;
  }

  .process-circle-align {
    display: flex;
    align-items: center;
    background: rgba(238, 186, 1, 1);
    width: 5px;
    height: 5px;
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
    width: 100%;
  }

  .user_name_align {
    width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
    padding-inline-start: 30px;
  }

  .bot_name_align {
    width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
    padding-inline-start: 21px;
  }

  .create_at-align {
    padding-inline-end: 122px;
  }

  .document-align {
    display: flex;
    align-items: center;
    justify-content: end;
    margin-top: 20px;
    padding-inline-end: 10px;
  }

  .upload-document-align {
    color: rgba(66, 75, 209, 1);
    font-size: 15px;
    text-decoration: underline;
  }

  .only-content-align {
    color: rgba(138, 138, 138, 1);
    font-size: 11px;
  }

  .content-scroll-align {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: calc(100vh - 285px);
    overflow-y: scroll;
    padding: 5px;
  }

  .count-align {
    display: flex;
    align-items: center;
    padding-right: 10px;
    /* justify-content: end; */
  }

  .user_name_align {
    padding-inline-start: 22px;
  }

  .bot_name_align {
    /* padding-inline-end: 20px; */
  }

  .view_align {
    padding-right: 24px;
    cursor: pointer;
  }

  .right-dropdown-align {
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 1);
    padding: 0px 10px;
    width: 150px !important;
    box-shadow: 0px 2px 24px 0px rgba(0, 0, 0, 0.05) !important;
    border-radius: 10px;
  }

  .calender-align {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 40px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 2px 24px 0px rgba(0, 0, 0, 0.05) !important;
    border-radius: 10px;
  }
</style>
