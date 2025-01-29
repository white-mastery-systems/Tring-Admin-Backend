import { navigateTo } from 'nuxt/app';
import { useUserDetails } from './useUserDetails';
import { useBillingVariation } from './useBillingVariation';

const { userDetails, userLocationDetails } = useUserDetails();
const { billingVariation } = useBillingVariation(userDetails.value, userLocationDetails.value,);

export function usePlanSelection(userDetails: any, orgBilling: any, route: any, onBoardingAccount: any) {
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
      console.log(route, "route -- route useplascsacbnahsv")
      const locationData = await fetchLocation();

      try {
        const hostedPageUrl = await fetchHostedPageUrl(plan, locationData);
        console.log(hostedPageUrl, 'hostedPageUrl');
        navigateTo(hostedPageUrl?.hostedpage?.url, {
          external: true,
          open: { target: '_blank' },
        });
      } catch (err) {
        handlePlanError(err);
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

  const fetchHostedPageUrl = async (plan: string, locationData: any) => {
    console.log('locationData', locationData);

    // Use useFetch to make the API request
    const { data, error } = await useFetch(`/api/billing/subscription?type=${route?.type}`, {
      method: 'POST',
      body: JSON.stringify({
        plan,
        locationData,
        redirectUrl: `${window.location.origin}/billing/billing-confirmation`,
      }),
    });

    // Handle error if any
    if (error.value) {
      throw new Error('Failed to fetch hosted page URL');
    }

    return data.value;
  };

  const handlePlanError = (err: any) => {
    toast.error('ERROR: ' + err.data.statusMessage);
    if (err.data.statusMessage?.includes('gst_no')) {
      navigateTo({ name: 'account', query: { tab: 'personal-details' } });
    }
  };

  return { choosePlan };
}
