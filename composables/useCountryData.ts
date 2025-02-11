import { ref, computed, onMounted } from 'vue';
import countryData from "~/assets/country-codes.json";

export function useCountryData() {
  const locationData = ref();
  const error = ref(null);

  const fetchLocation = async () => {
    try {
      const { data, error: fetchError } = await useFetch('https://ipv4-check-perf.radar.cloudflare.com/api/info');
      if (fetchError.value) {
        throw new Error('Failed to fetch location data');
      }
      locationData.value = data.value;
    } catch (err) {
      // toast.error(err.message)
      error.value = err.message;
    }
  };

  const getUserDetails = localStorage.getItem('user');
  const userDetails = getUserDetails ? JSON.parse(getUserDetails) : {};
  const countryDetails = computed(() => {
    if (!locationData.value) return { dial_code: userDetails?.countryCode ?? '+91'}; // Default fallback
    return countryData.find(country => country.code === locationData.value.country) || { dial_code: userDetails?.countryCode ?? '+91'};
  });

  onMounted(async () => {
    await fetchLocation()
  })

  return { locationData, countryDetails, fetchLocation, error };
}
