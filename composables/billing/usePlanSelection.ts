import { navigateTo } from 'nuxt/app';
import { computed } from 'vue';
import { useAsyncData } from '#app';
import { useUserDetailsComposable } from '../billing/useDetails';
import { useSubscriptionCheck } from '../billing/useSubscriptionCheck';

const { userDetails, fetchUser } = useUserDetailsComposable();
fetchUser()
const { checkSubscription } = useSubscriptionCheck()
export function usePlanSelection(userDetails: any, orgBilling: any, organization: any, route: any, onBoardingAccount: any) {
  const { orgDetails } = organization

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
      if (!orgDetails?.metadata?.gst && !orgDetails?.metadata?.gstType) {
        toast.error('Please complete the billing details before proceeding.');
        if (onBoardingAccount === true) {
          return navigateTo({ name: 'auth-onboarding-account' });
        } else {
          localStorage.setItem('cameFromBilling', 'true')
          localStorage.setItem('billingType', route?.type ?? 'chat')
          // return navigateTo({ name: 'account' });
          return navigateTo({ name: 'account', query: { tab: 'personal-details' } });
        }
      }
      const locationData = await fetchLocation();
      const billingType = route?.type ?? 'chat'
      try {
        const hostedPageUrl = await $fetch<{ hostedpage: { url: string } }>(
          `/api/v2/billing/subscriptions?type=${billingType}`,
          {
            method: "POST",
            body: {
              plan: plan,
              locationData: locationData,
              redirectUrl: `${window.location.origin}/billing/billing-confirmation?type=${billingType}`,
            },
          },
        );
        if (!hostedPageUrl?.hostedpage?.url) {
          toast.error("Invalid redirect URL received");
          return;
        }
        await navigateTo(hostedPageUrl?.hostedpage?.url, {
          external: true,
          // open: {
          //   target: "_blank",
          // },
        });
        await checkSubscription()
      } catch (err) {
        toast.error(err.statusMessage);
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
