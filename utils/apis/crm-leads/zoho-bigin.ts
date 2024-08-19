// import type { InsertIntent } from "~/server/schema/bot";

export const createLeadInZohoBigin = async (intentDetails: any) => {
  const updatedBot = await $fetch(`/api/bots/${intentDetails.id}/intents`, {
    method: "POST",
    body: intentDetails,
  });

  return updatedBot;
};
