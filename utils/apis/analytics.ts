export const deleteDynamicForm = async ({
  payload,    // Add payload parameter
  botId,
}: { payload: any; botId: string; }) => {
  try {
    const dynamicForm = await $fetch(`/api/bots/${botId}/dynamicForm`, {
      method: "DELETE",
      body: payload,   // Include payload here
    });
    return dynamicForm;
  } catch (err) {
    console.error("Error deleting dynamic form:", err);
    throw err;
  }
};