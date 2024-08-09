<template>
  <div class="form-align">
    <form>
      <div class="individual-form-align">
        <label for="frole" class="font-medium font-[10px]">LOGO</label>
        <input type="password" id="frole" name="fname" value="">
      </div>
      <div class="individual-form-align">
        <label for="frole" class="font-medium font-[10px]">LOGO</label>
        <div class="input-container">
          <input type="password" id="frole" name="fname" value="" placeholder="Enter your password">
          <span class="eye-icon" id="togglePassword">
            <OpenEye />
            <CloseEyeIcon />
          </span>
        </div>
      </div>

      <div class="color-picker-align gap-8 px-5">
        <div class="flex gap-3">
          <label for="lname" class="font-medium">COLOR</label>
          <input type="color" id="lname" name="lname" value="">
        </div>
        <label class="inline-flex items-center cursor-pointer">
          <input type="checkbox" value="" class="sr-only peer">
          <div
            class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600">
          </div>
          <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">OPEN BY DEFAULT</span>
        </label>
      </div>
      <div class="submit-btn-align">
        <input class="font-bold" type="submit" value="Submit">
      </div>
    </form>
  </div>
</template>
<style scoped>
.form-align {
  display: flex;
  /* flex-direction: column; */
  padding: 0 25px;
}

form {
  width: 100%;
  display: flex;
  flex-direction: column;
  /* flex-wrap: wrap; */
}

.individual-form-align {
  width: 50%;
  padding: 0 20px;
  height: 120px;
}

.individual-form-align input {
  background-color: rgba(246, 246, 246, 1);
  width: 100%;
  height: 50px;
  outline: none;
  border-radius: 10px;
  padding: 0 20px;
  margin-top: 20px;
}

textarea {
  background-color: rgba(246, 246, 246, 1);
  border-radius: 10px;
  width: 100%;
}

.text-area-align {
  display: flex;
  flex-direction: column;
  width: 50%;
  padding: 0 20px;
}

.text-area-label {
  margin-bottom: 20px;
}

.submit-btn-align {
  width: 100%;
  display: flex;
  justify-content: center;
}

.submit-btn-align input {
  width: 130px;
  height: 50px;
  border-radius: 10px;
  padding: 0 20px;
  background-color: rgba(246, 246, 246, 1);
  margin-top: 20px;
  margin-right: 170px;
}

.color-picker-align {
  display: flex;
  align-items: center;
}

.individual-form-align {
  position: relative;
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
}

input[type="password"] {
  padding-right: 2.5rem;
  width: 100%;
}

.eye-icon {
  position: absolute;
  right: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
}

.eye-icon i {
  display: inline-block;
}
</style>