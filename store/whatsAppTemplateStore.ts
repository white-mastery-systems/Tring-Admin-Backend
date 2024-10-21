export const useTemplateStore = defineStore("template", {
  state: () => ({
    values: {
      name: "",
      header: "",
      headerText: "",
      body: "",
      footer: "",
      templateVariables: "[]",
      headerTextTemplateVariables: "[]",
      headerLocation: "",
      headerFile: {},
      integrationId:"",
    },
  }),
  actions: {
    updateValues(newValues: any) {
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
        templateVariables: "[]",
        headerTextTemplateVariables: "[]",
        integrationId:"",
      };
    },
  },
});
