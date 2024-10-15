export const useOrgDetailsStore = defineStore("org", {
  state: () => ({
    values: {
      logo: "",
    },
  }),
  actions: {
    updateValues() {
      this.values = {
        logo: localStorage.getItem("orgDetails")
          ? (localStorage.getItem("orgDetails") as string)?.log?.url
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
