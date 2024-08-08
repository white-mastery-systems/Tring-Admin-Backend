<template>
  <div class="form-align">
    <form>
      <div class="individual-form-align">
        <label for="frole" class="font-medium font-[10px] pb-2">API Key</label>
        <input type="text" id="frole" name="fname" value="">
      </div>
      <div class="individual-form-align">
        <label for="lname" class="font-medium pb-2">PROJECT ID</label>
        <input type="text" id="lname" name="lname" value="">
      </div>
      <div class="individual-form-align">
        <label for="lcompany" class="font-medium pb-2">CAMPAIGN ID</label>
        <input type="text" id="lcompany" name="lcompany" value="">
      </div>
      <div class="submit-btn-align">
        <input class="font-bold"  type="submit" value="Submit">
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
  /* flex-wrap: wrap; */
  flex-direction: column;
  align-items: start;
}

.individual-form-align {
  width: 50%;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
  height: 100px;
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
  width: 130px;
  height: 50px;
  border-radius: 10px;
  padding: 0 20px;
  background-color: rgba(246, 246, 246, 1);
  margin-top: 20px;
  margin-right: 170px;
}
.color-picker-align input {
  width: 50%;
}
</style>


<!-- ROLE
NAME
COMPANY
GOAL
NOTES
DESCRIPTION -->