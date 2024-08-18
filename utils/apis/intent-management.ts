// import type { InsertIntent } from "~/server/schema/bot";

export const createBotIntents = async (intentDetails: any) => {
  const updatedBot = await $fetch(`/api/bots/${intentDetails.id}/intents`, {
    method: "POST",
    body: intentDetails,
  });
  toast.success("Intent added successfully");
  await navigateTo({
    name: "bots-id-config",
    params: { id: intentDetails.id },
  });
  return updatedBot;
};
