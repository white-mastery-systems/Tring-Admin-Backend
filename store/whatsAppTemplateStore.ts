export const useTemplateStore = defineStore("template", {
  state: () => ({
    values: {
      name: "",
      header: "",
      headerText: "",
      body: "",
      footer: "",
      templateVariables: [],
      headerLocation: "",
      headerFile: {},
    },
  }),
  actions: {
    updateValues(newValues: any) {
      console.log({ newValues });
      this.values = { ...this.values, ...newValues };
    },
    // addTemplateVariable() {
    //   this.values.templateVariables.push("");
    // },
    // removeTemplateVariable(index: any) {
    //   this.values.templateVariables.splice(index, 1);
    // },
    resetValues() {
      this.values = {
        name: "",
        header: "",
        headerText: "",
        body: "",
        footer: "",
        templateVariables: [],
      };
    },
  },
});