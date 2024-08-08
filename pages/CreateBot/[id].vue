<template>
  <div class="form-align">
    <form>
      <div class="individual-form-align">
        <label for="frole" class="font-bold">ROLE</label><br />
        <input type="text" id="frole" name="fname" value="" /><br />
      </div>
      <div class="individual-form-align">
        <label for="lname" class="font-bold">NAME</label><br />
        <input type="text" id="lname" name="lname" value="" /><br /><br />
      </div>
      <div class="individual-form-align">
        <label for="lcompany" class="font-bold">COMPANY</label><br />
        <input type="text" id="lcompany" name="lcompany" value="" /><br /><br />
      </div>
      <div class="individual-form-align">
        <label for="lgoal" class="font-bold">GOAL</label><br />
        <input type="text" id="lgoal" name="lgoal" value="" /><br /><br />
      </div>
      <div class="text-area-align">
        <span class="text-area-label font-bold"> NOTES </span>
        <textarea id="w3review" name="w3review" rows="4" cols="50"></textarea>
      </div>
      <div class="text-area-align">
        <span class="text-area-label font-bold"> DESCRIPTION </span>
        <textarea id="w3review" name="w3review" rows="4" cols="50"></textarea>
      </div>
      <div class="submit-btn-align">
        <input type="submit" value="Submit" />
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
    flex-wrap: wrap;
  }
  .individual-form-align {
    width: 50%;
    padding: 0 20px;
  }
  .individual-form-align input {
    background-color: rgba(246, 246, 246, 1);
    width: 100%;
    height: 50px;
    outline: none;
    border-radius: 10px;
    padding: 0 20px;
    margin-top: 10px;
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
    margin-bottom: 10px;
  }
  .submit-btn-align {
    width: 100%;
    display: flex;
    justify-content: end;
  }
  .submit-btn-align input {
    width: 130px;
    height: 50px;
    border-radius: 10px;
    padding: 0 20px;
    background-color: rgba(246, 246, 246, 1);
    margin-top: 40px;
  }
</style>
