<script setup lang="ts">
definePageMeta({
  layout: "auth",
});

const loginData = reactive({
  otp: '',
});
</script>
<template>
  <div class="sign-in-align">
    <div class="top-content-align font-bold">
      <span>
        OTP Verification
      </span>
    </div>
    <div class="form-align">
      <!-- <div> -->
      <div class="individual-form-align">
        <div class="input-container">
          <input class="mt-2 mb-2" type="otp" id="otp" name="otp" placeholder="Enter your OTP"
            v-model="loginData.otp" />
        </div>
      </div>
      <div class="submit-btn-align">
        <button class="font-bold" type="submit" @click="authHandlers.login(loginData)">
          Continue
        </button>
      </div>
      <!-- </div> -->
    </div>
    <div class="flex items-center gap-1 footer-align">
      <span class="bottom-content-align">
        By Signing up, I Agree to Tring AI
      </span>
      <span class="term-align">
        Terms & Conditions
      </span>
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
  padding: 0 25px;
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
  margin-top: 20px;
  /* margin-right: 170px; */
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
}

input[type="password"] {
  padding-right: 2.5rem;
  /* Adjust based on the icon size */
  width: 100%;
}

.bottom-content-align {
  color: #8A8A8A;
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
