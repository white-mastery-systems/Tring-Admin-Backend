import { defineStore } from "pinia";

export const useBreadcrumbStore = defineStore("breadcrumb", {
  state: () => ({
    breadcrumbs: [] as { label: string; to: string }[],
  }),
  actions: {
    setBreadcrumbs(breadcrumbs: { label: string; to: string }[]) {
      this.breadcrumbs = breadcrumbs;
    },
  },
});
