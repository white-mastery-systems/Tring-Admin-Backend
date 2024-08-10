<script setup lang="ts">
definePageMeta({
  layout: "auth",
});

const loginData = reactive({
  name: '',
  role: '',
});
</script>
<template>
  <div class="sign-in-align flex items-center">
    <div class="top-content-align font-bold">
        Personal Details
    </div>
    <div class="form-align">
      <!-- <div> -->
      <div class="individual-form-align">
        <label for="fmail" class="mb-4 font-[10px] font-bold">Name</label>
        <div class="input-container">
          <input class="mt-2 mb-2" type="otp" id="otp" name="otp" placeholder="Enter your Name"
            v-model="loginData.role" />
        </div>
      </div>
      <div class="individual-form-align">
        <label for="fpassword" class="font-bold">Role</label>
        <div class="input-container role-input">
          <input class="mt-2 mb-2" type="text" id="frole" name="fname" placeholder="Enter your Role"
            v-model="loginData.name" />
          <span class="eye-icon" id="togglePassword">
            <!-- <OpenEye /> -->
            <!-- <CloseEyeIcon /> -->
            <BottomArrowIcon />
            <!-- You can use FontAwesome or another icon library here -->
            <!-- <i class="fas fa-eye" id="showIcon"></i> -->
            <!-- <i class="fas fa-eye-slash" id="hideIcon" style="display: none;"></i> -->
          </span>
        </div>
        <!-- <div class="forget-pws-align align_border">Forgot Password?</div> -->
      </div>
      <div class="submit-btn-align">
        <button class="font-bold" type="submit" @click="authHandlers.login(loginData)">
          Proceed
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
.right-dropdown-align {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 1);
  padding: 0px 10px;
  width: 200px !important;
  box-shadow: 0px 2px 24px 0px rgba(0, 0, 0, 0.05) !important;
  border-radius: 10px;
}
/* .role-input {
   background: rgba(255, 255, 255, 1);
  padding: 0px 10px;
  width: 200px !important;
  box-shadow: 0px 2px 24px 0px rgba(0, 0, 0, 0.05) !important;
  border-radius: 10px;
} */
</style>
