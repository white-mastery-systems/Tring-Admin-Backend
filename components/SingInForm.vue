<template>
  <div class="sing-in-align">
    <div class="top-content-align font-bold">Let’s Get Started</div>
    <div class="form-align">
      <form>
        <div class="individual-form-align">
          <label for="fmail" class="font-bold font-[10px] pb-2">E-mail</label>
          <input type="text" id="frole" name="fmail" value="">
        </div>
        <div class="individual-form-align">
          <label for="fpassword" class="font-bold pb-2">Password</label>
          <div class="input-container">
            <input type="password" id="frole" name="fname" value="" placeholder="Enter your password">
            <span class="eye-icon" id="togglePassword">
              <OpenEye />
              <!-- <CloseEyeIcon /> -->
              <!-- You can use FontAwesome or another icon library here -->
              <!-- <i class="fas fa-eye" id="showIcon"></i> -->
              <!-- <i class="fas fa-eye-slash" id="hideIcon" style="display: none;"></i> -->
            </span>
          </div>
        </div>
        <div class="individual-form-align">
          <label for="lcmpassword" class="font-bold pb-2">Confirm Password</label>
          <div class="input-container">
            <input type="password" id="frole" name="fname" value="" placeholder="Enter your password">
            <span class="eye-icon" id="togglePassword">
              <OpenEye />
              <!-- <CloseEyeIcon /> -->
              <!-- You can use FontAwesome or another icon library here -->
              <!-- <i class="fas fa-eye" id="showIcon"></i> -->
              <!-- <i class="fas fa-eye-slash" id="hideIcon" style="display: none;"></i> -->
            </span>
          </div>
        </div>
        <div class="submit-btn-align">
          <input class="font-bold" type="submit" value="Sing up">
        </div>
      </form>
    </div>
  </div>
</template>
<style scoped>
.sing-in-align {
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
height: 100%;
}
.top-content-align {
  color: #424BD1;
  padding-right: 172px;
  padding-bottom: 20px;
}
.form-align {
  display: flex;
  /* flex-direction: column; */
  padding: 0 25px;
}
form {
  width: 100%;
  display: flex;
  /* flex-wrap: wrap; */
  flex-direction: column;
  /* align-items: start; */
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
.submit-btn-align {
  width: 100%;
  display: flex;
  justify-content: center;
}

.submit-btn-align input {
  width: 100%;
  height: 50px;
  border-radius: 10px;
  padding: 0 20px;
  background: #424BD1;
  color: #FFFFFF;
  margin-top: 20px;
  margin-right: 170px;
}

.color-picker-align input {
  width: 50%;
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

.right-card-align {
  position: relative;
  width: 50%;
  /* width: 600px; */
  /* Set width to the width of the larger image */
  /* height: 600px; */
  /* Adjust height if needed */
}

.right-card-align img:nth-child(1) {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}

.right-card-align img:nth-child(2) {
  position: absolute;
  top: 6px;
  left: 10px;
  bottom: 10px;
  right: 10px;
  z-index: 2;
}
</style>