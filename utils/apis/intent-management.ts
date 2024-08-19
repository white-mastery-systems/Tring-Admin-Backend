// import type { InsertIntent } from "~/server/schema/bot";

interface Payload {
  intentDetails: any;
  onSuccess: Function;
}
export const createBotIntents = async ({
  intentDetails,
  onSuccess,
}: Payload) => {
  try {
    const createdIntent = await $fetch(`/api/bots/${intentDetails.id}/intents`, {
      method: "POST",
      body: intentDetails,
    });
    
    onSuccess();
    return createdIntent;
  } catch (err: any) {
    toast.error(err.data.data[0].message);
  }
};
