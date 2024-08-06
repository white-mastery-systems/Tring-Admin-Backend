<template>
  <div class="dashboard-main-container">
    <div class="header-align">
      <span class="font-bold text-lg">Dashboard</span>
      <span class="right-dropdown-align" style="color: rgba(138, 138, 138, 1)">Summary: <span
          class="font-bold text-black">Today</span></span>
    </div>
    <div>
      <div class="dashboard-main-paage">
        <div class="card-align">
          <div>
            <img src="assets\icons\contact_count_icon.svg" width="34" height="34" />
          </div>
          <div>
            <div class="font-semibold content-align">Chat bots</div>
            <div class="font-bold text-lg">1</div>
          </div>
        </div>
        <div class="card-align">
          <div>
            <img src="assets\icons\contact_count_icon.svg" width="34" height="34" />
          </div>
          <div>
            <div class="font-semibold content-align">Call bots</div>
            <div class="font-bold text-lg">1</div>
          </div>
        </div>
        <div class="card-align">
          <div>
            <img src="assets\icons\contact_count_icon.svg" width="34" height="34" />
          </div>
          <div>
            <div class="font-semibold content-align">Chat Leads</div>
            <div class="font-bold text-lg">1</div>
          </div>
        </div>
        <div class="card-align">
          <div>
            <img src="assets\icons\contact_count_icon.svg" width="34" height="34" />
          </div>
          <div>
            <div class="font-semibold content-align">Call leads</div>
            <div class="font-bold text-lg">1</div>
          </div>
        </div>
      </div>
      <div class="graph-align">
        <span>
          <img src="assets\icons\Graph_left.svg" width="700">
        </span>
        <span>
          <img src="assets\icons\graph_right.svg" width="400">
        </span>
      </div>
      <div class="dashboard-main-paage">
        <div class="card-align">
          <div>
            <img src="assets\icons\contact_count_icon.svg" width="34" height="34" />
          </div>
          <div>
            <div class="font-semibold content-align">Chat Sessions</div>
            <div class="font-bold text-lg">612</div>
          </div>
        </div>
        <div class="card-align">
          <div>
            <img src="assets\icons\contact_count_icon.svg" width="34" height="34" />
          </div>
          <div>
            <div class="font-semibold content-align">Total Calls</div>
            <div class="font-bold text-lg">4,689</div>
          </div>
        </div>
        <div class="card-align">
          <div>
            <img src="assets\icons\contact_count_icon.svg" width="34" height="34" />
          </div>
          <div>
            <div class="font-semibold content-align">Call Duration</div>
            <div class="font-bold text-lg">742 mins</div>
          </div>
        </div>
        <div class="card-align">
          <div>
            <img src="assets\icons\contact_count_icon.svg" width="34" height="34" />
          </div>
          <div>
            <div class="font-semibold content-align">Unique Sessions</div>
            <div class="font-bold text-lg">413</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.dashboard-main-container {
  padding: 15px;
  /* width: 100%; */
}
.header-align {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: segoe UI Regular;
}
.right-dropdown-align {
  background: rgba(255, 255, 255, 1);
  padding: 10px;
  width: 200px !important;
  box-shadow: 0px 2px 24px 0px rgba(0, 0, 0, 0.05) !important;
  border-radius: 10px;
}
.dashboard-main-paage {
  margin-top: 30px;
  display: flex;
  align-items: center;
  gap: 30px;
}
.card-align {
  display: flex;
  align-items: center;
  padding: 10px 10px 10px 25px;
  width: 250px;
  height: 100px;
  gap: 15px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 24px 0px rgba(0, 0, 0, 0.05) !important;
  border-radius: 10px;
}
.content-align {
  margin-bottom: 5px;
  color: rgba(138, 138, 138, 1);
}
.graph-align {
  display: flex;
  opacity: 0.3;
}
</style>