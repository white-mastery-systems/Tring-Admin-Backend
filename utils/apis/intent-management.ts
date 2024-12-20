// import type { InsertIntent } from "~/server/schema/bot";

interface Payload {
  intentDetails: any;
  onSuccess: Function;
}

export const updateBotIntentById = async ({
  intentDetails,
  onSuccess,
}: Payload) => {
  try {
    const createdIntent = await $fetch(
      `/api/bots/${intentDetails.id}/intents/${intentDetails?.intentId}`,
      {
        method: "PUT",
        body: intentDetails,
      },
    );

    onSuccess();
    return createdIntent;
  } catch (err: any) {
    toast.error(err.statusMessage);
  }
};
export const createBotIntents = async ({
  intentDetails,
  onSuccess,
}: Payload) => {
  try {
    const createdIntent = await $fetch(
      `/api/bots/${intentDetails.id}/intents`,
      {
        method: "POST",
        body: intentDetails,
      },
    );

    onSuccess();
    return createdIntent;
  } catch (err: any) {
    // console.log(err.data.statusMessage, "err -- err");
    toast.error(err.data.statusMessage);
  }
};
interface DeleteIntentInterface {
  payload: {
    botId: string;
    intentId: string;
  };
  onSuccess: () => void;
}
export const deleteIntent = async ({
  payload,
  onSuccess,
}: DeleteIntentInterface) => {
  try {
    const deletedIntent = await $fetch(
      `/api/bots/${payload.botId}/intents/${payload.intentId}`,
      {
        method: "DELETE",
      },
    );
    onSuccess();
  } catch (err) {}
};
