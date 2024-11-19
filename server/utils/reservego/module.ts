import { logger } from "~/server/logger";

const reverseGoBaseUrl =
  useRuntimeConfig().envType === "stage"
    ? "https://stagingapi.reservego.co"
    : "https://api.reservego.co";

export const createNewReservation = async (
  integrationData: any,
  reqObj: any,
) => {
  try {
    const data: any = await $fetch(
      `${reverseGoBaseUrl}/api/bookings/reservation/create`,
      {
        method: "POST",
        body: {
          apiKey: integrationData?.apiKey,
          restaurantId: integrationData?.restaurantId,
          guestPhone: reqObj?.guestPhone,
          guestName: reqObj?.guestName,
          guestCount: reqObj?.guestCount,
          bookingTime: reqObj?.bookingTime,
          status: reqObj?.status,
          source: reqObj?.source,
          guestComments: reqObj?.guestComments,
        },
      },
    );
    if (data?.code !== "SUCCESS") {
      return { status: false, data };
    }
    return { status: true, data };
  } catch (error) {
    logger.error(
      `Reservego createNewReservation error, ${JSON.stringify(error)}`,
    );
    return { status: false };
  }
};

export const getReservationStatus = async (
  integrationData: any,
  reqObj: any,
) => {
  try {
    const data: any = await $fetch(
      `${reverseGoBaseUrl}/api/bookings/reservation/status`,
      {
        method: "POST",
        body: {
          rgApiKey: integrationData?.apiKey,
          rgRestaurantId: integrationData?.restaurantId,
          tpGuestPhoneNumber: reqObj?.phoneNumber,
        },
      },
    );
    if (data?.code !== "SUCCESS") {
      return { status: false, data };
    }
    return { status: true, data };
  } catch (error) {
    logger.error(
      `Reservego getReservationStatus error, ${JSON.stringify(error)}`,
    );
    return { status: false };
  }
};

export const checkAvailabilty = async (integrationData: any, reqObj: any) => {
  try {
    const data: any = await $fetch(
      `${reverseGoBaseUrl}/api/bookings/cloudTelephony/outlet/inventory`,
      {
        method: "POST",
        body: {
          rgApiKey: integrationData?.apiKey,
          rgRestaurantId: integrationData?.restaurantId,
          date: reqObj?.date,
        },
      },
    );
    if (data?.code !== "SUCCESS") {
      return { status: false, data };
    }
    return { status: true, data };
  } catch (error) {
    logger.error(`Reservego checkAvailabilty error, ${JSON.stringify(error)}`);
    return { status: false };
  }
};
