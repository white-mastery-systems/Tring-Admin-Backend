export const useOrgDetailsStore = defineStore("org", {
  state: () => ({
    values: {
      logo: localStorage.getItem("orgDetails")
        ? JSON.parse(localStorage.getItem("orgDetails")).logo.url
        : null,
    },
  }),
  actions: {
    updateValues() {
      this.values = {
        logo: localStorage.getItem("orgDetails")
          ? JSON.parse(localStorage.getItem("orgDetails")).logo.url
          : null,
      };
    },
    // addTemplateVariable() {
    //   this.values.templateVariables.push("");
    // },
    // removeTemplateVariable(index: any) {
    //   this.values.templateVariables.splice(index, 1);
    // },
    resetValues() {
      this.values = {
        logo: "",
      };
    },
  },
});
