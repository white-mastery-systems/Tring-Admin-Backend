export const useFreeTrial = defineStore('freeTrail', () => {
  // Declare a boolean variable
  const planFree = ref(false);

  // Return the variable
  return {
    planFree,
  };
});