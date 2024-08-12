<script setup lang="ts">
  definePageMeta({
    layout: "auth",
  });

  const loginData = reactive({
    name: "",
    industry: "Real Estate",
    avgTraffic: "Less than 100",
    employeeCount: "Less than 10",
  });
  const onSubmit = async () => {
    if (loginData.name.length < 1) {
      toast.error("Please enter valid details");
      return;
    }

    await $fetch("/api/auth/onboarding/2", {
      method: "POST",
      body: loginData,
    });
    return navigateTo("/DashBoard");
  };
</script>
<template>
  <div class="sign-in-align">
    <div class="top-content-align flex items-center gap-1 font-bold">
      <!-- <RightArrow /> -->
      <span> Company Details </span>
    </div>
    <div class="form-align">
      <!-- <div> -->
      <div class="individual-form-align">
        <label for="fpassword" class="font-bold">Name</label>
        <div class="input-container">
          <UiInput v-model="loginData.name" />
        </div>
      </div>
      <div class="individual-form-align">
        <label for="fpassword" class="font-bold">Industry</label>
        <div class="input-container">
          <UiSelect v-model="loginData.industry">
            <UiSelectTrigger> {{ loginData.industry }} </UiSelectTrigger>
            <UiSelectContent>
              <UiSelectItem value="Real Estate">Real Estate</UiSelectItem>
              <UiSelectItem value="Finance">Finance</UiSelectItem>
              <UiSelectItem value="Healthcare">Healthcare</UiSelectItem>
              <UiSelectItem value="Technology">Technology</UiSelectItem>
              <UiSelectItem value="Education">Education</UiSelectItem>
              <UiSelectItem value="Other">Other</UiSelectItem>
            </UiSelectContent>
          </UiSelect>
        </div>
      </div>
      <div class="individual-form-align">
        <label for="fpassword" class="font-bold">Monthly Website Traffic</label>
        <UiSelect v-model="loginData.avgTraffic">
          <UiSelectTrigger> {{ loginData.avgTraffic }} </UiSelectTrigger>
          <UiSelectContent>
            <UiSelectItem value="Less than 100">Less than 100</UiSelectItem>
            <UiSelectItem value="100-500">100-500</UiSelectItem>
            <UiSelectItem value="500-1000">500-1000</UiSelectItem>
            <UiSelectItem value="1000-5000">1000-5000</UiSelectItem>
            <UiSelectItem value="5000-10000">5000-10000</UiSelectItem>
            <UiSelectItem value="10000+">10000+</UiSelectItem>
          </UiSelectContent>
        </UiSelect>
        <!-- <div class="forget-pws-align align_border">Forgot Password?</div> -->
      </div>
      <div class="individual-form-align">
        <label for="fmail" class="mb-4 font-bold">No. of Employees</label>
        <UiSelect v-model="loginData.employeeCount">
          <UiSelectTrigger> {{ loginData.employeeCount }} </UiSelectTrigger>
          <UiSelectContent>
            <UiSelectItem value="Less than 10">Less than 10</UiSelectItem>
            <UiSelectItem value="10-50">10-50</UiSelectItem>
            <UiSelectItem value="50-100">50-100</UiSelectItem>
            <UiSelectItem value="100-500">100-500</UiSelectItem>
            <UiSelectItem value="500-1000">500-1000</UiSelectItem>
            <UiSelectItem value="1000+">1000+</UiSelectItem>
          </UiSelectContent>
        </UiSelect>
      </div>
      <div class="submit-btn-align">
        <button class="font-bold" type="submit" @click="onSubmit">
          Proceed
        </button>
      </div>
      <!-- </div> -->
    </div>
    <div class="footer-align flex items-center gap-1">
      <span class="bottom-content-align">
        By Signing up, I Agree to Tring AI
      </span>
      <span class="term-align"> Terms & Conditions </span>
    </div>
  </div>
</template>
<style scoped>
  .sign-in-align {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
  }

  .top-content-align {
    color: #424bd1;
    width: 80%;
    padding: 0 22px;
    /* padding-right: 172px; */
    padding-bottom: 20px;
  }

  .form-align {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 80%;
    padding: 0 25px;
  }

  /* .individual-form-align {
    gap: 5px;
  } */
  .individual-form-align input {
    background-color: rgba(246, 246, 246, 1);
    width: 100%;
    height: 50px;
    outline: none;
    border-radius: 10px;
    padding: 0 20px;
  }

  .submit-btn-align {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .submit-btn-align button {
    width: 100%;
    height: 50px;
    border-radius: 10px;
    padding: 0 20px;
    background: #424bd1;
    color: #ffffff;
    margin-top: 30px;
    /* margin-right: 170px; */
  }

  .input-container {
    position: relative;
    display: flex;
    align-items: center;
    font-size: 14px;
  }

  input[type="password"] {
    padding-right: 2.5rem;
    /* Adjust based on the icon size */
    width: 100%;
  }

  .eye-icon {
    position: absolute;
    right: 0.5rem;
    /* Adjust based on your design */
    cursor: pointer;
    font-size: 1rem;
    /* Adjust size as needed */
  }

  .eye-icon i {
    display: inline-block;
  }

  .bottom-content-align {
    color: #8a8a8a;
    font-size: 12px;
  }

  .term-align {
    font-size: 12px;
    text-decoration: underline;
  }

  .footer-align {
    position: absolute;
    bottom: 30px;
  }
</style>
