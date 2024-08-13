<template>
  <div class="flex items-center mx-5 gap-2 mt-2 mb-4">
    <button @click="router.back()">
      <img src="assets\icons\right_arrow.svg" width="20"></img>
    </button>
    <UiLabel class="text-[20px] font-bold">Basic Configuration</UiLabel>
  </div>
  <div class="form-align rounded-lg">
    <!-- {{ formDetails }} -->
    <div class="basic-confic-align text-[18px] font-bold">
      Basic Configurations
    </div>
    <div class="flex flex-wrap">
      <div class="individual-form-align">
        <label for="lname" class="font-bold">NAME</label><br />
        <input v-model="formDetails.NAME" class="my-2" type="text" id="lname" name="lname" /><br />
      </div>
      <div class="individual-form-align">
        <label for="lcompany" class="font-bold">Company Name</label><br />
        <input v-model="formDetails.COMPANY" class="my-2" type="text" id="lcompany" name="lcompany" /><br />
      </div>
      <!-- <div class="individual-form-align">
        <label for="frole" class="font-bold">ROLE</label><br />
        <input v-model="formDetails.ROLE" class="my-2" type="text" id="frole" name="fname" />
      </div> -->
      <div class="individual-form-align">
        <label class="font-bold">Role</label>
        <UiSelect v-model="formDetails.ROLE">
          <UiSelectTrigger class="mt-2 select-menu-align font-medium">
            <UiSelectValue placeholder="Select Role" />
          </UiSelectTrigger>
          <UiSelectContent>
            <UiSelectItem value="Customer Support">Customer Support</UiSelectItem>
            <UiSelectItem value="Sales Executive">Sales Executive</UiSelectItem>
          </UiSelectContent>
        </UiSelect>
        <!-- <div class="forget-pws-align align_border">Forgot Password?</div> -->
      </div>
      <div class="individual-form-align">
        <label for="lgoal" class="font-bold">GOAL</label><br />
        <input v-model="formDetails.GOAL" class="my-2" type="text" id="lgoal" name="lgoal" /><br />
      </div>
      <div class="text-area-align">
        <span class="text-area-label font-bold"> NOTES </span>
        <textarea clas placeholder="Enter your Note" v-model="formDetails.NOTES" class="my-2 text-[14px]" id="w3review"
          name="w3review" rows="4" cols="50"></textarea>
      </div>
      <div class="text-area-align">
        <span class="text-area-label font-bold"> DESCRIPTION </span>
        <textarea placeholder="Enter your Description" v-model="formDetails.DESCRIPTION" class="my-2 text-[14px]"
          id="w3review" name="w3review" rows="4" cols="50"></textarea>
      </div>
      <div class="submit-btn-align">
        <button class="font-bold text-[14px]" type="submit" @click="createBot()">
          Submit
        </button>
      </div>
    </div>
  </div>
  <div v-if="false" class="form-align rounded-lg">
    <!-- {{ formDetails }} -->
    <div class="basic-confic-align text-[18px] font-bold">
      Chat Prompts
    </div>
    <div class="flex flex-wrap">
      <div class="individual-form-align">
        <label for="lname" class="font-bold">Welcome Text</label><br />
        <input placeholder="Enter Welcome text" v-model="formDetails.NAME" class="my-2" type="text" id="lname"
          name="lname" /><br />
      </div>
      <div class="individual-form-align">
        <label for="lcompany" class="font-bold">Form Prompt</label><br />
        <input placeholder="Enter Form Prompt" v-model="formDetails.COMPANY" class="my-2" type="text" id="lcompany"
          name="lcompany" /><br />
      </div>
      <!-- <div class="individual-form-align">
        <label for="frole" class="font-bold">ROLE</label><br />
        <input v-model="formDetails.ROLE" class="my-2" type="text" id="frole" name="fname" />
      </div> -->
      <div class="individual-form-align">
        <label for="lgoal" class="font-bold">Error Message</label><br />
        <input v-model="formDetails.GOAL" placeholder="Enter Error text" class="my-2" type="text" id="lgoal"
          name="lgoal" /><br />
      </div>
      <div class="submit-btn-align">
        <button class="font-bold text-[14px]" type="submit" @click="createBot()">
          Submit
        </button>
      </div>
    </div>
  </div>
  <div class="basic-confic-align text-[18px] font-bold">
    <span>
      Intent Management
    </span>
    <span>
      Add Intent
    </span>
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  middleware: "admin-only",
});
const router = useRouter()
const formDetails: any = reactive({
  ROLE: '',
  NAME: '',
  COMPANY: '',
  GOAL: '',
  NOTES: '',
  DESCRIPTION: '',
  INTENTS: "-other\n-details"
})
const route = useRoute()
const paramId: any = route
const botDetails: any = await getBotDetails(paramId.params.id)


onMounted(() => {
  if (Object.entries(botDetails.metadata.prompt).length) {
    formDetails.ROLE = botDetails.metadata.prompt.ROLE
    formDetails.NAME = botDetails.metadata.prompt.NAME
    formDetails.COMPANY = botDetails.metadata.prompt.COMPANY
    formDetails.GOAL = botDetails.metadata.prompt.GOAL
    formDetails.NOTES = botDetails.metadata.prompt.NOTES
    formDetails.DESCRIPTION = botDetails.metadata.prompt.DESCRIPTION
  }
})

const createBot = () => {
  const payload: any = {
    id: botDetails.id,
    metadata: {
      ...botDetails.metadata,
      prompt: {
        ...formDetails,
      }
    }
  }
  updateBotDetails(payload)
}
</script>
<style scoped>
.focus\:ring-offset-2:focus {
  --tw-ring-offset-width: none;
}

.form-align {
  display: flex;
  flex-direction: column;
  padding: 15px 29px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 24px 0px rgba(0, 0, 0, 0.05) !important;
}

form {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}

.individual-form-align {
  width: 50%;
  padding: 0 20px;
  margin-top: 15px;
  margin-bottom: 15px;
}

.individual-form-align input {
  background-color: rgba(246, 246, 246, 1);
  width: 100%;
  height: 50px;
  outline: none;
  border-radius: 10px;
  padding: 0 20px;
  /* margin-top: 10px; */
}

textarea {
  background-color: rgba(246, 246, 246, 1);
  border-radius: 10px;
  width: 100%;
  padding: 20px;
  height: 80px;
  outline: none !important;
}

.text-area-align {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0 20px;
  margin-top: 15px;
}

.text-area-label {
  margin-bottom: 10px;
}

.submit-btn-align {
  width: 100%;
  display: flex;
  justify-content: end;
  padding: 0 21px;
}

.submit-btn-align input {
  width: 130px;
  height: 50px;
  border-radius: 10px;
  padding: 0 20px;
  background-color: rgba(246, 246, 246, 1);
  margin-top: 40px;
}

.submit-btn-align button {
  width: 20%;
  height: 40px;
  border-radius: 10px;
  padding: 0 20px;
  background: #424bd1;
  color: #ffffff;
  margin-top: 20px;
  /* margin-right: 170px; */
}

.basic-confic-align {
  padding-left: 20px;
  color: rgba(66, 75, 209, 1);
  margin: 10px 0;
}

.select-menu-align {
  height: 50px;
}
</style>
