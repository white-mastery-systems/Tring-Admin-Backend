import { navigateTo } from 'nuxt/app';
import { computed } from 'vue';
import { useAsyncData } from '#app';
import { useUserDetailsComposable } from '../billing/useDetails';
import { useBillingComposable } from '../billing/useBillingComposable'

const { userDetails, fetchUser } = useUserDetailsComposable();
fetchUser()

export function usePlanSelection(userDetails: any, orgBilling: any, route: any, onBoardingAccount: any) {
  console.log(onBoardingAccount, "onBoardingAccount -- onBoardingAccount")
  const choosePlan = async (plan: any) => {
    if (plan === 'chat_enterprise') {
      return navigateTo('https://tringlabs.ai/contact-us/', {
        external: true,
        open: { target: '_blank' },
      });
    } else {
      if (!userDetails?.mobile) {
        toast.error('Please update all the details to continue');
        if (onBoardingAccount === true) {
          return navigateTo({ name: 'auth-onboarding-account' });
        } else {
          return navigateTo({ name: 'account' });
        }
      }
      if (!orgBilling?.gst) {
        toast.error('Please update GST information to continue');
        if (onBoardingAccount === true) {
          return navigateTo({ name: 'auth-onboarding-account' });
        } else {
          // return navigateTo({ name: 'account' });
          return navigateTo({ name: 'account', query: { tab: 'personal-details' } });
        }
      }
      const locationData = await fetchLocation();

      try {
        const hostedPageUrl = await $fetch<{ hostedpage: { url: string } }>(
          `/api/billing/subscription?type=${route?.type ?? 'chat'}`,
          {
            method: "POST",
            body: {
              plan: plan,
              locationData: locationData,
              redirectUrl: `${window.location.origin}/billing/billing-confirmation`,
            },
          },
        );

        navigateTo(hostedPageUrl?.hostedpage?.url, {
          external: true,
          open: {
            target: "_blank",
          },
        });
      } catch (err) {
        toast.error("ERROR: " + err.statusMessage);
        if (err.statusMessage?.includes("gst_no")) {
          navigateTo({
            name: "account",
          });
        }
      }
    }
  };

  const fetchLocation = async () => {
    const { data, error } = await useFetch('https://ipv4-check-perf.radar.cloudflare.com/api/info');
    if (error.value) {
      throw new Error('Failed to fetch location data');
    }

    return data.value;
  };


  return { choosePlan };
}
