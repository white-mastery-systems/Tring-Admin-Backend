<template>
  <div class="bot-manage-main-container">
    <div class="header-align">
      <span class="text-lg font-bold"> Bot Management </span>
    </div>
    <div class="bot-main-align">
      <div class="list-header-align">
        <div class="header-content-align">
          <div class="items-cetner flex gap-4">
            <span class="content-align text-[17px] font-bold"
              >Yourstore Bot-4</span
            >
            <div class="acive_class">
              <div class="active-circle-align rounded-full"></div>
              <span class="text-[14px]">Active</span>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <span class="text-[17px] font-bold text-black"
              >Date Created:
              <span class="text-[15px] font-medium text-black"
                >12.09.2013</span
              ></span
            >
            <span>
              <button class="button-align text-[14px] font-medium">
                Deactivate Bot
              </button>
            </span>
          </div>
          <!-- <span class="font-semibold content-align">Date Created</span>
          <span class="font-semibold content-align">Status</span> -->
        </div>
      </div>
      <div
        class="bot-list-align text-[14px]"
        v-for="(list, index) in dataList"
        :key="index"
        @mouseover="
          listHover(index);
          previousIndex = index;
        "
        @mouseout="
          listHoverOut(index);
          previousIndex = index;
        "
        @click="
          async () => {
            if (list.bot === 'Document Management')
              await navigateTo('botdocumentmanagement');
            console.log(list.routeName, route.params.id);
            return navigateTo({
              name: list.routeName,
              params: { id: route.params.id },
            });
          }
        "
      >
        <div class="list_align">
          <span class="bot_name_align font-medium">{{ list.bot }}</span>
          <!-- <span class="font-medium pr-14">{{ list.createAt }}</span> -->
          <!-- <div v-if="list.status" class="pr-3 acive_class font-medium">
            <div class="rounded-full active-circle-align"></div>
            <span>Active</span>
          </div>
          <div v-else class="pl-2 deacive_class font-medium">
            <div class="rounded-full deactive-circle-align"></div>
            <span>Inactive</span>
          </div> -->
        </div>
        <div>
          <LeftArrowIcon class="arrow-aling hover:text-[#ffbc42]" />
        </div>
        <!-- <div v-if="!list.arrowChange">
          <img src="assets\icons\left_arrow.svg" width="30">
        </div> -->
        <!-- <div v-else>
          <img src="assets\icons\yellow_left_arrow.svg" width="30">
        </div> -->
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { ref } from "vue";
  const selectedValue = ref("Today");
  const route = useRoute("BotManagementDetails-id");

  const dataList = ref([
    {
      _id: 1,
      bot: "UI Customization",
      arrowChange: false,
    },
    {
      _id: 2,
      bot: "CRM Integration",
      arrowChange: false,
    },
    {
      _id: 3,
      bot: "Bot Configuration",
      arrowChange: false,
      routeName: "CreateBot-id",
    },
    {
      _id: 4,
      bot: "Document Management",
      arrowChange: false,
    },
  ]);
  const previousIndex = ref(0);
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

  const listHover = (index: any) => {
    if (dataList.value[previousIndex.value].arrowChange)
      dataList.value[index].arrowChange = false;
    dataList.value[index].arrowChange = true;
  };
  const listHoverOut = (index: any) => {
    if (dataList.value[previousIndex.value].arrowChange)
      dataList.value[index].arrowChange = false;
    dataList.value[index].arrowChange = false;
  };
</script>

<style scoped>
  .bot-manage-main-container {
    padding: 8px 25px;
  }

  .header-align {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: segoe UI Regular;
  }

  .bot-main-align {
    margin-top: 30px;
  }

  .list_align {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 65%;
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
    padding: 20px 30px;
    width: 100% !important;
    box-shadow: 0px 2px 24px 0px rgba(0, 0, 0, 0.05) !important;
    border-radius: 10px;
    margin: 20px;
  }

  .acive_class {
    display: flex;
    align-items: center;
    /* width: 50px; */
    color: rgba(26, 187, 0, 1) !important;
    gap: 5px;
  }

  /* .deacive_class {
  display: flex;
  align-items: center;
  gap: 5px;
  color: rgba(255, 0, 0, 1);
} */

  .active-circle-align {
    display: flex;
    align-items: center;
    background-color: rgba(26, 187, 0, 1);
    width: 6px;
    height: 6px;
  }
  .header-content-align {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }
  .list-header-align {
    padding: 10px 0px 10px 20px;
    display: flex;
    align-items: center;
    /* justify-content: space-between; */
    width: 100%;
    /* gap: 100px; */
    border-bottom: 0.5px solid rgba(181, 181, 181, 1);
  }
  .button-align {
    background-color: red;
    color: white;
    border-radius: 8px;
    padding: 10px 10px;
  }
  .bot-list-align:hover {
    color: rgba(255, 188, 66, 1);
    background: rgba(255, 248, 235, 1) !important;
  }
  .arrow-aling {
    width: 30px;
  }
  /* .right-dropdown-align {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 1);
  padding: 0px 10px;
  width: 200px !important;
  box-shadow: 0px 2px 24px 0px rgba(0, 0, 0, 0.05) !important;
  border-radius: 10px;
} */
  /* .deactive-circle-align {
  display: flex;
  align-items: center;
  background-color: rgba(255, 0, 0, 1);
  width: 5px;
  height: 5px;
} */

  /* .bot_name_align {
  width: 11%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
} */
</style>
